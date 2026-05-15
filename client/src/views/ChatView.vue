<template>
  <div class="chat-page">
    <ListaUsuarios :users="usuarios" :my-user="myUser" @logout="logoutUser" />
    <SalaChat
      :messages="mensajes"
      :typing-users="usuariosEscribiendo"
      :user-count="usuarios.length"
      :my-user="myUser"
      @send="enviarMensaje"
      @typing="avisarEscribiendo"
    />
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { cerrarSesion, usuarioActual } from '../auth.js'
import { obtenerPerfil } from '../profiles.js'
import {
  avisarEscribiendo,
  conectarSocket,
  desconectarSocket,
  enviarMensaje,
  mensajes,
  usuarios,
  usuariosEscribiendo,
} from '../socket.js'
import ListaUsuarios from '../components/ListaUsuarios.vue'
import SalaChat from '../components/SalaChat.vue'

const router = useRouter()
const myUser = ref(null)

onMounted(async () => {
  const uid = usuarioActual.value ? usuarioActual.value.uid : null
  if (!uid) return null

  myUser.value = await obtenerPerfil(uid)

  if (!myUser.value) {
    router.push({ name: 'setup' })
    return
  }

  conectarSocket(myUser.value)
})

onBeforeUnmount(desconectarSocket)

async function logoutUser() {
  desconectarSocket()
  await cerrarSesion()
  router.push({ name: 'auth' })
}
</script>

<style scoped>
.chat-page {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #111b21;
}

@media (max-width: 760px) {
  .chat-page {
    flex-direction: column;
  }
}
</style>
