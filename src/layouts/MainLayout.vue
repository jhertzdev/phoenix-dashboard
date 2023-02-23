<template>
  <q-layout view="lHh Lpr lFf">
    <q-header v-if="!['/login', '/registro'].includes(route.path)" elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          {{ getTitleFromPath(route.path) }}
        </q-toolbar-title>
        <template v-if="authStore.user">
          <div class="right text-align-center" style="position:relative">
            <q-btn-dropdown color="white" icon="notifications" flat size="md" dense>
              <q-list style="width: 300px; max-width: 100%;">
                <q-item v-for="notification in appStore.notifications">
                  <q-item-section>
                    <q-item-label>{{ notification.titulo }}</q-item-label>
                    <q-item-label caption>{{ notification.body }}</q-item-label>
                  </q-item-section>
                  <q-item-section side top>
                    <q-item-label caption>{{ helpers.timeAgo(notification.created_at) }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item>
                  <q-item-section class="q-py-sm">
                    <q-btn label="Marcar todas como leídas." color="primary"/>
                  </q-item-section>
                </q-item>
                <q-item v-if="!appStore.notifications.length">
                  <q-item-section>
                    <q-item-label class="q-py-md text-center text-caption">No hay notificaciones por leer.</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <q-badge color="secondary" rounded v-if="appStore.notifications.length" floating>
              {{ appStore.notifications.length }}
            </q-badge>
          </div>
          <div class="right text-align-center">
            <q-item clickable :to="'/perfil/' + authStore.user.id" class="q-px-sm">
              <q-avatar>
                <img src="/avatar.png">
              </q-avatar>
            </q-item>
          </div>
        </template>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered v-if="!['/login', '/registro'].includes(route.path)">
      <q-list>
        <q-item-label header>
          Menú
        </q-item-label>

        <MenuLink v-for="link in menuLinks" :key="link.title" v-bind="link" v-show="!!authStore.user?.id" />
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
import helpers from '../helpers/app.js'

const authStore = useAuthStore()
const appStore = useAppStore()

const route = useRoute()

const links = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    to: '/'
  },
  {
    title: 'Usuarios',
    icon: 'groups',
    to: '/users',
    allowedRoles: ['admin']
  },
  {
    title: 'Categorías',
    icon: 'category',
    to: '/categorias'
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
.right {
  float: right !important
}

.text-align-center {
  text-align: center !important;
}

.q-header .q-btn-dropdown__arrow {
  display: none;
}
</style>
