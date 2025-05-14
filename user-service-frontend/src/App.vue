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
  </div>
</template>

<script>
import { useQuery, useMutation } from '@vue/apollo-composable';
import { GET_USERS, CREATE_USER, UPDATE_USER } from './graphql/queries';
import { ref, computed } from 'vue';
import UserModal from './components/UserModal.vue';
import UserTable from './components/UserTable.vue';

export default {
  components: {
    UserModal,
    UserTable
  },
  setup() {
    const showModal = ref(false);
    const currentUser = ref(null);
    const currentPage = ref(1);
    const limit = 10;

    const { result, refetch } = useQuery(GET_USERS, {
      page: currentPage.value,
      limit: limit
    });

    const users = computed(() => result.value?.users?.list || []);
    const total = computed(() => result.value?.users?.totalUsers || 0);

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
          const cleanUserData = {
            id: currentUser.value.id,
            fullName: userData.fullName,
            phone: userData.phone
          };

          await updateUser({
            id: currentUser.value.id,
            data: cleanUserData
          });
        } else {
          await createUser({ data: userData });
        }

        await refetch({
          page: currentPage.value,
          limit: limit
        });

        closeModal();
      } catch (error) {
        console.error('ОШИБКА ПРИ СОХРАНЕНИИ ПОЛЬЗОВАТЕЛЯ:', error);
      }
    };

    const changePage = (page) => {
      currentPage.value = page;
      refetch({
        page: currentPage.value,
        limit: limit
      });
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
      changePage
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
