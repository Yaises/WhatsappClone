<template>
  <main class="auth-page">
    <section class="auth-card">
      <h1>WhatsApp Clone</h1>

      <div class="tabs">
        <button :class="{ active: mode === 'login' }" @click="mode = 'login'">Entrar</button>
        <button :class="{ active: mode === 'register' }" @click="mode = 'register'">Registro</button>
      </div>

      <p v-if="error" class="error">{{ error }}</p>

      <form class="form" @submit.prevent="submitForm">
        <label v-if="mode === 'register'">
          Nombre
          <input v-model="name" type="text" maxlength="40" required>
        </label>

        <label>
          Correo electronico
          <input v-model="email" type="email" required autocomplete="email">
        </label>

        <label>
          Contraseña
          <input v-model="password" type="password" required minlength="6">
        </label>

        <button class="primary-button" type="submit" :disabled="loading">
          {{ loading ? 'Espera...' : buttonText }}
        </button>
      </form>

      <button class="google-button" type="button" :disabled="loading" @click="loginGoogle">
        Entrar con Google
      </button>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginConEmail, loginConGoogle, registrarConEmail } from '../auth.js'
import { obtenerPerfil } from '../profiles.js'

const router = useRouter()

const mode = ref('login')
const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const buttonText = computed(() => (mode.value === 'login' ? 'Iniciar sesion' : 'Crear cuenta'))

const firebaseErrors = {
  'auth/email-already-in-use': 'Ese correo ya esta registrado.',
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/invalid-email': 'El correo no es valido.',
  'auth/popup-closed-by-user': 'Has cerrado la ventana de Google.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
}

function showError(firebaseError) {
  error.value = firebaseErrors[firebaseError.code] || firebaseError.message
}

async function goNext(user) {
  const profile = await obtenerPerfil(user.uid)
  await router.push({ name: profile ? 'chat' : 'setup' })
}

async function submitForm() {
  error.value = ''
  loading.value = true

  try {
    const user = mode.value === 'login'
      ? await loginConEmail(email.value, password.value)
      : await registrarConEmail(email.value, password.value, name.value)

    await goNext(user)
  } catch (firebaseError) {
    showError(firebaseError)
  } finally {
    loading.value = false
  }
}

async function loginGoogle() {
  error.value = ''
  loading.value = true

  try {
    const user = await loginConGoogle()
    await goNext(user)
  } catch (firebaseError) {
    showError(firebaseError)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 20px;
  background: #111b21;
}

.auth-card {
  width: 100%;
  max-width: 380px;
  padding: 28px;
  background: #202c33;
  border-radius: 8px;
}

h1 {
  margin-bottom: 22px;
  text-align: center;
  font-size: 24px;
}

.tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 18px;
}

.tabs button,
.primary-button,
.google-button {
  border: 0;
  border-radius: 8px;
  padding: 11px;
  cursor: pointer;
}

.tabs button {
  color: #e9edef;
  background: #2a3942;
}

.tabs .active,
.primary-button {
  color: white;
  background: #00a884;
}

.form {
  display: grid;
  gap: 14px;
}

label {
  display: grid;
  gap: 6px;
  color: #8696a0;
  font-size: 13px;
}

input {
  padding: 11px;
  color: #e9edef;
  background: #111b21;
  border: 1px solid #374045;
  border-radius: 8px;
}

.google-button {
  width: 100%;
  margin-top: 14px;
  color: #e9edef;
  background: #2a3942;
}

button:disabled {
  opacity: .6;
  cursor: not-allowed;
}

.error {
  margin-bottom: 14px;
  padding: 10px;
  color: #f28b82;
  background: rgba(234, 67, 53, .14);
  border-radius: 8px;
}
</style>
