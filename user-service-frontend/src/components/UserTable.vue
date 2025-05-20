<template>
  <div class="user-table">
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>ФИО</th>
            <th>Телефон</th>
            <th>Дата создания</th>
            <th class="icon-header"></th>
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
            <td class="icon-cell">
              <img 
                src="@/assets/user.png"
                alt="Инфо"
                width="20"
                height="20"
                class="info-icon"
                @click.stop="goToUserPage(user)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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
    users: Array,
    total: Number,
    currentPage: Number,
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
  emits: ['page-change', 'edit-user', 'show-info'],
  methods: {
    goToUserPage(user) {
      if (this.$router) {
        this.$router.push({
          name: 'UserInfo',
          params: { 
            id: user.id,
          }
        })
      } else {
        console.error('Router is not available')
        window.location.href = `/user/${user.id}`
      }
    }
  }
};
</script>

<style>
.user-table {
  margin-top: 20px;
}

.table-wrapper {
  position: relative;
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

.icon-header {
  width: 40px;
}

.icon-cell {
  padding: 8px 4px;
  text-align: center;
}

.info-icon {
  cursor: pointer;
  vertical-align: middle;
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