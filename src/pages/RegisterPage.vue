<template>
  <q-page class="flex flex-center q-pa-md">

    <div class="auth-card">
      <div><img src="../assets/logo-gofinapp.png" style="border-radius: 50%; width: 30%; height: 20%; margin-top: -15%; margin-bottom: -7%;" size="20%"></div>
      <p class="auth-header titulo3">Regístrate</p>
      
      <q-form
        @submit="handleSubmit"
        class="q-gutter-md"
      >

        <q-input
          outlined
          square
          type="text"
          v-model="userData.name"
          style="font-family: 'Poppins', sans-serif; margin-bottom: -3%; height: 5%;"
          label="Nombre"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Ingresa tu nombre.']"
        />
        <q-input
          outlined
          square
          type="text"
          v-model="userData.email"
          style="font-family: 'Poppins', sans-serif; margin-bottom: -3%; height: 5%;"
          label="E-mail"
          lazy-rules
          :rules="[ (val, rules) => rules.email(val) || 'Ingresa un e-mail válido.' ]"
        />
        <q-select
          outlined
          square
          v-model="userData.role"
          :options="availableRoles"
          style="font-family: 'Poppins', sans-serif; margin-bottom: -3%; height: 5%;"
          label="Rol de usuario"
          :rules="[ val => val?.value > 0 || 'Selecciona un rol válido.' ]"
        />
        <q-input
          outlined
          square
          type="password"
          v-model="userData.password"
          style="font-family: 'Poppins', sans-serif; margin-bottom: 17%; height: 5%;"
          label="Contraseña"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Ingresa tu contraseña.']"
        /> 

        <div class="text-center q-mt-lg">
          <q-btn square label="Confirmar" class="boton1" padding="4% 5%" type="submit" color="blue-9" :loading="buttonLoading" />
        </div>


      </q-form>

      <div class="auth-footer q-mt-md">
        <p>¿Ya tienes una cuenta? <router-link to="/login" class="text-second">Inicia sesión</router-link></p>
      </div>
      
    </div>

<!--///////////FONDO//////////////////////////-->

<ul class="circles">
                    <li class="uno"></li>
                    <li class="dos"></li>
            </ul>
<!--////////////////////////////////////-->



  </q-page>
</template>

<script setup>

import { ref, watch, toRef, onMounted } from 'vue'
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth.store';
import { useAppStore } from 'src/stores/app.store';
import axios from 'axios';

const $q = useQuasar()
const authStore = useAuthStore()
const appStore = useAppStore()

const availableRoles = ref(null)

watch(toRef(appStore, 'modalMessage'), () => {
  if (!appStore.modalIsVisible) {
    appStore.modalIsVisible = true
    $q.dialog({
      title: appStore.modalMessage.title,
      message: appStore.modalMessage.message
    }).onDismiss(() => {
      appStore.modalIsVisible = false
    })
  }
});

onMounted(() => {
  api.get('roles?selected=1').then(m => {
    availableRoles.value = m.data.map( d => {
      return {
        value: d.id,
        label: d.name,
      }
    });

    availableRoles.value = availableRoles.value.filter(d => d.label !== 'admin')

  }).catch(e => console.log(e))
})

const userData = ref({
  name: null,
  email: null,
  password: null,
  role: null
})

const buttonLoading = ref(false)

const handleSubmit = () => {
  buttonLoading.value = true
  

  const registerData = {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role_id: userData.role,
    active: 1,
  }

  axios.post('https://backend.excel.tarjetajovendiamante.com/api/register', registerData)
    .then(response => {
      // Procesar respuesta exitosa de la API
      console.log('Datos guardados:', response.data),
      this.$router.push('registro_part2')
    })
    .catch(error => {
      // Manejar error de la solicitud
      console.error('Error al guardar los datos:', error)
    })
    .finally(() => {
      buttonLoading.value = false
    })
}

</script>
