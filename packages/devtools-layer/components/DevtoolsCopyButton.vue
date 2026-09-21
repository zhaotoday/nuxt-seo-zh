<script setup lang="ts">
import { useCopy } from '../composables/clipboard'

const { text } = defineProps<{
  text: string
}>()

const { copy, copied } = useCopy()
</script>

<template>
  <UTooltip :text="copied ? '已复制！' : '复制'">
    <UButton
      :icon="copied ? 'carbon:checkmark' : 'carbon:copy'"
      :aria-label="copied ? '已复制' : '复制到剪贴板'"
      :class="copied ? 'text-[var(--seo-green)]' : ''"
      @click="copy(text)"
    />
  </UTooltip>
</template>
