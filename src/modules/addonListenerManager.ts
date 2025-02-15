import { AddonInfoDetail } from "./addonDetail";
import { AddonTable } from "./addonTable";
const { AddonManager } = ChromeUtils.import("resource://gre/modules/AddonManager.jsm");

export class AddonListenerManager {
  static addonEventListener = {
    onEnabled: async (addon: any) => {
      AddonTable.refresh();
      AddonInfoDetail.refresh();
    },
    onEnabling: async (addon: any) => {
      AddonTable.refresh();
      AddonInfoDetail.refresh();
    },
    onDisabled: async (addon: any) => {
      AddonTable.refresh();
      AddonInfoDetail.refresh();
    },
    onDisabling: async (addon: any) => {
      AddonTable.refresh();
      AddonInfoDetail.refresh();
    },
    onInstalled: async (addon: any) => {
      AddonTable.refresh();
      AddonInfoDetail.refresh();
    },
    onInstalling: async (addon: any) => {
      AddonTable.refresh();
      AddonInfoDetail.refresh();
    },
    onUninstalled: async (addon: any) => {
      AddonTable.refresh();
      AddonInfoDetail.refresh();
    },
    onUninstalling: async (addon: any) => {
      AddonTable.refresh();
      AddonInfoDetail.refresh();
    },
    onOperationCancelled: async (addon: any) => {
      AddonTable.refresh();
      AddonInfoDetail.refresh();
    },
    onPropertyChanged: async (addon: any) => {
      AddonTable.refresh();
      AddonInfoDetail.refresh();
    },
  }

  static addListener() {
    AddonManager.addAddonListener(this.addonEventListener);
  }

  static removeListener() {
    AddonManager.addAddonListener(this.addonEventListener);
  }
}