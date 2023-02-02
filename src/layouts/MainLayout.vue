<template>
  <q-layout view="lHh Lpr lFf">
    <q-header v-if="!['/login'].includes(route.path)" elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          {{ getTitleFromPath(route.path) }}
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Menú
        </q-item-label>

        <MenuLink
          v-for="link in menuLinks"
          :key="link.title"
          v-bind="link"
        />
        <MenuLink key="logLink" 
          :icon="authStore.user.id ? 'logout' : 'login'" 
          :to="authStore.user.id ? '/logout' : '/login'" 
          :title="authStore.user.id ? 'Cerrar sesión' : 'Iniciar sesión' "
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>

import { ref } from 'vue'
import MenuLink from 'src/components/MenuLink.vue'
import { useRoute } from 'vue-router';
import { useAuthStore } from 'src/stores/auth.store';

const authStore = useAuthStore()

const route = useRoute()

const linksList = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    to: '/'
  },
]

const getTitleFromPath = (path) => {
  if (path == '/') return 'Dashboard'
  if (path == '/login') return 'Inicio de sesión'
  return 'Dashboard'
}

const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const menuLinks = linksList

</script>
