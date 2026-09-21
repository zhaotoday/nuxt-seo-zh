import type { ChecklistItemDefinition, NuxtSEOModule } from 'nuxtseo-shared/const'
import { computed, ref, toValue } from 'vue'
import { installedModules } from './modules'
import { appFetch } from './rpc'

export interface ChecklistDetectResult {
  passed: boolean
  detail?: string
}

interface ChecklistItemWithDetect extends ChecklistItemDefinition {
  detect: (data: Record<string, any>, ctx: DetectContext) => ChecklistDetectResult
}

interface DetectContext {
  installedModuleSlugs: Set<string>
  debugData: Map<string, Record<string, any>>
}

export interface ChecklistItemResult extends ChecklistItemDefinition {
  passed: boolean
  detail?: string
}

export interface ModuleChecklistResult {
  moduleSlug: NuxtSEOModule['slug']
  moduleLabel: string
  moduleIcon: string
  items: ChecklistItemResult[]
  requiredPending: number
  recommendedPending: number
  totalPending: number
}

export interface ChecklistSummary {
  total: number
  passed: number
  requiredPending: number
  recommendedPending: number
}

// Debug endpoint paths for each module
const DEBUG_ENDPOINTS: Partial<Record<NuxtSEOModule['slug'], string>> = {
  'site-config': '/__site-config__/debug.json',
  'robots': '/__robots__/debug.json',
  'sitemap': '/__sitemap__/debug.json',
  'og-image': '/_og/debug.json',
  'schema-org': '/__schema-org__/debug.json',
}

// Module slug used internally by devtools → catalog slug mapping
const DEVTOOLS_NAME_TO_SLUG: Record<string, NuxtSEOModule['slug']> = {
  'nuxt-robots': 'robots',
  'sitemap': 'sitemap',
  'nuxt-og-image': 'og-image',
  'nuxt-schema-org': 'schema-org',
  'nuxt-seo-utils': 'seo-utils',
  'nuxt-link-checker': 'link-checker',
  'nuxt-site-config': 'site-config',
  'nuxt-ai-ready': 'ai-ready',
  'nuxt-skew-protection': 'skew-protection',
}

const MODULE_META: Record<string, { label: string, icon: string }> = {
  'site-config': { label: 'Site Config', icon: 'carbon:settings-check' },
  'robots': { label: 'Robots', icon: 'carbon:bot' },
  'sitemap': { label: 'Sitemap', icon: 'carbon:load-balancer-application' },
  'og-image': { label: 'OG Image', icon: 'carbon:image-search' },
  'seo-utils': { label: 'SEO Utils', icon: 'carbon:tools' },
  'schema-org': { label: 'Schema.org', icon: 'carbon:chart-relationship' },
}

function isValidUrl(url?: string): boolean {
  if (!url)
    return false
  return !url.includes('localhost') && !url.includes('127.0.0.1') && url.length > 0
}

