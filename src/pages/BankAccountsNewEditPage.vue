<template>
  <q-page class="flex column q-pa-md flex-center text-center">
    <q-spinner
        color="primary"
        size="3em"
        v-if="isLoading"
    />
    <template v-else>
      <div v-if="!cuentaId || (cuentaId && cuentaData.id)" class="row justify-center full-width">
        <div class="col-12 col-sm-8 col-md-6">
          <h5 class="page-title">{{ cuentaData?.id ? 'Editar' : 'Agregar' }} cuenta {{ cuentaData?.id && '"' + cuentaData.name + '"' }}</h5>
          <q-form
            @submit="handleSubmitCuenta"
            class="q-gutter-md"
          >
            <q-input
              filled
              square
              type="text"
              v-model="updateData.name"
              :rules="[ val => val && val.length > 0 || 'Ingresa un nombre.' ]"
              hint="Ingresa un nombre."
              label="Nombre *"
            />
            <q-input
              filled
              square
              type="text"
              v-model="updateData.description"
              label="Descripción"
              hint="Ingresa una descripción (opcional)."
              autogrow
            />
            <q-input
              filled
              square
              type="number"
              v-model.number="updateData.saldo"              
              label="Saldo inicial *"
              prefix="$"
              lazy-rules
              :rules="[ val => val > 0 || 'Ingresa un valor válido.' ]"
              hint="Ingresa un valor numérico."
            />
            <q-select
              filled
              square
              label="Usuario asignado"
              v-model="updateData.user_id"
              :options="availableUsers"
              :loading="usersLoading"
              @virtual-scroll="onUsersScroll"
              v-if="authStore.user.role_name === 'contador'"
              clearable
            />
            <q-select
              filled
              square
              label="Banco *"
              v-model="updateData.bank"
              :options="availableBanks"
              :loading="banksLoading"
              @virtual-scroll="onBanksScroll"
              :rules="[ val => val && val.value > 0 || 'Selecciona un banco.' ]"
              hint="Selecciona un banco."
              clearable
            />
            <div class="text-center q-mt-lg">
              <q-btn square label="Reestablecer" type="button" color="secondary" @click="handleResetForm" class="q-mr-sm" />
              <q-btn square label="Guardar" type="submit" color="primary" :loading="buttonLoading" />
            </div>
          </q-form>
        </div>
      </div>
      <template v-else>
        <p>No se pudo cargar la información.</p>
        <q-btn color="primary" @click="fetchData">Volver a intentar</q-btn>
      </template>
    </template>
  </q-page>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted, nextTick } from 'vue'
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth.store';

const $q = useQuasar()
const route = useRoute()
const authStore = useAuthStore()

const cuentaData = ref(null)

const updateData = ref({
  name: null,
  saldo: null,
  description: null,
  bank: null,
  user_id: null,
})

const cuentaId = route.params.id

const isLoading = ref(!!cuentaId)
const buttonLoading = ref(false)

// Bancos:
const banksLoading = ref(false)
const availableBanks = ref([])
const nextPageBanks = ref(1)
const lastPageBanks = ref(0)

const onBanksScroll = ({to, ref}) => {
  const lastIndex = availableBanks.value.length - 1 
  if (banksLoading.value !== true && nextPageBanks.value <= lastPageBanks.value && to === lastIndex) {
    banksLoading.value = true
    getBancos(nextPageBanks.value, ref)
  }
}

function getBancos(pageId, ref = null) {
  api.get('bank?page=' + pageId)
    .then(response => {        
      availableBanks.value = [...availableBanks.value, ...response.data.data.map(bank => {
            return {
              value: bank.id,
              label: bank.name
            }
          }
        )
      ]
      nextPageBanks.value++
      lastPageBanks.value = response.data.pagination.lastPage

      if (ref !== null) {
        nextTick(() => {
          ref.refresh()
          banksLoading.value = false
        })
      }

    })
    .catch(e => console.log('Error', e))
}

