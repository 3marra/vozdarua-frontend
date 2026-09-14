<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // primary | secondary | outline | ghost
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
})
defineEmits(['click'])

const VARIANTS = {
  // bg-teal-dark (não bg-teal) em repouso: texto branco sobre bg-teal só fica em 3.7:1,
  // abaixo do mínimo de 4.5:1 do WCAG 1.4.3 pra texto normal. teal-dark passa em 5.5:1.
  primary: 'bg-teal-dark text-white hover:bg-teal-darker active:scale-95',
  // Preenchido e com borda mais forte que "outline" — pra ações secundárias que ainda
  // precisam de destaque visual (ex: trocar uma seleção já feita), sem competir com a primária.
  secondary: 'bg-teal-soft text-teal-dark border-1.5 border-teal-mid hover:bg-teal-mid/40 active:scale-95',
  outline: 'bg-white text-teal-dark border-1.5 border-teal hover:bg-teal-soft active:scale-95',
  ghost: 'bg-transparent text-teal hover:underline',
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="w-full min-h-[48px] rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
    :class="VARIANTS[variant]"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
