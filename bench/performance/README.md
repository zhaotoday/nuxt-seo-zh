# SSR 性能基准测试

这个基准测试会构建一个包含完整 Nuxt SEO 模块栈的生产 Nuxt 应用。该技术栈包含 `nuxt-ai-ready`、i18n 和 skew protection。它会测量：

- 每次 SSR 渲染的服务端 CPU 时间；
- 每次 SSR 渲染分配的 V8 堆；
- `robots.txt`、`sitemap.xml` 和 `llms.txt` 的 CPU 时间与分配；
- SSR 和 SEO 端点负载的采样 CPU 与堆分析。

在本地运行：

```sh
pnpm dev:prepare
pnpm benchmark:build
pnpm benchmark
```

结果是 `bench/performance/result.json`。分析产物位于 `bench/performance/profiles/`：

- `ssr-*` 包含 SSR 分析集；
- `robots-*`、`sitemap-*` 和 `ai-ready-*` 包含各自端点的分析集；
- 每个 `*-profile-analysis.md` 包含完整成本和聚焦 Nuxt SEO 的成本，以及调用路径；
- 每个 `*-profile-analysis.json` 包含机器可读的 self、inclusive、module 和 path 成本；
- 每个 `*-flamegraph.speedscope.json` 可在 <https://www.speedscope.app/> 打开；
- 每个原始 `.cpuprofile` 和 `.heapprofile` 包含 V8 数据。

Pull request 工作流会在同一台 runner 上构建 base 和 head 提交。评论以紧凑的负载对比开头。分配值来自采样堆分析。模块成本和当前 SSR 热点默认折叠，需要时再展开。CPU 变化需要 5% 加上测量不确定性。内存变化需要同时满足 2.5% 和 16 KiB。产物会保留两套结果、完整调用路径和所有原始分析文件。
