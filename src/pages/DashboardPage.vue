<template>
  <q-page class="flex column flex-center">
    <div class="user-avatar">
      <q-icon name="face_6" />
    </div>
    <div v-if="authStore.user">
      Bienvenido, <strong>{{ authStore.user.name }}</strong>
    </div>
  </q-page>
</template>

<style>
.user-avatar{ 
  color: var(--q-secondary);
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 1.5rem;
  font-size: 5rem;
}
</style>

<script setup>

import { useAuthStore } from 'src/stores/auth.store';

const authStore = useAuthStore()

</script>
