<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">

      <q-card-section class="q-dialog__title" v-if="props.title">
        {{ props.title }}
      </q-card-section>

      <q-card-section class="q-dialog__message" v-if="props.message">
        {{ props.message }}
      </q-card-section>

      <q-card-section>
        <q-select filled square label="Seleccionar usuario" v-model="userId" :options="availableUsers"
          :loading="usersLoading" @virtual-scroll="onUsersScroll" clearable />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="Solicitar" :disable="!userId" @click="onOKClick" />
        <q-btn color="primary" label="Cancelar" @click="onDialogCancel" />
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script setup>

import { ref, onMounted, nextTick } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import { api } from 'src/boot/axios';

const props = defineProps(['title', 'message', 'filters'])

const userId = ref(null)

// Usuarios:
const usersLoading = ref(false)
const availableUsers = ref([])
const nextPageUsers = ref(1)
const lastPageUsers = ref(0)

const onUsersScroll = ({ to, ref }) => {
  const lastIndex = availableUsers.value.length - 1
  if (usersLoading.value !== true && nextPageUsers.value <= lastPageUsers.value && to === lastIndex) {
    usersLoading.value = true
    getUsers(nextPageUsers.value, ref)
  }
}

function getUsers(pageId, ref = null) {
  let endpoint = 'users?page=' + pageId
  if (props.filters?.roleId) {
    endpoint += '&role_id=' + props.filters.roleId
  }
  console.log(endpoint);
  api.get(endpoint)
    .then(response => {
      availableUsers.value = [...availableUsers.value, ...response.data.data.map(user => {
        return {
          value: user.id,
          label: `${user.name} (${user.email})`
        }
      })]
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

onMounted(() => {
  getUsers(nextPageUsers.value)
})

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits
])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
// dialogRef      - Vue ref to be applied to QDialog
// onDialogHide   - Function to be used as handler for @hide on QDialog
// onDialogOK     - Function to call to settle dialog with "ok" outcome
//                    example: onDialogOK() - no payload
//                    example: onDialogOK({ /*...*/ }) - with payload
// onDialogCancel - Function to call to settle dialog with "cancel" outcome

// this is part of our example (so not required)
function onOKClick() {
  // on OK, it is REQUIRED to
  // call onDialogOK (with optional payload)
  onDialogOK( userId.value?.value )
  // or with payload: onDialogOK({ ... })
  // ...and it will also hide the dialog automatically
}
</script>