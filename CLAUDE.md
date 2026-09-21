# Nuxt SEO

`@nuxtjs/seo` 的 monorepo。这是一个元模块，会安装并配置全部 Nuxt SEO 模块。

## Nuxt SEO 模块

所有模块仓库位于 `~/pkg`。`@nuxtjs/seo` 模块会捆绑这些：

| 模块 | 包名 | 路径 |
|----------------------|---|---|
| Robots | `@nuxtjs/robots` | `~/pkg/nuxt-robots` |
| Sitemap | `@nuxtjs/sitemap` | `~/pkg/sitemap` |
| OG Image | `nuxt-og-image` | `~/pkg/og-image` |
| Schema.org | `nuxt-schema-org` | `~/pkg/nuxt-schema-org` |
| SEO Utils | `nuxt-seo-utils` | `~/pkg/nuxt-seo-utils` |
| Link Checker | `nuxt-link-checker` | `~/pkg/nuxt-link-checker` |
| Site Config | `nuxt-site-config` | `~/pkg/nuxt-site-config` |

### 独立模块

这些模块不会捆绑进 `@nuxtjs/seo`，但可以单独安装。

| 模块 | 包名 | 路径 |
|----------------------|---|---|
| Skew Protection | `nuxt-skew-protection` | `~/pkg/nuxt-skew-protection` |
| AI Ready | `nuxt-ai-ready` | `~/pkg/nuxt-ai-ready` |

## 网站

nuxtseo.com 网站源码位于 `~/sites/nuxtseo.com`。这是一个部署到 Cloudflare Workers 并使用 D1 数据库的 Nuxt 应用。`nuxt-seo-pro` 层（`layers/nuxt-seo-pro/`）包含 Pro 控制台、遥测 API 和许可证校验端点。


<!-- skilld -->
修改代码前，先评估每个已安装 skill 与当前任务的相关性。
对每个 skill 判断 YES/NO，并在继续之前调用所有 YES 的 skill。
<!-- /skilld -->
