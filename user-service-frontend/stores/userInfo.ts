import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserInfoStore = defineStore('userInfo', () => {
  const selectedUser = ref(null);

  const setUser = (user) => {
    selectedUser.value = user;
  };

  const clearUser = () => {
    selectedUser.value = null;
  };

  return {
    selectedUser,
    setUser,
    clearUser
  };
});