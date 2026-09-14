<script setup>
defineProps({
  name: { type: String, required: true }, // nome do símbolo, ex: "search", "location_on"
  size: { type: [String, Number], default: null },
  fill: { type: Boolean, default: false },
})
</script>

<template>
  <span
    class="material-symbols-outlined"
    :style="{ fontSize: size ? (typeof size === 'number' ? `${size}px` : size) : undefined, fontVariationSettings: fill ? `'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24` : undefined }"
    aria-hidden="true"
  >{{ name }}</span>
</template>
