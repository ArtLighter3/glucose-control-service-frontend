<script setup lang="ts">

import { CarbsUnit, GlucoseUnit } from '@/service/patientProfileService.ts'
import {
  getCarbsUnitName,
  getCarbsUnitShortName,
  getGlucoseUnitName
} from '@/util/enumToStringLiterals.ts'
import {
  BButton,
  BCard,
  BForm, BFormCheckbox,
  BFormGroup,
  BFormInput, BFormInvalidFeedback
} from 'bootstrap-vue-next'
import FormTransitionGroup from '@/components/FormTransitionGroup.vue'
import { useInsulinCalculation } from '@/composables/fetching/useInsulinCalculation.ts'
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{
  patientId: string,
  unchangeableCarbs?: number,
  carbsUnit: CarbsUnit,
  glucoseUnit: GlucoseUnit,
}>();

const { calculationData, calculate, calculating, success,
  fieldErrors, objectErrors, getValidationState,
  calculationResult } = useInsulinCalculation(props.patientId);

const showDetails = ref(false);

onMounted(() => {
  if (props.unchangeableCarbs !== undefined)
    calculationData.value.carbs = props.unchangeableCarbs;
});

watch((calculationData.value), () => {
  success.value = false;
});

</script>

<template>
  <form-transition-group>
  <b-form class="insulin-calc-form" key="form" @submit.prevent="calculate">
        <span v-for="(objectError, index) in objectErrors" :key="`error-${index}`"
              class="error-text">{{ objectError }}</span>
      <b-form-group key="carbs" id="carbs"
                    class="form-group-inner"
                    :label="`Принимаемые углеводы [${getCarbsUnitShortName(carbsUnit)}]`"
                    label-for="carbs-input"
                    :disabled="unchangeableCarbs !== undefined"
                    :state="getValidationState('carbs')">
        <b-form-input class="squared-input-field"
                      id="carbs-input" type="number"
                      v-model="calculationData.carbs"/>
        <b-form-invalid-feedback>
                    <span v-for="(message, index) in fieldErrors.carbs" :key="index">
                      {{ message }}
                    </span>
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group key="correction" id="correction"
                    class="form-group-inner"
                    label="Коррекция [ед]"
                    label-for="correction-input"
                    :state="getValidationState('correction')">
        <b-form-input class="squared-input-field"
                      id="correction-input" type="number"
                      v-model="calculationData.correction"/>
        <b-form-invalid-feedback>
                    <span v-for="(message, index) in fieldErrors.correction" :key="index">
                      {{ message }}
                    </span>
        </b-form-invalid-feedback>
      </b-form-group>
        <b-form-group key="correct-glucose-level" id="correct-glucose-level"
                      class="form-group-inner"
                      :state="getValidationState('correctGlucoseLevel')">
          <b-form-checkbox id="correct-glucose-level-checkbox"
                           value="true" unchecked-value="false"
                           v-model="calculationData.correctGlucoseLevel"
          >
            Понизить уровень глюкозы до целевого диапазона
          </b-form-checkbox>
          <b-form-invalid-feedback>
                    <span v-for="(message, index) in fieldErrors.correctGlucoseLevel" :key="index">
                      {{ message }}
                    </span>
          </b-form-invalid-feedback>
        </b-form-group>
      <b-form-group key="glucose" id="glucose"
                    class="form-group-inner"
                    :label="`Текущий уровень глюкозы [${getGlucoseUnitName(glucoseUnit)}]`"
                    label-for="glucose-input"
                    :disabled="!calculationData.correctGlucoseLevel"
                    :state="getValidationState('glucose')">
          <b-form-input class="squared-input-field"
                        id="glucose-input" type="number"
                        key="glucose-input"
                        v-model="calculationData.glucose"/>
          <b-form-invalid-feedback>
                      <span v-for="(message, index) in fieldErrors.glucose" :key="index">
                        {{ message }}
                      </span>
          </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group key="consider-active-insulin" id="consider-active-insulin"
                    class="form-group-inner"
                    :state="getValidationState('considerActiveInsulin')">
        <b-form-checkbox id="consider-active-insulin-checkbox"
                         value="true" unchecked-value="false"
                         v-model="calculationData.considerActiveInsulin"
        >
          Учитывать ранее введенный инсулин (по записям ввода инсулина)
        </b-form-checkbox>
        <b-form-invalid-feedback>
                    <span v-for="(message, index) in fieldErrors.considerActiveInsulin"
                          :key="index">
                      {{ message }}
                    </span>
        </b-form-invalid-feedback>
      </b-form-group>
    <b-button class="calculate-btn"
              variant="outline-success"
              type="submit"
              :loading="calculating"
              loading-fill
              squared
              size="lg">
      Рассчитать
    </b-button>
  </b-form>
  <div v-if="success && calculationResult !== null" class="calculation-result" key="result">
    <b-card>
      <span class="result-value">{{ calculationResult.result }} ед</span>
    </b-card>
    <span class="show-details-text" @click="showDetails = !showDetails">
      {{ showDetails ? "Скрыть детали" : "Показать детали" }}
    </span>
    <div v-if="showDetails" class="details" key="details">
      <div class="detail-item" key="carbs-detail">
        <span class="detail-item-name">Углеводы: </span>
        <span class="detail-item-value">{{ calculationResult.carbs }}
          {{ getCarbsUnitShortName(calculationResult.carbsUnit) }}
          (ICR: {{ calculationResult.insulinToCarbsRatio }}
          {{ getCarbsUnitShortName(calculationResult.carbsUnit) }})
        </span>
      </div>
      <div class="detail-item" key="carbs-insulin-detail">
        <span class="detail-item-name">Компенсирование углеводов: </span>
        <span class="detail-item-value">{{ calculationResult.carbsInsulin }} ед</span>
      </div>
      <div class="detail-item" key="glucose-detail">
        <span class="detail-item-name">Глюкоза: </span>
        <span class="detail-item-value">{{ calculationResult.glucose }}
          {{ getGlucoseUnitName(calculationResult.glucoseUnit) }}
          (ISF: {{ calculationResult.insulinSensitivityFactor }}
          {{ getGlucoseUnitName(calculationResult.glucoseUnit) }}/ед)
        </span>
      </div>
      <div class="detail-item" key="corr-insulin-detail">
        <span class="detail-item-name">Корректирование глюкозы: </span>
        <span class="detail-item-value">{{ calculationResult.correctionInsulin }} ед</span>
      </div>
      <div class="detail-item" key="iob-detail">
        <span class="detail-item-name">Активный инсулин: </span>
        <span class="detail-item-value">{{ calculationResult.activeInsulin }} ед</span>
      </div>
    </div>
  </div>
  </form-transition-group>
</template>

<style scoped>
  .insulin-calc-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    flex: 1;
    padding-left: 2rem;
    padding-right: 2rem;

    .calculate-btn {
      margin-top: 1rem;
    }

    .form-group-inner {
      width: 100%;
      margin-top: 1.1rem;
    }

  }

  .calculation-result {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;

    .result-value {
      font-size: 3rem;

      @media (max-width: 768px) {
        font-size: 2rem;
      }
    }

    .show-details-text {
      margin-top: 1rem;
      cursor: pointer;
    }

    .details {
      margin-top: 1rem;
      display: flex;
      flex-direction: column;

      .detail-item {
        display: flex;
        justify-content: space-between;
      }
    }
  }

</style>
