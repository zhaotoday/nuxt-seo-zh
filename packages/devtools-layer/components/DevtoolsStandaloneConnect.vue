<script setup lang="ts">
import { ref } from 'vue'
import { standaloneUrl } from '../composables/state'

const trailingSlashes = /\/+$/
const urlInput = ref(standaloneUrl.value || 'http://localhost:3000')
const error = ref('')
const connecting = ref(false)

async function connect() {
  error.value = ''
  connecting.value = true
  const url = urlInput.value.replace(trailingSlashes, '')
  try {
    // Verify the dev server is reachable
    await fetch(url, { mode: 'no-cors', signal: AbortSignal.timeout(5000) })
    standaloneUrl.value = url
  }
  catch {
    error.value = `无法访问 ${url}。开发服务器是否正在运行？`
  }
  finally {
    connecting.value = false
  }
}
</script>

<template>
  <div class="standalone-connect">
    <div class="standalone-connect-card">
      <UIcon name="carbon:plug" class="text-4xl text-[var(--seo-green)]" />
      <h2 class="text-lg font-semibold">
        连接到开发服务器
      </h2>
      <p class="text-sm text-[var(--color-text-muted)] text-center max-w-sm leading-relaxed">
        当前为独立模式。输入 Nuxt 开发服务器的 URL 开始检查。
      </p>
      <form class="standalone-connect-form" @submit.prevent="connect">
        <UInput
          v-model="urlInput"
          placeholder="http://localhost:3000"
          size="lg"
          icon="carbon:link"
          class="flex-1"
          :disabled="connecting"
        />
        <UButton
          type="submit"
          icon="carbon:connect"
          size="lg"
          :loading="connecting"
        >
          连接
        </UButton>
      </form>
      <p v-if="error" class="text-xs text-[var(--color-warning)] text-center max-w-sm">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.standalone-connect {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.standalone-connect-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2.5rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-surface-elevated);
  max-width: 28rem;
  width: 100%;
}

.standalone-connect-form {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}
</style>
