<script setup lang="ts">
import { computed, type ComputedRef, onMounted, ref } from 'vue'
import {
  BFormInput,
  BForm,
  BFormGroup,
  BFormSelect,
  BFormSelectOption,
  BButton,
  BSpinner,
  BCard, BFormInvalidFeedback
} from 'bootstrap-vue-next'
import { type AxiosResponse, isAxiosError } from 'axios'
import FormTransitionGroup from '@/components/FormTransitionGroup.vue'
import type { ApiExceptionResponse, FieldErrors } from '@/util/exception.ts'
import {
  getInsulinProfile,
  type InsulinProfile,
  postInsulinProfile,
  putInsulinProfile,
} from '@/service/insulinService.ts'
import InsulinPropertyByTime from '@/components/patient-view/InsulinPropertyByTime.vue'

const props = defineProps({
  patientId: {
    type: String,
    required: true,
  },
})

const insulinProfile = ref<InsulinProfile>({
  defaultInsulinToCarbsRatio: 30,
  defaultInsulinSensitivityFactor: 30,
  durationOfInsulinAction: 5,
  factorsByTime: {},
  ratiosByTime: {},
})

const globalError = ref(false)
const loading = ref(true)
const insulinProfileDoesNotExist = ref(false)
onMounted(async () => {
  try {
    globalError.value = false
    insulinProfile.value = (await getInsulinProfile(props.patientId)).data
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      if (err.response.status === 404) insulinProfileDoesNotExist.value = true
      else globalError.value = true
    }
  }
  loading.value = false
})

const submitting = ref(false)
const success = ref(false)
const fieldErrors = ref<FieldErrors>({})
const objectErrors = ref<string[]>([])
const submitForm = async () => {
  submitting.value = true
  try {
    if (globalError.value) return
    fieldErrors.value = {}
    objectErrors.value = []

    const response = insulinProfileDoesNotExist.value
      ? await postInsulinProfile(props.patientId, insulinProfile.value)
      : await putInsulinProfile(props.patientId, insulinProfile.value)
    insulinProfile.value = response.data
    success.value = true
    insulinProfileDoesNotExist.value = false
  } catch (err) {
    success.value = false
    if (isAxiosError(err) && err.response) {
      if (err.response.status === 400 && err.response.data) {
        const exceptionResponse = err.response as AxiosResponse<ApiExceptionResponse>
        fieldErrors.value = exceptionResponse.data.fieldErrors
        objectErrors.value = exceptionResponse.data.objectErrors
      }
    }
  }
  submitting.value = false
}

const getValidationState = (fieldName: string, errors: FieldErrors) => {
  if (success.value) return true
  if (errors[fieldName] && errors[fieldName].length > 0) return false

  return null
}

const sortedRatioTimeSlots = computed(() => {
  return Object.keys(insulinProfile.value.ratiosByTime).sort();
});
const sortedFactorTimeSlots = computed(() => {
  return Object.keys(insulinProfile.value.factorsByTime).sort();
});

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
const updateTimeSlot = (oldTimeValue: string, newTimeValue: string, map: {[key: string]: number}) => {
  const propertyValue = map[oldTimeValue]
  if (propertyValue === undefined) return

  delete map[oldTimeValue]
  map[newTimeValue] = propertyValue
};
const updateMapValue = (timeSlot: string, newValue: number, map: {[key: string]: number}) => {
  map[timeSlot] = newValue
};
const handleRatiosTimeSlotUpdate = (oldTimeValue: string, newTimeValue: string) => {
  updateTimeSlot(oldTimeValue, newTimeValue, insulinProfile.value.ratiosByTime)
};
const handleRatiosValueUpdate = (timeSlot: string, newValue: number) => {
  updateMapValue(timeSlot, newValue, insulinProfile.value.ratiosByTime)
};
const handleFactorsTimeSlotUpdate = (oldTimeValue: string, newTimeValue: string) => {
  updateTimeSlot(oldTimeValue, newTimeValue, insulinProfile.value.factorsByTime)
};
const handleFactorsValueUpdate = (timeSlot: string, newValue: number) => {
  updateMapValue(timeSlot, newValue, insulinProfile.value.factorsByTime)
};

const deleteRatioByTime = (timeSlot: string) => {
  delete insulinProfile.value.ratiosByTime[timeSlot];
};
const deleteFactorByTime = (timeSlot: string) => {
  delete insulinProfile.value.factorsByTime[timeSlot];
};

