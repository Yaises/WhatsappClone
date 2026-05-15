import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase.js'

export async function obtenerPerfil(uid) {
  const perfilDoc = await getDoc(doc(db, 'profiles', uid))

  if (perfilDoc.exists()) {
    return perfilDoc.data()
  }

  return null
}

export async function guardarPerfil(uid, perfil) {
  await setDoc(doc(db, 'profiles', uid), perfil)
}
