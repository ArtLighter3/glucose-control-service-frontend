<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  BFormInput,
  BForm,
  BFormGroup, BFormSelect, BFormSelectOption,
  BButton,
  BSpinner,
  BCard} from 'bootstrap-vue-next'
import { type AxiosResponse, isAxiosError } from 'axios'
import FormTransitionGroup from '@/components/FormTransitionGroup.vue'
import type { ApiExceptionResponse, FieldErrors } from '@/util/exception.ts'
import {
  getInsulinProfile,
  type InsulinProfile, postInsulinProfile,
  putInsulinProfile
} from '@/service/insulinService.ts'
import InsulinPropertyByTime from '@/components/InsulinPropertyByTime.vue'

  const props = defineProps({
    patientId: {
      type: String,
      required: true
    }
  });

  const insulinProfile = ref<InsulinProfile>({
    defaultInsulinToCarbsRatio: 30,
    defaultInsulinSensitivityFactor: 30,
    durationOfInsulinAction: 5,
    factorsByTime: new Map<string, number>(),
    ratiosByTime: new Map<string, number>(),
  });

  const globalError = ref(false);
  const loading = ref(true);
  const insulinProfileDoesNotExist = ref(false);
  onMounted(async () => {
    try {
      globalError.value = false;
      insulinProfile.value = (await getInsulinProfile(props.patientId)).data;
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        if (err.response.status === 404) insulinProfileDoesNotExist.value = true;
        else globalError.value = true;
      }
    }
    loading.value = false;
  });

  const submitting = ref(false);
  const success = ref(false);
  const fieldErrors = ref<FieldErrors>({});
  const objectErrors = ref<string[]>([]);
  const submitForm = async () => {
    submitting.value = true;
    try {
      if (globalError.value) return;
      fieldErrors.value = {};
      objectErrors.value = [];

      const response = insulinProfileDoesNotExist.value ?
        await postInsulinProfile(props.patientId, insulinProfile.value) :
        await putInsulinProfile(props.patientId, insulinProfile.value);
      insulinProfile.value = response.data;
      success.value = true;
      insulinProfileDoesNotExist.value = false;
    } catch (err) {
      success.value = false;
      if (isAxiosError(err) && err.response) {
        if (err.response.status === 400 && err.response.data) {
          const exceptionResponse = err.response as AxiosResponse<ApiExceptionResponse>;
          fieldErrors.value = exceptionResponse.data.fieldErrors;
          objectErrors.value = exceptionResponse.data.objectErrors;
        }
      }
    }
    submitting.value = false;
  };

  const getValidationState = (fieldName: string, errors: FieldErrors) => {
    if (success.value) return true;
    if (errors[fieldName] && errors[fieldName].length > 0) return false;

    return null;
  };

  // const updateTimeSlot = (oldTimeValue: string, newTimeValue: string, map: Map<string, number>) => {
  //   const propertyValue = map.get(oldTimeValue);
  //   if (propertyValue === undefined) return;
  //
  //   map.delete(oldTimeValue);
  //   map.set(newTimeValue, propertyValue);
  // };
  // const updateMapValue = (timeSlot: string, newValue: number, map: Map<string, number>) => {
  //   map.set(timeSlot, newValue)
  // };
  const updateTimeSlot = (oldTimeValue: string, newTimeValue: string, map: any) => {
    const propertyValue = map[oldTimeValue];
    if (propertyValue === undefined) return;

    delete map[oldTimeValue];
    map[newTimeValue] = propertyValue;
  };
  const updateMapValue = (timeSlot: string, newValue: number, map: any) => {
    map[timeSlot] = newValue;
  };
  const handleRatiosTimeSlotUpdate = (oldTimeValue: string, newTimeValue: string) => {
    updateTimeSlot(oldTimeValue, newTimeValue, insulinProfile.value.ratiosByTime);
  };
  const handleRatiosValueUpdate = (timeSlot: string, newValue: number) => {
    updateMapValue(timeSlot, newValue, insulinProfile.value.ratiosByTime)
  };
  const handleFactorsTimeSlotUpdate = (oldTimeValue: string, newTimeValue: string) => {
    updateTimeSlot(oldTimeValue, newTimeValue, insulinProfile.value.factorsByTime);
  };
  const handleFactorsValueUpdate = (timeSlot: string, newValue: number) => {
    updateMapValue(timeSlot, newValue, insulinProfile.value.factorsByTime)
  };

