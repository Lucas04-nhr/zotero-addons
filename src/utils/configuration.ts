import { getString } from "./locale";
import { getPref, setPref } from "./prefs";

interface Source {
  id: 
  "source-zotero-chinese-github" |
  "source-zotero-chinese-gitee" |
  "source-zotero-chinese-jsdelivr" |
  "source-zotero-chinese-ghproxy" |
  "source-custom";
  api?: string;
};

export const Sources: Readonly<Readonly<Source>[]> = <const>[
  {
    id: "source-zotero-chinese-github",
    api: "https://raw.githubusercontent.com/zotero-chinese/zotero-plugins/gh-pages/dist/plugins.json",
  },
  {
    id: "source-zotero-chinese-gitee",
    api: "https://gitee.com/northword/zotero-plugins/raw/gh-pages/dist/plugins.json",
  },
  {
    id: "source-zotero-chinese-jsdelivr",
    api: "https://cdn.jsdelivr.net/gh/northword/zotero-plugins@gh-pages/dist/plugins.json",
  },
  {
    id: "source-zotero-chinese-ghproxy",
    api: "https://ghproxy.com/?q=https://raw.githubusercontent.com/zotero-chinese/zotero-plugins/gh-pages/dist/plugins.json",
  },
  {
    id: "source-custom",
  },
];

export function currentSource(): Readonly<Source> {
  const curSource = getPref('source') as string;
  const match = Sources.find(source => { 
    return source.id === curSource;
  });
  if (match) { return match; }
  return Sources[0];
}

export function setCurrentSource(source?: string) {
  if (source && Sources.find(e => e.id === source)) {
    setPref('source', source);
  } else {
    setPref('source', 'source-default');
  }
}

export function customSourceApi() {
  return getPref('customSource') as string
}

export function setCustomSourceApi(api: string) {
  setPref('customSource', api);
}