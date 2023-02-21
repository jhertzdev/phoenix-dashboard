<template>
  <q-page class="flex column flex-center q-pa-md" v-if="isLoading">
    <q-spinner color="primary" size="3em" />
  </q-page>
  <template v-else>
    <q-page class="flex column flex-center q-pa-md" v-if="!users.length">
      <p>No se han encontrado usuarios.</p>
      <q-btn color="primary" @click="retryFetchUsers">Volver a intentar</q-btn>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="add" color="secondary" label="Solicitar" @click="handleClickSolicitar()" />
      </q-page-sticky>
    </q-page>
    <q-page class="flex column q-pa-md" v-else>
      <q-list bordered>
        <q-item v-for="solicitud in users" :key="solicitud.id" class="q-my-sm">
          <q-item-section avatar>
            <q-skeleton type="circle" v-if="!solicitud.letter"/>
            <q-avatar color="primary" text-color="white" v-else>
              {{ solicitud.letter }}
            </q-avatar>
          </q-item-section>
  
          <q-item-section>
            <q-item-label>
              <q-skeleton type="text" v-if="!solicitud.data.name"/>
              <span v-else>{{ solicitud.data.name }}</span>
            </q-item-label>
            <q-item-label caption lines="1">
              <q-skeleton type="text" v-if="!solicitud.data.email"/>
              <span v-else>{{ solicitud.data.email }}</span>
            </q-item-label>
          </q-item-section>

          <q-btn color="secondary" padding="xs" icon="link_off" 
            v-if="solicitud.accept_client && solicitud.accept_contador" 
            @click="handleDeleteSolicitud(solicitud.id, 'unlink')"
          />

          <q-btn-dropdown color="primary" padding="xs" v-else-if="
            (authStore.user.role_name == 'contador' && !solicitud.accept_contador) ||
            (authStore.user.role_name == 'cliente' && !solicitud.accept_client)
          ">
            <q-list>
              <q-item clickable v-close-popup @click="handleAcceptSolicitud(solicitud.id)">
                <q-item-section avatar>
                  <q-avatar icon="check"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Aceptar solicitud</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="handleDeleteSolicitud(solicitud.id, 'reject')">
                <q-item-section avatar>
                  <q-avatar icon="delete"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Rechazar solicitud</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>

          <q-btn color="primary" padding="xs" icon="hourglass_bottom" v-else @click="handleDeleteSolicitud(solicitud.id, 'cancel')"/>
  
        </q-item>
      </q-list>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="add" color="secondary" label="Solicitar" @click="handleClickSolicitar()" />
      </q-page-sticky>
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
import DialogSelectUsers from 'src/components/DialogSelectUsers.vue';
import { useQuasar } from 'quasar';

const $q = useQuasar()
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
        if (authStore.user?.role_name == 'contador') { u.data = u.user }
        if (authStore.user?.role_name == 'cliente') { u.data = u.contador }
        u.letter = u.data.name.slice(0, 1).toUpperCase()
        return u
      })
    }
    if (response.data?.pagination) {
      maxPages.value = response.data.pagination.lastPage
    }
  }).finally(() => isLoading.value = false)
}

const handleClickSolicitar = () => {

  let role = authStore.user?.role_name == 'contador' ? 'cliente' : 'contador'

  let message = `Selecciona un ${role} de la lista.`
  
  $q.dialog({
    component: DialogSelectUsers,
    componentProps: {  
      filters: {
        roleId: authStore.user?.role_name == 'contador' ? 2 : 3
      },
      title: 'Enviar solicitud',
      message
    },
  }).onOk(userId => {
        
    let data = authStore.user?.role_name == 'contador' ? {
      user_id: userId,
      contador_id: authStore.user.id,
      accept_contador: 1,
      accept_client: 0,
    } : {
      user_id: authStore.user.id,
      contador_id: userId,
      accept_contador: 0,
      accept_client: 1,
    }
    
    api.post('contador_clientes', data).then(response => {
      if (response.data?.data) {
        fetchUsers()
        $q.notify({
          type: 'positive',
          message: 'La solicitud se ha enviado correctamente.',
        })
      } else {
        $q.notify({
          type: 'negative',
          message: 'No se pudo enviar la solicitud.',
        })
      }
    }).catch(e => {
      console.log(e);
      $q.notify({
        type: 'negative',
        message: 'Ha ocurrido un error. Vuelve a intentarlo más tarde.',
      })
    })

  }).onCancel(() => { 
    console.log('Cancel')
  }).onDismiss(() => {
    console.log('Called on OK or Cancel')
  })
} 

const handleDeleteSolicitud = (solicitudId, reason) => {

  let title, message, action
  if (reason == 'reject') {
    title = 'Rechazar solicitud'
    message = '¿Estás seguro de rechazar esta solicitud?'
    action = 'rechazada'
  } else if (reason == 'cancel') {
    title = 'Cancelar solicitud'
    message = '¿Estás seguro de cancelar esta solicitud?'
    action = 'cancelada'
  } else if (reason == 'unlink') {
    title = 'Desvincular usuario'
    message = '¿Estás seguro de desvincular a este usuario?'
    action = 'desvinculada'
  }

  $q.dialog({
      title,
      message,
      cancel: true,
    }).onOk(() => {

      api.delete('contador_clientes/' + solicitudId)
        .then(response => {
          if (response.data?.status === 200) {
            users.value = users.value.filter(solicitud => solicitud.id !== solicitudId)
            $q.notify({
              type: 'positive',
              message: `Solicitud ${action}.`,
            })
          } else {
            console.log(response.data);
            $q.notify({
              type: 'negative',
              message: `La solicitud no pudo ser ${action}.`,
            })
          }
        }).catch(e => {
          console.log(e);
          $q.notify({
            type: 'negative',
            message: `La solicitud no pudo ser ${action}.`,
          })
        })

    })
}

const handleAcceptSolicitud = (solicitudId) => {

  let data = authStore.user?.role_name == 'contador' ? { accept_contador: 1 } : { accept_client: 1}

  api.put('contador_clientes/' + solicitudId, data).then(response => {
    console.log(response);
    if (response.data?.status == 200) {
      let solicitudIndex = users.value.findIndex(solicitud => solicitud.id === solicitudId)
      if (users.value[solicitudIndex]) {
        users.value[solicitudIndex] = { ...users.value[solicitudIndex], ...data }
      }
      $q.notify({
        type: 'positive',
        message: 'Solicitud aceptada.',
      })
    } else {
      $q.notify({
        type: 'negative',
        message: 'No se pudo aceptar la solicitud.',
      })
    }
  })
  .catch(e => {
    console.log(e);
    $q.notify({
      type: 'negative',
      message: 'Ha ocurrido un error. Vuelve a intentarlo más tarde.',
    })
  })
  
}

onMounted(() => { fetchUsers() })

</script>
