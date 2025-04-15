


import { createClient, type User } from '@supabase/supabase-js'

// dovrebbe essere cosi ma in errore "A composable that requires access to the nuxt instance was called outside of a plugin,nuxthook,nuxt middleware or vue setup"
// const config = useRuntimeConfig()
// const supabaseUrl = config.public.supabaseUrl as string
// const supabaseKey = config.public.supabaseKey as string

const supabaseUrl = "https://knmihlsxprmqsdyowyly.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtubWlobHN4cHJtcXNkeW93eWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NjgxNDQsImV4cCI6MjA1OTQ0NDE0NH0.59tX02tg7EsuA0FPZbQJPLsHYhQ8LZysw4fGIKCGuig"

const supabase = createClient(supabaseUrl, supabaseKey)

// Stato dell'utente e del caricamento
const currentUser: Ref<User | null> = ref(null)
const isUserLoaded: Ref<boolean> = ref(false)

// Funzione per inizializzare lo stato utente
async function initializeUser() {
  if (typeof window !== 'undefined') {
    const { data: { user } } = await supabase.auth.getUser()
    currentUser.value = user ?? null
    isUserLoaded.value = true // Indica che il caricamento è completato
  }
}

// Listener per cambiamenti di stato dell'autenticazione
if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((_event, session) => {
    currentUser.value = session?.user ?? null
  })
}

// Composable per ottenere il client Supabase
export function useSupabaseClient() {
  return supabase
}

// Composable per ottenere lo stato utente
export function useSupabaseUser() {
  return currentUser
}

// Composable per verificare se il caricamento dell'utente è completato
export function useSupabaseUserInitialization() {
  return { initializeUser, isUserLoaded }
}
