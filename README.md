# <img align="center" src="addon/chrome/content/icons/favicon.png" width=80/> Zotero Addons

[![zotero target version](https://img.shields.io/badge/Zotero-7-green?style=flat-square&logo=zotero&logoColor=CC2936)](https://www.zotero.org)
[![Using Zotero Plugin Template](https://img.shields.io/badge/Using-Zotero%20Plugin%20Template-blue?style=flat-square&logo=github)](https://github.com/windingwind/zotero-plugin-template)
[![Using Zotero Chinese Plugins](https://img.shields.io/badge/Using-Zotero%20Chinese%20Plugins-blue?style=flat-square&logo=github)](https://github.com/zotero-chinese/zotero-plugins)
[![Using Zotero Scraper](https://img.shields.io/badge/Using-Zotero%20Addons%20Scraper-blue?style=flat-square&logo=github)](https://github.com/syt2/zotero-addons-scraper)  
[![Release](https://img.shields.io/github/v/release/syt2/zotero-addons?style=flat-square&logo=github&color=red)](https://github.com/syt2/zotero-addons/releases/latest)
![Downloads@all](https://img.shields.io/github/downloads/syt2/zotero-addons/total?style=flat-square&logo=github)
![Downloads@latest](https://img.shields.io/github/downloads/syt2/zotero-addons/latest/total?style=flat-square&logo=github)

## Introduction

This is a Zotero Add-on for collecting and installing add-ons in [Zotero7](https://www.zotero.org).

> For Zotero 6, see [here](https://github.com/syt2/zotero-addons/tree/z6#readme).

## Install

1. Download the [latest release xpi file](https://github.com/syt2/zotero-addons/releases/latest/download/zotero-addons.xpi)

   > For Zotero 6, download [v0.6.0-6](https://github.com/syt2/zotero-addons/releases/download/0.6.0-6/zotero-addons.xpi).

2. Install in Zotero `(Tools) -> (Add-ons)`

## Usage

After install this add-on in Zotero, click <img align="center" src="addon/chrome/content/icons/favicon.png" width=24/> in Toolbar

## Add-on Data Source

### [zotero-chinese/zotero-plugins](https://github.com/zotero-chinese/zotero-plugins)

The main data source for add-ons comes from **[zotero-chinese/zotero-plugins](https://github.com/zotero-chinese/zotero-plugins)**.

Switch the source to `(zotero-chinese)` in Zotero to use this source.

> If you have new add-ons to add, submit it to [zotero-chinese/zotero-plugins](https://github.com/zotero-chinese/zotero-plugins).

### [syt2/zotero-addons-scraper](https://github.com/syt2/zotero-addons-scraper)

Switch the source to `(addon-scraper)` in Zotero to use this source.

### Custom Source

You can also use other custom data sources, as long as the data source format is consistent with the format in the [zotero-chinese/zotero-plugins](https://github.com/zotero-chinese/zotero-plugins).

## Develop

### Scheme

- Custom Data Source

  `zotero://zoteroaddoncollection/configSource?source=source-custom&customURL={encodeURIComponent(SOME URL)}`
  can change add-on data source automatically to a custom url.

- Install Add-on from URL

  `zotero://zoteroaddoncollection/install?source={encodeURIComponent(SOME URL)}`
  can install add-on from the custom url.

## Star History

<a href="https://star-history.com/#syt2/zotero-addons&Timeline">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=syt2/zotero-addons&type=Timeline&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=syt2/zotero-addons&type=Timeline" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=syt2/zotero-addons&type=Timeline" />
  </picture>
</a>
