<template>
  <q-page class="flex flex-center q-pa-md">

    <div class="login-card">

      <div class="login-header">
        Inicio de sesión
      </div>
      
      <q-form
        @submit="handleSubmit"
        class="q-gutter-md"
      >
        <q-input
          filled
          square
          type="text"
          v-model="userData.username"
          label="Nombre de usuario"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Ingresa tu nombre de usuario.' ]"
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
          <q-btn square label="Iniciar sesión" type="submit" color="primary" icon-right="arrow_forward_ios" :loading="buttonLoading" />
        </div>

      </q-form>

    </div>

  </q-page>
</template>

<style>

  .login-card {
    text-align: center;
    width: 100%;
    padding: 0 10px;
    max-width: 400px;
  }

  .login-header {
    color: var(--q-secondary);
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 2rem;
    font-size: 1.5rem;
  }

  .app-title span:first-child {
    font-weight: 900;
  }
  
</style>

<script setup>

import { ref, watch, toRef } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth.store';
import { useAppStore } from 'src/stores/app.store';

const $q = useQuasar()
const authStore = useAuthStore()
const appStore = useAppStore()

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

const userData = ref({
  username: '',
  password: ''
})

const buttonLoading = ref(false)

const handleSubmit = () => {
  buttonLoading.value = true
  $q.localStorage.set('username', userData.value.username)
  authStore.login(userData.value.username, userData.value.password).finally(() => {
    buttonLoading.value = false
  })
}

</script>
