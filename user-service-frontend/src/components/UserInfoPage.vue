<template>
  <div class="user-info-page">
    <h2>Информация о пользователе</h2>
    <p><strong>ID:</strong> {{ user.id }}</p>
    <p><strong>ФИО:</strong> {{ user.fullName }}</p>
    <p><strong>Телефон:</strong> {{ user.phone }}</p>
    <p><strong>Дата создания:</strong> {{ formatDate(user.createdAt) }}</p>
    <button @click="goBack" class="back-btn">Назад</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {}
    }
  },
  created() {
    this.fetchUserData()
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString()
    },
    fetchUserData() {
      this.user = this.$route.params.userData || {}
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.user-info-page {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.back-btn {
  margin-top: 20px;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  background-color: #2196F3;
  color: white;
  cursor: pointer;
}

.back-btn:hover {
  background-color: #1976D2;
}
</style>