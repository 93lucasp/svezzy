<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <div class="flex-1 flex flex-col">
      <!-- Contenuto principale -->
      <div class="flex-1 relative overflow-hidden">
        <!-- Step 1 -->
        <div 
          class="absolute inset-0 flex flex-col items-center justify-center p-8 text-center transition-transform duration-300"
          :style="{ transform: `translateX(${(currentStep - 1) * -100}%)` }"
        >
          <div class="w-52 h-52 bg-indigo-100 rounded-full flex items-center justify-center mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Benvenuto in Svezzy!</h2>
          <p class="text-gray-600 mb-2">Svezzy ti aiuta a seguire il percorso di svezzamento del tuo bambino in modo semplice e intuitivo.</p>
        </div>

        <!-- Step 2 -->
        <div 
          class="absolute inset-0 flex flex-col items-center justify-center p-8 text-center transition-transform duration-300"
          :style="{ transform: `translateX(${(currentStep - 2) * 100}%)` }"
        >
          <div class="w-52 h-52 bg-indigo-100 rounded-full flex items-center justify-center mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Organizza gli alimenti</h2>
          <p class="text-gray-600 mb-2">Tieni traccia di tutti gli alimenti che il tuo bambino ha assaggiato, con informazioni su allergie e note personali.</p>
        </div>

        <!-- Step 3 -->
        <div 
          class="absolute inset-0 flex flex-col items-center justify-center p-8 text-center transition-transform duration-300"
          :style="{ transform: `translateX(${(currentStep - 3) * 100}%)` }"
        >
          <div class="w-52 h-52 bg-indigo-100 rounded-full flex items-center justify-center mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Personalizza l'esperienza</h2>
          <p class="text-gray-600 mb-2">Registra più bambini e personalizza i loro percorsi di svezzamento in base alle loro esigenze specifiche.</p>
        </div>
      </div>

      <!-- Navigazione e indicatori -->
      <div class="p-8">
        <!-- Indicatori di step personalizzati -->
        <div class="flex justify-center space-x-2 mb-8">
          <div 
            v-for="step in 3" 
            :key="step"
            @click="goToStep(step)"
            :class="[
              'h-3 w-3 rounded-full cursor-pointer transition-colors',
              currentStep === step ? 'bg-indigo-600' : 'bg-gray-300'
            ]"
          ></div>
        </div>

        <div class="flex justify-between">
          <button 
            v-if="currentStep > 1" 
            @click="goToStep(currentStep - 1)" 
            class="text-indigo-600 py-2 px-4 rounded-lg hover:bg-indigo-50"
          >
            Indietro
          </button>
          <div v-else class="w-20"></div>
          
          <button 
            v-if="currentStep < 3" 
            @click="goToStep(currentStep + 1)" 
            class="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700"
          >
            Avanti
          </button>
          <button 
            v-else 
            @click="finishWelcome" 
            class="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700"
          >
            Inizia
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const currentStep = ref(1);
const hasSeenWelcome = useCookie('has-seen-welcome', {
  maxAge: 60 * 60 * 24 * 365, // 1 anno in secondi
  sameSite: true
});

// Touch handling per lo swipe
const touchStartX = ref(0);
const touchEndX = ref(0);

function handleTouchStart(e) {
  touchStartX.value = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
  touchEndX.value = e.changedTouches[0].screenX;
  handleSwipe();
}

function handleSwipe() {
  const minSwipeDistance = 50;
  const swipeDistance = touchEndX.value - touchStartX.value;
  
  if (swipeDistance > minSwipeDistance && currentStep.value > 1) {
    // Swipe a destra, vai allo step precedente
    goToStep(currentStep.value - 1);
  } else if (swipeDistance < -minSwipeDistance && currentStep.value < 3) {
    // Swipe a sinistra, vai allo step successivo
    goToStep(currentStep.value + 1);
  }
}

function goToStep(step) {
  currentStep.value = step;
}

function finishWelcome() {
  // Imposta il cookie per indicare che l'utente ha visto la welcome page
  hasSeenWelcome.value = 'true';
  
  // Reindirizza alla pagina di login
  navigateTo('/');
}

// Controlla se l'utente ha già visto la welcome page
onMounted(() => {
  // Aggiungi gli event listener per il touch
  const mainContent = document.querySelector('.min-h-screen');
  if (mainContent) {
    mainContent.addEventListener('touchstart', handleTouchStart);
    mainContent.addEventListener('touchend', handleTouchEnd);
  }
  
  if (hasSeenWelcome.value === 'true') {
    // Se l'ha già vista, reindirizza
    const user = useSupabaseUser();
    if (user.value) {
      navigateTo('/alimenti');
    } else {
      navigateTo('/');
    }
  }
});

onUnmounted(() => {
  // Rimuovi gli event listener quando il componente viene smontato
  const mainContent = document.querySelector('.min-h-screen');
  if (mainContent) {
    mainContent.removeEventListener('touchstart', handleTouchStart);
    mainContent.removeEventListener('touchend', handleTouchEnd);
  }
});
</script>

<style>
.min-h-screen {
  touch-action: pan-y;
}
</style> 