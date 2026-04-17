<script setup lang="ts">
import { BForm, BFormGroup, BFormInput, BButton } from 'bootstrap-vue-next'
import { ref } from 'vue';

const props = defineProps<{
  loading: boolean
}>();

const searchQuery = ref<string>('');

const emit = defineEmits<{
  (e: 'search', searchQuery: string): void
}>();
</script>

<template>
  <div class="search-input-wrapper">
     <b-form
       class="search-form"
       @submit.prevent="$emit('search', searchQuery)"
     >
          <b-form-group
                    class="search-input-group"
                    key="search"
                    id="search"
          >
            <b-form-input
                      class="squared-input-field"
                      id="search-input"
                      key="search-input"
                      type="search"
                      v-model="searchQuery"
                      placeholder="Поиск"
            />
          </b-form-group>
       <b-button
          class="search-btn"
          variant="outline-success"
          type="submit"
          :loading="loading"
          loading-fill
          squared
          size="md">
            Поиск
       </b-button>
     </b-form>
  </div>
</template>

<style scoped>
.search-form {
  display: flex;
  gap: 0.5rem;
  align-items: stretch;
}
</style>
