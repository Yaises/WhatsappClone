<template>
  <aside class="sidebar">
    <header class="my-profile">
      <img :src="myUser?.avatar" :alt="myUser?.name">

      <div>
        <strong>{{ myUser?.name }}</strong>
        <span>{{ myUser?.status }}</span>
      </div>

      <button type="button" title="Editar perfil" @click="$router.push({ name: 'setup' })">Editar</button>
      <button type="button" title="Cerrar sesion" @click="$emit('logout')">Salir</button>
    </header>

    <h2>{{ users.length }} conectado{{ users.length !== 1 ? 's' : '' }}</h2>

    <div class="user-list">
      <article v-for="user in users" :key="user.id" class="user">
        <img :src="user.avatar" :alt="user.name">

        <div>
          <strong>
            {{ user.name }}
            <small v-if="user.uid === myUser?.uid">tu</small>
          </strong>
          <span>{{ user.status }}</span>
        </div>
      </article>

      <p v-if="users.length === 0" class="empty">No hay usuarios conectados.</p>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  users: { type: Array, default: () => [] },
  myUser: { type: Object, default: null },
})

defineEmits(['logout'])
</script>

<style scoped>
.sidebar {
  width: 340px;
  min-width: 260px;
  background: #111b21;
  border-right: 1px solid #222d34;
  overflow-y: auto;
}

.my-profile {
  display: grid;
  grid-template-columns: 42px 1fr auto auto;
  gap: 10px;
  align-items: center;
  padding: 12px;
  background: #202c33;
}

.my-profile img,
.user img {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
}

.my-profile div,
.user div {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.my-profile strong,
.user strong {
  color: #e9edef;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.my-profile span,
.user span,
.empty {
  color: #8696a0;
  font-size: 13px;
}

button {
  border: 0;
  border-radius: 6px;
  padding: 7px 8px;
  color: #e9edef;
  background: #2a3942;
  cursor: pointer;
}

h2 {
  padding: 14px 16px 8px;
  color: #00a884;
  font-size: 13px;
  text-transform: uppercase;
}

.user {
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 12px;
  padding: 10px 16px;
  border-top: 1px solid #222d34;
}

small {
  margin-left: 5px;
  color: #00a884;
}

.empty {
  padding: 16px;
}
</style>
