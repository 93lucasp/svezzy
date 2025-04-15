// Composable per gestire gli alimenti nello svezzamento
export function useAlimenti() {
  // Client Supabase e utente loggato
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  
  // Stato
  const alimenti = ref([]);
  const categorie = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  
  // Filtraggio per categoria
  const categoriaSelezionata = ref('');
  const alimentiFiltrati = computed(() => {
    if (!categoriaSelezionata.value) {
      return alimenti.value;
    }
    return alimenti.value.filter(alimento => alimento.categoria === categoriaSelezionata.value);
  });

  // Filtraggio per stato (assaggiato o meno)
  const statoFiltro = ref('tutti'); // 'tutti', 'da-provare', 'assaggiati'
  const alimentiPerStato = computed(() => {
    let risultati = alimentiFiltrati.value;
    
    if (statoFiltro.value === 'da-provare') {
      risultati = risultati.filter(alimento => !alimento.assaggiato);
    } else if (statoFiltro.value === 'assaggiati') {
      risultati = risultati.filter(alimento => alimento.assaggiato);
    }
    
    return risultati;
  });

  // Alimenti da suggerire in base all'età del bambino
  const etaBambino = ref(0); // in mesi
  const alimentiConsigliati = computed(() => {
    if (!etaBambino.value) {
      return [];
    }
    
    return alimenti.value.filter(alimento => 
      alimento.mese_consigliato <= etaBambino.value && !alimento.assaggiato
    );
  });

  // Carica tutte le categorie dalla tabella categorie
  async function fetchCategorie() {
    isLoading.value = true;
    error.value = null;
    
    try {
      const { data, error: categorieError } = await supabase
        .from('categorie')
        .select('*');
      
      if (categorieError) throw categorieError;
      
      categorie.value = data || [];
    } catch (err) {
      console.error('Errore nel caricamento delle categorie:', err);
      error.value = 'Errore nel caricamento delle categorie';
    } finally {
      isLoading.value = false;
    }
  }

  // Carica tutti gli alimenti dalla tabella alimenti
  async function fetchAlimenti() {
    if (!user.value) return;
    
    isLoading.value = true;
    error.value = null;
    
    try {
      // Ottiene l'elenco base degli alimenti
      const { data: alimentiData, error: alimentiError } = await supabase
        .from('alimenti')
        .select('*');
      
      if (alimentiError) throw alimentiError;
      
      // Ottiene gli alimenti assaggiati dal bambino
      const { data: assaggiatiData, error: assaggiatiError } = await supabase
        .from('alimenti_bambini')
        .select('*')
        .eq('user_id', user.value.id);
      
      if (assaggiatiError) throw assaggiatiError;
      
      // Combina i dati: marca come assaggiati quelli presenti in alimenti_bambini
      // e aggiunge le note se presenti
      const alimentiProcessati = alimentiData.map(alimento => {
        const alimentoAssaggiato = assaggiatiData.find(a => a.alimento_id === alimento.id);
        return {
          ...alimento,
          assaggiato: !!alimentoAssaggiato,
          note: alimentoAssaggiato?.note || ''
        };
      });
      
      alimenti.value = alimentiProcessati;
    } catch (err) {
      console.error('Errore nel caricamento degli alimenti:', err);
      error.value = 'Errore nel caricamento degli alimenti';
    } finally {
      isLoading.value = false;
    }
  }

  // Funzione per aggiornare lo stato di un alimento
  async function toggleAssaggiato(id) {
    if (!user.value) return;
    
    const index = alimenti.value.findIndex(alimento => alimento.id === id);
    if (index === -1) return;
    
    const nuovoStato = !alimenti.value[index].assaggiato;
    
    try {
      if (nuovoStato) {
        // Aggiungi alla tabella alimenti_bambini
        const { error: insertError } = await supabase
          .from('alimenti_bambini')
          .insert({
            user_id: user.value.id,
            alimento_id: id,
            note: alimenti.value[index].note
          });
        
        if (insertError) throw insertError;
      } else {
        // Rimuovi dalla tabella alimenti_bambini
        const { error: deleteError } = await supabase
          .from('alimenti_bambini')
          .delete()
          .eq('user_id', user.value.id)
          .eq('alimento_id', id);
        
        if (deleteError) throw deleteError;
      }
      
      // Aggiorna lo stato locale
      alimenti.value[index].assaggiato = nuovoStato;
    } catch (err) {
      console.error('Errore nell\'aggiornamento dello stato dell\'alimento:', err);
      // Non modifichiamo lo stato locale in caso di errore
    }
  }

  // Funzione per aggiungere/modificare una nota
  async function aggiungiNota(id, nota) {
    if (!user.value) return;
    
    const index = alimenti.value.findIndex(alimento => alimento.id === id);
    if (index === -1) return;
    
    try {
      if (alimenti.value[index].assaggiato) {
        // Aggiorna la nota nella tabella alimenti_bambini
        const { error: updateError } = await supabase
          .from('alimenti_bambini')
          .update({ note: nota })
          .eq('user_id', user.value.id)
          .eq('alimento_id', id);
        
        if (updateError) throw updateError;
      } else {
        // Se non è ancora assaggiato, prima lo marca come assaggiato
        // e poi inserisce con la nota
        const { error: insertError } = await supabase
          .from('alimenti_bambini')
          .insert({
            user_id: user.value.id,
            alimento_id: id,
            note: nota
          });
        
        if (insertError) throw insertError;
        
        // Aggiorna anche lo stato di assaggio
        alimenti.value[index].assaggiato = true;
      }
      
      // Aggiorna la nota localmente
      alimenti.value[index].note = nota;
    } catch (err) {
      console.error('Errore nell\'aggiornamento della nota:', err);
    }
  }

  // Ricerca per nome
  const testoDiRicerca = ref('');
  const alimentiRicerca = computed(() => {
    if (!testoDiRicerca.value.trim()) {
      return alimentiPerStato.value;
    }
    
    const termineRicerca = testoDiRicerca.value.toLowerCase();
    return alimentiPerStato.value.filter(alimento => 
      alimento.nome.toLowerCase().includes(termineRicerca)
    );
  });

  // Setter per l'età del bambino
  function setEtaBambino(mesi) {
    etaBambino.value = mesi;
  }

  // Carica solo gli alimenti assaggiati dal bambino
  async function fetchAlimentiAssaggiati() {
    if (!user.value) return [];
    
    isLoading.value = true;
    error.value = null;
    
    try {
      // Esegue una query JOIN tra alimenti_bambini e alimenti
      const { data, error: queryError } = await supabase
        .from('alimenti_bambini')
        .select(`
          *,
          alimento:alimenti(*)
        `)
        .eq('user_id', user.value.id);
      
      if (queryError) throw queryError;
      
      // Trasforma i dati in un formato più semplice da usare
      const alimentiAssaggiati = data.map(item => ({
        ...item.alimento,
        assaggiato: true,
        note: item.note || ''
      }));
      
      return alimentiAssaggiati;
    } catch (err) {
      console.error('Errore nel caricamento degli alimenti assaggiati:', err);
      error.value = 'Errore nel caricamento degli alimenti assaggiati';
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  // Carica gli alimenti e le categorie al mount del composable
  if (process.client) {
    // Carica le categorie subito
    fetchCategorie();
    
    // Utilizziamo watchEffect per ricaricare quando l'utente cambia
    watchEffect(() => {
      if (user.value) {
        fetchAlimenti();
      }
    });
  }

  return {
    alimenti,
    categorie,
    categoriaSelezionata,
    statoFiltro,
    alimentiFiltrati,
    alimentiPerStato,
    alimentiConsigliati,
    testoDiRicerca,
    alimentiRicerca,
    isLoading,
    error,
    toggleAssaggiato,
    aggiungiNota,
    setEtaBambino,
    fetchAlimenti,
    fetchCategorie,
    fetchAlimentiAssaggiati
  };
} 