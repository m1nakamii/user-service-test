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
    />

    <h2>График новых пользователей по дням</h2>
    <line-chart :chart-data="chartData" />
  </div>
</template>

<script>
import { useQuery, useMutation } from '@vue/apollo-composable';
import { ref, computed, watch } from 'vue';
import UserModal from './components/UserModal.vue';
import UserTable from './components/UserTable.vue';
import LineChart from './components/LineChart.vue';
import { GET_USERS, GET_ALL_USERS, CREATE_USER, UPDATE_USER } from './graphql/queries';

export default {
  components: {
    UserModal,
    UserTable,
    LineChart
  },
  setup() {
    const showModal = ref(false);
    const currentUser = ref(null);
    const currentPage = ref(1);
    const limit = 10;

    const { result: paginatedResult, refetch: refetchPaginated } = useQuery(GET_USERS, {
      page: currentPage.value,
      limit
    });

    const users = computed(() => paginatedResult.value?.users?.list || []);
    const total = computed(() => paginatedResult.value?.users?.totalUsers || 0);

    const { result: allUsersResult, refetch: refetchAllUsers } = useQuery(GET_ALL_USERS);

    const chartData = computed(() => {
      const allUsers = allUsersResult.value?.users?.list || [];
      const dateMap = new Map();
      allUsers.forEach(user => {
        const date = new Date(user.createdAt).toISOString().slice(0, 10);
        dateMap.set(date, (dateMap.get(date) || 0) + 1);
      });

      const labels = Array.from(dateMap.keys()).sort();
      const counts = labels.map(date => dateMap.get(date));

      return {
        labels,
        datasets: [
          {
            label: 'Новые пользователи',
            data: counts,
            borderColor: '#42A5F5',
            backgroundColor: 'rgba(66, 165, 245, 0.2)',
            tension: 0.4
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
        await refetchAllUsers();
        closeModal();
      } catch (error) {
        console.error('Ошибка при сохранении:', error);
      }
    };

    const changePage = (page) => {
      currentPage.value = page;
      refetchPaginated({ page: page, limit });
    };

    watch(currentPage, (newPage) => {
      refetchPaginated({ page: newPage, limit });
    });

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
      chartData
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
</style>