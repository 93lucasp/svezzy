export default defineNuxtRouteMiddleware(async (to, from) => {
  const { initializeUser, isUserLoaded } = useSupabaseUserInitialization()
  const user = useSupabaseUser()
  
  // Lista delle pagine accessibili senza autenticazione
  const publicPages = ['/', '/registrazione', '/recupero-password']
  const isPublicPage = publicPages.includes(to.path)
  const homePage = '/alimenti'
  
  // Verifica se l'utente ha già visto la welcome page
  const hasSeenWelcome = useCookie('has-seen-welcome').value === 'true'
  
  // Gestione per la welcome page
  if (to.path !== '/welcome' && !hasSeenWelcome) {
    return navigateTo('/welcome')
  }
  
  // Se l'utente sta già andando alla welcome page, permettigli di accedervi
  if (to.path === '/welcome') {
    return
  }

  // Attesa del caricamento dello stato utente
  if (!isUserLoaded.value) {
    await initializeUser()
  }

  // Se l'autenticazione è ancora in caricamento, continua la navigazione
  if (user.value === undefined) {
    return
  }

  // Gestione della navigazione in base allo stato di autenticazione
  const isAuthenticated = !!user.value

  if (isAuthenticated) {
    // Utente autenticato che tenta di accedere a pagine pubbliche viene reindirizzato alla home
    if (isPublicPage) {
      return navigateTo(homePage)
    }
    // Altrimenti può accedere alle pagine protette
    return
  } else {
    // Utente non autenticato può accedere solo alle pagine pubbliche
    if (isPublicPage) {
      return
    }
    // Altrimenti viene reindirizzato alla pagina di login
    return navigateTo('/')
  }
})