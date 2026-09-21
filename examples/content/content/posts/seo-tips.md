---
title: Nuxt 站点的 SEO 技巧
description: 面向内容驱动 Nuxt 站点的一组简短 SEO 技巧。
date: 2026-05-17
robots: index, follow
---

# SEO 技巧

几条快速建议：

1. 在 `nuxt.config.ts` 中设置 `site.url`，让 canonical 和站点地图条目使用绝对地址。
2. 在页面中使用 `useSeoMeta()`{lang="ts"} 获得类型安全的 meta 标签。
3. 让 `nuxt-og-image` 根据页面元数据自动生成分享图。
4. 使用 frontmatter 的 `sitemap`、`robots` 和 `schemaOrg` 做按页覆盖。
