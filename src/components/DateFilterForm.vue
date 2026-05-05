<script setup lang="ts">
import { ref } from 'vue'
import { BForm, BFormGroup, BFormInput, BButton } from 'bootstrap-vue-next'
type TimeRange = 'day' | 'week' | 'month' | 'three_months'

const from = defineModel<string>('from');
const to = defineModel<string>('to');

const filtered = ref(false);
defineExpose({ filtered });

//const currentDate = new Date().toISOString().slice(0, 16);
// const fromInternal = ref(...props.from);
// const toInternal = ref(...props.to);

const applyPreset = (range: TimeRange) => {
  const current = new Date();
  const offset = current.getTimezoneOffset() * 60000;
  const toDate = new Date(current.getTime() - offset);
  const fromDate = new Date(current.getTime() - offset);
  switch (range) {
    case 'day':
      fromDate.setHours(0, 0, 0, 0);
      break;
    case 'week':
      fromDate.setDate(fromDate.getDate() - 7);
      break;
    case 'month':
      fromDate.setDate(fromDate.getDate() - 30);
      break;
    case 'three_months':
      fromDate.setDate(fromDate.getDate() - 90);
      break;
  }

  to.value = toDate.toISOString().slice(0, 16);
  from.value = fromDate.toISOString().slice(0, 16);
};

const emits = defineEmits<{
  (e: 'update:from', from: string): void,
  (e: 'update:to', to: string): void,
  (e: 'apply', from: string, to: string): void,
  (e: 'cancel'): void
}>();
</script>

<template>
  <b-form class="filter-form"
          @submit.prevent="filtered = true; $emit('apply', from, to)"
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
                    v-model="from"
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
                    v-model="to"
        />
      </b-form-group>
    </div>
    <div class="filter-presets">
      <span class="opaque-text clickable-text" @click="applyPreset('day')">Эти сутки</span>
      <span class="opaque-text clickable-text" @click="applyPreset('week')">Неделя</span>
      <span class="opaque-text clickable-text" @click="applyPreset('month')">Месяц</span>
      <span class="opaque-text clickable-text" @click="applyPreset('three_months')">3 месяца</span>
    </div>
    <div class="buttons">
      <b-button class="filter-btn"
                          variant="outline-success"
                          type="submit"
                          loading-fill
                          squared
                          size="lg"
      >
                  Применить
      </b-button>
      <b-button class="filter-btn"
                              variant="outline-danger"
                              loading-fill
                              squared
                              size="lg"
                              @click="filtered = false; $emit('cancel')"
      >
                      Отменить
      </b-button>
    </div>
  </b-form>
</template>

<style scoped>
      .filter-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;

        .filter-first-row {
          display: flex;
          flex-direction: row;
        }

        .filter-presets {
          display: flex;
          gap: 1rem;
        }

        .buttons {
          display: flex;
          justify-content: space-evenly;
        }
      }

    .opaque-text {
      opacity: 0.5;
    }

    .clickable-text {
      cursor: pointer;
    }
</style>
