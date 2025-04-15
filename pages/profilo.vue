<template>
  <div class="bg-gray-50 min-h-screen pb-6">
    <!-- Header -->
    <div class="bg-white px-4 py-4 shadow-sm">
      <h1 class="text-xl font-semibold text-indigo-600">Profilo</h1>
    </div>
    
    <!-- Sezione Bambini -->
    <div class="mt-6 px-4">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium">I miei bambini</h2>
          <button 
            @click="aggiungiNuovoBambino" 
            class="text-sm text-indigo-600 hover:text-indigo-800"
          >
            Aggiungi bambino
          </button>
        </div>
        
        <!-- Lista bambini -->
        <div v-if="bambini && bambini.length > 0" class="space-y-4">
          <!-- Lista di tutti i bambini -->
          <div class="overflow-hidden rounded-lg border border-gray-200">
            <div class="divide-y divide-gray-200">
              <div 
                v-for="bambino in bambini" 
                :key="bambino.id" 
                :class="[
                  'flex items-center justify-between p-4 hover:bg-gray-50 transition-colors',
                  bambinoSelezionato && bambino.id === bambinoSelezionato.id ? 'bg-indigo-50' : ''
                ]"
                @click="selectBambino(bambino)"
              >
                <div class="flex-1">
                  <div class="flex items-center">
                    <span class="text-2xl mr-3">
                      {{ bambino.sesso === 'M' ? '👦' : bambino.sesso === 'F' ? '👧' : '👶' }}
                    </span>
                    <div>
                      <h4 class="font-medium">{{ bambino.nome || 'Bambino' }}</h4>
                      <p class="text-sm text-gray-500">
                        {{ bambino.data_nascita ? formatDate(bambino.data_nascita) : 'Data non specificata' }}
                        <span v-if="bambino.data_nascita" class="ml-1">
                          ({{ calcolaEtaFormattata(bambino) }})
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button 
                    @click.stop="modificaBambinoById(bambino.id)"
                    class="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                    title="Modifica"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </button>
                  <button 
                    v-if="bambini.length > 1"
                    @click.stop="showDeleteConfirmationFor(bambino.id)"
                    class="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Rimuovi"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m-6.5-.025a48.108 48.108 0 013.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m-6.5-.025a48.11 48.11 0 013.478-.397" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="p-4 text-center text-gray-500">
          <p>Non hai ancora aggiunto nessun bambino</p>
          <button
            @click="showEditModal = true"
            class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
          >
            Aggiungi bambino
          </button>
        </div>
      </div>
    </div>
    
    <!-- Sezione Account -->
    <div class="mt-6 px-4">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-medium mb-4">Account</h2>
        
        <div class="space-y-4">
          <button 
            @click="logout" 
            class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Esci
          </button>
          
          <button 
            @click="showDeleteConfirmation = true" 
            class="w-full flex justify-center py-2 px-4 border border-red-300 rounded-md text-red-600 hover:bg-red-50"
          >
            Elimina account
          </button>
        </div>
      </div>
    </div>
    
    <!-- Modale modifica dati bambino -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" @click="closeEditModal"></div>
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="bg-white rounded-xl w-full max-w-md p-6 shadow-xl transform transition-all duration-300 ease-in-out">
          <h3 class="text-xl font-semibold mb-6 text-gray-800">
            {{ bambinoInModifica ? 'Modifica dati del bambino' : 'Aggiungi un nuovo bambino' }}
          </h3>
          
          <form @submit.prevent="saveBabyData" class="space-y-4">
            <!-- Nome -->
            <div>
              <label for="babyName" class="block text-sm font-medium text-gray-700 mb-1">Nome (facoltativo)</label>
              <input 
                id="babyName" 
                type="text" 
                v-model="editableBabyData.nome" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
            
            <!-- Data di nascita -->
            <div>
              <label for="birthDate" class="block text-sm font-medium text-gray-700 mb-1">Data di nascita</label>
              <input 
                id="birthDate" 
                type="date" 
                v-model="editableBabyData.dataNascita" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
            
            <!-- Sesso -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Sesso</label>
              <div class="flex space-x-4">
                <button 
                  type="button"
                  @click="editableBabyData.sesso = 'M'"
                  :class="[
                    'flex-1 py-3 px-4 rounded-lg border-2 flex flex-col items-center transition-colors',
                    editableBabyData.sesso === 'M' 
                      ? 'border-indigo-600 bg-indigo-50' 
                      : 'border-gray-200 hover:border-indigo-200'
                  ]"
                >
                  <span class="text-2xl mb-1">👦</span>
                  <span>Maschio</span>
                </button>
                
                <button 
                  type="button"
                  @click="editableBabyData.sesso = 'F'"
                  :class="[
                    'flex-1 py-3 px-4 rounded-lg border-2 flex flex-col items-center transition-colors',
                    editableBabyData.sesso === 'F' 
                      ? 'border-indigo-600 bg-indigo-50' 
                      : 'border-gray-200 hover:border-indigo-200'
                  ]"
                >
                  <span class="text-2xl mb-1">👧</span>
                  <span>Femmina</span>
                </button>
                
                <button 
                  type="button"
                  @click="editableBabyData.sesso = 'O'"
                  :class="[
                    'flex-1 py-3 px-4 rounded-lg border-2 flex flex-col items-center transition-colors',
                    editableBabyData.sesso === 'O' 
                      ? 'border-indigo-600 bg-indigo-50' 
                      : 'border-gray-200 hover:border-indigo-200'
                  ]"
                >
                  <span class="text-2xl mb-1">👶</span>
                  <span>Altro</span>
                </button>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <button 
                type="button"
                @click="closeEditModal" 
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annulla
              </button>
              <button 
                type="submit" 
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
              >
                Salva
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- Modale conferma eliminazione account -->
    <div v-if="showDeleteConfirmation" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" @click="showDeleteConfirmation = false"></div>
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="bg-white rounded-xl w-full max-w-md p-6 shadow-xl transform transition-all duration-300 ease-in-out">
          <h3 class="text-xl font-semibold mb-4 text-red-600">Elimina account</h3>
          
          <p class="mb-6 text-gray-600">
            Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile e tutti i tuoi dati verranno persi.
          </p>
          
          <div class="flex justify-end space-x-3">
            <button 
              @click="showDeleteConfirmation = false" 
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annulla
            </button>
            <button 
              @click="deleteAccount" 
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
            >
              Elimina
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modale conferma eliminazione bambino -->
    <div v-if="showDeleteBambinoConfirmation" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" @click="showDeleteBambinoConfirmation = false"></div>
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="bg-white rounded-xl w-full max-w-md p-6 shadow-xl transform transition-all duration-300 ease-in-out">
          <h3 class="text-xl font-semibold mb-4 text-red-600">Rimuovi bambino</h3>
          
          <p class="mb-6 text-gray-600">
            Sei sicuro di voler rimuovere {{ bambinoToDelete && bambinoToDelete.nome ? '"' + bambinoToDelete.nome + '"' : 'questo bambino' }}? Questa azione è irreversibile e tutti i dati associati verranno persi.
          </p>
          
          <div class="flex justify-end space-x-3">
            <button 
              @click="showDeleteBambinoConfirmation = false" 
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annulla
            </button>
            <button 
              @click="deleteBambino" 
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
            >
              Rimuovi
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Importo il composable aggiornato
const { bambini, bambinoSelezionato, selezionaBambino, selezionaBambinoById, getBambini, addBambino, updateBambino } = useBambini();
const user = useSupabaseUser();

