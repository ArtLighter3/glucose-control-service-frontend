<script setup lang="ts">

import { BFormInput, BFormSelect, BFormSelectOption } from 'bootstrap-vue-next'

//Может и выглядит не очень, но таким образом могут быть выставлены только определенные временные
//слоты
enum Time {
  T00_30 = "00:30",
  T01_00 = "01:00",
  T01_30 = "01:30",
  T02_00 = "02:00",
  T02_30 = "02:30",
  T03_00 = "03:00",
  T03_30 = "03:30",
  T04_00 = "04:00",
  T04_30 = "04:30",
  T05_00 = "05:00",
  T05_30 = "05:30",
  T06_00 = "06:00",
  T06_30 = "06:30",
  T07_00 = "07:00",
  T07_30 = "07:30",
  T08_00 = "08:00",
  T08_30 = "08:30",
  T09_00 = "09:00",
  T09_30 = "09:30",
  T10_00 = "10:00",
  T10_30 = "10:30",
  T11_00 = "11:00",
  T11_30 = "11:30",
  T12_00 = "12:00",
  T12_30 = "12:30",
  T13_00 = "13:00",
  T13_30 = "13:30",
  T14_00 = "14:00",
  T14_30 = "14:30",
  T15_00 = "15:00",
  T15_30 = "15:30",
  T16_00 = "16:00",
  T16_30 = "16:30",
  T17_00 = "17:00",
  T17_30 = "17:30",
  T18_00 = "18:00",
  T18_30 = "18:30",
  T19_00 = "19:00",
  T19_30 = "19:30",
  T20_00 = "20:00",
  T20_30 = "20:30",
  T21_00 = "21:00",
  T21_30 = "21:30",
  T22_00 = "22:00",
  T22_30 = "22:30",
  T23_00 = "23:00",
  T23_30 = "23:30",
}

const props = defineProps({
  id: {
    required: true,
    type: String
  },
  timeAdjustable: {
    required: false,
    type: Boolean,
    default: true,
  },
  valueDisplayName: {
    required: false,
    type: String
  },
  deletable: {
    required: false,
    type: Boolean,
    default: true
  }
});

const time = defineModel<string>('time')
const value = defineModel<number>('value')

const emit = defineEmits<{
  (e: 'update:time', time: string): void
  (e: 'update:value', value: number): void
}>();

</script>

<template :key="id">
  <div class="value-row">
    С
    <b-form-select @input="$emit('update:time', $event.target.value)"
                   v-if="timeAdjustable" class="squared-input-field"
                   :id="`${id}-select`"
                   v-model="time">
      <b-form-select-option v-for="timeSlot in Object.entries(Time)"
                            :key="timeSlot[1]" :value="timeSlot[1]">
        {{ timeSlot[1] }}
      </b-form-select-option>
    </b-form-select>
    <div v-else> 0:00 </div>
    {{ valueDisplayName }}
    <b-form-input @input="$emit('update:value', $event.target.value)"
                  class="squared-input-field"
                  :id="`${id}-value-input`" type="number"
                  number
                  v-model="value"/>
  </div>
</template>

<style scoped>
.value-row {
  display: flex;
}
</style>
