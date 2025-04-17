<template>
  <div class="bg-gray-50 min-h-screen pb-6">
    <!-- Header -->
    <div class="bg-white px-4 py-4 shadow-sm">
      <div class="flex items-center">
        <button @click="navigateTo('/profilo')" class="mr-2 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <h1 class="text-xl font-semibold text-primary">Modifica Password</h1>
      </div>
    </div>

    <!-- Contenuto principale -->
    <div class="mt-6 px-4">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <form @submit.prevent="updatePassword" class="space-y-6">
          <!-- Nuova password -->
          <div>
            <label
              for="newPassword"
              class="block text-sm font-medium text-gray-700"
            >
              Nuova password
            </label>
            <input
              id="newPassword"
              type="password"
              placeholder="********"
              v-model="passwordData.newPassword"
              class="outline-none w-full  py-2 border-b border-gray-300 rounded-md focus:outline-none"
              required
              minlength="6"
            />
            <p class="text-xs text-gray-500 mt-1">
              La password deve contenere almeno 6 caratteri
            </p>
          </div>

          <!-- Conferma nuova password -->
          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-gray-700"
            >
              Conferma nuova password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="********"
              v-model="passwordData.confirmPassword"
              class="outline-none w-full  py-2 border-b border-gray-300 rounded-md focus:outline-none"
              required
            />
          </div>

          <!-- Pulsanti -->
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="navigateTo('/profilo')"
              class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              class="px-6 py-2 bg-primary text-white rounded-full hover:bg-indigo-700 transition-colors shadow-md"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? "Aggiornamento..." : "Aggiorna password" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Toast notification -->
    <transition name="toast">
      <div
        v-if="showToast"
        :class="[
          'fixed top-4 inset-x-4 px-6 py-3 rounded-lg shadow-lg z-50 max-w-md mx-auto border',
          toastType === 'success'
            ? 'bg-green-50 border-green-600'
            : 'bg-red-50 border-red-600',
        ]"
      >
        <div class="flex items-center">
          <span v-if="toastType === 'success'" class="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
          <span v-else class="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </span>
          <p>{{ toastMessage }}</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();

// Dati del form
const passwordData = ref({
  newPassword: "",
  confirmPassword: "",
});

// Stato del form
const isSubmitting = ref(false);

// Toast notification
const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref("success");

// Funzione per mostrare il toast
function displayToast(message, type = "success", duration = 6000) {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;

  // Nascondi automaticamente dopo la durata specificata
  setTimeout(() => {
    showToast.value = false;
  }, duration);
}

// Funzione per aggiornare la password
async function updatePassword() {
  // Validazione
  if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
    displayToast("Le password non corrispondono", "error");
    return;
  }

  if (passwordData.value.newPassword.length < 6) {
    displayToast(
      "La nuova password deve contenere almeno 6 caratteri",
      "error"
    );
    return;
  }

  isSubmitting.value = true;

  try {
    // Aggiornamento password tramite Supabase
    const { error } = await supabase.auth.updateUser({
      password: passwordData.value.newPassword,
    });

    if (error) throw error;

    // Reset del form
    passwordData.value = {
      newPassword: "",
      confirmPassword: "",
    };

    displayToast("Password aggiornata con successo", "success");

    // Reindirizza alla pagina del profilo dopo un breve delay
    setTimeout(() => {
      navigateTo("/profilo");
    }, 2000);
  } catch (error) {
    console.error("Errore durante l'aggiornamento della password:", error);
    displayToast(
      "Si è verificato un errore durante l'aggiornamento della password. Riprova più tardi.",
      "error"
    );
  } finally {
    isSubmitting.value = false;
  }
}

definePageMeta({
  middleware: "auth",
});
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