// Modale modifica dati bambino
const showEditModal = ref(false);
const bambinoInModifica = ref(null); // null = nuovo bambino, altrimenti bambino esistente
const editableBabyData = ref({
  nome: '',
  dataNascita: '',
  sesso: ''
});

// Modali per conferme
const showDeleteConfirmation = ref(false);
const showDeleteBambinoConfirmation = ref(false);
const bambinoToDelete = ref(null);

// Formattazione data
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Funzione per aggiungere un nuovo bambino
function aggiungiNuovoBambino() {
  bambinoInModifica.value = null;
  editableBabyData.value = {
    nome: '',
    dataNascita: '',
    sesso: ''
  };
  showEditModal.value = true;
}

// Funzione per modificare un bambino esistente
function modificaBambino() {
  bambinoInModifica.value = bambinoSelezionato.value;
  editableBabyData.value = {
    nome: bambinoSelezionato.value.nome || '',
    dataNascita: bambinoSelezionato.value.data_nascita || '',
    sesso: bambinoSelezionato.value.sesso || ''
  };
  showEditModal.value = true;
}

// Funzione per selezionare un bambino
function selectBambino(bambino) {
  selezionaBambino(bambino);
}

// Funzione per modificare un bambino specifico tramite ID
function modificaBambinoById(bambinoId) {
  const bambino = bambini.value.find(b => b.id === bambinoId);
  if (bambino) {
    bambinoInModifica.value = bambino;
    editableBabyData.value = {
      nome: bambino.nome || '',
      dataNascita: bambino.data_nascita || '',
      sesso: bambino.sesso || ''
    };
    showEditModal.value = true;
  }
}