// Usuarios:
const usersLoading = ref(false)
const availableUsers = ref([])
const nextPageUsers = ref(1)
const lastPageUsers = ref(0)

const onUsersScroll = ({to, ref}) => {
  const lastIndex = availableUsers.value.length - 1 
  if (usersLoading.value !== true && nextPageUsers.value <= lastPageUsers.value && to === lastIndex) {
    usersLoading.value = true
    getUsers(nextPageUsers.value, ref)
  }
}

function getUsers(pageId, ref = null) {
  api.get('users?page=' + pageId)
    .then(response => {        
      availableUsers.value = [...availableUsers.value, ...response.data.data.map(user => {
            return {
              value: user.id,
              label: `${user.name} (${user.email})`
            }
          }
        )
      ]
      nextPageUsers.value++
      lastPageUsers.value = response.data.pagination.lastPage

      if (ref !== null) {
        nextTick(() => {
          ref.refresh()
          usersLoading.value = false
        })
      }

    })
    .catch(e => console.log('Error', e))
}

function fetchData() {  
  isLoading.value = true;
  api.get('bank_account/' + cuentaId)
    .then(response => {
      console.log(response);
      cuentaData.value = response.data
      updateData.value.name = response.data.name
      updateData.value.description = response.data.description
      updateData.value.saldo = response.data.saldo
      if (response.data.bank_id) {
        api.get('bank/' + response.data.bank_id).then(response2 => {
          cuentaData.value.bankName = response2.data?.name || response.data.bank_id
          updateData.value.bank = {
            label: cuentaData.value.bankName,
            value: response2.data?.id || response.data.bank_id
          }
        })
      }
    })
    .catch(e => console.log(e))
    .finally(() => isLoading.value = false)
}

onMounted(() => {
  if (cuentaId) fetchData()
  getBancos(nextPageBanks.value)
  if (authStore.user.role_name == 'contador') {
    getUsers(nextPageUsers.value)
  }
})

const handleSubmitCuenta = () => {
  buttonLoading.value = true

  let postData = {
    name: updateData.value.name,
    description: updateData.value.description,
    saldo: updateData.value.saldo
  }

  if (updateData.value.bank?.value) postData.bank_id = updateData.value.bank.value
  
  if (authStore.user.role_name === 'contador') {
    postData.contador_id = authStore.user.id
    postData.user_id = updateData.value?.user_id?.value || null
  } else {
    postData.user_id = authStore.user.id
  }

  // Actualizar cuenta
  if (cuentaId) {
    console.log('Actualizar', postData);
    api.put('bank_account/' + cuentaId, postData).then(response => {
      console.log(response);
      if (response.data?.status == 200) {
        cuentaData.value = response.data?.data
        $q.notify({
          type: 'positive',
          message: 'Actualizado exitosamente.',
        })
      } else {
        $q.notify({
          type: 'negative',
          message: 'No se pudo actualizar.',
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
    .finally(() => buttonLoading.value = false)
  // Crear nuevo
  } else {
    api.post('bank_account', postData).then(response => {
      if (response.data?.status == 200) {
        $q.notify({
          type: 'positive',
          message: 'Creado exitosamente.',
        })
        handleResetForm()
      } else {
        $q.notify({
          type: 'negative',
          message: 'No se pudo crear.',
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
    .finally(() => buttonLoading.value = false)
  }

}


const handleResetForm = () => {
  updateData.value.name = cuentaData.value?.name || null
  updateData.value.description = cuentaData.value?.description || null
  updateData.value.saldo = cuentaData.value?.saldo || null
  if (cuentaData.value?.bank_id) {
    updateData.value.bank = {
      label: cuentaData.value.bankName || cuentaData.value.bank_id,
      value: cuentaData.value.bank_id,
    }
  } else { updateData.value.bank = null }  
}

</script>
