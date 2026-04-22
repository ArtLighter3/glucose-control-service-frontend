<script setup lang="ts">
import { ref } from 'vue'
import { BSpinner, BButton, BPagination } from 'bootstrap-vue-next'
import { watch } from 'vue'
import SearchField from '@/components/SearchField.vue'
import { useUsersFetching } from '@/composables/fetching/useUsersFetching.ts'
import type { UserDetailedInfo } from '@/service/userService.ts'
import UsersList from '@/components/admin-view/UsersList.vue'
import UserSettingsWithTabs from '@/components/admin-view/UserSettingsWithTabs.vue'

// const props = defineProps<{
//   doctorId: string,
// }>();

// onMounted(async () => {
//   await getPatients();
// });

const { loading, users, page, totalElements, pageSize, search }
  = useUsersFetching();

const currentQuery = ref('');

watch((page), async (newPage) => {
  await search(currentQuery.value);
});

const showUserInfo = ref(false);
const userDetailedInfo = ref<UserDetailedInfo | null>(null);
const openUserInfo = (clickedUserInfo: UserDetailedInfo) => {
  userDetailedInfo.value = clickedUserInfo;
  showUserInfo.value = true;
};
const closeUserInfo = () => {
  showUserInfo.value = false;
};

</script>

<template>
  <div v-if="showUserInfo" class="back-nav-link">
    <b-button variant="success" class="circular-btn" size="lg" @click="closeUserInfo">
      <img src="@/assets/icons/back-arrow.svg" alt="Назад" />
    </b-button>
  </div>
  <div v-if="!showUserInfo" class="users-list-wrapper">
    <search-field
      class="align-center"
      :loading="false"
      @search="currentQuery = $event; search($event)"
    />
    <b-spinner v-if="loading" variant="success" />
    <users-list v-else
      @user:click="openUserInfo($event)"
      :users="users"
    />
    <b-pagination v-if="totalElements > pageSize"
      class="pages-wrapper"
      v-model="page"
      :total-rows="totalElements"
      :per-page="pageSize"
      size="lg"
      align="center"
    />
  </div>
  <div v-else class="user-info-outer-wrapper">
    <user-settings-with-tabs
      v-if="userDetailedInfo !== null"
      :user-detailed-info="userDetailedInfo"
      @user:deleted="closeUserInfo(); search(currentQuery)"
    />
  </div>
</template>

<style scoped>
.users-list-wrapper {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;

  .align-center {
    align-self: center;
    border-color: var(--color-background-alt);
  }

  @media (max-width: 768px) {
    padding-left: 4.32rem;
    padding-right: 2rem;
  }

}

.user-info-outer-wrapper {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
      padding-left: 4rem;
  }
}

.back-nav-link {
  position: fixed;
  bottom: 100px;
  right: 100px;
  z-index: 999;

  @media (max-width: 768px) {
    right: 50px;
    bottom: 100px;
  }
}
</style>
