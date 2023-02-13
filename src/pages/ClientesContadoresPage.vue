<template>
  <q-page class="flex column flex-center q-pa-md" v-if="isLoading">
    <q-spinner color="primary" size="3em" />
  </q-page>
  <template v-else>
    <q-page class="flex column flex-center q-pa-md" v-if="!users.length">
      <p>No se han encontrado usuarios.</p>
      <q-btn color="primary" @click="retryFetchUsers">Volver a intentar</q-btn>
    </q-page>
    <q-page class="flex column q-pa-md" v-else>
      <q-list bordered>
        <q-item v-for="user in users" :key="user.id" class="q-my-sm">
          <q-item-section avatar>
            <q-skeleton type="circle" v-if="!user.letter"/>
            <q-avatar color="primary" text-color="white" v-else>
              {{ user.letter }}
            </q-avatar>
          </q-item-section>
  
          <q-item-section>
            <q-item-label>
              <q-skeleton type="text" v-if="!user.name"/>
              <span v-else>{{ user.name }}</span>
            </q-item-label>
            <q-item-label caption lines="1">
              <q-skeleton type="text" v-if="!user.email"/>
              <span v-else>{{ user.email }}</span>
            </q-item-label>
          </q-item-section>
  
        </q-item>
      </q-list>
      <div class="q-pa-lg flex flex-center">
        <q-pagination
          v-model="currentPage"
          :max="maxPages"
          :max-pages="6"
          :boundary-numbers="false"
        />
      </div>
    </q-page>
  </template>
</template>

<script setup>

import { ref, watch, onMounted } from 'vue'
import { api } from 'src/boot/axios';
import { useAuthStore } from 'src/stores/auth.store';

const authStore = useAuthStore()

const users = ref([])
const isLoading = ref(true)

const currentPage = ref(1)
const maxPages = ref(0)

watch(currentPage, () => {
  fetchUsers()
})

const retryFetchUsers = () => {
  if (currentPage.value !== 1) currentPage.value = 1
  else fetchUsers()
}

function fetchUsers() {
  isLoading.value = true
  let endpoint;

  if (authStore.user?.role_name == 'contador') {
    endpoint = 'contador_clientes?contador_id=' + authStore.user.id + '&with[]=user'
  } else if (authStore.user?.role_name == 'cliente') {
    endpoint = 'contador_clientes?user_id=' + authStore.user.id + '&with[]=contador'
  }

  api.get(endpoint + '&page=' + currentPage.value).then(response => {
    if (response.data?.data) {
      console.log(endpoint, response.data.data);
      users.value = response.data.data.map(u => {
        let user
        if (authStore.user?.role_name == 'contador') { user = u.user }
        if (authStore.user?.role_name == 'cliente') { user = u.contador }
        user.letter = user.name.slice(0, 1).toUpperCase()
        return user
      })
    }
    if (response.data?.pagination) {
      maxPages.value = response.data.pagination.lastPage
    }
  }).finally(() => isLoading.value = false)
}

onMounted(() => { fetchUsers() })

</script>
