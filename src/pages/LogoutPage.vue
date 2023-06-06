<template>
  <q-page>Cerrando sesión...</q-page>
</template>

<script setup>

import { useAuthStore } from 'stores/auth.store';
const appStore = useAuthStore();
appStore.logout()
window.location = '/login';
</script>
