<template>
  <q-page class="flex flex-center q-pa-md">
      <!-- FONDO -->
      <div class="circle arriba"></div>
      <div class="circle abajo"></div>
      <!-- FONDO -->


    <div class="q-pa-md">
      <q-carousel
        ref="carouselRef"
        v-model="slide"
        swipeable
        animated
        :navigation-position="navPos"
        navigation
        padding
        height="100%"
        width="100%"
        control-color="blue"
        class=" text-black rounded-borders"
        style="background:none;"
    >
        <!-- Slide 1 -->  
        <q-carousel-slide name="intro" class="column no-wrap flex-center otro">
          <img src="../assets/logo-gofinapp.png" class="logo-1 q-pb-md">
          <span class="text-h3 texto-mod1 q-pt-xl">Es momento de tomar control de tus finanzas</span>
          <br>
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
        </q-carousel-slide>


        
        <!-- Slide 2 -->    
        <q-carousel-slide name="intro2" class="column no-wrap flex-center">
          <img src="../assets/logo-gofinapp.png" class="logo-1 q-pb-md">
          <div style="height: max-content;">
            <span class="text-h2 texto-mod3">¿Cuantas cuentas de banco tienes?</span>
            <br>
            <br>
            <span class="text-h6 text-justify texto-mod4 q-mt-xl">Es importante llevar control de todos tus movimientos.</span>
            <br>
            <br>
            <p class="text-weight-medium text-left texto-mod5">¿Porque te pedimos esto?</p>
            <ul class="ul1 q-ma-md">
              <li><i class="las la-check-circle q-pr-md"></i>Llevar un control eficiente de:</li>
              <li class="spaced1"><i class="las la-check q-pr-md"></i>Tus ingresos</li>
              <li class="spaced1"><i class="las la-check q-pr-md"></i>Tus gastos</li>
              <li><i class="las la-check-circle q-pr-md"></i>Poder automatizar tu proceso de registro de cuentas (ingresos - egresos)</li>
            </ul>
          </div>
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
        </q-carousel-slide>


        <!-- Slide 3 -->   
        <q-carousel-slide name="intro3" class="column no-wrap flex-center">
          <img src="../assets/logo-gofinapp.png" class="logo-1 q-pb-md">
          <article>
            <span class="q-mt-md text-center titulo3 tittle">
                Cuentas
            </span>
            <section v-for="datos, index in data" :key="index" class="row" style="width:100%;">
              <div class="col-12">
                <h5 style="font-family: 'Poppins', sans-serif;">Cuenta {{ index + 1 }}</h5>
              </div>
              <div class="col-12 col-md-5" style="padding:0.1em;">
                <!-- <q-input rounded outlined v-model="datos.banco" label="Banco" /> -->
                <q-select
                  style="min-width:200px; font-family: 'Poppins', sans-serif;"
                  v-model="datos.banco"
                  :options="bancos"
                  class="select-1"
                  label="Banco"
                  outlined
                />
              </div>
              <div class="col-10 col-md-5 select-2" style="padding:0.1em; margin-top: 5%;">
                 <!--  <q-input rounded outlined v-model="datos.cuenta" label="Cuenta" /> -->
                  <q-select
                    style="min-width:200px; font-family: 'Poppins', sans-serif;"
                    v-model="datos.cuenta"
                    :options="cuentas"
                    label="Cuenta"
                    outlined
                  />
              </div>
              <div class="col-2 col-md-2" style="padding:0.1em;padding-top:1em">
                <q-btn
                  round
                  dense
                  flat
                  style="position:relative; top: 30%;"
                  icon="delete"
                  color="red"
                  @click="removeData(index)"
                />
              </div>
            </section> 
            <div class="row" style="margin-top:1em;">
              <div class="col-12">
                <q-btn
                  round
                  dense
                  icon="add"
                  color="green"
                  @click="addData"
                />
              </div>
            </div>
            <div class="centerr">
              <q-btn 
                outline
                no-caps
                label="Siguiente" 
                class="boton2 carousel-button" 
                style="color:black;"
                size="160%" 
                icon="las la-long-arrow-alt-right"
                @click="nextSlide"
              />
            </div>
              
          </article>
        </q-carousel-slide>




        <!-- Slide 4 -->  
        <q-carousel-slide name="intro4" class="column no-wrap flex-center">
          <img src="../assets/logo-gofinapp.png" class="logo-2 q-pb-md">
            <div style="height: fit-content;">
              <article>
                <br>
                <br>
                <br>
              <h6 class="q-mt-md text-center titulo3">
                  Gofinapp
              </h6>
              <p style="font-size:1.5em;text-align: justify; width: 80%; position: relative; left: 10%; margin-top: -15%;">
                Para obtener todos los beneficios que te ofrece GoFInAPP suscribete al plan Premium!
              </p>
              <table style="width: 50%; margin-right: 10%; font-family: 'Poppins', sans-serif;">
                <thead>
                  <tr style="font-size: 1.4rem;">
                    <th>Articulo</th>
                    <th>Freemium</th>
                    <th>Premium</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="articulo,index in articulos" :key="index"  style="font-size: 1.1rem;">
                    <td>{{articulo.name}}</td>
                    <td v-if="articulo.freemium"><q-icon name="check" color="green"/></td>
                    <td v-else><q-icon name="close" color="red"/></td>
                    <td v-if="articulo.premium"><q-icon name="check" color="green"/></td>
                    <td v-else><q-icon name="close" color="red"/></td>
                  </tr>
                </tbody>
              </table>
              <section class="row">
                <div class="col-6" style="padding:1em">
                  <q-card  bordered class="my-card">
                    <q-card-section>
                      <div class="text-h6">Freemium</div>
                      <q-separator  inset /> 
                      <div class="text-subtitle2" style="font-size:1.5em;padding:0.5em">0.00</div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-6" style="padding:1em">
                    <q-card  bordered class="my-card">
                      <q-card-section>
                        <div class="text-h6">Premium</div>
                        <q-separator  inset /> 
                        <div class="text-subtitle2" style="font-size:1.5em;padding:0.5em">29.99</div>
                      </q-card-section>
                    </q-card>
                  </div>
              </section>
              <div style="text-align:center;padding:2em">
                <q-btn
                    outline
                    no-caps
                    label="Empecemos"
                    class="carousel-button"
                    style="color:black;"
                    size="25px"
                    icon-right="las la-long-arrow-alt-right"
                    @click="slide = 'intro4'"
                  />
              </div>
              <a @click="actualizar_form()">
                <h5 class="q-mt-md text-center" style="font-size:1em;font-weight:bold;">
                  Continuar con Plan Freemium
                </h5>
              </a>
            </article>

            </div>
           
        </q-carousel-slide>
      </q-carousel>
    </div>
    </q-page>
