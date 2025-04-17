<template>
  <div class="bg-gray-50 min-h-screen pb-6 relative">
    <!-- Header -->
    <div class="bg-white px-4 py-4 shadow-sm sticky top-0 z-10">
      <div class="flex items-center justify-between">
        <app-logo class="w-32" />

        <!-- Nome bambino selezionato -->
        <div
          v-if="bambinoSelezionato"
          class="text-green-700 font-light px-4 py-2 flex items-center"
        >
          {{ bambinoSelezionato.nome }}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4 ml-1 text-green-700"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      <!-- Messaggio se non ci sono bambini -->
      <div
        v-if="user && (!bambini || bambini.length === 0)"
        class="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-200"
      >
        Aggiungi prima un bambino nella sezione profilo per visualizzare gli
        alimenti consigliati.
      </div>

      <!-- Messaggio se non è selezionato nessun bambino -->
      <div
        v-else-if="user && bambini.length > 0 && !bambinoSelezionato"
        class="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-200"
      >
        Seleziona un bambino nella sezione profilo per visualizzare gli alimenti
        consigliati.
      </div>

      <!-- Search Bar -->
      <div class="mt-4 relative">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <svg
            class="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          type="text"
          v-model="testoDiRicerca"
          placeholder="Cerca alimento..."
          class="outline-none pl-10 pr-4 py-2 w-full border-b border-gray-300"
        />
      </div>

      <!-- Filters -->
      <div class="mt-4 flex flex-wrap gap-2">
        <!-- Categorie -->
        <div
          class="flex items-center space-x-2 overflow-auto w-full whitespace-nowrap"
        >
          <button
            v-for="categoria in categorie"
            :key="categoria.id"
            class="rounded-full shadow-lg px-4 py-1 text-sm"
            :class="{
              'bg-primary/20': categoria.id === categoriaSelezionata,
              'bg-white': categoria.id !== categoriaSelezionata,
            }"
            @click="selezionaCategoria(categoria.id)"
          >
            {{ categoria.icona }}
            {{ categoria.nome }}
          </button>
        </div>
      </div>
    </div>

    <!-- Stato di caricamento -->
    <div v-if="isLoading" class="mt-6 px-4 py-8 text-center">
      <div class="flex justify-center items-center">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"
        ></div>
        <span class="ml-2">Caricamento...</span>
      </div>
    </div>

    <template v-else>
      <!-- Suggeriti per età (visibili solo se è impostata la data di nascita) -->
      <div
        v-if="
          bambinoSelezionato &&
          etaBambino.mesi > 0 &&
          alimentiConsigliati.length > 0
        "
        class="mt-6 px-4"
      >
        <h2 class="text-lg font-medium mb-3">
          Consigliati per {{ etaFormattata }}
        </h2>
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <alimento-item
            v-for="alimento in alimentiConsigliati"
            :key="alimento.id"
            :alimento="alimento"
            @toggle="toggleAssaggiato"
            class="border-l-4 border-indigo-400"
          />
        </div>
      </div>

      <!-- Lista alimenti -->
      <div class="mt-6 px-4">
        <h2 class="text-lg font-medium mb-3">Alimenti da assaggiare</h2>

        <div
          v-if="error"
          class="bg-white rounded-lg shadow-sm p-8 text-center text-red-500"
        >
          {{ error }}
        </div>

        <div
          v-else-if="alimentiRicerca.length === 0"
          class="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500"
        >
          Nessun alimento trovato con i filtri selezionati.
        </div>

        <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
          <alimento-dettagliato
            v-for="alimento in alimentiRicerca"
            :key="alimento.id"
            :alimento="alimento"
            @toggle="toggleAssaggiato"
          />
        </div>
      </div>
    </template>

    <!-- Modale per le note -->
  </div>
</template>

<script setup>
// Client Supabase e utente

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { bambini, bambinoSelezionato } = useBambini();

