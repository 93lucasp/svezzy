export default defineNuxtRouteMiddleware(async (to, from) => {
  const { initializeUser, isUserLoaded } = useSupabaseUserInitialization()
  const user = useSupabaseUser()

  console.debug('[auth middleware] Current route:', to.path)
  console.debug('[auth middleware] User state:', user.value === undefined ? 'loading' : user.value ? 'authenticated' : 'unauthenticated')

  // Assicurati che lo stato dell'utente sia caricato
  if (!isUserLoaded.value) {
    console.debug('[auth middleware] Initializing user...')
    await initializeUser()
  }

  // Se lo stato dell'utente è ancora undefined, consenti alla pagina di gestire il caricamento
  if (user.value === undefined) {
    console.debug('[auth middleware] Auth still loading, deferring navigation...')
    return
  }

  // Gestione utenti autenticati
  if (user.value) {
    if (to.path === '/login' || to.path === '/signup') {
      console.debug('[auth middleware] Authenticated user attempting to access auth page, redirecting to home')
      return navigateTo('/')
    }
    console.debug('[auth middleware] User authenticated, allowing access to:', to.path)
    return
  }

  // Gestione utenti non autenticati
  if (to.path === '/login' || to.path === '/signup') {
    console.debug('[auth middleware] Allowing unauthenticated access to auth page:', to.path)
    return
  }

  // Reindirizza utenti non autenticati alla pagina di login, preservando la destinazione
  console.debug('[auth middleware] No user found, redirecting to /login...')
  // return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  return navigateTo('/login')
})
