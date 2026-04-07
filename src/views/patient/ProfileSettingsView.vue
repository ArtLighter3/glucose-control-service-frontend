<script setup lang="ts">

import PatientProfileFormContent from '@/components/patient-view/PatientProfileFormContent.vue'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { BTabs, BTab } from 'bootstrap-vue-next'
import UserInfoFormContent from '@/components/patient-view/UserInfoFormContent.vue'
import IntegrationProfileFormContent
  from '@/components/patient-view/IntegrationProfileFormContent.vue'

const id = ref(useRoute().params.id as string);

</script>

<template>
  <div class="settings-view-wrapper">
    <b-tabs pills class="tabs-wrapper" justified>
      <b-tab title="Основные" active>
        <patient-profile-form-content :patientId="id"/>
      </b-tab>
      <b-tab title="Аккаунт" lazy>
        <user-info-form-content :patient-id="id"/>
      </b-tab>
      <b-tab title="Интеграция" lazy>
        <integration-profile-form-content :patient-id="id"/>
      </b-tab>
    </b-tabs>

  </div>
</template>

<style scoped>
.settings-view-wrapper {
  display: flex;
  justify-content: center;
  align-items: start;
  padding: 2rem;

  .tabs-wrapper {
    flex-grow: 1;
  }

  @media(max-width: 768px) {
    padding-left: 4rem;
    padding-right: 1rem;
  }
}

:deep(.nav-link) {
  border-radius: 0;
  color: var(--color-text);

  &.active {
    background-color: var(--color-background-alt);
  }
}

</style>

