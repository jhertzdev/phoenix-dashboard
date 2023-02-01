<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
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
          {{ getTitleFromPath(this.$route.path) }}
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

const linksList = [
  {
    title: 'Iniciar sesión',
    icon: 'login',
    to: '/'
  },
  {
    title: 'Dashboard',
    icon: 'dashboard',
    to: '/dashboard'
  },
]

const getTitleFromPath = (path) => {
  if (path == '/' || path == '/login') return 'Inicio de sesión'
  if (path == '/dashboard') return 'Dashboard'
  return 'Dashboard'
}

const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const menuLinks = linksList

</script>