// Stato
const alimenti = ref([]);
const categorie = ref([]);
const isLoading = ref(false);
const error = ref(null);
// Filtraggio
const categoriaSelezionata = ref("");
const testoDiRicerca = ref("");

// Modale per le note
const showNoteModal = ref(false);
const alimentoSelezionato = ref(null);
const noteTemp = ref("");
const isAllergicTemp = ref(false);

// Carica tutte le categorie
async function fetchCategorie() {
  try {
    const { data, error: categorieError } = await supabase
      .from("categorie")
      .select("*");

    if (categorieError) throw categorieError;

    categorie.value = data || [];
  } catch (err) {
    console.error("Errore nel caricamento delle categorie:", err);
    error.value = "Errore nel caricamento delle categorie";
  }
}

// Carica tutti gli alimenti
async function fetchAlimenti() {
  if (!user.value || !bambinoSelezionato.value) return;

  isLoading.value = true;
  error.value = null;
  console.log("Caricamento alimenti per bambino:", bambinoSelezionato.value.id);

  try {
    // Ottiene l'elenco base degli alimenti
    const { data: alimentiData, error: alimentiError } = await supabase
      .from("alimenti")
      .select("*");

    if (alimentiError) throw alimentiError;

    // Ottiene gli alimenti assaggiati dal bambino
    const { data: assaggiatiData, error: assaggiatiError } = await supabase
      .from("alimenti_bambini")
      .select("*")
      .eq("bambino_id", bambinoSelezionato.value.id);

    if (assaggiatiError) throw assaggiatiError;

    console.log("Alimenti assaggiati trovati:", assaggiatiData.length);

    // Combina i dati: marca come assaggiati quelli presenti in alimenti_bambini
    // e aggiunge le note se presenti
    const alimentiProcessati = alimentiData.map((alimento) => {
      const alimentoAssaggiato = assaggiatiData.find(
        (a) => a.alimento_id === alimento.id
      );
      return {
        ...alimento,
        assaggiato: !!alimentoAssaggiato,
        nota_personale: alimentoAssaggiato?.nota_personale || "",
        is_allergic: alimentoAssaggiato?.is_allergic || false,
      };
    });

    alimenti.value = alimentiProcessati;
  } catch (err) {
    console.error("Errore nel caricamento degli alimenti:", err);
    error.value = "Errore nel caricamento degli alimenti";
  } finally {
    isLoading.value = false;
  }
}

function selezionaCategoria(id) {
  if (categoriaSelezionata.value === id) {
    categoriaSelezionata.value = "";
    return;
  }
  categoriaSelezionata.value = id;
}

// Funzione per aggiornare lo stato di un alimento
async function toggleAssaggiato(id) {
  if (!user.value || !bambinoSelezionato.value) return;

  const index = alimenti.value.findIndex((alimento) => alimento.id === id);
  if (index === -1) return;

  const nuovoStato = !alimenti.value[index].assaggiato;

  try {
    if (nuovoStato) {
      // Aggiungi alla tabella alimenti_bambini
      const { error: insertError } = await supabase
        .from("alimenti_bambini")
        .insert({
          bambino_id: bambinoSelezionato.value.id,
          alimento_id: id,
          nota_personale: alimenti.value[index].nota_personale,
          assaggiato: true,
          creato_il: new Date().toISOString(),
          modificato_il: new Date().toISOString(),
        });

      if (insertError) throw insertError;
    } else {
      // Rimuovi dalla tabella alimenti_bambini
      const { error: deleteError } = await supabase
        .from("alimenti_bambini")
        .delete()
        .eq("bambino_id", bambinoSelezionato.value.id)
        .eq("alimento_id", id);

      if (deleteError) throw deleteError;
    }

    // Aggiorna lo stato locale
    alimenti.value[index].assaggiato = nuovoStato;
  } catch (err) {
    console.error("Errore nell'aggiornamento dello stato dell'alimento:", err);
  }
}

