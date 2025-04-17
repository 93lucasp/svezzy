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

    // Verifica se l'utente ha già dei bambini registrati
    const { data: bambini, error: bambiniError } = await supabase
      .from("bambini")
      .select("id")
      .eq("user_id", data.user.id);

    if (bambiniError) {
      console.error("Errore nella verifica dei bambini:", bambiniError);
    }

    // Se l'utente non ha bambini, reindirizzalo all'onboarding
    if (!bambini || bambini.length === 0) {
      navigateTo("/onboarding");
    } else {
      // Altrimenti, reindirizzalo alla pagina alimenti
      navigateTo("/");
    }
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

// Verifica se l'utente ha già visto la pagina di benvenuto
onMounted(() => {
  // Se l'utente non ha visto la pagina di benvenuto, reindirizzalo
  if (!hasSeenWelcome.value || hasSeenWelcome.value !== true) {
    navigateTo("/welcome");
  }
});
</script>