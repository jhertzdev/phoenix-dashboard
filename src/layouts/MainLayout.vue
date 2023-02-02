<template>
  <q-layout view="lHh Lpr lFf">
    <q-header v-if="!['/login'].includes(this.$route.path)" elevated>
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
    to: '/login'
  },
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