</script>

<template>
  <b-spinner v-if="loading" variant="success"></b-spinner>
  <div class="insulin-profile-form-inner-wrapper" v-else>
    <h4 class="error-text" v-if="globalError">ОШИБКА</h4>
    <b-form class="insulin-profile-form" v-else @submit.prevent="submitForm">
      <h2>ИНСУЛИНОВЫЙ РЕЖИМ</h2>
      <b-card class="form-group-wrapper">
        <form-transition-group>
          <span
            v-for="(objectError, index) in objectErrors"
            :key="`error-${index}`"
            class="error-text"
            >{{ objectError }}</span
          >
          <b-form-group
            key="dia"
            id="dia"
            class="form-group-inner"
            label="Время действия инсулина (DIA) [час]"
            label-for="dia-input"
            :state="getValidationState('durationOfInsulinAction', fieldErrors)"
            :invalid-feedback="fieldErrors.durationOfInsulinAction"
          >
            <b-form-input
              class="squared-input-field"
              id="dia-input"
              type="number"
              v-model="insulinProfile.durationOfInsulinAction"
            />
          </b-form-group>
          <b-form-group
            key="icr"
            id="icr"
            class="form-group-inner"
            label="Углеводный коэффициент (ICR)
                              (соотношение углеводов / 1 ед инсулина) [граммы]"
            label-for="default-icr-input"
          >
            <b-card>
              <insulin-property-by-time
                id="default-icr-input"
                v-model:value="insulinProfile.defaultInsulinToCarbsRatio"
                :deletable="false"
                :time-adjustable="false"
              ></insulin-property-by-time>
              <insulin-property-by-time
                v-for="[time, value] in Object.entries(insulinProfile.ratiosByTime)"
                :key="`icr-${time}`"
                :id="`icr-${time}`"
                :time="time"
                @update:time="handleRatiosTimeSlotUpdate(time, $event)"
                :value="value"
                @update:value="handleRatiosValueUpdate(time, $event)"/>
            </b-card>
          </b-form-group>
          <b-form-group
            key="isf"
            id="isf"
            class="form-group-inner"
            label="Фактор чувствительности к инсулину (ISF) [ммоль/л/ед]"
            label-for="default-isf-input"
          >
            <b-card>
              <insulin-property-by-time
                id="default-isf-input"
                v-model:value="insulinProfile.defaultInsulinSensitivityFactor"
                :deletable="false"
                :time-adjustable="false"
              ></insulin-property-by-time>
              <insulin-property-by-time
                v-for="[time, value] in Object.entries(insulinProfile.factorsByTime)"
                :key="`isf-${time}`"
                :id="`isf-${time}`"
                :time="time"
                @update:time="handleFactorsTimeSlotUpdate(time, $event)"
                :value="value"
                @update:value="handleFactorsValueUpdate(time, $event)"/>
            </b-card>
          </b-form-group>
        </form-transition-group>
      </b-card>
      <b-button
        class="update-profile-btn"
        variant="outline-success"
        type="submit"
        :loading="submitting"
        loading-fill
        squared
        size="lg"
      >
        Сохранить
      </b-button>
    </b-form>
  </div>
</template>

<style scoped>
h4 {
  text-align: center;
}

.insulin-profile-form-inner-wrapper {
  display: flex;
  align-items: center;
  flex: 1;

  .insulin-profile-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    flex: 1;

    .form-group-wrapper {
      margin: 1rem;
      flex: 1;
      width: 50%;
      flex-basis: 250px;

      .form-group-inner {
        margin-top: 1.1rem;
      }
    }
  }
}
</style>
