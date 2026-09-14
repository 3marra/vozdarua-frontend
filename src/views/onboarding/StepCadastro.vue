<script setup>
import { ref, computed, onMounted } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useOcorrenciasStore } from '@/stores/ocorrencias'
import { useAuth } from '@/composables/useAuth'
import AppButton from '@/components/ui/AppButton.vue'
import AppField from '@/components/ui/AppField.vue'
import AppIcon from '@/components/ui/AppIcon.vue'

const emit = defineEmits(['next'])
const ocorrencias = useOcorrenciasStore()
const { registrar, login, continuarAnonimo, isLoggedIn } = useAuth()

const modo = ref('cadastro') // cadastro | login
const erroEnvio = ref('')
const enviando = ref(false)

const schemaCadastro = toTypedSchema(
  z.object({
    phone: z.string().min(8, 'Informe um telefone válido'),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
  })
)

const schemaLogin = toTypedSchema(
  z.object({
    email: z.string().email('E-mail inválido'),
    password: z.string().min(1, 'Informe sua senha'),
  })
)

const { handleSubmit, errors, defineField } = useForm({
  // ponytail: computed em vez de valor fixo — mesmo problema do AuthModal.vue,
  // useForm só reage a troca de schema se ela for reativa.
  validationSchema: computed(() => (modo.value === 'cadastro' ? schemaCadastro : schemaLogin)),
})

const [phone] = defineField('phone')
const [email] = defineField('email')
const [password] = defineField('password')

async function finalizarComOcorrencia() {
  await ocorrencias.enviarRascunho()
  emit('next')
}

// ponytail: usuário já logado não deve ver o form de cadastro/login de novo —
// envia direto. Voltar da tela de sucesso até aqui reenvia (rascunho já foi
// limpo, então falha validação no backend em vez de duplicar); não vale
// guarda extra para esse caso raro.
async function submitLogado() {
  enviando.value = true
  erroEnvio.value = ''
  try {
    await finalizarComOcorrencia()
  } catch (e) {
    erroEnvio.value = e.response?.data?.error || 'Não foi possível continuar. Tente novamente.'
  } finally {
    enviando.value = false
  }
}

onMounted(() => {
  if (isLoggedIn.value) submitLogado()
})

const onSubmit = handleSubmit(async (values) => {
  enviando.value = true
  erroEnvio.value = ''
  try {
    if (modo.value === 'cadastro') {
      await registrar({ email: values.email, password: values.password, phone: values.phone })
    } else {
      await login({ email: values.email, password: values.password })
    }
    await finalizarComOcorrencia()
  } catch (e) {
    erroEnvio.value = e.response?.data?.error || 'Não foi possível continuar. Verifique seus dados.'
  } finally {
    enviando.value = false
  }
})

async function seguirAnonimo() {
  continuarAnonimo()
  await finalizarComOcorrencia()
}

function alternarModo() {
  modo.value = modo.value === 'cadastro' ? 'login' : 'cadastro'
}
</script>

<template>
  <div class="flex flex-col p-5 pb-8">

    <!-- Usuário já logado: envio automático, sem pedir login de novo -->
    <div v-if="isLoggedIn" class="flex flex-col items-center gap-4 py-14 text-center">
      <span v-if="enviando" class="text-sm text-gray-500 animate-pulse">Registrando ocorrência…</span>
      <template v-else-if="erroEnvio">
        <p class="text-sm text-red-600">{{ erroEnvio }}</p>
        <AppButton @click="submitLogado">Tentar novamente</AppButton>
      </template>
    </div>

    <template v-else>
    <!-- Hero -->
    <div class="mb-6">
      <div class="w-14 h-14 rounded-2xl bg-teal/10 flex items-center justify-center text-teal mb-4">
        <AppIcon :name="modo === 'cadastro' ? 'person_add' : 'waving_hand'" size="28" />
      </div>
      <h1 class="text-2xl font-extrabold text-gray-900 leading-tight">
        {{ modo === 'cadastro' ? 'Quase lá!' : 'Bem-vindo de volta!' }}
      </h1>
      <p class="text-sm text-gray-500 mt-1 leading-relaxed">
        {{ modo === 'cadastro'
          ? 'Crie sua conta para acompanhar sua ocorrência e receber atualizações.'
          : 'Entre para vincular a ocorrência à sua conta.'
        }}
      </p>
    </div>

    <!-- Formulário -->
    <form class="flex flex-col gap-3 mb-4" @submit="onSubmit">
      <AppField v-if="modo === 'cadastro'" v-model="phone" label="Telefone" type="tel" mask="phone" placeholder="(11) 99999-9999" :error="errors.phone" />
      <AppField v-model="email" label="E-mail" type="email" :error="errors.email" />
      <AppField v-model="password" label="Senha" type="password" :error="errors.password" />

      <div v-if="erroEnvio" class="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
        <AppIcon name="warning" class="text-red-600 flex-shrink-0" size="18" />
        <p class="text-xs text-red-600 leading-relaxed">{{ erroEnvio }}</p>
      </div>

      <AppButton type="submit" :disabled="enviando" class="mt-1">
        <span v-if="enviando" class="animate-pulse">Aguarde…</span>
        <span v-else>{{ modo === 'cadastro' ? 'Criar conta e registrar' : 'Entrar e registrar' }}</span>
      </AppButton>
    </form>

    <!-- Alternar modo -->
    <AppButton variant="secondary" class="mb-5" @click="alternarModo">
      {{ modo === 'cadastro' ? 'Já tenho conta — Entrar' : 'Criar uma nova conta' }}
    </AppButton>

    <!-- Divisor -->
    <div class="flex items-center gap-3 mb-5">
      <div class="flex-1 h-px bg-gray-100" />
      <span class="text-xs text-gray-500 font-medium">ou</span>
      <div class="flex-1 h-px bg-gray-100" />
    </div>

    <!-- Anônimo: mesma paleta "secundária" (teal-soft/teal-mid) do restante da jornada,
         mas com duas linhas — por isso não usa o AppButton, que só suporta uma. -->
    <button
      type="button"
      class="flex flex-col items-center gap-1 w-full py-3.5 rounded-xl bg-teal-soft border-1.5 border-teal-mid hover:bg-teal-mid/40 active:scale-95 transition-all"
      @click="seguirAnonimo"
    >
      <span class="text-sm font-semibold text-teal-dark">Continuar sem cadastro</span>
      <span class="text-xs text-teal">Sua ocorrência será registrada como anônima</span>
    </button>
    </template>

  </div>
</template>