const addRatioByTime = () => {
  addValueByTime(insulinProfile.value.ratiosByTime, sortedRatioTimeSlots);
}
const addFactorByTime = () => {
  addValueByTime(insulinProfile.value.factorsByTime, sortedFactorTimeSlots);
}
const addValueByTime = (map: {[key: string]: number}, sortedKeys: ComputedRef<string[]>) => {
  if (sortedKeys.value.length <= 0) map["00:30"] = 30;
  else if (sortedKeys.value.length === 23) return;
  else {
    const lastTimeSlot = sortedKeys.value[sortedKeys.value.length - 1];
    //console.log(Time.T23_30.valueOf())
    if (lastTimeSlot === "23:30" || lastTimeSlot === undefined) {
      // for (let i = sortedKeys.value.length - 2; i >= 0; i--) {
      //
      // }
      //TODO
      return;
    }

    let minutes = lastTimeSlot.slice(-2);
    let hours = lastTimeSlot.slice(0, 2);
    if (minutes === "00") {
      minutes = "30";
    }
    else if (minutes === "30") {
      minutes = "00";
      hours = `${parseInt(hours) + 1}`;
    } else return;

    const newTimeSlot = `${hours.padStart(2, '0')}:${minutes}`;
    map[newTimeSlot] = 30;
  }
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
            >{{ objectError }}
          </span>
          <b-form-group
            key="dia"
            id="dia"
            class="form-group-inner"
            label="Время действия инсулина (DIA) [час]"
            label-for="dia-input"
            :state="getValidationState('durationOfInsulinAction', fieldErrors)"
          >
            <b-form-input
              class="squared-input-field"
              id="dia-input"
              type="number"
              v-model="insulinProfile.durationOfInsulinAction"
            />
            <b-form-invalid-feedback>
              <span v-for="(message, index) in fieldErrors.durationOfInsulinAction" :key="index">
                {{ message }}
              </span>
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            key="icr"
            id="icr"
            class="form-group-inner"
            label="Углеводный коэффициент (ICR)
                              (соотношение углеводов / 1 ед инсулина) [граммы]"
            label-for="default-icr-input"
          >
            <form-transition-group>
            <b-card>

                <insulin-property-by-time
                  id="default-icr-input"
                  key="default-icr-input"
                  v-model:value="insulinProfile.defaultInsulinToCarbsRatio"
                  :deletable="false"
                  :time-adjustable="false"
                  value-display-name="ICR"
                  :state="getValidationState('defaultInsulinToCarbsRatio', fieldErrors)"
                  :invalid-feedback-messages="fieldErrors.defaultInsulinToCarbsRatio"
                ></insulin-property-by-time>
                <insulin-property-by-time
                  v-for="time in sortedRatioTimeSlots"
                  :key="`icr-${time}`"
                  :id="`icr-${time}`"
                  :time="time"
                  value-display-name="ICR"
                  @update:time="handleRatiosTimeSlotUpdate(time, $event)"
                  :value="insulinProfile.ratiosByTime[time]"
                  @update:value="handleRatiosValueUpdate(time, $event)"
                  :state="getValidationState(`ratiosByTime[${time}]`, fieldErrors)"
                  :invalid-feedback-messages="fieldErrors[`ratiosByTime[${time}]`]"
                  @delete="deleteRatioByTime(time)"
                />
                <b-button key="add-icr"
                          class="add-value-btn"
                          variant="success" squared
                          @click="addRatioByTime"
                          >
                  Добавить
                </b-button>

            </b-card>
            </form-transition-group>
          </b-form-group>
          <b-form-group
            key="isf"
            id="isf"
            class="form-group-inner"
            label="Фактор чувствительности к инсулину (ISF) [ммоль/л/ед]"
            label-for="default-isf-input"
          >
            <b-card>
              <form-transition-group>
                <insulin-property-by-time
                  id="default-isf-input" key="default-isf-input"
                  v-model:value="insulinProfile.defaultInsulinSensitivityFactor"
                  :deletable="false"
                  :time-adjustable="false"
                  value-display-name="ISF"
                  :state="getValidationState('defaultInsulinSensitivityFactor', fieldErrors)"
                  :invalid-feedback-messages="fieldErrors.defaultInsulinSensitivityFactor"
                ></insulin-property-by-time>
                <insulin-property-by-time
                  v-for="time in sortedFactorTimeSlots"
                  :key="`isf-${time}`"
                  :id="`isf-${time}`"
                  :time="time"
                  value-display-name="ISF"
                  @update:time="handleFactorsTimeSlotUpdate(time, $event)"
                  :value="insulinProfile.factorsByTime[time]"
                  @update:value="handleFactorsValueUpdate(time, $event)"
                  :state="getValidationState(`factorsByTime[${time}]`, fieldErrors)"
                  :invalid-feedback-messages="fieldErrors[`factorsByTime[${time}]`]"
                  @delete="deleteFactorByTime(time)"
                />
                <b-button key="add-isf"
                          class="add-value-btn"
                          variant="success" squared
                          @click="addFactorByTime">Добавить</b-button>
              </form-transition-group>
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

        .add-value-btn {
          margin-top: 1rem;
          width: 100%;
        }
      }
    }
  }
}
</style>
