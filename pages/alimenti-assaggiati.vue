<template>
  <div class="bg-gray-50 min-h-screen pb-6">
    <!-- Header -->
    <div class="bg-white px-4 py-4 shadow-sm">
      <div class="flex items-center justify-between">
        <app-logo class="w-32"/>
        
        <!-- Nome bambino selezionato -->
        <div v-if="bambinoSelezionato" class="text-green-700 font-light px-4 py-2 flex items-center">
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
      <div v-if="user && (!bambini || bambini.length === 0)" class="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-200">
        Aggiungi prima un bambino nella sezione profilo per visualizzare gli alimenti assaggiati.
      </div>
      
      <!-- Messaggio se non è selezionato nessun bambino -->
      <div v-else-if="user && bambini.length > 0 && !bambinoSelezionato" class="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-200">
        Seleziona un bambino nella sezione profilo per visualizzare gli alimenti assaggiati.
      </div>
      
      <!-- Search Bar -->
      <div class="mt-4 relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input 
          type="text" 
          v-model="testoDiRicerca" 
          placeholder="Cerca alimento..." 
          class="outline-none pl-10 pr-4 py-2 w-full  border-b border-gray-300"
        />
      </div>
      
      <!-- Filters -->
      <div class="mt-4 flex flex-wrap gap-2">
        <!-- Categorie -->
        <div
          class="flex items-center space-x-2 overflow-auto w-full whitespace-nowrap "
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
    
    <!-- Lista alimenti assaggiati -->
    <div class="mt-6 px-4">
      <h2 class="text-lg font-medium mb-3">Alimenti assaggiati</h2>

      <div v-if="isLoading" class="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
        <div class="flex justify-center items-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span class="ml-2">Caricamento...</span>
        </div>
      </div>
      
      <div v-else-if="error" class="bg-white rounded-lg shadow-sm p-8 text-center text-red-500">
        {{ error }}
      </div>
      
      <div v-else-if="!bambinoSelezionato" class="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
        Seleziona un bambino per vedere gli alimenti assaggiati.
      </div>
      
      <div v-else-if="alimentiAssaggiatiRicerca.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
        Non hai ancora assaggiato alcun alimento.
        <div class="mt-4">
          <button 
            @click="navigateTo('/alimenti')" 
            class="inline-flex items-center text-primary hover:text-indigo-800"
          >
            <svg class="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12"></path>
            </svg>
            Vai alla lista completa
          </button>
        </div>
      </div>
      
      <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
        <alimento-item 
          v-for="alimento in alimentiAssaggiatiRicerca" 
          :key="alimento.id" 
          :alimento="alimento"
          nota="personale"
          @toggle="toggleAssaggiato"
          @add-note="openNoteModal"
        />
      </div>
    </div>
    
    <!-- Modale per le note -->
    <div v-if="showNoteModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" @click="closeNoteModal"></div>
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="bg-white rounded-xl w-full max-w-md p-6 shadow-xl transform transition-all duration-300 ease-in-out">
          <h3 class="text-xl font-semibold mb-4 text-gray-800">{{ alimentoSelezionato?.nome }}</h3>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Note personali</label>
            <textarea 
              v-model="noteTemp" 
              rows="4" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Aggiungi qui le tue note (es. reazioni, preferenze...)"
            ></textarea>
          </div>
          
          <div class="mb-4">
            <div class="flex items-center">
              <ion-toggle v-model="isAllergicTemp" label-placement="end">
                Reazione allergica
              </ion-toggle>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3">
            <button 
              @click="closeNoteModal" 
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annulla
            </button>
            <button 
              @click="saveNote" 
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
              Salva
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Client Supabase e utente
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { bambini, bambinoSelezionato } = useBambini();

// Stato
const alimentiAssaggiati = ref([]);
const categorie = ref([]);
const isLoading = ref(false);
const error = ref(null);

// Filtraggio
const categoriaSelezionata = ref('');
const testoDiRicerca = ref('');

// Modale per le note
const showNoteModal = ref(false);
const alimentoSelezionato = ref(null);
const noteTemp = ref('');
const isAllergicTemp = ref(false);

// Carica tutte le categorie
async function fetchCategorie() {
  try {
    const { data, error: categorieError } = await supabase
      .from('categorie')
      .select('*');
    
    if (categorieError) throw categorieError;
    
    categorie.value = data || [];
  } catch (err) {
    console.error('Errore nel caricamento delle categorie:', err);
    error.value = 'Errore nel caricamento delle categorie';
  }
}

// Carica gli alimenti assaggiati
async function fetchAlimentiAssaggiati() {
  if (!user.value || !bambinoSelezionato.value) return;

  isLoading.value = true;
  error.value = null;
  console.log('Caricamento alimenti assaggiati per bambino:', bambinoSelezionato.value.id);

  try {
    // Ottiene gli alimenti assaggiati dal bambino selezionato
    const { data: assaggiatiData, error: assaggiatiError } = await supabase
      .from("alimenti_bambini")
      .select("*, alimenti(*)")
      .eq("bambino_id", bambinoSelezionato.value.id)
      .order('creato_il', { ascending: false });

    if (assaggiatiError) throw assaggiatiError;

    console.log('Alimenti assaggiati trovati:', assaggiatiData.length);

    // Trasforma i dati per corrispondere alla struttura attesa
    const alimentiProcessati = assaggiatiData.map((record) => {
      return {
        ...record.alimenti,
        assaggiato: true,
        nota_personale: record.nota_personale || "",
        is_allergic: record.is_allergic || false
      };
    });

    alimentiAssaggiati.value = alimentiProcessati;
  } catch (err) {
    console.error("Errore nel caricamento degli alimenti assaggiati:", err);
    error.value = "Errore nel caricamento degli alimenti assaggiati";
  } finally {
    isLoading.value = false;
  }
}

