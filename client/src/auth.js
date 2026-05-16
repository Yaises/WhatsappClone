import { ref } from 'vue'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth, githubProvider, googleProvider } from './firebase.js'

export const usuarioActual = ref(null)
export const cargandoUsuario = ref(true)

export const authLista = new Promise((resolve) => {
  onAuthStateChanged(auth, (user) => {
    usuarioActual.value = user
    cargandoUsuario.value = false
    resolve(user)
  })
})

export async function registrarConEmail(email, password, name) {
  const result = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(result.user, { displayName: name })
  return result.user
}

export async function loginConEmail(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}

export async function loginConGoogle() {
  const result = await signInWithPopup(auth, googleProvider)
  return result.user
}

export async function loginConGithub() {
  const result = await signInWithPopup(auth, githubProvider)
  return result.user
}

export function cerrarSesion() {
  return signOut(auth)
}
