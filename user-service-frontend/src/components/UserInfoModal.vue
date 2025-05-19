<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal">
      <h2>Информация о пользователе</h2>
      <p><strong>ФИО:</strong> {{ user.fullName }}</p>
      <p><strong>Телефон:</strong> {{ user.phone }}</p>
      <button @click="close" class="close-btn">Закрыть</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  methods: {
    close() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal {
  background: white;
  padding: 20px;
  border-radius: 6px;
  width: 320px;
  max-width: 90%;
}
.close-btn {
  margin-top: 20px;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  background-color: #2196F3;
  color: white;
  cursor: pointer;
}
.close-btn:hover {
  background-color: #1976D2;
}
</style>