// Checklist definitions with detection logic per module
const CHECKLIST_DEFINITIONS: Partial<Record<NuxtSEOModule['slug'], ChecklistItemWithDetect[]>> = {
  'site-config': [
    {
      id: 'site-url',
      label: '已配置站点 URL',
      description: '规范 URL、站点地图和 OG 图片需要生产环境站点 URL 才能正确工作。',
      level: 'required',
      docsUrl: 'https://nuxtseo.com/docs/site-config/getting-started/how-it-works',
      detect: (data) => {
        const url = data?.config?.url || ''
        const passed = isValidUrl(url)
        return { passed, detail: passed ? url : '未设置或正在使用 localhost' }
      },
    },
    {
      id: 'site-name',
      label: '已设置站点名称',
      description: '用于所有模块的默认 meta 标签、Schema.org 和 OG 标签。',
      level: 'required',
      docsUrl: 'https://nuxtseo.com/docs/site-config/getting-started/how-it-works',
      detect: (data) => {
        const name = data?.config?.name || ''
        const passed = !!name && name !== 'My Site'
        return { passed, detail: passed ? name : '未配置' }
      },
    },
    {
      id: 'default-locale',
      label: '已配置默认语言',
      description: '使用 i18n 时确保 hreflang 标签和按语言区分的站点地图正确。',
      level: 'recommended',
      docsUrl: 'https://nuxtseo.com/docs/site-config/guides/setting-site-config',
      detect: (data) => {
        const locale = data?.config?.defaultLocale
        const passed = !!locale
        return { passed, detail: passed ? locale : '未设置' }
      },
    },
    {
      id: 'trailing-slash',
      label: '已设置尾部斜杠偏好',
      description: '避免因 URL 格式不一致产生重复内容。请显式设置为 true 或 false。',
      level: 'recommended',
      docsUrl: 'https://nuxtseo.com/docs/site-config/guides/setting-site-config',
      detect: (data) => {
        const trailingSlash = data?.config?.trailingSlash
        const passed = typeof trailingSlash === 'boolean'
        return { passed, detail: passed ? (trailingSlash ? '已启用' : '已禁用') : '未显式设置' }
      },
    },
    {
      id: 'robots-installed',
      label: '已安装 Robots 模块',
      description: '控制所有 SEO 模块的抓取和索引。强烈建议安装。',
      level: 'recommended',
      docsUrl: 'https://nuxtseo.com/docs/robots/getting-started/installation',
      detect: (_data, ctx) => {
        const passed = ctx.installedModuleSlugs.has('robots')
        return { passed, detail: passed ? '已安装' : '未安装' }
      },
    },
  ],
  'robots': [
    {
      id: 'no-validation-errors',
      label: 'robots.txt 没有校验错误',
      description: '你的 robots.txt 不应包含会迷惑爬虫的语法错误。',
      level: 'required',
      docsUrl: 'https://nuxtseo.com/docs/robots/getting-started/installation',
      detect: (data) => {
        const errors = data?.validation?.errors || []
        const passed = errors.length === 0
        return { passed, detail: passed ? '没有错误' : `发现 ${errors.length} 个错误` }
      },
    },
    {
      id: 'ai-directives',
      label: '已配置 AI 机器人指令',
      description: '使用 blockAiBots 或内容信号指令，配置 AI 爬虫如何与你的内容交互。',
      level: 'recommended',
      docsUrl: 'https://nuxtseo.com/docs/robots/guides/ai-bots',
      detect: (data) => {
        const groups = data?.runtimeConfig?.groups || []
        const hasContentSignal = groups.some((g: any) => g.contentSignal?.length || g.contentUsage?.length)
        const aiAgents = ['gptbot', 'chatgpt-user', 'anthropic-ai', 'claudebot', 'claude-web', 'google-extended', 'ccbot']
        const hasAiAgent = groups.some((g: any) =>
          (g.userAgent || []).some((ua: string) => aiAgents.includes(ua.toLowerCase())),
        )
        const passed = hasContentSignal || hasAiAgent
        return { passed, detail: passed ? (hasContentSignal ? '已配置内容信号' : '已配置 AI agent 规则') : '未找到 AI 机器人指令' }
      },
    },
    {
      id: 'bot-detection',
      label: '已启用机器人检测',
      description: '通过请求头和指纹识别对机器人分类，减少非 SEO 爬虫带来的服务器负载。',
      level: 'recommended',
      docsUrl: 'https://nuxtseo.com/docs/robots/guides/bot-detection',
      detect: (data) => {
        const enabled = data?.runtimeConfig?.botDetection
        return { passed: !!enabled, detail: enabled ? '已启用' : '已禁用' }
      },
    },
    {
      id: 'sitemap-reference',
      label: 'robots.txt 中引用了站点地图',
      description: '爬虫会使用 robots.txt 中的 Sitemap 指令来发现你的站点地图 URL。',
      level: 'recommended',
      docsUrl: 'https://nuxtseo.com/docs/robots/guides/robots-txt',
      detect: (data) => {
        const sitemaps = data?.validation?.sitemaps || []
        const passed = sitemaps.length > 0
        return { passed, detail: passed ? `已引用 ${sitemaps.length} 个站点地图` : '未找到 sitemap 指令' }
      },
    },
  ],
  'sitemap': [
    {
      id: 'site-url-set',
      label: '站点地图已设置站点 URL',
      description: '站点地图需要绝对站点 URL。没有它，生产环境中的 URL 会使用 localhost。',
      level: 'required',
      docsUrl: 'https://nuxtseo.com/docs/sitemap/getting-started/installation',
      detect: (data) => {
        const url = data?.siteConfig?.url || ''
        const passed = isValidUrl(url)
        return { passed, detail: passed ? url : '未配置站点 URL' }
      },
    },
    {
      id: 'has-sources',
      label: '已配置 URL 数据源',
      description: '为 CMS 或数据库内容添加动态 URL 数据源，让所有页面都出现在站点地图中。',
      level: 'recommended',
      docsUrl: 'https://nuxtseo.com/docs/sitemap/guides/dynamic-urls',
      detect: (data) => {
        const sources = data?.globalSources || []
        const sitemaps = data?.sitemaps || {}
        const userSources = sources.filter((s: any) => s.sourceType === 'user' || (s.context?.name && !s.context.name.startsWith('nuxt:')))
        const sitemapUserSources = Object.values(sitemaps).flatMap((s: any) =>
          (s.sources || []).filter((src: any) => src.sourceType === 'user'),
        )
        const totalUser = userSources.length + sitemapUserSources.length
        const passed = totalUser > 0
        return { passed, detail: passed ? `${totalUser} 个自定义数据源` : '仅检测到默认应用数据源' }
      },
    },
    {
      id: 'no-source-errors',
      label: '站点地图数据源没有错误',
      description: '所有已配置的站点地图数据源都应成功解析。',
      level: 'required',
      docsUrl: 'https://nuxtseo.com/docs/sitemap/guides/dynamic-urls',
      detect: (data) => {
        const sources = data?.globalSources || []
        const sitemaps = data?.sitemaps || {}
        const allSources = [
          ...sources,
          ...Object.values(sitemaps).flatMap((s: any) => s.sources || []),
        ]
        const failures = allSources.filter((s: any) => s._isFailure || s.error)
        const passed = failures.length === 0
        return { passed, detail: passed ? '所有数据源正常' : `${failures.length} 个数据源失败` }
      },
    },
    {
      id: 'url-warnings',
      label: '没有 URL 校验警告',
      description: '站点地图中的 URL 应遵循最佳实践（无空白、小写等）。',
      level: 'recommended',
      docsUrl: 'https://nuxtseo.com/docs/sitemap/guides/best-practices',
      detect: (data) => {
        const sources = data?.globalSources || []
        const sitemaps = data?.sitemaps || {}
        const allSources = [
          ...sources,
          ...Object.values(sitemaps).flatMap((s: any) => s.sources || []),
        ]
        const warningCount = allSources.reduce((sum: number, s: any) => sum + (s._urlWarnings?.length || 0), 0)
        const passed = warningCount === 0
        return { passed, detail: passed ? '没有警告' : `${warningCount} 个 URL 警告` }
      },
    },
  ],
  'og-image': [
    {
      id: 'renderer',
      label: '已安装渲染器',
      description: '生成 OG 图片需要渲染器（Takumi、Satori 或 Browser）。',
      level: 'required',
      docsUrl: 'https://nuxtseo.com/docs/og-image/getting-started/installation',
      detect: (data) => {
        const compat = data?.compatibility || {}
        const hasTakumi = compat.takumi && compat.takumi !== false
        const hasSatori = compat.satori && compat.satori !== false
        const hasBrowser = compat.browser && compat.browser !== false
        const passed = hasTakumi || hasSatori || hasBrowser
        const renderers = [hasTakumi && 'takumi', hasSatori && 'satori', hasBrowser && 'browser'].filter(Boolean)
        return { passed, detail: passed ? `可用：${renderers.join(', ')}` : '未安装渲染器' }
      },
    },
    {
      id: 'custom-template',
      label: '已创建自定义 OG 模板',
      description: '社区模板仅供开发使用。生产环境请创建自定义模板。',
      level: 'recommended',
      docsUrl: 'https://nuxtseo.com/docs/og-image/guides/templates',
      detect: (data) => {
        const components = data?.componentNames || []
        const appTemplates = components.filter((c: any) => c.category === 'app')
        const communityTemplates = components.filter((c: any) => c.category === 'community')
        const passed = appTemplates.length > 0
        if (passed)
          return { passed, detail: `${appTemplates.length} 个自定义模板` }
        if (communityTemplates.length > 0)
          return { passed: false, detail: `${communityTemplates.length} 个社区模板，上线前请导出` }
        return { passed: false, detail: '未找到模板' }
      },
    },
  ],
  'seo-utils': [
    {
      id: 'schema-org-installed',
      label: '已安装 Schema.org 模块',
      description: '为页面添加结构化数据，改善富搜索结果。与 SEO Utils 搭配效果更好。',
      level: 'recommended',
      docsUrl: 'https://nuxtseo.com/docs/schema-org/getting-started/installation',
      detect: (_data, ctx) => {
        const passed = ctx.installedModuleSlugs.has('schema-org')
        return { passed, detail: passed ? '已安装' : '未安装' }
      },
    },
    {
      id: 'sitemap-installed',
      label: '已安装 Sitemap 模块',
      description: '生成 XML 站点地图，让搜索引擎能高效发现你的所有页面。',
      level: 'recommended',
      docsUrl: 'https://nuxtseo.com/docs/sitemap/getting-started/installation',
      detect: (_data, ctx) => {
        const passed = ctx.installedModuleSlugs.has('sitemap')
        return { passed, detail: passed ? '已安装' : '未安装' }
      },
    },
  ],
  'schema-org': [
    {
      id: 'identity',
      label: '已配置身份信息',
      description: '设置 Organization 或 Person 身份，以获得丰富的 Schema.org 知识图谱结果。',
      level: 'recommended',
      docsUrl: 'https://nuxtseo.com/docs/schema-org/guides/setup-identity',
      detect: (data) => {
        const config = data?.runtimeConfig || {}
        const identity = config.identity
        if (!identity)
          return { passed: false, detail: '未设置身份信息' }
        const type = typeof identity === 'string' ? identity : identity['@type'] || 'Unknown'
        const name = typeof identity === 'object' ? (identity.name || '') : ''
        return { passed: true, detail: name ? `${type}: ${name}` : type }
      },
    },
    {
      id: 'robots-companion',
      label: '已安装 Robots 模块',
      description: 'Robots 模块会自动把不可索引路径从 Schema.org 输出中排除。',
      level: 'recommended',
      docsUrl: 'https://nuxtseo.com/docs/schema-org/getting-started/installation',
      detect: (_data, ctx) => {
        const passed = ctx.installedModuleSlugs.has('robots')
        return { passed, detail: passed ? '已安装' : '未安装' }
      },
    },
  ],
}

