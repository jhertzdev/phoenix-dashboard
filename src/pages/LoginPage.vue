<template>
  <q-page class="flex flex-center q-pa-md">

    <div class="auth-card">

      <div class="auth-header">
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
          v-model="userData.email"
          label="E-mail"
          lazy-rules
          :rules="[ (val, rules) => rules.email(val) || 'Ingresa un e-mail válido.' ]"
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
  email: '',
  password: ''
})

const buttonLoading = ref(false)

const handleSubmit = () => {
  buttonLoading.value = true
  authStore.login(userData.value.email, userData.value.password).finally(() => {
    buttonLoading.value = false
  })
}

</script>
