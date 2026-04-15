<script setup lang="ts">
import {type GlucoseEntry} from '@/service/diaryService.ts'
import { type CarbsUnit } from '@/service/patientProfileService.ts'
import InfoPanelValue from '@/components/patient-view/InfoPanelValue.vue'
import { computed } from 'vue'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'
import {
  getCarbsUnitShortName,
  getGlucoseUnitName
} from '@/util/enumToStringLiterals.ts'

const props = defineProps<{
  recentGlucose: GlucoseEntry | null,
  overallDayCarbs: number | null,
  carbsUnit: CarbsUnit | null,
  activeInsulin: number | null,
}>();

const formattedDate = computed((): string | null => {
  if (props.recentGlucose) {
    const date = new Date(props.recentGlucose.commitedAt);
    return format(date, "d MMM yyyy HH:mm", {
      locale: ru
    });
  } else return null;
});

</script>

<template>
  <div class="panel-wrapper">
    <info-panel-value class="panel-item carbs-item"
                      name="Углеводы за день"
                      :value="overallDayCarbs"
                      :units="carbsUnit ? getCarbsUnitShortName(carbsUnit) : null"
    />
    <info-panel-value class="panel-item glucose-item"
                      :name="formattedDate"
                      :value="recentGlucose?.value"
                      :units="recentGlucose && recentGlucose.glucoseUnits ?
                            getGlucoseUnitName(recentGlucose.glucoseUnits) : null"
    />
    <info-panel-value class="panel-item insulin-item"
                      name="Активный инсулин"
                      :value="activeInsulin"
                      units="ЕД"
    />
  </div>
</template>

<style scoped>
.panel-wrapper {
  display: flex;
  align-items: start;
  justify-content: center;
  flex-wrap: wrap;
  border-style: solid;
  border-width: 1px;
  border-color: var(--color-background-alt);
  background-color: var(--color-background-alt-lite);
  padding: 1rem;

  .panel-item {
    margin: 1rem;
    background-color: var(--color-background-alt);
    color: white;
    padding: 1rem;
    flex: 1 0 auto;
    aspect-ratio: 1 / 1;
    box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 0.6);
  }

  .glucose-item {
    scale: 120%;
  }
}


@media (max-width: 768px) {
  .panel-wrapper {
    flex-direction: column;
    align-items: center;
  }
}
</style>
