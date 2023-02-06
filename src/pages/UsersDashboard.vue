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
            <q-avatar color="primary" text-color="white">
              {{ user.letter }}
            </q-avatar>
            <q-badge class="user-role" color="secondary">{{ user.rol.name }}</q-badge>
          </q-item-section>
  
          <q-item-section>
            <q-item-label> {{ user.name }}</q-item-label>
            <q-item-label caption lines="1">{{ user.email }}</q-item-label>
          </q-item-section>
  
          <q-item-section side>
            <q-btn-dropdown color="primary" padding="xs">
              <q-list>
                <q-item clickable v-close-popup :to="`/perfil/${user.id}`">
                  <q-item-section>
                    <q-item-label>Editar perfil</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
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

<style>
.q-item__section--avatar {
  position: relative;
}
.q-badge.user-role {
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(calc(-50% - 8px));
  text-transform: uppercase;
  font-size: 70%;
  font-weight: 600;
}
</style>

<script setup>

import { ref, watch, onMounted } from 'vue'
import { api } from 'src/boot/axios';

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
  api.get('users?page=' + currentPage.value).then(response => {
    console.log(response);
    if (response.data?.data) {
      users.value = response.data.data
      users.value.map(user => {
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
