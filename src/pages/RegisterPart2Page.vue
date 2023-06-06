<template>
    <q-page class="flex flex-center q-pa-md">
      <!-- FONDO -->
      <div class="circle arriba"></div>
      <div class="circle abajo"></div>
      <!-- FONDO -->
      <div class="q-pa-md">
      <q-carousel
        v-model="slide"
        swipeable
        animated
        navigation-position="bottom"
        navigation
        padding
        height="100%"
        width="100%"
        control-color="blue"
        class=" text-black rounded-borders"
        style="background:none;"
      >
        <q-carousel-slide name="intro" class="column no-wrap flex-center">
          <h6 class="q-mt-md text-center" style="font-size:2em;font-weight:bold;">
            Es momento de tomar control de tus finanzas
          </h6>
          <p style="font-size:1.5em;text-align: justify;">
            En Gofinap vamos a crear tu entorno financiero para que tengas control de tu salud financiera
          </p>
          <div style="text-align:center;margin-top:2em">
            <q-btn
              outline
              no-caps
              label="Siguiente"
              class="carousel-button"
              style="color:black;"
              size="25px"
              icon-right="las la-long-arrow-alt-right"
              @click="slide='intro2'"
            />
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="intro2" class="column no-wrap flex-center">
          <h6 class="q-mt-md text-center" style="font-size:2em;font-weight:bold;">
            ¿Cuantas cuentas de banco tienes?
          </h6>
            <p style="font-size:1.5em;text-align: justify;">
             Es importante llevar control de todos tus movimientos.
            </p>
            <p style="font-size:1.5em;text-align: left;font-weight:bold;width:95%">
              ¿Porque te pedimos esto?         
            </p>
            <div>
              <q-list>
                <q-item  v-ripple>
                  <q-item-section avatar>
                    <q-icon color="black" name="done" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Llevar un control eficiente </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item  v-ripple>
                  <q-item-section avatar>
                    <q-icon color="black" name="done" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>De tus ingresos</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item  v-ripple>
                  <q-item-section avatar>
                    <q-icon color="black" name="done" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label style="font-weight:bold;">Poder automatizar tu proceso de registro de cuentas (ingresos - egresoss</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div style="text-align:center;margin-top:2em">
              <q-btn
                outline
                no-caps
                label="Empecemos"
                class="carousel-button"
                style="color:black;"
                size="25px"
                icon-right="las la-long-arrow-alt-right"
                @click="slide = 'intro3'"
              />
            </div>
        </q-carousel-slide>
        <q-carousel-slide name="intro3" class="column no-wrap flex-center">
          <img src="../assets/ejemplo-login.png" style="border-radius: 50%; width: 7em; height: 7em;" size="20%">
          <article>
            <h6 class="q-mt-md text-center" style="font-size:2em;font-weight:bold;">
                Cuentas
            </h6>
            <section v-for="datos, index in data" :key="index" class="row" style="width:100%;">
              <div class="col-12">
                <h5>Cuenta {{ index + 1 }}</h5>
              </div>
              <div class="col-12 col-md-5" style="padding:0.1em">
                <!-- <q-input rounded outlined v-model="datos.banco" label="Banco" /> -->
                <q-select
                  style="min-width:200px"
                  v-model="datos.banco"
                  :options="bancos"
                  label="Banco"
                  outlined
                  rounded
                />
              </div>
              <div class="col-10 col-md-5" style="padding:0.1em">
                 <!--  <q-input rounded outlined v-model="datos.cuenta" label="Cuenta" /> -->
                  <q-select
                    style="min-width:200px"
                    v-model="datos.cuenta"
                    :options="cuentas"
                    label="Cuenta"
                    outlined
                    rounded
                  />
              </div>
              <div class="col-2 col-md-2" style="padding:0.1em;padding-top:1em">
                <q-btn
                  round
                  dense
                  flat
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
            <div style="text-align:center;margin-top:2em">
              <q-btn
                outline
                no-caps
                label="Sigamos"
                class="carousel-button"
                style="color:black;"
                size="25px"
                icon-right="las la-long-arrow-alt-right"
                @click="slide = 'intro4'"
              />
            </div>
          </article>
        </q-carousel-slide>
        <q-carousel-slide name="intro4" class="column no-wrap flex-center">
          <img src="../assets/ejemplo-login.png" style="border-radius: 50%; width: 9em; height: 9em;" size="20%">
            <article>
              <h6 class="q-mt-md text-center" style="font-size:3em;font-weight:bold;">
                  Gofinapp
              </h6>
              <p style="font-size:1.5em;text-align: justify;">
                Para obtener todos los beneficios que te ofrece GoFInAPP suscribete al plan Premium!
              </p>
              <table style="width:100%;">
                <thead>
                  <tr>
                    <th>Articulo</th>
                    <th>Freemium</th>
                    <th>Premium</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="articulo,index in articulos" :key="index">
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
                    <!--
                      <q-card-section>
                        {{ lorem }}
                      </q-card-section> 
                    -->
                  </q-card>
                </div>
                <div class="col-6" style="padding:1em">
                    <q-card  bordered class="my-card">
                      <q-card-section>
                        <div class="text-h6">Premium</div>
                        <q-separator  inset /> 
                        <div class="text-subtitle2" style="font-size:1.5em;padding:0.5em">29.99</div>
                      </q-card-section>
                      
                      <!--
                      <q-card-section>
                        {{ lorem }}
                      </q-card-section> 
                    -->
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
        </q-carousel-slide>
      </q-carousel>
    </div>
    </q-page>
</template>
<style scoped>
table > *{
  font-size:2em
}
th,td{
  padding:0.5em;
  text-align:center;
}
.circle {
  width: 30%;
  height: 30%;
  border-radius: 50%;
  z-index: 1;
}
.arriba{
  position:fixed;
  top: -19%;
  left: -19%;
  background-color: #498536;
}
.abajo{
  background-color: #b0ccfa;
  position:fixed;
  bottom: -19%;
  right: -19%;
}
.my-card{
  background: white;
  text-align:center;
}
</style>
<script setup>
import {ref,onMounted } from 'vue';
import getBank from '../api/getBank.js';
import { api } from 'src/boot/axios';
import {useRouter} from 'vue-router';

const router = useRouter();
const slide= ref('intro');
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
const lorem= 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque voluptatem totam, architecto cupiditate officia rerum, error dignissimos praesentium libero ab nemo.';
const prevSlide = () => {
  slide.value.prev()
}

const nextSlide = () => {
  slide.value.next()
}
const cuentas=ref(["Corriente",'Ahorro','Nomina','Inversion','Credito']);
const bancos=ref([]);
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