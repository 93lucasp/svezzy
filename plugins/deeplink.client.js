import { App } from '@capacitor/app';
// import { useSupabaseClient } from '~/composables/useSupabase'

export default defineNuxtPlugin(() => {
  App.addListener('appUrlOpen', async (data) => {
    if (data && data.url) {

      // Gestisci il deeplink
      const url = new URL(data.url);
      console.log('url::', url)
      const path = url.pathname;
      const queryParams = Object.fromEntries(url.searchParams.entries());
      const result = data.url.split('svezzy://')[1];

      // Crea URL temporaneo per estrarre i parametri dall'hash
      const url2 = new URL(data.url.replace('svezzy://', 'https://placeholder.com'));
      // Estrai parametri dall'hash
      const params = new URLSearchParams(url2.hash.substring(1)); // Rimuovi il `#`
      const type = params.get('type');
      console.log('Tipo di deeplink:', type);

      // Se il tipo è signup, naviga alla home
      if (type === 'signup') {
        console.log('Apertura app dopo signup');
        return navigateTo('/');
      }

      // Se il tipo è recovery, procedi con il recupero password
      if (type === 'recovery') {
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const supabase = useSupabaseClient();
        try {
          const { data } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })
          return navigateTo('/new-password');
        }
        catch (error) {
          console.log('Errore durante il settaggio della sessione:', error);
        }
      }
      
      // Gestione autenticazione social (Google)
      if (url2.hash && params.get('access_token')) {
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const provider = params.get('provider') || queryParams.provider;
        
        console.log('Login social completato:', provider || 'provider non specificato');
        
        const supabase = useSupabaseClient();
        try {
          const { data } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          console.log('Sessione impostata correttamente');
          return navigateTo('/');
        } catch (error) {
          console.log('Errore durante il settaggio della sessione:', error);
        }
      }
    }
  });
});
