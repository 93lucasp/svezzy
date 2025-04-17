<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
    <div class="w-full max-w-md">
      <h1 class="text-3xl font-bold text-center text-primary mb-8">Svezzy</h1>
      
      <div class="bg-white p-8 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold text-center mb-6">Recupera Password</h2>
        
        <div v-if="!recoveryEmailSent">
          <p class="text-gray-600 mb-6 text-center">
            Inserisci la tua email e ti invieremo un link per reimpostare la password.
          </p>
          
          <form @submit.prevent="handleRecovery" class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                id="email" 
                type="email" 
                v-model="email" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div v-if="error" class="text-red-500 text-sm mt-2">
              {{ error }}
            </div>
            
            <button 
              type="submit" 
              class="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              :disabled="isLoading"
            >
              <span v-if="isLoading">Caricamento...</span>
              <span v-else>Invia link di recupero</span>
            </button>
          </form>
        </div>
        
        <div v-else class="text-center">
          <div class="flex justify-center mb-4">
            <span class="bg-green-100 text-green-800 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </span>
          </div>
          <h3 class="text-xl font-medium text-gray-900 mb-2">Email inviata!</h3>
          <p class="text-gray-600 mb-4">
            Abbiamo inviato un link per reimpostare la password all'indirizzo email fornito.
          </p>
        </div>
        
        <div class="mt-6 text-center">
          <button @click="navigateToLogin" class="text-primary hover:text-indigo-800 font-medium">
            Torna al login
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const email = ref('');
const isLoading = ref(false);
const recoveryEmailSent = ref(false);
const error = ref('');

// Otteniamo il client Supabase
const supabase = useSupabaseClient();

async function handleRecovery() {
  error.value = '';
  isLoading.value = true;
  
  try {
    const { data, error: authError } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/`
    });
    
    if (authError) throw authError;
    
    recoveryEmailSent.value = true;
  } catch (err) {
    error.value = 'Errore durante l\'invio dell\'email: ' + (err.message || 'Riprova più tardi');
    console.error('Errore reset password:', err);
  } finally {
    isLoading.value = false;
  }
}

function navigateToLogin() {
  navigateTo('/');
}
</script> 