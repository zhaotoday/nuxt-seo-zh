<script setup lang="ts">
import { previewSource, productionUrl } from '../composables/state'

const { error } = defineProps<{
  error?: string | Error | null
}>()
</script>

<template>
  <DevtoolsError
    icon="carbon:cloud-offline"
    title="无法访问生产站点"
    :error="error"
  >
    <template v-if="!error">
      <p class="text-xs text-[var(--color-text-muted)] max-w-xs leading-relaxed">
        无法连接到 <code class="prod-url">{{ productionUrl }}</code>。
        请检查站点是否已部署且可访问。
      </p>
    </template>
    <UButton
      variant="soft"
      size="xs"
      icon="carbon:laptop"
      @click="previewSource = 'local'"
    >
      切换到本地
    </UButton>
  </DevtoolsError>
</template>

<style scoped>
.prod-url {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  padding: 0.125rem 0.375rem;
  border-radius: var(--radius-sm);
  background: var(--color-surface-sunken);
  border: 1px solid var(--color-border-subtle);
}
</style>
