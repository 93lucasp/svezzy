<template>
  <div class="flex flex-col min-h-screen bg-white relative">
    <div
      class="bg-white w-full sticky top-0 z-50"
      :style="`height: ${safeAreaStyles['--safe-area-inset-top']};`"
    />
    <!-- Contenuto principale -->
    <ion-content class="flex-1">
      <slot />
    </ion-content>

    <!-- Bottom Navigation (mostrare solo nelle pagine principali) -->
    <nav
      v-if="shouldShowNavigation"
      class="bg-white border-t border-gray-200 fixed bottom-0 w-full pb-6"
    >
      <div class="grid grid-cols-3 h-16">
        <nuxt-link
          to="/"
          class="flex flex-col items-center justify-center"
          active-class="text-primary"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            ></path>
          </svg>
          <span class="text-xs mt-1">Alimenti</span>
        </nuxt-link>

        <nuxt-link
          to="/alimenti-assaggiati"
          class="flex flex-col items-center justify-center"
          active-class="text-primary"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span class="text-xs mt-1">Assaggiati</span>
        </nuxt-link>

        <nuxt-link
          to="/profilo"
          class="flex flex-col items-center justify-center"
          active-class="text-primary"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            ></path>
          </svg>
          <span class="text-xs mt-1">Profilo</span>
        </nuxt-link>
      </div>
    </nav>

    <!-- Aggiungere padding-bottom quando la navigazione è visibile -->
    <div v-if="shouldShowNavigation" class="h-16"></div>
  </div>
</template>

<script setup>
const { safeAreaStyles } = useSafeArea();
const route = useRoute();

// Non mostrare la navigazione nelle pagine di autenticazione/onboarding
const shouldShowNavigation = computed(() => {
  const authPages = [
    "login",
    "registrazione",
    "recupero-password",
    "onboarding",
    "welcome",
  ];
  const routeName = route.name?.toString() || "";
  return !authPages.includes(routeName);
});
</script>
