<template>
  <div class="border-b border-gray-100 last:border-b-0">
    <div class="p-4 flex items-center">
      <!-- Checkbox personalizzata -->
      <div class="flex-shrink-0 mr-3">
        <div class="custom-checkbox-container">
          <input 
            type="checkbox" 
            :id="`alimento-${alimento.id}`" 
            :checked="alimento.assaggiato"
            @change="$emit('toggle', alimento.id)"
            class="custom-checkbox"
          />
          <label :for="`alimento-${alimento.id}`" class="custom-checkbox-label"></label>
        </div>
      </div>
      
      <!-- Informazioni alimento -->
      <div class="flex-1 min-w-0">
        <div class="block text-sm font-medium">
          {{ alimento.nome }} <span class="text-gray-400">({{ alimento.mese_introduzione }}+)</span>
          <span v-if="alimento.allergeni" class="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
          
            Allergene
          </span>
        </div>
        <p v-if="alimento.note_nutrizionali" class="text-xs text-green-600 mt-1 line-clamp-1">
          {{ alimento.note_nutrizionali }}
        </p>
      </div>
      
      <!-- Pulsante nota -->
      <!-- <button 
        @click="$emit('add-note', alimento)" 
        class="ml-3 flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full text-gray-400 hover:text-primary hover:bg-indigo-50"
      >
        <svg 
          :class="[
            'h-5 w-5', 
            alimento.nota_personale ? 'text-indigo-500' : 'text-gray-400'
          ]" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          ></path>
        </svg>
      </button> -->
      
      <!-- Pulsante espandi -->
      <button 
        @click="isExpanded = !isExpanded" 
        class="ml-2 flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full text-gray-400 hover:text-primary hover:bg-indigo-50"
      >
        <svg 
          :class="['h-5 w-5', isExpanded ? 'transform rotate-180' : '']" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
    </div>
    
    <!-- Note e descrizione (se presenti) -->
    <div v-if="alimento.nota_personale || alimento.descrizione" class="px-4 pb-4 -mt-1">
      <div v-if="alimento.descrizione" class="text-sm bg-blue-50 rounded-md p-3 mb-2 text-gray-600 border-l-2 border-blue-300">
        {{ alimento.descrizione }}
      </div>
      <div v-if="alimento.nota_personale" class="text-sm bg-gray-50 rounded-md p-3 text-gray-600 border-l-2 border-yellow-500">
        <div class="font-medium text-xs mb-1 text-gray-500">Note personali:</div>
        {{ alimento.nota_personale }}
       
      </div>
    </div>
    
    <!-- Dettagli avanzati (visibili solo quando espanso) -->
    <div v-if="isExpanded" class="px-4 pb-4 space-y-3">
      <!-- Note nutrizionali -->
      <div v-if="alimento.note_nutrizionali" class="text-sm bg-green-50 rounded-md p-3 text-gray-600 border-l-2 border-green-300">
        <div class="font-medium text-xs mb-1 text-gray-500">Note nutrizionali:</div>
        {{ alimento.note_nutrizionali }}
      </div>
      
      <!-- Allergeni RIMOSSO -->
      
      <!-- Suggerimenti preparazione -->
      <div v-if="alimento.suggerimenti_preparazione" class="text-sm bg-amber-50 rounded-md p-3 text-gray-600 border-l-2 border-amber-300">
        <div class="font-medium text-xs mb-1 text-gray-500">Suggerimenti di preparazione:</div>
        {{ alimento.suggerimenti_preparazione }}
      </div>
      
      <!-- Note generali -->
      <div v-if="alimento.note" class="text-sm bg-purple-50 rounded-md p-3 text-gray-600 border-l-2 border-purple-300">
        <div class="font-medium text-xs mb-1 text-gray-500">Note generali:</div>
        {{ alimento.note }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  alimento: {
    type: Object,
    required: true
  }
});

defineEmits(['toggle', 'add-note']);

const isExpanded = ref(false);
</script>

<style scoped>
.custom-checkbox-container {
  position: relative;
  height: 20px;
  width: 20px;
}

.custom-checkbox {
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
  margin: 0;
}

.custom-checkbox-label {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
}

.custom-checkbox-label:after {
  content: "";
  position: absolute;
  display: none;
  left: 7px;
  top: 3px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.custom-checkbox:checked ~ .custom-checkbox-label {
  background-color: var(--color-primary, #6366F1);
  border-color: var(--color-primary, #6366F1);
}

.custom-checkbox:checked ~ .custom-checkbox-label:after {
  display: block;
}

.custom-checkbox:focus ~ .custom-checkbox-label {
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}
</style> 