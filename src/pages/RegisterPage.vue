<template>
  <q-page class="flex flex-center q-pa-md">

    <div class="auth-card">

      <div class="auth-header">
        Registro de usuario
      </div>
      
      <q-form
        @submit="handleSubmit"
        class="q-gutter-md"
      >

        <q-input
          filled
          square
          type="text"
          v-model="userData.name"
          label="Nombre"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Ingresa tu nombre.']"
        />
        <q-input
          filled
          square
          type="text"
          v-model="userData.email"
          label="E-mail"
          lazy-rules
          :rules="[ (val, rules) => rules.email(val) || 'Ingresa un e-mail válido.' ]"
        />
        <q-select
          filled
          square
          v-model="userData.role"
          :options="availableRoles"
          label="Rol de usuario"
          :rules="[ val => val?.value > 0 || 'Selecciona un rol válido.' ]"
        />  
        <q-input
          filled
          square
          type="password"
          v-model="userData.password"
          label="Contraseña"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Ingresa tu contraseña.']"
        /> 
        <div class="text-center q-mt-lg">
          <q-btn square label="Registrarse" type="submit" color="primary" icon-right="arrow_forward_ios" :loading="buttonLoading" />
        </div>

      </q-form>

      <div class="auth-footer q-mt-md">
        <p>¿Ya tienes una cuenta?</p>
        <router-link to="/login" class="text-secondary">Inicia sesión</router-link>
      </div>
      
    </div>

  </q-page>
</template>

<script setup>

import { ref, watch, toRef, onMounted } from 'vue'
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth.store';
import { useAppStore } from 'src/stores/app.store';

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
  
  let registerData = {
    name: userData.value.name,
    email: userData.value.email,
    password: userData.value.password,
    role_id: userData.value.role.value
  }
  authStore.register(registerData).finally(() => {
    buttonLoading.value = false
  })
}

</script>
