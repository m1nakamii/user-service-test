<template>
  <div class="modal-overlay">
    <div class="modal">
      <h2>{{ user ? 'Редактировать пользователя' : 'Добавить пользователя' }}</h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="fullName">ФИО:</label>
          <input 
            id="fullName" 
            v-model="form.fullName" 
            type="text" 
            required
          >
        </div>
        
        <div class="form-group">
          <label for="phone">Телефон:</label>
          <input 
            id="phone" 
            v-model="form.phone" 
            type="tel" 
            required
          >
        </div>
        
        <div class="buttons">
          <button type="button" @click="close" class="cancel">Отмена</button>
          <button type="submit" class="save">{{ user ? 'Обновить' : 'Сохранить' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      form: {
        fullName: '',
        phone: ''
      }
    };
  },
  watch: {
    user: {
      immediate: true,
      handler(val) {
        if (val) {
          this.form = { ...val };
        } else {
          this.form = { fullName: '', phone: '' };
        }
      }
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    handleSubmit() {
      this.$emit('save', { ...this.form });
    }
  }
};
</script>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
  max-width: 90%;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.buttons button {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save {
  background-color: #4CAF50;
  color: white;
}

.save:hover {
  background-color: #45a049;
}

.cancel {
  background-color: #f44336;
  color: white;
}

.cancel:hover {
  background-color: #d32f2f;
}
</style>