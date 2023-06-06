<template>
  <q-page class="flex flex-center q-pa-lg">

    <div class="auth-card cardd" style="position: fixed; z-index: 100;">
      <div class="flex flex-center" style="font-family: 'Montserrat', sans-serif;">
          <img src="../assets/logo-gofinapp.png" style="border-radius: 50%; width: 50%; height: 40%; padding-top: 7%; margin-bottom: -7%;" size="20%">
        <div class="q-pt-lg">
          <img src="../assets/titulo.png" class="titulo">
        </div>
      </div>

        <div class="auth-header login1" style="font-family: 'Montserrat', sans-serif;">
          Iniciar Sesión
        </div>
        <q-form
          @submit="handleSubmit"
          class="q-gutter-md"
        >
          <q-input
            outlined
            square
            type="text"
            style="font-family: 'Poppins', sans-serif;"
            v-model="userData.email"
            label="E-mail Address"
            lazy-rules
            :rules="[ (val, rules) => rules.email(val) || 'Ingresa un e-mail válido.' ]"
          />
    
          <q-input
            outlined
            square
            type="password"
            style="font-family: 'Poppins', sans-serif;"
            v-model="userData.password"
            label="Password"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Ingresa tu contraseña.']"
          />
    
          <div class="text-center q-mt-lg">
            <q-btn square label="Login" class="boton1" padding="4% 5%" type="submit" color="blue-9" :loading="buttonLoading" />
          </div>

        </q-form>

          <div class="auth-footer q-mt-md" style="font-family: 'Poppins', sans-serif; margin-bottom: 5%;">
              <p>¿No tienes una cuenta? <router-link to="/registro" class="text-second">Regístrate</router-link></p>
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