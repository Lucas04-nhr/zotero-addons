import { VirtualizedTableHelper } from "zotero-plugin-toolkit/dist/helpers/virtualizedTable";
import { config } from "../../package.json";
import { getString } from "../utils/locale";
import { AddonInfo, AddonInfoManager, z7XpiDownloadUrls } from "./addonInfo";
import { isWindowAlive } from "../utils/window";
import { Sources, currentSource, customSourceApi, setCurrentSource, setCustomSourceApi } from "../utils/configuration";
const { AddonManager } = ChromeUtils.import("resource://gre/modules/AddonManager.jsm");
declare const ZoteroStandalone: any;

export class AddonTable {
  // register an item in menu tools
  static registerInMenuTool() {
    ztoolkit.Menu.register("menuTools", {
      tag: "menuseparator",
    });
    ztoolkit.Menu.register("menuTools", {
      tag: "menuitem",
      label: getString("menuitem-addons"),
      commandListener: (event) => {
        (async () => {
          await this.showAddonsWindow();
        })();
      },
    });
    ztoolkit.Menu.register("menuTools", {
      tag: "menuseparator",
    });
  }

  private static addonInfos: [AddonInfo[], { [key: string]: string }[]] = [
    [],
    [],
  ];
  private static window?: Window;
  private static tableHelper?: VirtualizedTableHelper;

  // display addon table window
  static async showAddonsWindow() {
    Zotero.log(isWindowAlive(this.window));

    if (isWindowAlive(this.window)) {
      this.window?.focus();
      this.refresh();
      return;
    }

    const windowArgs = { _initPromise: Zotero.Promise.defer() };
    const win = (window as any).openDialog(
      `chrome://${config.addonRef}/content/addons.xhtml`,
      `${config.addonRef}-addons`,
      `chrome,centerscreen,resizable,status,width=800,height=400,dialog=no`,
      windowArgs,
    )!;
    await windowArgs._initPromise.promise;
    this.window = win;
    let columns = [
      {
        dataKey: "name",
        label: "name",
        fixedWidth: false,
      },
      {
        dataKey: "description",
        label: "description",
        fixedWidth: false,
      },
      {
        dataKey: "star",
        label: "stars",
        staticWidth: true,
        width: 50,
      },
    ];
    if (currentSource().id === "source-zotero-chinese-github-backup") {
      columns.push({
        dataKey: "isInstalled",
        label: "state",
        staticWidth: true,
        width: 50,
      });
    }
    columns = columns.map(column => Object.assign(column, { label: getString(column.label) }));

    this.tableHelper = new ztoolkit.VirtualizedTable(win!)
      .setContainerId(`table-container`)
      .setProp({
        id: `header`,
        columns: columns,
        showHeader: true,
        multiSelect: true,
        staticColumns: true,
        disableFontSizeScaling: false,
      })
      .setProp("getRowCount", () => this.addonInfos[1].length)
      .setProp("getRowData", (index) => this.addonInfos[1][index])
      .setProp("getRowString", (index) => this.addonInfos[1][index].name || "")
      .setProp("onSelectionChange", (selection) => {
        const selectAddons: AddonInfo[] = [];
        for (const select of selection.selected) {
          if (select < 0 || select >= this.addonInfos[1].length) {
            return;
          }
          selectAddons.push(this.addonInfos[0][select]);
        }
        this.updateButtons(selectAddons);
      })
      .render(undefined, (_) => {
        this.refresh();
      });

    ztoolkit.UI.replaceElement({
      tag: "menulist",
      id: `sources`,
      attributes: {
        value: currentSource().id,
        native: "true",
      },
      listeners: [{
        type: "command",
        listener: ev => {
          const selectSource = (win.document.querySelector("#sources") as XUL.MenuList).getAttribute("value");
          const oldSource = currentSource();
          setCurrentSource(selectSource ?? undefined);
          const newSource = currentSource();
          if (oldSource.id === newSource.id) { return; }
          const hideCustomInput = newSource.id !== "source-custom";
          (win.document.querySelector("#customSource-container") as HTMLElement).hidden = hideCustomInput;
          this.refresh(true);
        },
      }],
      children: [{
        tag: "menupopup",
        children: Sources.map(source => ({
          tag: "menuitem",
          attributes: {
            label: getString(source.id),
            value: source.id,
          }
        }))
      },
      ]
    }, win.document.querySelector("#sourceContainerPlaceholder"));

    (win.document.querySelector("#manageAddons") as HTMLButtonElement).addEventListener("click", event => {
      Zotero.openInViewer('chrome://mozapps/content/extensions/aboutaddons.html', doc => ZoteroStandalone.updateAddonsPane);
    });
    (win.document.querySelector("#refresh") as HTMLButtonElement).addEventListener("click", event => {
      this.refresh(true);
    });
    (win.document.querySelector("#gotoPage") as HTMLButtonElement).addEventListener("click", event => {
      this.tableHelper?.treeInstance.selection.selected.forEach((select) => {
        if (select < 0 || select >= this.addonInfos[1].length) {
          return;
        }
        const pageURL = `https://github.com/${this.addonInfos[0][select].repo}`;
        if (pageURL) {
          Zotero.launchURL(pageURL);
        }
      });
    });
    (win.document.querySelector("#install") as HTMLButtonElement).addEventListener("click", event => {
      const selectAddons: AddonInfo[] = [];
      for (const select of this.tableHelper?.treeInstance.selection.selected ?? []) {
        if (select < 0 || select >= this.addonInfos[1].length) {
          return;
        }
        selectAddons.push(this.addonInfos[0][select]);
      }
      this.installAddons(selectAddons);
    });
    (win.document.querySelector("#customSource-container") as HTMLElement).hidden = currentSource().id !== "source-custom";
    (win.document.querySelector("#customSourceInput") as HTMLInputElement).value = customSourceApi();
    (win.document.querySelector("#customSourceInput") as HTMLInputElement).addEventListener("change", event => {
      setCustomSourceApi((event.target as HTMLInputElement).value);
      this.refresh(true);
    });
    win.open();
  }

