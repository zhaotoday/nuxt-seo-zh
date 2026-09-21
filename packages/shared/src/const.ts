export type ChecklistItemLevel = 'required' | 'recommended'

export interface ChecklistItemDefinition {
  /** Unique ID within its module, e.g. 'site-url' */
  id: string
  /** Human-readable label */
  label: string
  /** Why this matters */
  description: string
  level: ChecklistItemLevel
  /** URL to relevant docs */
  docsUrl: string
}

export interface NuxtSEOModule {
  slug: 'nuxt-seo' | 'site-config' | 'robots' | 'sitemap' | 'og-image' | 'link-checker' | 'seo-utils' | 'schema-org' | 'skew-protection' | 'ai-ready' | 'ai-kit'
  label: string
  icon: string
  description: string
  repo: string
  npm: string
  playgrounds?: Record<string, string>
}

export const NuxtSEO: NuxtSEOModule = {
  slug: 'nuxt-seo',
  label: 'Nuxt SEO',
  icon: 'i-carbon-3rd-party-connected',
  description: '把所有能力整合到一起的一站式模块。',
  repo: 'harlan-zw/nuxt-seo',
  npm: '@nuxtjs/seo',
  playgrounds: {
    basic: 'https://stackblitz.com/github/harlan-zw/nuxt-seo/tree/main/examples/basic',
    i18n: 'https://stackblitz.com/github/harlan-zw/nuxt-seo/tree/main/examples/i18n',
  },
}

export const SiteConfigModule: NuxtSEOModule = {
  slug: 'site-config',
  label: 'Site Config',
  icon: 'i-carbon-settings-check',
  description: '为 Nuxt 模块提供强大的构建时与运行时共享站点配置。',
  repo: 'harlan-zw/nuxt-site-config',
  npm: 'nuxt-site-config',
  playgrounds: {
    'basic': 'https://stackblitz.com/github/harlan-zw/nuxt-site-config/tree/main/examples/basic',
    'env-driven': 'https://stackblitz.com/github/harlan-zw/nuxt-site-config/tree/main/examples/env-driven',
    'multi-site': 'https://stackblitz.com/github/harlan-zw/nuxt-site-config/tree/main/examples/multi-site',
  },
}

export const RobotsModule: NuxtSEOModule = {
  slug: 'robots',
  label: 'Robots',
  icon: 'i-carbon-bot',
  description: '轻松管理抓取和索引你站点的机器人。',
  repo: 'nuxt-modules/robots',
  npm: '@nuxtjs/robots',
  playgrounds: {
    'basic': 'https://stackblitz.com/github/nuxt-modules/robots/tree/main/examples/basic',
    'i18n': 'https://stackblitz.com/github/nuxt-modules/robots/tree/main/examples/i18n',
    'custom-rules': 'https://stackblitz.com/github/nuxt-modules/robots/tree/main/examples/custom-rules',
  },
}

export const SitemapModule: NuxtSEOModule = {
  slug: 'sitemap',
  label: 'Sitemap',
  icon: 'i-carbon-load-balancer-application',
  description: '灵活强大、无缝集成的 XML 站点地图。',
  repo: 'nuxt-modules/sitemap',
  npm: '@nuxtjs/sitemap',
  playgrounds: {
    'basic': 'https://stackblitz.com/github/nuxt-modules/sitemap/tree/main/examples/basic',
    'i18n': 'https://stackblitz.com/github/nuxt-modules/sitemap/tree/main/examples/i18n',
    'dynamic-urls': 'https://stackblitz.com/github/nuxt-modules/sitemap/tree/main/examples/dynamic-urls',
  },
}

export const OgImageModule: NuxtSEOModule = {
  slug: 'og-image',
  label: 'OG Image',
  icon: 'i-carbon-image-search',
  description: '在 Nuxt 中用 Vue 模板生成 OG 图片。',
  repo: 'nuxt-modules/og-image',
  npm: 'nuxt-og-image',
  playgrounds: {
    'basic-satori': 'https://stackblitz.com/github/nuxt-modules/og-image/tree/main/examples/basic-satori',
    'basic-takumi': 'https://stackblitz.com/github/nuxt-modules/og-image/tree/main/examples/basic-takumi',
    'content': 'https://stackblitz.com/github/nuxt-modules/og-image/tree/main/examples/content',
    'i18n': 'https://stackblitz.com/github/nuxt-modules/og-image/tree/main/examples/i18n',
  },
}

