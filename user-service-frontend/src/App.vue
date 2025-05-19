<template>
  <div class="app">
    <h1>Управление пользователями</h1>

    <button @click="openCreateModal" class="add-button">Добавить пользователя</button>

    <user-modal 
      v-if="showModal"
      :user="currentUser"
      @close="closeModal"
      @save="saveUser"
    />

    <user-table 
      :users="users" 
      :total="total"
      :current-page="currentPage"
      @page-change="changePage"
      @edit-user="editUser"
      @show-info="showUserInfo"
    />

    <user-info-modal
      v-if="showInfoModal"
      :user="infoUser"
      @close="closeInfoModal"
    />

    <div class="chart-container">
      <h2>График новых пользователей по дням</h2>
      <line-chart v-if="chartData" :chart-data="chartData" />
    </div>
  </div>
</template>

<script>
import { useQuery, useMutation, useSubscription } from '@vue/apollo-composable';
import { ref, computed, watch } from 'vue';
import UserModal from './components/UserModal.vue';
import UserTable from './components/UserTable.vue';
import UserInfoModal from './components/UserInfoModal.vue';
import LineChart from './components/LineChart.vue';
import { GET_USERS, CREATE_USER, UPDATE_USER, GET_DAILY_USER_STATS, USER_CHANGED_SUBSCRIPTION } from './graphql/queries';

export default {
  components: {
    UserModal,
    UserTable,
    UserInfoModal,
    LineChart
  },
  setup() {
    const showModal = ref(false);
    const currentUser = ref(null);
    const currentPage = ref(1);
    const limit = 10;

    const showInfoModal = ref(false);
    const infoUser = ref(null);

    const { result: paginatedResult, refetch: refetchPaginated } = useQuery(GET_USERS, {
      page: currentPage.value,
      limit
    });

    const { result: statsResult, refetch: refetchStats } = useQuery(GET_DAILY_USER_STATS);

    const { result: subscriptionResult, error: subscriptionError } = useSubscription(USER_CHANGED_SUBSCRIPTION);

    watch(subscriptionError, (error) => {
      if (error) {
        console.error('Subscription error:', error);
      }
    });

    watch(subscriptionResult, (newVal) => {
      if (newVal?.userChanged) {
        refetchPaginated({ page: currentPage.value, limit });
        refetchStats();
      }
    });

    const users = computed(() => paginatedResult.value?.users?.list || []);
    const total = computed(() => paginatedResult.value?.users?.totalUsers || 0);

    const chartData = computed(() => {
      const stats = statsResult.value?.dailyUserStats || [];

      const labels = stats.map(item => item.date);
      const counts = stats.map(item => item.count);

      return {
        labels,
        datasets: [
          {
            label: 'Новые пользователи',
            data: counts,
            borderColor: '#42A5F5',
            backgroundColor: 'rgba(66, 165, 245, 0.2)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#1e88e5'
          }
        ]
      };
    });

    const { mutate: createUser } = useMutation(CREATE_USER);
    const { mutate: updateUser } = useMutation(UPDATE_USER);

    const openCreateModal = () => {
      currentUser.value = null;
      showModal.value = true;
    };

    const editUser = (user) => {
      currentUser.value = { ...user };
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      currentUser.value = null;
    };

    const saveUser = async (userData) => {
      try {
        if (currentUser.value) {
          const cleanData = {
            id: currentUser.value.id,
            fullName: userData.fullName,
            phone: userData.phone
          };
          await updateUser({ id: cleanData.id, data: cleanData });
        } else {
          await createUser({ data: userData });
        }

        await refetchPaginated({ page: currentPage.value, limit });
        await refetchStats();
        closeModal();
      } catch (error) {
        console.error('Ошибка при сохранении:', error);
      }
    };

    const changePage = (page) => {
      currentPage.value = page;
      refetchPaginated({ page, limit });
    };

    watch(currentPage, (newPage) => {
      refetchPaginated({ page: newPage, limit });
    });

    // Открыть модальное окно с информацией
    const showUserInfo = (user) => {
      infoUser.value = user;
      showInfoModal.value = true;
    };

    const closeInfoModal = () => {
      showInfoModal.value = false;
      infoUser.value = null;
    };

    return {
      showModal,
      users,
      total,
      currentPage,
      currentUser,
      openCreateModal,
      editUser,
      closeModal,
      saveUser,
      changePage,
      chartData,
      showInfoModal,
      infoUser,
      showUserInfo,
      closeInfoModal
    };
  }
};
</script>

<style>
.app {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.add-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}

.add-button:hover {
  background-color: #45a049;
}

.chart-container {
  margin-top: 40px;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
</style>