</template>

<script setup>
import { ref,onMounted } from 'vue';
import getBank from '../api/getBank.js';
import { api } from 'src/boot/axios';
import {useRouter} from 'vue-router';
import { useAuthStore } from 'stores/auth.store';

const authStore = useAuthStore()
const router = useRouter();
//const slide= ref('intro');
const data = ref([{
  banco: '',
  cuenta: '',
}]);
const articulos=ref([
  {
    name:"Articulo 1",
    freemium:false,
    premium:true
  },
  {
    name:"Articulo 2",
    freemium:true,
    premium:true
  }
]);
const addData = () => {
  data.value.push({
    banco: '',
    cuenta: '',
  })
}
const removeData = (index) => {
  data.value.splice(index, 1)
}
const carouselRef = ref(null)
const prevSlide = () => {
  carouselRef.value.prev()
}

const nextSlide = () => {
  carouselRef.value.next()
}

const slide = ref('intro') 



const cuentas=ref(["Corriente",'Ahorro','Nomina','Inversion','Credito']);
const bancos=ref([]);


////////////////////////////////
onMounted(async()=>{
  await getBank().then((res)=>{
      let response_map=res.map((item)=>{
        return {
          label:item.name,
          value:item.id
        };
      });
      bancos.value=response_map;
  });
});
const actualizar_form=async()=>{
  let user = JSON.parse(localStorage.getItem('user'));
  let form = {
    form:1,
    cuentas:data.value
  }
  await api.put('user/'+user.id,form).then((res)=>{
    localStorage.setItem('user',JSON.stringify(res.data.data));
    router.push('/');
  });
}
</script>