<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50"
  >
    <div class="w-full max-w-md">
      <app-logo class="w-32 mx-auto mb-4" />

      <div class="bg-white p-8 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold text-center mb-6">
          {{
            registrationComplete ? "Registrazione completata!" : "Registrati"
          }}
        </h2>

        <form
          v-if="!registrationComplete"
          @submit.prevent="handleRegister"
          class="space-y-4"
        >
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
              class="outline-none w-full py-2 border-b border-gray-300 rounded-md focus:outline-none"
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
              class="outline-none w-full py-2 border-b border-gray-300 rounded-md focus:outline-none"
            />
          </div>

          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-gray-700"
              >Conferma Password</label
            >
            <input
              id="confirmPassword"
              type="password"
              v-model="confirmPassword"
              placeholder="********"
              required
              class="outline-none w-full py-2 border-b border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div v-if="error" class="text-red-500 text-sm mt-2">
            {{ error }}
          </div>
          <div class="pt-6">
            <button
              type="submit"
              class="w-full bg-primary text-white py-2 px-4 rounded-full"
              :disabled="isLoading"
            >
              <span v-if="isLoading">Caricamento...</span>
              <span v-else>Registrati</span>
            </button>
          </div>
        </form>

        <!-- Messaggio di conferma dopo la registrazione -->
        <div v-if="registrationComplete" class="text-center py-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 text-green-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">
            Registrazione completata!
          </h3>
          <p class="text-gray-600 mb-4">
            Abbiamo inviato un'email di conferma a
            <strong>{{ registeredEmail }}</strong
            >.
          </p>
          <p class="text-gray-600 mb-6">
            Per favore, controlla la tua casella di posta e clicca sul link di
            conferma per attivare il tuo account.
          </p>
          <button
            @click="navigateToLogin"
            class="px-4 py-2 bg-primary text-white rounded-full"
          >
            Torna al login
          </button>
        </div>

        <div v-if="!registrationComplete" class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Hai già un account?
            <button
              @click="navigateToLogin"
              class="text-primary hover:text-indigo-800 font-medium"
            >
              Accedi
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
const confirmPassword = ref("");
const isLoading = ref(false);
const error = ref("");
const registrationComplete = ref(false);
const registeredEmail = ref("");

// Otteniamo il client Supabase
const supabase = useSupabaseClient();

async function handleRegister() {
  error.value = "";

  if (password.value !== confirmPassword.value) {
    error.value = "Le password non coincidono";
    return;
  }

  isLoading.value = true;

  try {
    const { data, error: authError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        emailRedirectTo: `${window.location.origin}/alimenti`,
      },
    });

    if (authError) throw authError;

    // Salva l'email registrata per mostrarla nel messaggio di conferma
    registeredEmail.value = email.value;

    // Dopo la registrazione, mostra il messaggio di conferma
    registrationComplete.value = true;

    // Reimposta i campi del form
    email.value = "";
    password.value = "";
    confirmPassword.value = "";
  } catch (err) {
    error.value =
      "Errore durante la registrazione: " +
      (err.message || "Riprova più tardi");
    console.error("Errore registrazione:", err);
  } finally {
    isLoading.value = false;
  }
}

function navigateToLogin() {
  navigateTo("/login");
}
</script> 