const debugCache = ref<Map<string, Record<string, any>>>(new Map())
const loading = ref(false)
const evaluated = ref(false)

function getInstalledSlugs(): Set<string> {
  const slugs = new Set<string>()
  for (const mod of toValue(installedModules)) {
    const slug = DEVTOOLS_NAME_TO_SLUG[mod.name]
    if (slug)
      slugs.add(slug)
  }
  return slugs
}

async function fetchDebugData(): Promise<void> {
  const fetch = toValue(appFetch)
  if (!fetch)
    return

  const slugs = getInstalledSlugs()
  const cache = new Map<string, Record<string, any>>()

  const fetches = Object.entries(DEBUG_ENDPOINTS)
    .filter(([slug]) => slugs.has(slug))
    .map(async ([slug, endpoint]) => {
      const data = await fetch(endpoint!).catch((error) => {
        console.warn(`[nuxt-seo] failed to load checklist data from "${endpoint}":`, error)
        return null
      })
      if (data)
        cache.set(slug, data)
    })

  await Promise.all(fetches)
  debugCache.value = cache
}

function evaluateModule(slug: NuxtSEOModule['slug'], ctx: DetectContext): ModuleChecklistResult | undefined {
  const definitions = CHECKLIST_DEFINITIONS[slug]
  if (!definitions?.length)
    return undefined

  const meta = MODULE_META[slug]
  if (!meta)
    return undefined

  const data = debugCache.value.get(slug) || {}
  const items: ChecklistItemResult[] = definitions.map((def) => {
    const result = def.detect(data, ctx)
    return {
      id: def.id,
      label: def.label,
      description: def.description,
      level: def.level,
      docsUrl: def.docsUrl,
      passed: result.passed,
      detail: result.detail,
    }
  })

  const requiredPending = items.filter(i => i.level === 'required' && !i.passed).length
  const recommendedPending = items.filter(i => i.level === 'recommended' && !i.passed).length

  return {
    moduleSlug: slug,
    moduleLabel: meta.label,
    moduleIcon: meta.icon,
    items,
    requiredPending,
    recommendedPending,
    totalPending: requiredPending + recommendedPending,
  }
}

