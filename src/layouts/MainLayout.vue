<template>
  <q-layout view="lHh Lpr lFf">
    <q-header v-if="!['/login', '/registro'].includes(route.path)" elevated>
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
      v-if="!['/login', '/registro'].includes(route.path)"
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

const authStore = useAuthStore()

const route = useRoute()

const links = [
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
    title:'Categorías',
    icon:'category',
    to:'/categorias'
  },
  {
    title: 'Clientes',
    icon: 'person',
    to: '/clientes',
    allowedRoles: ['contador']
  },
  {
    title: 'Contadores',
    icon: 'work',
    to: '/contadores',
    allowedRoles: ['cliente']
  },
  {
    title: 'Bancos',
    icon: 'account_balance',
    to: '/bancos',
  },
  {
    title: 'Cuentas',
    icon: 'account_balance_wallet',
    to: '/cuentas',
  },
  {
    title: 'Movimientos',
    icon: 'ssid_chart',
    to: '/movimientos'
  },
  {
    title: 'Reportes',
    icon: 'data_usage',
    to: '/reportes'
  },
  {
    title: 'Salir',
    icon: 'logout',
    to: '/logout'
  }
]

const linksList = []
links.forEach(link => {
  if (link.allowedRoles === undefined) linksList.push(link)
  if (link.allowedRoles !== undefined && link.allowedRoles.includes(authStore.user?.role_name)) linksList.push(link)
});

const getTitleFromPath = (path) => {
  if (path == '/') return 'Dashboard'
  if (path == '/clientes' || path.startsWith('/clientes')) return 'Clientes'
  if (path == '/categorias' || path.startsWith('/categorias')) return 'Categorías'
  if (path == '/contadores' || path.startsWith('/contadores')) return 'Contadores'
  if (path == '/bancos' || path.startsWith('/bancos')) return 'Bancos'
  if (path == '/cuentas' || path.startsWith('/cuentas')) return 'Cuentas'
  if (path == '/reportes' || path.startsWith('/reportes')) return 'Reportes'
  if (path == '/movimientos' || path.startsWith('/movimientos')) return 'Movimientos'
  if (path == '/users' || path.startsWith('/users')) return 'Usuarios'
  if (path == '/login') return 'Inicio de sesión'
  if (path == '/registro') return 'Registro de usuario'
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
