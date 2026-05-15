import { ref } from 'vue'
import { io } from 'socket.io-client'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3200'

let socket = null

export const usuarios = ref([])
export const mensajes = ref([])
export const usuariosEscribiendo = ref({})

export function conectarSocket(miPerfil) {
  if (socket && socket.connected) return

  socket = io(SERVER_URL)

  socket.on('connect', () => {
    socket.emit('join', miPerfil)
  })

  socket.on('userList', (listaUsuarios) => {
    usuarios.value = listaUsuarios
  })

  socket.on('chatMessage', (mensaje) => {
    mensajes.value.push(mensaje)
  })

  socket.on('systemMessage', (mensaje) => {
    mensajes.value.push({
      id: Date.now(),
      system: true,
      text: mensaje.text,
    })
  })

  socket.on('typing', (data) => {
    if (data.isTyping) {
      usuariosEscribiendo.value[data.user.id] = data.user.name
    } else {
      delete usuariosEscribiendo.value[data.user.id]
    }
  })
}

export function desconectarSocket() {
  if (socket) {
    socket.disconnect()
  }

  socket = null
  usuarios.value = []
  mensajes.value = []
  usuariosEscribiendo.value = {}
}

export function enviarMensaje(texto) {
  if (socket) {
    socket.emit('chatMessage', { text: texto })
  }
}

export function avisarEscribiendo(estaEscribiendo) {
  if (socket) {
    socket.emit('typing', estaEscribiendo)
  }
}