const results = computed<ModuleChecklistResult[]>(() => {
  const slugs = getInstalledSlugs()
  const ctx: DetectContext = { installedModuleSlugs: slugs, debugData: debugCache.value }
  const moduleResults: ModuleChecklistResult[] = []

  // Evaluate in a consistent order
  const orderedSlugs: NuxtSEOModule['slug'][] = ['site-config', 'robots', 'sitemap', 'og-image', 'schema-org', 'seo-utils']
  for (const slug of orderedSlugs) {
    if (!slugs.has(slug) && slug !== 'site-config')
      continue
    // Site config is always evaluated (it's the foundation)
    const result = evaluateModule(slug, ctx)
    if (result)
      moduleResults.push(result)
  }

  return moduleResults
})

const summary = computed<ChecklistSummary>(() => {
  let total = 0
  let passed = 0
  let requiredPending = 0
  let recommendedPending = 0
  for (const r of results.value) {
    total += r.items.length
    passed += r.items.filter(i => i.passed).length
    requiredPending += r.requiredPending
    recommendedPending += r.recommendedPending
  }
  return { total, passed, requiredPending, recommendedPending }
})

export function getModuleResult(slug: string): ModuleChecklistResult | undefined {
  return results.value.find(r => r.moduleSlug === slug)
}

export function getModuleResultByName(devtoolsName: string): ModuleChecklistResult | undefined {
  const slug = DEVTOOLS_NAME_TO_SLUG[devtoolsName]
  if (!slug)
    return undefined
  return getModuleResult(slug)
}

export async function evaluate(): Promise<void> {
  if (loading.value)
    return
  loading.value = true
  await fetchDebugData().catch(() => {
    // Debug endpoints are optional; keep the checklist usable with fallback state.
    debugCache.value = new Map()
  })
  evaluated.value = true
  loading.value = false
}

export function getSetupChecklist() {
  return {
    results,
    summary,
    loading,
    evaluated,
    evaluate,
    getModuleResult,
    getModuleResultByName,
  }
}
