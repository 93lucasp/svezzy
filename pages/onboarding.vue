<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50"
  >
    <div class="w-full max-w-md">
      <h1 class="text-3xl font-bold text-center text-primary mb-8">Svezzy</h1>

      <div class="bg-white p-8 rounded-lg shadow-md">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl font-semibold">Onboarding</h2>
          <div class="flex space-x-1">
            <div
              v-for="step in 3"
              :key="step"
              :class="[
                'h-2 w-8 rounded-full',
                currentStep === step
                  ? 'bg-primary'
                  : currentStep > step
                  ? 'bg-primary'
                  : 'bg-gray-200',
              ]"
            ></div>
          </div>
        </div>

        <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
          {{ error }}
        </div>

        <!-- Step 1: Nome -->
        <div v-if="currentStep === 1" class="space-y-6">
          <div class="mb-4">
            <h3 class="text-lg font-medium">Come si chiama il tuo bambino?</h3>
          </div>

          <div>
            <label
              for="babyName"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Nome</label
            >
            <input
              id="babyName"
              type="text"
              v-model="babyName"
              required
              placeholder="Inserisci il nome"
              class="outline-none w-full px-3 py-2 border-b border-gray-300"
            />
          </div>

          <div class="flex justify-end">
            <button
              @click="nextStep"
              :disabled="!babyName"
              :class="[
                'py-2 px-6 rounded-full focus:outline-none ',
                babyName
                  ? 'bg-primary text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed',
              ]"
            >
              Avanti
            </button>
          </div>
        </div>

        <!-- Step 2: Data di nascita -->
        <div v-if="currentStep === 2" class="space-y-6">
          <div class="text-center mb-4">
            <h3 class="text-lg font-medium">Quando è nato?</h3>
          </div>

          <div>
            <label
              for="birthDate"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Data di nascita</label
            >
            <input
              id="birthDate"
              type="date"
              v-model="birthDate"
              required
              :max="todayFormatted"
              class="outline-none w-full px-3 py-2 border-b border-gray-300"
            />
          </div>

          <div class="flex justify-between">
            <button @click="prevStep" class="text-primary py-2 px-4">
              Indietro
            </button>

            <button
              @click="nextStep"
              :disabled="!birthDate"
              :class="[
                'py-2 px-6 rounded-full',
                birthDate
                  ? 'bg-primary text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed',
              ]"
            >
              Avanti
            </button>
          </div>
        </div>

        <!-- Step 3: Sesso -->
        <div v-if="currentStep === 3" class="space-y-6">
          <div class="text-center mb-4">
            <h3 class="text-lg font-medium">Sesso</h3>
          </div>

          <div class="flex space-x-4">
            <button
              @click="gender = 'M'"
              :class="[
                'flex-1 py-3 px-4 rounded-md border-2 flex flex-col items-center transition-colors',
                gender === 'M'
                  ? 'border-primary bg-primary/20'
                  : 'border-gray-200 ',
              ]"
            >
              <span class="text-2xl mb-1">👦</span>
              <span>Maschio</span>
            </button>

            <button
              @click="gender = 'F'"
              :class="[
                'flex-1 py-3 px-4 rounded-md border-2 flex flex-col items-center transition-colors',
                gender === 'F'
                  ? 'border-primary bg-primary/20'
                  : 'border-gray-200 ',
              ]"
            >
              <span class="text-2xl mb-1">👧</span>
              <span>Femmina</span>
            </button>
          </div>

          <div class="flex justify-between">
            <button
              @click="prevStep"
              class="text-primary py-2 px-4 "
            >
              Indietro
            </button>

            <button
              @click="finishOnboarding"
              :disabled="!gender || isLoading"
              :class="[
                'py-2 px-6 rounded-full',
                gender && !isLoading
                  ? 'bg-primary text-white '
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed',
              ]"
            >
              <span v-if="isLoading">Caricamento...</span>
              <span v-else>Completa</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const currentStep = ref(1);
const babyName = ref("");
const birthDate = ref("");
const gender = ref("");
const isLoading = ref(false);
const error = ref("");

// Computed property per ottenere la data odierna formattata
const todayFormatted = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
});

// Otteniamo il client Supabase e l'utente corrente
const supabase = useSupabaseClient();
const user = useSupabaseUser();

function nextStep() {
  if (currentStep.value < 3) {
    currentStep.value++;
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
}

async function finishOnboarding() {
  if (!user.value) {
    error.value = "Nessun utente autenticato trovato";
    return;
  }

  // Verifica che tutti i campi siano compilati
  if (!babyName.value || !birthDate.value || !gender.value) {
    error.value = "Per favore compila tutti i campi richiesti";
    return;
  }

  isLoading.value = true;
  error.value = "";

  try {
    // Inserimento dei dati del bambino nella tabella 'bambini'
    const { data, error: insertError } = await supabase
      .from("bambini")
      .insert([
        {
          user_id: user.value.id,
          nome: babyName.value,
          data_nascita: birthDate.value,
          sesso: gender.value,
        },
      ])
      .select();

    if (insertError) throw insertError;

    console.log("Bambino salvato:", data);

    // Vai alla pagina principale dopo l'onboarding
    navigateTo("/");
  } catch (err) {
    error.value =
      "Errore durante il salvataggio: " + (err.message || "Riprova più tardi");
    console.error("Errore salvataggio bambino:", err);
  } finally {
    isLoading.value = false;
  }
}

definePageMeta({
  middleware: "auth",
});
</script> 