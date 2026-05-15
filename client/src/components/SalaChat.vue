<template>
  <section class="chat">
    <header class="chat-header">
      <div>
        <h1>Sala General</h1>
        <p>{{ userCount }} participante{{ userCount !== 1 ? 's' : '' }}</p>
      </div>
    </header>

    <main ref="messagesBox" class="messages">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="message.system ? 'system-message' : ['message', isMine(message) ? 'mine' : 'other']"
      >
        <template v-if="message.system">
          {{ message.text }}
        </template>

        <template v-else>
          <strong v-if="!isMine(message)">{{ message.user.name }}</strong>
          <p>{{ message.text }}</p>
          <time>{{ formatTime(message.timestamp) }}</time>
        </template>
      </div>
    </main>

    <p class="typing">
      <span v-if="typingNames.length">{{ typingNames.join(', ') }} escribiendo...</span>
    </p>

    <form class="message-form" @submit.prevent="sendMessage">
      <input
        v-model="text"
        type="text"
        maxlength="2000"
        placeholder="Escribe un mensaje"
        @input="typing"
      >
      <button type="submit" :disabled="!text.trim()">Enviar</button>
    </form>
  </section>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'

const props = defineProps({
  messages: { type: Array, default: () => [] },
  typingUsers: { type: Object, default: () => ({}) },
  userCount: { type: Number, default: 0 },
  myUser: { type: Object, default: null },
})

const emit = defineEmits(['send', 'typing'])

const text = ref('')
const messagesBox = ref(null)
let typingTimeout = null

const typingNames = computed(() =>
  Object.values(props.typingUsers).filter((name) => name !== props.myUser?.name)
)

function isMine(message) {
  return message.user?.uid === props.myUser?.uid
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function sendMessage() {
  const cleanText = text.value.trim()
  if (!cleanText) return

  emit('send', cleanText)
  text.value = ''
  emit('typing', false)
}

function typing() {
  emit('typing', true)
  clearTimeout(typingTimeout)
  typingTimeout = setTimeout(() => emit('typing', false), 1200)
}

function scrollToBottom() {
  if (!messagesBox.value) return
  messagesBox.value.scrollTop = messagesBox.value.scrollHeight
}

watch(() => props.messages.length, () => nextTick(scrollToBottom))
</script>

<style scoped>
.chat {
  flex: 1;
  display: grid;
  grid-template-rows: auto 1fr 24px auto;
  min-width: 0;
  background: #0b141a;
}

.chat-header {
  padding: 12px 18px;
  background: #202c33;
}

h1 {
  font-size: 17px;
}

.chat-header p,
.typing,
time {
  color: #8696a0;
  font-size: 12px;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 18px 8%;
  overflow-y: auto;
}

.message {
  max-width: 68%;
  padding: 8px 10px;
  border-radius: 8px;
}

.message p {
  margin: 3px 0;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.other {
  align-self: flex-start;
  background: #202c33;
}

.mine {
  align-self: flex-end;
  background: #005c4b;
}

.system-message {
  align-self: center;
  padding: 6px 12px;
  color: #e9edef;
  background: #202c33;
  border-radius: 8px;
  font-size: 13px;
}

.typing {
  padding-left: 18px;
  color: #00a884;
}

.message-form {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  padding: 10px 16px;
  background: #202c33;
}

input {
  min-width: 0;
  padding: 11px 14px;
  color: #e9edef;
  background: #2a3942;
  border: 0;
  border-radius: 8px;
}

button {
  border: 0;
  border-radius: 8px;
  padding: 0 18px;
  color: white;
  background: #00a884;
  cursor: pointer;
}

button:disabled {
  opacity: .6;
  cursor: not-allowed;
}

@media (max-width: 760px) {
  .messages {
    padding: 14px;
  }

  .message {
    max-width: 86%;
  }
}
</style>
