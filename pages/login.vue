<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50"
  >
    <div class="w-full max-w-md">
      <app-logo class="w-32 mx-auto mb-4" />

      <div class="bg-white p-8 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold text-center mb-6">Accedi</h2>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700"
              >Email</label
            >
            <input
              id="email"
              type="email"
              v-model="email"
              placeholder="mariorossi@gmail.com"
              required
              class="outline-none w-full  py-2 border-b border-gray-300 rounded-md focus:outline-none"
            />
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
              >Password</label
            >
            <input
              id="password"
              type="password"
              v-model="password"
              placeholder="********"
              required
              class="outline-none w-full  py-2 border-b border-gray-300 rounded-md focus:outline-none"
            />
          </div>

          <div class="text-right">
            <button
              type="button"
              @click="navigateToForgotPassword"
              class="text-sm text-primary"
            >
              Password dimenticata?
            </button>
          </div>

          <div v-if="error" class="text-red-500 text-sm mt-2">
            {{ error }}
          </div>

          <button
            type="submit"
            class="w-full bg-primary text-white py-2 px-4 rounded-full focus:outline-none"
            :disabled="isLoading"
          >
            <span v-if="isLoading">Caricamento...</span>
            <span v-else>Accedi</span>
          </button>
        </form>
        
        <div class="mt-4 relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Oppure</span>
          </div>
        </div>
        
        <div class="mt-4">
          <button
            type="button"
            @click="handleGoogleLogin"
            class="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-full shadow-sm bg-white hover:bg-gray-50"
            :disabled="isLoading"
          >
            <svg class="h-5 w-5 mr-2" viewBox="0 0 24 24" width="24" height="24">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
              </g>
            </svg>
            Continua con Google
          </button>
        </div>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Non hai un account?
            <button
              @click="navigateToRegister"
              class="text-primary hover:text-indigo-800 font-medium"
            >
              Registrati
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const email = ref("");
const password = ref("");
const isLoading = ref(false);
const error = ref("");

// Otteniamo il client Supabase
const supabase = useSupabaseClient();

// Cookie per verificare se l'utente ha già visto la pagina di benvenuto
const hasSeenWelcome = useCookie("hasSeenWelcome");

async function handleLogin() {
  error.value = "";
  isLoading.value = true;

  try {
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (authError) throw authError;

    
      navigateTo("/");
    
  } catch (err) {
    error.value =
      "Errore durante il login: " +
      (err.message || "Controlla le tue credenziali e riprova");
    console.error("Errore login:", err);
  } finally {
    isLoading.value = false;
  }
}

function navigateToForgotPassword() {
  navigateTo("/recupero-password");
}

function navigateToRegister() {
  navigateTo("/signup");
}

async function handleGoogleLogin() {
  isLoading.value = true;
  error.value = "";
  
  try {
    const { data, error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `svezzy://provider=google`
      }
    });
    
    if (authError) throw authError;
    
  } catch (err) {
    error.value = "Errore durante l'accesso con Google: " + (err.message || "Riprova più tardi");
    console.error("Errore accesso Google:", err);
    isLoading.value = false;
  }
}

// Verifica se l'utente ha già visto la pagina di benvenuto
onMounted(() => {
  // Se l'utente non ha visto la pagina di benvenuto, reindirizzalo
  if (!hasSeenWelcome.value || hasSeenWelcome.value !== true) {
    navigateTo("/welcome");
  }
});
</script>