// Funzione per rimuovere un alimento dalla lista assaggiati
async function toggleAssaggiato(id) {
  if (!user.value || !bambinoSelezionato.value) return;
  
  try {
    // Rimuovi dalla tabella alimenti_bambini
    const { error: deleteError } = await supabase
      .from('alimenti_bambini')
      .delete()
      .eq('bambino_id', bambinoSelezionato.value.id)
      .eq('alimento_id', id);
    
    if (deleteError) throw deleteError;
    
    // Rimuovi anche dalla lista locale
    alimentiAssaggiati.value = alimentiAssaggiati.value.filter(alimento => alimento.id !== id);
  } catch (err) {
    console.error('Errore nella rimozione dell\'alimento:', err);
  }
}

// Funzione per aggiornare la nota di un alimento
async function aggiungiNota(id, nota, is_allergic) {
  if (!user.value || !bambinoSelezionato.value) return;
  
  const index = alimentiAssaggiati.value.findIndex(alimento => alimento.id === id);
  if (index === -1) return;
  
  try {
    // Aggiorna la nota nella tabella alimenti_bambini
    const { error: updateError } = await supabase
      .from('alimenti_bambini')
      .update({ 
        nota_personale: nota,
        is_allergic: is_allergic,
        modificato_il: new Date().toISOString()
      })
      .eq('bambino_id', bambinoSelezionato.value.id)
      .eq('alimento_id', id);
    
    if (updateError) throw updateError;
    
    // Aggiorna la nota localmente
    alimentiAssaggiati.value[index].nota_personale = nota;
    alimentiAssaggiati.value[index].is_allergic = is_allergic;
  } catch (err) {
    console.error('Errore nell\'aggiornamento della nota:', err);
  }
}

// Alimenti assaggiati filtrati per categoria
const alimentiAssaggiatiFiltrati = computed(() => {
  if (!categoriaSelezionata.value) {
    return alimentiAssaggiati.value;
  }
  return alimentiAssaggiati.value.filter(alimento => 
    alimento.categoria_id === categoriaSelezionata.value
  );
});

// Filtraggio per ricerca
const alimentiAssaggiatiRicerca = computed(() => {
  if (!testoDiRicerca.value.trim()) {
    return alimentiAssaggiatiFiltrati.value;
  }
  
  const termineRicerca = testoDiRicerca.value.toLowerCase();
  return alimentiAssaggiatiFiltrati.value.filter(alimento => 
    alimento.nome.toLowerCase().includes(termineRicerca)
  );
});

function openNoteModal(alimento) {
  alimentoSelezionato.value = alimento;
  noteTemp.value = alimento.nota_personale;
  isAllergicTemp.value = alimento.is_allergic || false;
  showNoteModal.value = true;
}

function closeNoteModal() {
  showNoteModal.value = false;
}

async function saveNote() {
  if (alimentoSelezionato.value) {
    await aggiungiNota(alimentoSelezionato.value.id, noteTemp.value, isAllergicTemp.value);
    closeNoteModal();
  }
}

// Funzione per calcolare l'età formattata di un qualsiasi bambino (per il dropdown)
function calcolaEtaFormattata(bambino) {
  if (!bambino || !bambino.data_nascita) {
    return 'Età non disponibile';
  }
  
  const oggi = new Date();
  const nascita = new Date(bambino.data_nascita);
  
  let mesi = (oggi.getFullYear() - nascita.getFullYear()) * 12;
  mesi += oggi.getMonth() - nascita.getMonth();
  
  // Calcola giorni
  let giorni = oggi.getDate() - nascita.getDate();
  if (giorni < 0) {
    // Se siamo "prima" del giorno di nascita nel mese corrente
    mesi--;
    const ultimoGiornoMeseScorso = new Date(oggi.getFullYear(), oggi.getMonth(), 0).getDate();
    giorni += ultimoGiornoMeseScorso;
  }
  
  let testo = '';
  
  if (mesi === 1) {
    testo = '1 mese';
  } else if (mesi > 1) {
    testo = `${mesi} mesi`;
  }
  
  if (giorni === 1) {
    testo += testo ? ' e 1 giorno' : '1 giorno';
  } else if (giorni > 1) {
    testo += testo ? ` e ${giorni} giorni` : `${giorni} giorni`;
  }
  
  return testo || 'Appena nato';
}

// Funzione per selezionare una categoria
function selezionaCategoria(id) {
  if (categoriaSelezionata.value === id) {
    categoriaSelezionata.value = "";
    return;
  }
  categoriaSelezionata.value = id;
}

// Caricamento dati all'avvio
onMounted(async () => {
  await fetchCategorie();
  await fetchAlimentiAssaggiati();
});

// Aggiornamento alimenti quando cambia il bambino selezionato
watch(() => bambinoSelezionato.value, async (newBambino) => {
  if (newBambino) {
    console.log('Bambino selezionato cambiato in alimenti-assaggiati:', newBambino.nome);
    await fetchAlimentiAssaggiati();
  } else {
    console.log('Nessun bambino selezionato in alimenti-assaggiati');
    alimentiAssaggiati.value = [];
  }
}, { immediate: true });

definePageMeta({
  middleware: 'auth'
})
</script> 