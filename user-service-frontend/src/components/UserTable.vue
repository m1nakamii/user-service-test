<template>
  <div class="user-table">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>ФИО</th>
          <th>Телефон</th>
          <th>Дата создания</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="user in users" 
          :key="user.id"
          @click="$emit('edit-user', user)"
          class="clickable-row"
        >
          <td>{{ user.id }}</td>
          <td>{{ user.fullName }}</td>
          <td>{{ user.phone }}</td>
          <td>{{ new Date(user.createdAt).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
    
    <div class="pagination" v-if="total > limit">
      <button 
        v-for="page in pageCount" 
        :key="page" 
        @click="$emit('page-change', page)"
        :class="{ active: currentPage === page }"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    users: {
      type: Array,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    },
    limit: {
      type: Number,
      default: 10
    }
  },
  computed: {
    pageCount() {
      return Math.ceil(this.total / this.limit);
    }
  },
  emits: ['page-change', 'edit-user']
};
</script>

<style>
.user-table {
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

.clickable-row {
  cursor: pointer;
}

.clickable-row:hover {
  background-color: #f5f5f5;
}

.pagination {
  display: flex;
  gap: 5px;
  justify-content: center;
}

.pagination button {
  padding: 5px 10px;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
}

.pagination button.active {
  background-color: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.pagination button:hover:not(.active) {
  background-color: #ddd;
}
</style>