// Composable per gestire i dati dei bambini
export function useBambini() {
  // Client Supabase e utente loggato
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  
  // Cookie per memorizzare l'ID del bambino selezionato (durata 7 giorni)
  const bambinoSelezionatoCookie = useCookie('bambino-selezionato-id', {
    maxAge: 60 * 60 * 24 * 7, // 7 giorni in secondi
    sameSite: true
  });
  
  // Lista dei bambini e bambino selezionato (stato condiviso tra le pagine)
  const bambini = ref([]);
  const bambinoSelezionato = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  
  // Funzione per caricare tutti i bambini dell'utente corrente
  async function getBambini() {
    if (!user.value) return [];
    
    isLoading.value = true;
    error.value = null;
    
    try {
      const { data, error: bambiniError } = await supabase
        .from('bambini')
        .select('*')
        .eq('user_id', user.value.id);
      
      if (bambiniError) throw bambiniError;
      
      bambini.value = data || [];
      
      // Cerca di selezionare il bambino salvato nel cookie
      if (bambinoSelezionatoCookie.value && !bambinoSelezionato.value) {
        const bambinoInCookie = bambini.value.find(b => b.id === bambinoSelezionatoCookie.value);
        if (bambinoInCookie) {
          bambinoSelezionato.value = bambinoInCookie;
        }
      }
      
      // Se c'è un bambino selezionato, verifica che sia ancora nella lista
      if (bambinoSelezionato.value) {
        const bambinoCorrisponde = bambini.value.find(b => b.id === bambinoSelezionato.value.id);
        if (!bambinoCorrisponde && bambini.value.length > 0) {
          // Se il bambino selezionato non esiste più, seleziona il primo disponibile
          bambinoSelezionato.value = bambini.value[0];
          bambinoSelezionatoCookie.value = bambinoSelezionato.value.id;
        } else if (!bambinoCorrisponde) {
          // Se il bambino selezionato non esiste più e non ci sono altri bambini
          bambinoSelezionato.value = null;
          bambinoSelezionatoCookie.value = null;
        }
      } else if (bambini.value.length > 0 && !bambinoSelezionato.value) {
        // Se non c'è un bambino selezionato ma ci sono bambini disponibili, seleziona il primo
        bambinoSelezionato.value = bambini.value[0];
        bambinoSelezionatoCookie.value = bambinoSelezionato.value.id;
      }
      
      return bambini.value;
    } catch (err) {
      console.error('Errore nel caricamento dei bambini:', err);
      error.value = 'Errore nel caricamento dei bambini';
      return [];
    } finally {
      isLoading.value = false;
    }
  }
  
  // Funzione per selezionare un bambino specifico
  function selezionaBambino(bambino) {
    if (!bambino) return;
    bambinoSelezionato.value = bambino;
    bambinoSelezionatoCookie.value = bambino.id;
  }
  
  // Funzione per selezionare un bambino per ID
  function selezionaBambinoById(bambinoId) {
    if (!bambinoId) return;
    const bambino = bambini.value.find(b => b.id === bambinoId);
    if (bambino) {
      bambinoSelezionato.value = bambino;
      bambinoSelezionatoCookie.value = bambino.id;
    }
  }
  
  // Funzione per aggiungere un nuovo bambino (POST)
  async function addBambino(dati) {
    if (!user.value) return null;
    
    isLoading.value = true;
    error.value = null;
    
    try {
      const { data, error: insertError } = await supabase
        .from('bambini')
        .insert({
          user_id: user.value.id,
          nome: dati.nome || '',
          data_nascita: dati.data_nascita || '',
          sesso: dati.sesso || ''
        })
        .select();
      
      if (insertError) throw insertError;
      
      if (data && data[0]) {
        // Aggiorna la lista locale dei bambini
        await getBambini();
        // Seleziona automaticamente il nuovo bambino
        selezionaBambinoById(data[0].id);
        return data[0];
      }
      
      return null;
    } catch (err) {
      console.error('Errore nell\'aggiunta del bambino:', err);
      error.value = 'Errore nel salvataggio dei dati';
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  
  // Funzione per aggiornare un bambino esistente (PUT)
  async function updateBambino(id, dati) {
    if (!user.value || !id) return false;
    
    isLoading.value = true;
    error.value = null;
    
    try {
      const { error: updateError } = await supabase
        .from('bambini')
        .update({
          nome: dati.nome || '',
          data_nascita: dati.data_nascita || '',
          sesso: dati.sesso || ''
        })
        .eq('id', id)
        .eq('user_id', user.value.id);
      
      if (updateError) throw updateError;
      
      // Aggiorna la lista locale dei bambini
      await getBambini();
      
      // Aggiorna anche il bambino selezionato se è quello che abbiamo modificato
      if (bambinoSelezionato.value && bambinoSelezionato.value.id === id) {
        selezionaBambinoById(id);
      }
      
      return true;
    } catch (err) {
      console.error('Errore nell\'aggiornamento del bambino:', err);
      error.value = 'Errore nell\'aggiornamento dei dati';
      return false;
    } finally {
      isLoading.value = false;
    }
  }
  
  // Inizializza la lista dei bambini se siamo nel client
  if (process.client) {
    watchEffect(() => {
      if (user.value) {
        getBambini();
      } else {
        // Se l'utente è stato disconnesso, resetta i dati
        bambini.value = [];
        bambinoSelezionato.value = null;
        bambinoSelezionatoCookie.value = null;
      }
    });
  }
  
  return {
    bambini,
    bambinoSelezionato,
    isLoading,
    error,
    getBambini,
    selezionaBambino,
    selezionaBambinoById,
    addBambino,
    updateBambino
  };
} 