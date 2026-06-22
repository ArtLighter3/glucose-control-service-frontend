<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import {
  BFormInput,
  BForm,
  BFormGroup,
  BButton,
  BSpinner,
  BCard, BFormInvalidFeedback
} from 'bootstrap-vue-next'
import FormTransitionGroup from '@/components/FormTransitionGroup.vue'
import InsulinPropertyByTime from '@/components/patient-view/insulin/InsulinPropertyByTime.vue'
import {
  useInsulinProfileFetchingAndSubmitting
} from '@/composables/fetching/useInsulinProfileFetchingAndSubmitting.ts'
import type { GlucoseUnit } from '@/service/patientProfileService.ts'
import { getGlucoseUnitName } from '@/util/enumToStringLiterals.ts'

const props = defineProps<{
  patientId: string,
  glucoseUnit: GlucoseUnit
}>()

const {insulinProfile, fetchingError, loading,
  submit, submitting, success, fieldErrors, objectErrors,
  getValidationState} = useInsulinProfileFetchingAndSubmitting(props.patientId);

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
const updateTimeSlot = (oldTimeValue: string, newTimeValue: string | undefined,
                        map: {[key: string]: number}) => {
  if (newTimeValue === undefined) return;
  const propertyValue = map[oldTimeValue]
  if (propertyValue === undefined) return;

  delete map[oldTimeValue];
  map[newTimeValue] = propertyValue;
};
const updateMapValue = (timeSlot: string, newValue: number | undefined,
                        map: {[key: string]: number}) => {
  if (newValue === undefined) return;
  map[timeSlot] = newValue;
};
const handleRatiosTimeSlotUpdate = (oldTimeValue: string, newTimeValue: string | undefined) => {
  updateTimeSlot(oldTimeValue, newTimeValue, insulinProfile.value.ratiosByTime);
};
const handleRatiosValueUpdate = (timeSlot: string, newValue: number | undefined) => {
  updateMapValue(timeSlot, newValue, insulinProfile.value.ratiosByTime);
};
const handleFactorsTimeSlotUpdate = (oldTimeValue: string, newTimeValue: string | undefined) => {
  updateTimeSlot(oldTimeValue, newTimeValue, insulinProfile.value.factorsByTime);
};
const handleFactorsValueUpdate = (timeSlot: string, newValue: number | undefined) => {
  updateMapValue(timeSlot, newValue, insulinProfile.value.factorsByTime);
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
  else if (sortedKeys.value.length === 47) return;
  else {
    const lastTimeSlot = sortedKeys.value[sortedKeys.value.length - 1];
    let newTimeSlot = "00:30";

    if (lastTimeSlot === undefined) return;
    else if (lastTimeSlot === "23:30") {
      //необходимо найти самый поздний незанятый временной слот
      let minutes = "00", hours = "23";
      for (let i = 47; i >= 0; i--) {
        newTimeSlot = `${hours.padStart(2, '0')}:${minutes}`;

        if (map[newTimeSlot] === undefined) break;

        //Отнимаем 30 минут от временного слота
        if (minutes === "00") {
          minutes = "30";
          hours = `${parseInt(hours) - 1}`;
        } else if (minutes === "30") {
          minutes = "00";
        }
      }
    } else {
      //Прибавление 30 минут к последнему временному слоту
      let minutes = lastTimeSlot.slice(-2);
      let hours = lastTimeSlot.slice(0, 2);
      if (minutes === "00") {
        minutes = "30";
      } else if (minutes === "30") {
        minutes = "00";
        hours = `${parseInt(hours) + 1}`;
      } else return;
      newTimeSlot = `${hours.padStart(2, '0')}:${minutes}`;
    }

    map[newTimeSlot] = 30;
  }
};
</script>

<template>
  <b-spinner v-if="loading" variant="success"></b-spinner>
  <div class="insulin-profile-form-inner-wrapper" v-else>
    <h4 class="error-text" v-if="fetchingError">ОШИБКА</h4>
    <b-form class="insulin-profile-form" v-else @submit.prevent="submit">
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
            :state="getValidationState('durationOfInsulinAction')"
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
                  :state="getValidationState('defaultInsulinToCarbsRatio')"
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
                  :state="getValidationState(`ratiosByTime[${time}]`)"
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
            :label="`Фактор чувствительности к инсулину (ISF)
            [${getGlucoseUnitName(glucoseUnit)}/ед]`"
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
                  :state="getValidationState('defaultInsulinSensitivityFactor')"
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
                  :state="getValidationState(`factorsByTime[${time}]`)"
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
h4, h2 {
  text-align: center;
}

.insulin-profile-form-inner-wrapper {
  display: flex;
  align-items: center;
  flex: 1;
  padding: 1rem;

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

      @media (max-width: 1080px) {
        width: 100%;
      }
    }
  }
}
</style>
