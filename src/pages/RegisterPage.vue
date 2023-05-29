<template>
  <q-page class="flex flex-center q-pa-md fondo">
    
      <q-carousel
        ref="carouselRef"
        v-model="slide"
        transition-prev="scale"
        transition-next="scale"
        animated
        control-color="blue"
        navigation
        padding
        v-model:fullscreen="isFullscreen"
        class="text-black fondo otro fullscreen"
      >
        <q-carousel-slide name="firstSlide" class="no-wrap flex-center">
              <span class="text-h3 texto-mod1">Es momento de tomar control de tus finanzas</span>
              <p class="text-h5 text-justify texto-mod2">En Gofinap vamos a crear tu entorno financiero para que tengas control de tu salud financiera</p>
        
   
              <q-btn 
                outline
                no-caps
                label="Siguiente" 
                class="boton2 carousel-button right" 
                style="color:black;"
                size="160%" 
                icon="las la-long-arrow-alt-right"
                @click="nextSlide"
              />
            <!--///////////FONDO//////////////////////////-->
              <ul class="circles" style="z-index: -10; height: fit-content;">
                <li class="uno"></li>
                <li class="dos"></li>
              </ul>
            <!--////////////////////////////////////-->

        </q-carousel-slide>

        <q-carousel-slide name="secondSlide" class="column no-wrap flex-center padding1">
            <span class="text-h2 texto-mod3">¿Cuantas cuentas de banco tienes?</span>
            <span class="text-h6 text-justify texto-mod4">Es importante llevar control de todos tus movimientos.</span>
            <br>
            <p class="text-weight-medium text-left texto-mod5">¿Porque te pedimos esto?</p>
            <ul class="ul1 q-ma-md">
              <li><i class="las la-check-circle q-pr-md"></i>Llevar un control eficiente de:</li>
              <li class="spaced1"><i class="las la-check q-pr-md"></i>Tus ingresos</li>
              <li class="spaced1"><i class="las la-check q-pr-md"></i>Tus gastos</li>
              <li><i class="las la-check-circle q-pr-md"></i>Poder automatizar tu proceso de registro de cuentas (ingresos - egresos)</li>
            </ul>
            <q-btn 
                outline
                no-caps
                label="Siguiente" 
                class="boton2-1 carousel-button right" 
                style="color:black;"
                size="160%" 
                icon="las la-long-arrow-alt-right"
                @click="nextSlide"
              />
          <!--///////////FONDO//////////////////////////-->
            <ul class="circles" style="z-index: -10; height: fit-content;">
                <li class="uno"></li>
                <li class="dos"></li>
            </ul>
          <!--////////////////////////////////////-->


        </q-carousel-slide>

        <q-carousel-slide name="thirdSlide" class="column no-wrap flex-center padding1">
              <span class="text-h2 texto-mod3">¿Cuantas cuentas de banco tienes?</span>

              <q-form
                @submit="onSubmit"
                @reset="onReset"
                class="q-gutter-md"
              >
              <q-select 
              outlined 
              v-model="model" :options="options" 
              label="Nombre del Banco" 
              style="width: 150%; margin-left: -20%;"
              behavior="menu"
              />
              <q-select 
              outlined 
              v-model="model2" :options="options2" 
              label="Tipo de cuenta" 
              style="width: 150%; margin-left: -20%;"
              behavior="menu"
              />

              <div v-for="(input, index) in inputs" :key="index">
                <q-select 
              outlined 
              v-model="input.model" :options="options" 
              label="Nombre del Banco" 
              style="width: 150%; margin-left: -20%;"
              behavior="menu"
              />
              <q-select 
              outlined 
              v-model="input.model2" :options="options2" 
              label="Tipo de cuenta" 
              style="width: 150%; margin-left: -20%;"
              behavior="menu"
              />
              <q-btn @click="removeInput(index)" label="Eliminar" />
              </div>
              
              <q-btn @click="addInput" label="Agregar Selects" />
              <q-btn outline no-caps label="Sigamos" class="boton2" align="right" size="160%" icon="las la-long-arrow-alt-right" type="submit"/>
              </q-form>

          <!--///////////FONDO//////////////////////////-->
          <ul class="circles" style="z-index: -10; height: fit-content;">
                <li class="uno"></li>
                <li class="dos"></li>
            </ul>
          <!--////////////////////////////////////-->


        </q-carousel-slide>

      </q-carousel>




      
  <!-- //////////////////////////////////////////////////////////////////////  -->
  

      <div class="auth-footer q-mt-md">
        <p>¿Ya tienes una cuenta?</p>
        <router-link to="/login" class="text-secondary">Inicia sesión</router-link>
      </div>
    
    <!-- MODIFICAR AQUI, Y PONER UN BOTON ARRIBA A LA IZQ-->


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


const slide = ref('firstSlide') 

const model= ref(null)
const model2= ref(null)
const options = ['Banco 1', 'Banco 2', 'Banco 3']
const options2 = ['Tipo 1', 'Tipo 2', 'Tipo 3']


const carouselRef = ref(null)

const prevSlide = () => {
  carouselRef.value.prev()
}

const nextSlide = () => {
  carouselRef.value.next()
}

const inputs = ref([])

const addInput = () => {
  inputs.value.push({ model1: null, model2: null })
}

const removeInput = (index) => {
  inputs.value.splice(index, 1)
}

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
