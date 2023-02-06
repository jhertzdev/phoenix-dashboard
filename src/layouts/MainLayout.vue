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

        <div v-if="authStore.user" class="right text-align-center">
          <q-item clickable :to="'/perfil/'+authStore.user.id">
            <q-avatar>
              <img src="/avatar.png">
            </q-avatar>
          </q-item>
        </div>

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
          v-show="!!authStore.user?.id"
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
import { useAppStore } from 'src/stores/app.store';

const authStore = useAuthStore()

const route = useRoute()

const linksList = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    to: '/'
  },
  {
    title:'Usuarios',
    icon:'groups',
    to:'/users'
  },
  {
    title: 'Clientes',
    icon: 'dashboard',
    to: '/clientes'
  },
  {
    title: 'Contadores',
    icon: 'dashboard',
    to: '/contadores'
  },
  {
    title: 'Ingresos',
    icon: 'dashboard',
    to: '/ingresos'
  },
  {
    title: 'Reportes',
    icon: 'dashboard',
    to: '/reportes'
  },
  {
    title: 'Gastos',
    icon: 'dashboard',
    to: '/gastos'
  },
  {
    title: 'Ingresos',
    icon: 'dashboard',
    to: '/users'
  },
  {
    title: 'Salir',
    icon: 'logout',
    to: '/logout'
  }
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

<style>
  .right{
    float:right !important
  }
  .text-align-center{
    text-align:center !important;
  }
</style>
