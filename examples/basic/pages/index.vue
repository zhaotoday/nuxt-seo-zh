<script setup lang="ts">
useSeoMeta({
  title: '首页',
  description: '欢迎来到首页。',
})

defineOgImage('NuxtSeo')
</script>

<template>
  <div>
    <h1>首页</h1>
    <p>这是一个安装了 @nuxtjs/seo 的 Nuxt 示例应用。</p>
  </div>
</template>
