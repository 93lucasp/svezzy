import { App } from '@capacitor/app';
// import { useSupabaseClient } from '~/composables/useSupabase'

export default defineNuxtPlugin(() => {
  App.addListener('appUrlOpen', async (data) => {
    if (data && data.url) {

      // Gestisci il deeplink
      const url = new URL(data.url);
      const path = url.pathname;
      const queryParams = Object.fromEntries(url.searchParams.entries());
      const result = data.url.split('svezzy://')[1];

      const url2 = new URL(data.url.replace('svezzy://', 'https://placeholder.com'));
      // Estrai access_token e refresh_token dall'hash
      const params = new URLSearchParams(url2.hash.substring(1)); // Rimuovi il `#`
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const supabase = useSupabaseClient();
      try {
        const { data } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        })
        navigateTo(`/new-password`)
      }
      catch (error) {
        console.log('Errore durante il settaggio della sessione:', error);
      }
    }
  });
});