// Funzione per mostrare la conferma di eliminazione per un bambino specifico
function showDeleteConfirmationFor(bambinoId) {
  bambinoToDelete.value = bambini.value.find(b => b.id === bambinoId);
  if (bambinoToDelete.value) {
    showDeleteBambinoConfirmation.value = true;
  }
}

// Funzione per eliminare un bambino (modificata per usare bambinoToDelete)
async function deleteBambino() {
  if (!bambinoToDelete.value || !bambinoToDelete.value.id) return;
  
  const supabase = useSupabaseClient();
  
  try {
    // Elimina i riferimenti in alimenti_bambini
    await supabase
      .from('alimenti_bambini')
      .delete()
      .eq('bambino_id', bambinoToDelete.value.id);
    
    // Elimina il bambino
    const { error } = await supabase
      .from('bambini')
      .delete()
      .eq('id', bambinoToDelete.value.id)
      .eq('user_id', user.value.id);
    
    if (error) throw error;
    
    // Ricarica la lista e seleziona un altro bambino se disponibile
    await getBambini();
    showDeleteBambinoConfirmation.value = false;
    bambinoToDelete.value = null;
  } catch (err) {
    console.error('Errore durante l\'eliminazione del bambino:', err);
    alert('Si è verificato un errore durante l\'eliminazione. Riprova più tardi.');
  }
}

// Funzione per calcolare l'età formattata di un qualsiasi bambino
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

// Chiusura modale modifica
function closeEditModal() {
  showEditModal.value = false;
  bambinoInModifica.value = null;
}

// Salvataggio dati bambino
async function saveBabyData() {
  try {
    // Mappo i campi del form ai campi del database
    const bambinoDati = {
      nome: editableBabyData.value.nome,
      data_nascita: editableBabyData.value.dataNascita,
      sesso: editableBabyData.value.sesso
    };

    // Validazione base
    if (!bambinoDati.data_nascita) {
      alert('La data di nascita è obbligatoria');
      return;
    }
    
    if (!bambinoDati.sesso) {
      alert('Il sesso è obbligatorio');
      return;
    }

    if (bambinoInModifica.value) {
      // Aggiorna bambino esistente
      const risultato = await updateBambino(bambinoInModifica.value.id, bambinoDati);
      if (!risultato) {
        throw new Error('Aggiornamento fallito');
      }
    } else {
      // Crea nuovo bambino
      const newBambino = await addBambino(bambinoDati);
      if (!newBambino) {
        throw new Error('Creazione fallita');
      }
    }
    
    // Ricarica i bambini per aggiornare la lista
    await getBambini();
    closeEditModal();
  } catch (error) {
    console.error('Errore durante il salvataggio:', error);
    alert('Si è verificato un errore durante il salvataggio. Controlla i dati inseriti.');
  }
}

// Funzione di logout
async function logout() {
  const supabase = useSupabaseClient();
  
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Reindirizzamento esplicito alla pagina di login
    navigateTo('/');
  } catch (err) {
    console.error('Errore durante il logout:', err);
  }
}

// Funzione di eliminazione account
async function deleteAccount() {
  const supabase = useSupabaseClient();
  showDeleteConfirmation.value = false;
  
  try {
    // Chiama la funzione SQL che elimina tutto, incluso l'utente
    const { error } = await supabase
      .rpc('delete_user_account');
    
    if (error) throw error;
    
    // Non è necessario fare logout perché l'utente è già stato eliminato
    // Semplicemente reindirizza alla home
    navigateTo('/');
  } catch (err) {
    console.error('Errore durante l\'eliminazione dell\'account:', err);
    alert('Si è verificato un errore durante l\'eliminazione dell\'account. Riprova più tardi.');
  }
}

// All'apertura della pagina, carica i dati
onMounted(async () => {
  // I bambini sono già caricati dal composable
  // ma possiamo forzare un aggiornamento se necessario
  await getBambini();
});

definePageMeta({
  middleware: 'auth'
})
</script> 