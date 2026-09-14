<script setup>
import { computed, ref, useId } from 'vue'
import AppIcon from '@/components/ui/AppIcon.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: ' ' }, // espaço intencional para :placeholder-shown funcionar
  error: { type: String, default: '' },
  mask: { type: String, default: '' }, // 'phone' -> (99) 99999-9999
})
const emit = defineEmits(['update:modelValue'])

const fieldId = useId()
const errorId = computed(() => `${fieldId}-error`)
const hasValue = computed(() => props.modelValue && props.modelValue.length > 0)

const senhaVisivel = ref(false)
const isPassword = computed(() => props.type === 'password')
const inputType = computed(() => isPassword.value && senhaVisivel.value ? 'text' : props.type)

function formatPhone(digits) {
  const d = digits.slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

function onInput(e) {
  if (props.mask === 'phone') {
    const formatted = formatPhone(e.target.value.replace(/\D/g, ''))
    e.target.value = formatted
    emit('update:modelValue', formatted)
  } else {
    emit('update:modelValue', e.target.value)
  }
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="relative">
      <input
        :id="fieldId"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :aria-describedby="error ? errorId : undefined"
        :aria-invalid="!!error || undefined"
        class="peer w-full rounded-xl border border-gray-300 px-3.5 pt-5 pb-2.5 text-sm text-gray-800 outline-none transition-all duration-150 focus:border-teal focus:ring-2 focus:ring-teal/20 placeholder-transparent"
        :class="[error ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : '', isPassword ? 'pr-10' : '']"
        @input="onInput"
      />
      <button
        v-if="isPassword"
        type="button"
        :aria-label="senhaVisivel ? 'Ocultar senha' : 'Mostrar senha'"
        tabindex="-1"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600"
        @click="senhaVisivel = !senhaVisivel"
      >
        <AppIcon :name="senhaVisivel ? 'visibility_off' : 'visibility'" size="18" />
      </button>
      <label
        v-if="label"
        :for="fieldId"
        class="pointer-events-none absolute left-3.5 top-3.5 text-sm text-gray-500 transition-all duration-150 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-teal peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-500"
        :class="error ? 'peer-focus:text-red-600' : ''"
      >
        {{ label }}
      </label>
    </div>
    <p
      v-if="error"
      :id="errorId"
      role="alert"
      class="text-xs text-red-600 px-1"
    >{{ error }}</p>
  </div>
</template>
