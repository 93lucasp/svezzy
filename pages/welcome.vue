<template>
  <div class="h-full flex flex-col bg-gray-50">
    <div class="flex-1 flex flex-col">
      <!-- Contenuto principale -->
      <div class="flex-1 relative overflow-hidden">
        <!-- Step 1 - Piatto di spaghetti -->
        <div 
          class="absolute inset-0 flex flex-col items-center justify-center px-8 pt-8 text-center transition-transform duration-300"
          :style="{ transform: `translateX(${(currentStep - 1) * -100}%)` }"
        >
          <div class="w-64 h-64 bg-indigo-100 rounded-full flex items-center justify-center mb-8">
           <img src="~/assets/img/1.svg" alt="Illustration 1" class="w-full h-full object-cover">
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Benvenuto in Svezzy!</h2>
          <p class="text-gray-600 ">Svezzy ti aiuta a seguire il percorso di svezzamento del tuo bambino in modo semplice e intuitivo.</p>
        </div>

        <!-- Step 2 - Telefono -->
        <div 
          class="absolute inset-0 flex flex-col items-center justify-center px-8 pt-8 text-center transition-transform duration-300"
          :style="{ transform: `translateX(${(currentStep - 2) * 100}%)` }"
        >
          <div class="w-64 h-64 bg-indigo-100 rounded-full flex items-center justify-center mb-8">
            <img src="~/assets/img/2.svg" alt="Illustration 1" class="w-full h-full object-cover">
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Organizza gli alimenti</h2>
          <p class="text-gray-600 ">Tieni traccia di tutti gli alimenti che il tuo bambino ha assaggiato, con informazioni su allergie e note personali.</p>
        </div>

        <!-- Step 3 - Due bambini -->
        <div 
          class="absolute inset-0 flex flex-col items-center justify-center px-8 pt-8 text-center transition-transform duration-300"
          :style="{ transform: `translateX(${(currentStep - 3) * 100}%)` }"
        >
          <div class="w-64 h-64 bg-indigo-100 rounded-full flex items-center justify-center mb-8">
            <img src="~/assets/img/3.svg" alt="Illustration 1" class="w-full h-full object-cover">
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Personalizza l'esperienza</h2>
          <p class="text-gray-600 ">Registra più bambini e personalizza i loro percorsi di svezzamento in base alle loro esigenze specifiche.</p>
        </div>
      </div>

      <!-- Navigazione e indicatori -->
      <div class="px-8 pb-16">
        <!-- Indicatori di step personalizzati -->
        <div class="flex justify-center space-x-2 mb-8">
          <div 
            v-for="step in 3" 
            :key="step"
            @click="goToStep(step)"
            :class="[
              'h-1 w-6 rounded-full cursor-pointer transition-colors',
              currentStep === step ? 'bg-primary' : 'bg-gray-300'
            ]"
          ></div>
        </div>

        <div class="flex justify-between">
          
          
          <button 
            v-if="currentStep < 3" 
            @click="goToStep(currentStep + 1)" 
            class="bg-primary text-white py-2 px-6 rounded-full w-full "
          >
            Avanti
          </button>
          <button 
            v-else 
            @click="finishWelcome" 
            class="bg-primary text-white py-2 px-6 rounded-full w-full "
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

// Cookie per memorizzare se l'utente ha già visto la pagina di benvenuto
const hasSeenWelcome = useCookie('hasSeenWelcome', {
  maxAge: 60 * 60 * 24 * 365, // Valido per un anno
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
  hasSeenWelcome.value = true;
  
  // Reindirizza alla pagina di login
  navigateTo('/login');
}

// Aggiungi gli event listener per il touch
onMounted(() => {
  const mainContent = document.querySelector('.min-h-screen');
  if (mainContent) {
    mainContent.addEventListener('touchstart', handleTouchStart);
    mainContent.addEventListener('touchend', handleTouchEnd);
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