export const LinkCheckerModule: NuxtSEOModule = {
  slug: 'link-checker',
  label: 'Link Checker',
  icon: 'i-carbon-cloud-satellite-link',
  description: '发现并神奇地修复可能损害 SEO 的链接。',
  repo: 'harlan-zw/nuxt-link-checker',
  npm: 'nuxt-link-checker',
  playgrounds: {
    'basic': 'https://stackblitz.com/github/harlan-zw/nuxt-link-checker/tree/main/examples/basic',
    'broken-links': 'https://stackblitz.com/github/harlan-zw/nuxt-link-checker/tree/main/examples/broken-links',
    'skip-inspection': 'https://stackblitz.com/github/harlan-zw/nuxt-link-checker/tree/main/examples/skip-inspection',
  },
}

export const SeoUtilsModule: NuxtSEOModule = {
  slug: 'seo-utils',
  label: 'SEO Utils',
  icon: 'i-carbon-tools',
  description: '提升 Nuxt 站点可发现性和可分享性的 SEO 工具。',
  repo: 'harlan-zw/nuxt-seo-utils',
  npm: 'nuxt-seo-utils',
  playgrounds: {
    'basic': 'https://stackblitz.com/github/harlan-zw/nuxt-seo-utils/tree/main/examples/basic',
    'breadcrumbs': 'https://stackblitz.com/github/harlan-zw/nuxt-seo-utils/tree/main/examples/breadcrumbs',
    'meta-tags': 'https://stackblitz.com/github/harlan-zw/nuxt-seo-utils/tree/main/examples/meta-tags',
  },
}

export const SchemaOrgModule: NuxtSEOModule = {
  slug: 'schema-org',
  label: 'Schema.org',
  icon: 'i-carbon-chart-relationship',
  description: '构建 Schema.org 图谱最快、最简单的方式。',
  repo: 'harlan-zw/nuxt-schema-org',
  npm: 'nuxt-schema-org',
  playgrounds: {
    'basic': 'https://stackblitz.com/github/harlan-zw/nuxt-schema-org/tree/main/examples/basic',
    'blog': 'https://stackblitz.com/github/harlan-zw/nuxt-schema-org/tree/main/examples/blog',
    'e-commerce': 'https://stackblitz.com/github/harlan-zw/nuxt-schema-org/tree/main/examples/e-commerce',
  },
}

export const SkewProtectionModule: NuxtSEOModule = {
  slug: 'skew-protection',
  npm: 'nuxt-skew-protection',
  repo: 'nuxt-seo-pro/nuxt-skew-protection',
  description: '用持久化资源和即时更新解决 Nuxt 版本偏移。',
  label: 'Skew Protection',
  icon: 'i-carbon-version',
}

export const AiReadyModule: NuxtSEOModule = {
  slug: 'ai-ready',
  npm: 'nuxt-ai-ready',
  repo: 'nuxt-seo-pro/nuxt-ai-ready',
  description: '为 Nuxt 站点提供符合最佳实践的 AI 与 LLM 可发现性。',
  label: 'AI Ready',
  icon: 'i-carbon-ai-label',
}

export const modules: NuxtSEOModule[] = [
  NuxtSEO,
  RobotsModule,
  SitemapModule,
  OgImageModule,
  SchemaOrgModule,
  LinkCheckerModule,
  SeoUtilsModule,
  SiteConfigModule,
  SkewProtectionModule,
  AiReadyModule,
]

export const bundledModules = [
  RobotsModule,
  SitemapModule,
  OgImageModule,
  SchemaOrgModule,
  LinkCheckerModule,
  SeoUtilsModule,
]

export const standaloneModules = [
  SkewProtectionModule,
  AiReadyModule,
]

/** @deprecated Use `bundledModules` */
export const normalModules = bundledModules
/** @deprecated Use `standaloneModules` */
export const proModules = standaloneModules
