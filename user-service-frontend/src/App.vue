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
import UserModal from './components/UserModal.vue';
import UserTable from './components/UserTable.vue';
import axios from 'axios';

export default {
  components: {
    UserModal,
    UserTable
  },
  data() {
    return {
      showModal: false,
      users: [],
      total: 0,
      currentPage: 1,
      limit: 10,
      currentUser: null
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get('http://localhost:3000/users', {
          params: {
            page: this.currentPage,
            limit: this.limit
          }
        });
        this.users = response.data.users;
        this.total = response.data.total;
      } catch (error) {
        console.error('Ошибка при загрузке пользователей:', error);
      }
    },
    openCreateModal() {
      this.currentUser = null;
      this.showModal = true;
    },
    editUser(user) {
      this.currentUser = { ...user };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.currentUser = null;
    },
    async saveUser(userData) {
      try {
        if (this.currentUser) {
          await axios.patch(`http://localhost:3000/users/${this.currentUser.id}`, userData);
        } else {
          await axios.post('http://localhost:3000/users', userData);
        }
        this.fetchUsers();
        this.closeModal();
      } catch (error) {
        console.error('Ошибка при сохранении пользователя:', error);
      }
    },
    changePage(page) {
      this.currentPage = page;
      this.fetchUsers();
    }
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