  private static async installAddons(addons: AddonInfo[]) {
    await Promise.all(addons.map(async addon => {
      const z7XpiUrls = z7XpiDownloadUrls(addon).filter(url => (url?.length ?? 0) > 0);
      for (const xpiUrl of z7XpiUrls) {
        ztoolkit.log(`downloading ${addon.name} from ${xpiUrl}`);
        try {
          const response = await Zotero.HTTP.request("get", xpiUrl, {
            responseType: "arraybuffer",
          });
          const xpiDownloadPath = PathUtils.join(
            PathUtils.tempDir,
            `${addon.name}.xpi`,
          );
          await IOUtils.write(xpiDownloadPath, new Uint8Array(response.response));
          const xpiFile = Zotero.File.pathToFile(xpiDownloadPath);
          const xpiInstaller = await AddonManager.getInstallForFile(xpiFile);
          xpiInstaller.install();
          await Zotero.Promise.delay(1000);
          const installsucceed = await AddonManager.getAddonByID(xpiInstaller.addon.id);
          new ztoolkit.ProgressWindow(config.addonName, {
            closeOnClick: true,
            closeTime: 3000,
          }).createLine({
            text: `${addon.name} ${installsucceed ? getString("install-succeed") : getString("install-failed")}`,
            type: installsucceed ? "success" : "fail",
            progress: 0,
          }).show();
          break;
        } catch (error) {
          ztoolkit.log(`download from ${xpiUrl} failed: ${error}`);
        }
      }
    }));
    await this.refresh(false);
  }

  private static async updateButtons(selectAddons: AddonInfo[]) {
    const gotoPageButton = this.window?.document.querySelector("#gotoPage") as HTMLButtonElement;
    const installButton = this.window?.document.querySelector("#install") as HTMLButtonElement;
    gotoPageButton.disabled =
      selectAddons.length !== 1 ||
      (selectAddons[0].repo?.length ?? 0) === 0;
    const installDisabled = selectAddons.reduce((previous, current) => {
      return previous && (current.releases.find(release => release.targetZoteroVersion >= "7")?.xpiDownloadUrl?.github.length ?? 0) === 0;
    }, true);
    installButton.disabled = installDisabled;
  }

  private static async refresh(force = false) {
    await this.updateAddonInfos(force);
    this.updateTable();
  }

  private static async updateAddonInfos(force = false) {
    const addonInfos = await AddonInfoManager.shared.fetchAddonInfos(force);
    this.addonInfos = [
      addonInfos,
      await Promise.all(
        addonInfos.map(async addonInfo => {
          const result: { [key: string]: string } = {};
          result["name"] = addonInfo.name;
          result["description"] = addonInfo.description ?? "?";
          result['star'] = addonInfo.star === 0 ? "0" : addonInfo.star ? String(addonInfo.star) : "?"
          if (addonInfo.id) {
            if (await AddonManager.getAddonByID(addonInfo.id)) {
              result["isInstalled"] = "✓";
            } else {
              result["isInstalled"] = "";
            }
          } else {
            result["isInstalled"] = "?";
          }
          return result;
        }),
      ),
    ];
  }

  private static async updateTable() {
    return new Promise<void>((resolve) => {
      this.tableHelper?.render(undefined, (_) => {
        resolve();
      });
    });
  }
}
