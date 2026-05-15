import { createRouter, createWebHistory } from 'vue-router'
import { authLista, usuarioActual } from './auth.js'
import { obtenerPerfil } from './profiles.js'
import AuthView from './views/AuthView.vue'
import SetupView from './views/SetupView.vue'
import ChatView from './views/ChatView.vue'

const routes = [
  { path: '/', name: 'auth', component: AuthView },
  { path: '/setup', name: 'setup', component: SetupView, meta: { requiresAuth: true } },
  { path: '/chat', name: 'chat', component: ChatView, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  await authLista
  const user = usuarioActual.value

  if (to.meta.requiresAuth && !user) {
    return { name: 'auth' }
  }

  if (to.name === 'auth' && user) {
    const profile = await obtenerPerfil(user.uid)
    return { name: profile ? 'chat' : 'setup' }
  }

  return true
})

export default router
