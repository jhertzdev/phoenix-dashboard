<template>
  <q-page class="flex column flex-center">
    <div class="user-avatar">
      <q-icon name="face_6" />
    </div>
    <div v-if="username.length">
      Bienvenido, <strong>@{{ username }}</strong>
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

import { useQuasar } from 'quasar';
const $q = useQuasar()

const username = $q.localStorage.getItem('username')

</script>
