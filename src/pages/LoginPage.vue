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
          <q-btn square label="Iniciar sesión" type="submit" color="primary" icon-right="arrow_forward_ios" />
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

import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router';


const $q = useQuasar()
const router = useRouter()

const userData = ref({
  username: '',
  password: ''
})

const handleSubmit = () => {
  $q.localStorage.set('username', userData.value.username)
  showModal()
}

const showModal = () => {
  const dialog = $q.dialog({
    message: 'Iniciando sesión...',
    progress: true,
    persistent: true,
    ok: false
  })

  setTimeout(() => {
    dialog.hide()
    $q.dialog({
      title: 'Inicio de sesión',
      message: '¡Has iniciado sesión correctamente!'
    }).onDismiss(() => {
      router.push({ path: '/dashboard' })
    })
  }, 1000)
}

</script>
