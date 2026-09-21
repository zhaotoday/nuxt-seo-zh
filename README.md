<h1>@nuxtjs/seo</h1>

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

> 为忙碌的 Nuxt 开发者准备的完整技术 SEO 与 AEO 方案。

[Nuxt SEO](https://nuxtseo.com) 是一套面向 Nuxt 社区、由社区共建的 SEO 模块、工具与教程生态。搜索已经变了：Google 仍然重要，但 [ChatGPT](https://chatgpt.com)、Claude、[Perplexity](https://perplexity.ai) 和 AI Overviews 也会回答你的站点本可以回答的问题，而且它们只会引用自己能解析的来源。Nuxt SEO 提供完整技术栈——robots.txt、站点地图、Schema.org、OG 图片、meta 标签、链接检查——让你的 Nuxt 应用同时被搜索引擎和问答引擎发现。

<p align="center">
<table>
<tbody>
<td align="center">
<sub>由我的 <a href="https://github.com/sponsors/harlan-zw">赞助计划 💖</a> 支持<br> 关注我 <a href="https://twitter.com/harlan_zw">@harlan_zw</a> 🐦 • 加入 <a href="https://discord.gg/275MBUBvgP">Discord</a> 获取帮助</sub><br>
</td>
</tbody>
</table>
</p>

## 功能特性

- 🤖 **抓取控制**：自动生成 `robots.txt`、`<meta name="robots">` 标签和 `X-Robots-Tag` 响应头，管理搜索引擎与 AI 爬虫如何访问你的站点。
- 📄 **站点地图**：根据应用数据源自动生成 `sitemap.xml`，并支持 i18n 站点的多站点地图。
- 🔎 **结构化数据**：自动生成 Schema.org JSON-LD，这是获得富摘要、AI Overviews 和实体识别的最大杠杆。
- 🖼️ **OG 图片**：为每个页面动态生成 Open Graph 图片，无需手工设计。
- △ **SEO 工具集**：干净的标题、默认 meta、canonical URL、面包屑、favicon 和社交分享链接，这些都是 AI 解析器依赖的 AEO 基础能力。
- ✅ **链接检查**：构建时检测死链，并集成 [ESLint](https://eslint.org) 与 DevTools。

### 为 AI 问答时代而生

传统 SEO 信号（干净的 HTML、结构化数据、可抓取的站点地图、有效的 meta）同样是 AI 爬虫决定引用什么的依据。Nuxt SEO 默认把这些都给你。再搭配 [`nuxt-ai-ready`](https://github.com/harlan-zw/nuxt-ai-ready) 提供 `llms.txt`、按需 markdown 端点和 MCP 服务器，默认即可在 `@vercel/agent-readability` 上拿到 **100/100**。

```sh
npx nuxt module add seo nuxt-ai-ready
# 然后验证：
npx @vercel/agent-readability audit https://your-site.com
```

## `@nuxtjs/seo` 模块

`@nuxtjs/seo` 包只是一个别名，用来一次性安装全部模块。

```ts
// 它做的事情就这些！
export default defineNuxtModule<ModuleOptions>({
  moduleDependencies: {
    '@nuxtjs/robots': { version: '>=6.0' },
    '@nuxtjs/sitemap': { version: '>=8.0' },
    'nuxt-link-checker': { version: '>=5.0' },
    'nuxt-og-image': { version: '>=6.2' },
    'nuxt-schema-org': { version: '>=6.0' },
    'nuxt-seo-utils': { version: '>=8.1' },
    'nuxt-site-config': { version: '>=4.0' },
  },
})
```

每个模块都可以单独使用。安装 `@nuxtjs/seo` 可一次拿到全部能力，也可以只选你需要的（例如 Sitemap 和 Robots）。无论哪种方式，配置、组合式 API 和功能都完全相同。

### 模块

| 模块 | 包名 | 解决什么问题 |
|--------|---------|----------------|
| Robots | [@nuxtjs/robots](https://github.com/nuxt-modules/robots) | 控制哪些爬虫（Googlebot、GPTBot、ClaudeBot、PerplexityBot…）可以访问哪些页面 |
| Sitemap | [@nuxtjs/sitemap](https://github.com/nuxt-modules/sitemap) | 为每个爬虫、搜索引擎和问答引擎提供完整内容索引 |
| Schema.org | [nuxt-schema-org](https://github.com/harlan-zw/nuxt-schema-org) | AI 引擎用来理解实体、作者、产品和 FAQ 的结构化数据 |
| OG Image | [nuxt-og-image](https://github.com/nuxt-modules/og-image) | 社交分享和聊天机器人富卡片的预览图 |
| SEO Utils | [nuxt-seo-utils](https://github.com/harlan-zw/nuxt-seo-utils) | Favicon、canonical、面包屑、默认 meta 等 AEO 基础能力 |
| Link Checker | [nuxt-link-checker](https://github.com/harlan-zw/nuxt-link-checker) | 死链会伤害 SEO、迷惑 AI 爬虫，并损害用户体验 |
| Site Config | [nuxt-site-config](https://github.com/harlan-zw/nuxt-site-config) | 在所有模块间共享的站点 URL、名称和语言配置 |

### 配套模块

默认不捆绑，但强烈建议用来补全 AEO 能力：

| 模块 | 包名 | 解决什么问题 |
|--------|---------|----------------|
| AI Ready | [nuxt-ai-ready](https://github.com/harlan-zw/nuxt-ai-ready) | `llms.txt`、按需 `.md` 路由变体、MCP 服务器、IndexNow、面向 RAG 的输出 |
| Skew Protection | [nuxt-skew-protection](https://github.com/harlan-zw/nuxt-skew-protection) | 部署后保持资源持久化并即时更新 |

> [!NOTE]
> 安装任意 SEO 模块时都会自动安装 Site Config。它提供统一配置层，在构建时和运行时对所有模块生效。

## 安装

一次安装全部：

```sh
npx nuxt module add seo
```

或者只选你需要的：

```sh
npx nuxt module add sitemap robots
```

如果要全面做 AEO，可以同时加上 `nuxt-ai-ready`：

```sh
npx nuxt module add seo ai-ready
```

> [!TIP]
> 使用 [skilld](https://github.com/harlan-zw/skilld) 为这个包生成 Agent Skill：
> ```bash
> npx skilld add @nuxtjs/seo
> ```

安装完成后，查看 [使用模块](https://nuxtseo.com/docs/nuxt-seo/guides/using-the-modules) 指南开始使用。

## 更进一步

模块负责技术基础。验证线上站点同样重要：

- [Meta 标签检查器](https://nuxtseo.com/tools/meta-tag-checker)
- [Schema 验证器](https://nuxtseo.com/tools/schema-validator)
- [XML 站点地图验证器](https://nuxtseo.com/tools/xml-sitemap-validator)
- [Robots.txt 验证器](https://nuxtseo.com/tools/robots-txt-validator)
- [社交分享调试器](https://nuxtseo.com/tools/social-share-debugger)

了解更多 SEO 与 AEO：

- [SEO 检查清单](https://nuxtseo.com/learn-seo/checklist)
- [面向 AI 优化的内容](https://nuxtseo.com/learn-seo/nuxt/launch-and-listen/ai-optimized-content)
- [llms.txt 指南](https://nuxtseo.com/learn-seo/nuxt/controlling-crawlers/llms-txt)
- [上线前预热](https://nuxtseo.com/learn-seo/pre-launch-warmup)

## 文档

[阅读完整文档](https://nuxtseo.com/) 了解配置选项、指南和示例。

## 赞助者

<p align="center">
  <a href="https://raw.githubusercontent.com/harlan-zw/static/main/sponsors.svg">
    <img src='https://raw.githubusercontent.com/harlan-zw/static/main/sponsors.svg'/>
  </a>
</p>

## 许可证

基于 [MIT 许可证](https://github.com/harlan-zw/nuxt-seo/blob/main/LICENSE.md)。

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@nuxtjs/seo/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@nuxtjs/seo

[npm-downloads-src]: https://img.shields.io/npm/dm/@nuxtjs/seo.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@nuxtjs/seo

[license-src]: https://img.shields.io/github/license/harlan-zw/nuxt-seo.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://github.com/harlan-zw/nuxt-seo/blob/main/LICENSE.md

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt
[nuxt-href]: https://nuxt.com
