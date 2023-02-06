<template>
  <q-page class="flex column q-pa-md flex-center text-center">
    <q-spinner
        color="primary"
        size="3em"
        v-if="isLoading"
    />
    <template v-else>
      <div v-if="userData?.name" class="row justify-center full-width">
        <div class="col-12 col-sm-8 col-md-6">
          <h5 class="page-title">Perfil de <i>{{ userData?.name }}</i></h5>
          <q-form
            @submit="handleSubmitUpdateUser"
            class="q-gutter-md"
          >
            <q-input
              filled
              square
              type="text"
              v-model="updateData.name"
              label="Nombre"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Ingresa un nombre.' ]"
            />
            <q-input
              filled
              square
              type="text"
              v-model="updateData.email"
              label="E-mail"
              lazy-rules
              :rules="[ (val, rules) => rules.email(val) || 'Ingresa un e-mail válido.' ]"
            />

            <!--
              <q-select
                filled
                square
                v-model="updateData.role"
                :options="availableRoles"
                label="Rol de usuario"
                :rules="[ val => val?.value > 0 || 'Selecciona un rol válido.' ]"
              />
            -->

            <q-input
              filled
              square
              type="password"
              v-model="updateData.password"
              label="Contraseña nueva"
              bottom-slots
            >
              <template v-slot:hint>
                Deja en blanco si no quieres cambiar la contraseña.
              </template>
            </q-input>

          <div class="text-center q-mt-lg">
            <q-btn square label="Reestablecer" type="button" color="secondary" @click="handleResetForm" class="q-mr-sm" />
            <q-btn square label="Guardar" type="submit" color="primary" :loading="buttonLoading" />
          </div>

          </q-form>
        </div>
      </div>
      <template v-else>
        <p>No se pudo cargar la información de usuario.</p>
        <q-btn color="primary" @click="fetchData">Volver a intentar</q-btn>
      </template>
    </template>
  </q-page>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { api, ApiRest } from 'src/boot/axios';
import { useQuasar } from 'quasar';

const $q = useQuasar()
const userData = ref(null)
const updateData = ref({
  name: null,
  email: null,
  role: null,
  password: null,
})

const isLoading = ref(true)
const buttonLoading = ref(false)
const route = useRoute()

const availableRoles = ref(null)

function fetchData() {

  
  isLoading.value = true;
  api.get('user/' + route.params.id)
    .then(response => {
      userData.value = response.data
      updateData.value.name = response.data.name
      updateData.value.email = response.data.email
      
      // Obtener roles
      api.get('roles?selected=1').then(m => {
        availableRoles.value = m.data.map( d => {
          return {
            value: d.id,
            label: d.name,
          }
        });

        let currentRole = availableRoles.value.find(role => role.value === userData.value.role_id)

        if (currentRole) {
          updateData.value.role = currentRole
        }
      }).catch(e => console.log(e))

    })
    .catch(e => console.log(e))
    .finally(() => isLoading.value = false)

}

onMounted(() => {
  console.log('userid', route.params.id);
  fetchData()
})

const handleSubmitUpdateUser = () => {
  buttonLoading.value = true

  let newUserData = {
    name: updateData.value.name,
    email: updateData.value.email,
    role_id: updateData.value.role.value,
  }

  if (updateData.value.password) newUserData.password = updateData.value.password

  api.put('user/' + route.params.id, newUserData).then(response => {
    if (response.data) {
      // Revisar errores
      if (response.data.error) {

        console.log(response.data);

      } else if (response.data.data) {
        userData.value = response.data.data
        $q.notify({
          type: 'positive',
          message: response.data?.message || 'Datos actualizados',
        })
        return;
      }
    }
    // Mensaje por defecto
    $q.notify({
      type: 'negative',
      message: 'Ha ocurrido un error. Vuelve a intentarlo más tarde.',
    })
  })
  .finally(() => buttonLoading.value = false)
}

const handleResetForm = () => {
  updateData.value.name = userData.value.name || ''
  updateData.value.email = userData.value.email || ''
  updateData.value.password = ''
  let currentRole = availableRoles.value.find(role => role.value === userData.value.role_id)
  if (currentRole) {
    updateData.value.role = currentRole
  }
}

</script>