// Filtro per categoria
const alimentiFiltrati = computed(() => {
  let risultati = alimenti.value;

  // Filtra sempre per mostrare solo gli alimenti da provare
  risultati = risultati.filter((alimento) => !alimento.assaggiato);

  // Applica il filtro per categoria se selezionata
  if (categoriaSelezionata.value) {
    risultati = risultati.filter(
      (alimento) => alimento.categoria_id === categoriaSelezionata.value
    );
  }

  return risultati;
});

// Ricerca per nome
const alimentiRicerca = computed(() => {
  if (!testoDiRicerca.value.trim()) {
    return alimentiFiltrati.value;
  }

  const termineRicerca = testoDiRicerca.value.toLowerCase();
  return alimentiFiltrati.value.filter((alimento) =>
    alimento.nome.toLowerCase().includes(termineRicerca)
  );
});

// Calcola l'età del bambino selezionato
const etaBambino = computed(() => {
  if (!bambinoSelezionato.value || !bambinoSelezionato.value.data_nascita) {
    return { mesi: 0, giorni: 0 };
  }

  const oggi = new Date();
  const nascita = new Date(bambinoSelezionato.value.data_nascita);

  let mesi = (oggi.getFullYear() - nascita.getFullYear()) * 12;
  mesi += oggi.getMonth() - nascita.getMonth();

  // Calcola giorni
  let giorni = oggi.getDate() - nascita.getDate();
  if (giorni < 0) {
    // Se siamo "prima" del giorno di nascita nel mese corrente
    mesi--;
    const ultimoGiornoMeseScorso = new Date(
      oggi.getFullYear(),
      oggi.getMonth(),
      0
    ).getDate();
    giorni += ultimoGiornoMeseScorso;
  }

  return { mesi, giorni };
});

// Età formattata in testo
const etaFormattata = computed(() => {
  if (etaBambino.value.mesi === 0 && etaBambino.value.giorni === 0) {
    return "Età non disponibile";
  }

  let testo = "";

  if (etaBambino.value.mesi === 1) {
    testo = "1 mese";
  } else if (etaBambino.value.mesi > 1) {
    testo = `${etaBambino.value.mesi} mesi`;
  }

  if (etaBambino.value.giorni === 1) {
    testo += testo ? " e 1 giorno" : "1 giorno";
  } else if (etaBambino.value.giorni > 1) {
    testo += testo
      ? ` e ${etaBambino.value.giorni} giorni`
      : `${etaBambino.value.giorni} giorni`;
  }

  return testo;
});

// Alimenti da suggerire in base all'età del bambino
const alimentiConsigliati = computed(() => {
  if (!bambinoSelezionato.value || etaBambino.value.mesi === 0) {
    return [];
  }

  return alimenti.value.filter(
    (alimento) =>
      alimento.mese_consigliato <= etaBambino.value.mesi && !alimento.assaggiato
  );
});

// Caricamento dati all'avvio
onMounted(async () => {
  await fetchCategorie();
  console.log("bambini", bambini.value.length);
  // I bambini sono già caricati dal composable useBambini
  // TODO 
  setTimeout(() => {
    // Se l'utente è autenticato ma non ha bambini registrati, reindirizzalo all'onboarding
    if (bambini.value.length === 0) {
      console.log("Nessun bambino registrato, reindirizzamento a onboarding");
      return navigateTo("/onboarding");
    }
  }, 800);

  await fetchAlimenti();
});

// Aggiornamento alimenti quando cambia il bambino selezionato
watch(
  () => bambinoSelezionato.value?.id,
  async (newBambinoId) => {
    if (newBambinoId) {
      console.log(
        "ID del bambino selezionato cambiato in alimenti:",
        newBambinoId
      );
      await fetchAlimenti();
    } else {
      console.log("Nessun bambino selezionato in alimenti");
      alimenti.value = [];
    }
  },
  { immediate: true }
);

definePageMeta({
  middleware: "auth",
});
</script>
