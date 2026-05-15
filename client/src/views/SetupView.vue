<template>
  <main class="setup-page">
    <section class="setup-card">
      <h1>Configura tu perfil</h1>
      <p class="intro">Antes de entrar al chat necesitas nombre, estado y avatar.</p>

      <p v-if="error" class="error">{{ error }}</p>

      <div class="avatar-preview">
        <img :src="previewUrl || avatar" :alt="name">
        <button type="button" @click="abrirSelectorArchivo">Subir foto</button>
        <input ref="fileInput" class="hidden" type="file" accept="image/*" @change="selectFile">
      </div>

      <p class="small-title">Avatares preparados</p>
      <div class="avatar-list">
        <button
          v-for="presetAvatar in presetAvatars"
          :key="presetAvatar"
          type="button"
          :class="{ selected: avatar === presetAvatar && !previewUrl }"
          @click="selectPresetAvatar(presetAvatar)"
        >
          <img :src="presetAvatar" alt="Avatar">
        </button>
      </div>

      <form class="form" @submit.prevent="saveProfile">
        <label>
          Nombre
          <input v-model="name" type="text" maxlength="40" required>
        </label>

        <label>
          Estado
          <input v-model="status" type="text" maxlength="80">
        </label>

        <button class="primary-button" type="submit" :disabled="saving">
          {{ saving ? 'Guardando...' : 'Entrar al chat' }}
        </button>
      </form>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { uploadAvatar } from '../supabase.js'
import { usuarioActual } from '../auth.js'
import { guardarPerfil, obtenerPerfil } from '../profiles.js'
import fotoperfil1 from '../assets/avatars/fotoperfil1.jpg'
import fotoperfil2 from '../assets/avatars/fotoperfil2.jpg'
import fotoperfil3 from '../assets/avatars/fotoperfil3.jpg'
import fotoperfil4 from '../assets/avatars/fotoperfil4.jpg'
import fotoperfil5 from '../assets/avatars/fotoperfil5.gif'
import fotoperfil6 from '../assets/avatars/fotoperfil6.jpg'


const router = useRouter()

const presetAvatars = [
  fotoperfil1,
  fotoperfil2,
  fotoperfil3,
  fotoperfil4,
  fotoperfil5,
  fotoperfil6,
  'https://api.dicebear.com/9.x/adventurer/svg?seed=Ana',
  'https://api.dicebear.com/9.x/adventurer/svg?seed=Luis',
  'https://api.dicebear.com/9.x/adventurer/svg?seed=Marta',
]

const name = ref(usuarioActual.value ? usuarioActual.value.displayName : '')
const status = ref('Hola, estoy usando WhatsApp Clone')
const avatar = ref(presetAvatars[0])
const file = ref(null)
const previewUrl = ref('')
const fileInput = ref(null)
const error = ref('')
const saving = ref(false)

onMounted(loadSavedProfile)

async function loadSavedProfile() {
  if (!usuarioActual.value) return

  const profile = await obtenerPerfil(usuarioActual.value.uid)
  if (!profile) return

  name.value = profile.name || name.value
  status.value = profile.status || status.value
  avatar.value = profile.avatar || avatar.value
}

function selectFile(event) {
  const selectedFile = event.target.files?.[0]
  if (!selectedFile) return

  if (!selectedFile.type.startsWith('image/')) {
    error.value = 'Selecciona un archivo de imagen.'
    return
  }

  file.value = selectedFile
  previewUrl.value = URL.createObjectURL(selectedFile)
  error.value = ''
}

function selectPresetAvatar(presetAvatar) {
  avatar.value = presetAvatar
  file.value = null
  previewUrl.value = ''
}

function abrirSelectorArchivo() {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

async function saveProfile() {
  if (!name.value.trim()) {
    error.value = 'El nombre es obligatorio.'
    return
  }

  saving.value = true
  error.value = ''

  try {
    const avatarUrl = file.value
      ? await uploadAvatar(file.value, usuarioActual.value.uid)
      : avatar.value

    const profile = {
      uid: usuarioActual.value.uid,
      name: name.value.trim(),
      status: status.value.trim() || 'Hola, estoy usando WhatsApp Clone',
      avatar: avatarUrl,
      email: usuarioActual.value.email,
    }

    await guardarPerfil(usuarioActual.value.uid, profile)
    await router.push({ name: 'chat' })
  } catch (saveError) {
    error.value = `No se pudo guardar el perfil: ${saveError.message}`
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.setup-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 20px;
  background: #111b21;
}

.setup-card {
  width: 100%;
  max-width: 460px;
  padding: 28px;
  background: #202c33;
  border-radius: 8px;
}

h1 {
  font-size: 24px;
  margin-bottom: 6px;
}

.intro,
.small-title {
  color: #8696a0;
  font-size: 14px;
}

.avatar-preview {
  display: grid;
  justify-items: center;
  gap: 10px;
  margin: 22px 0 16px;
}

.avatar-preview img {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  background: #111b21;
}

.avatar-preview button,
.primary-button {
  border: 0;
  border-radius: 8px;
  padding: 10px 14px;
  color: white;
  background: #00a884;
  cursor: pointer;
}

.hidden {
  display: none;
}

.avatar-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 10px 0 20px;
}

.avatar-list button {
  width: 54px;
  height: 54px;
  padding: 0;
  overflow: hidden;
  border: 2px solid transparent;
  border-radius: 50%;
  background: #111b21;
  cursor: pointer;
}

.avatar-list .selected {
  border-color: #00a884;
}

.avatar-list img {
  width: 100%;
  height: 100%;
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

button:disabled {
  opacity: .6;
  cursor: not-allowed;
}

.error {
  margin-top: 14px;
  padding: 10px;
  color: #f28b82;
  background: rgba(234, 67, 53, .14);
  border-radius: 8px;
}
</style>
