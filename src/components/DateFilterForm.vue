<script setup lang="ts">
import { ref } from 'vue'
import { BForm, BFormGroup, BFormInput, BButton } from 'bootstrap-vue-next'
const props = defineProps<{
  from: string,
  to: string
}>();

//const currentDate = new Date().toISOString().slice(0, 16);
// const fromInternal = ref(...props.from);
// const toInternal = ref(...props.to);

const emits = defineEmits<{
  (e: 'update:from', from: string): void,
  (e: 'update:to', to: string): void,
  (e: 'apply', from: string, to: string): void
}>();
</script>

<template>
  <b-form class="filter-form"
          @submit.prevent="$emit('apply', from, to)"
  >
    <div class="filter-first-row">
      <b-form-group
                  class="filter-form-group"
                  key="from"
                  id="from"
                  label="C"
                  label-for="from-input"
      >
        <b-form-input
                    class="squared-input-field"
                    id="from-input"
                    key="from-input"
                    type="datetime-local"
                    :model-value="from"
                    @update:model-value="$emit('update:from', $event)"
        />
      </b-form-group>
      <b-form-group
                  class="filter-to-group"
                  key="to"
                  id="to"
                  label="по"
                  label-for="to-input"
      >
        <b-form-input
                    class="squared-input-field"
                    id="to-input"
                    key="to-input"
                    type="datetime-local"
                    :model-value="to"
                    @update:model-value="$emit('update:to', $event)"
        />
      </b-form-group>
    </div>
    <b-button class="filter-btn"
                        variant="outline-success"
                        type="submit"
                        loading-fill
                        squared
                        size="lg">
                Применить
    </b-button>
  </b-form>
</template>

<style scoped>
      .filter-form {
        display: flex;
        flex-direction: column;

        .filter-first-row {
          display: flex;
          flex-direction: row;
        }
      }
</style>
