<template>
  <q-page>
<!-- FALTA ACOMODAR VISUALMENTE-->
    <div class="row" style="padding-bottom: 15%; margin-top: -10%;">
      <div class="col-1"></div>      
      <div class="col-9">      
        <div class="contenido">
        <div class="circulo col-1">
          <q-icon name="las la-dollar-sign" color="white" size="25px" class="middle"></q-icon>
        </div>
      </div>  
        <CardTotals title="Balance total" :total="dashboardData?.balance" style="height:100%; width: 115%; margin-left: -2%; " />
        <q-btn 
          dense 
          flat
          round 
          :icon="expanded.inicio1 ? 'las la-angle-down' : 'las la-angle-up'"
          @click="() => expanded.inicio1 = !expanded.inicio1"
          class="btn-dash"
        />
    </div>
    <div class="col-1"></div>

    <div class="row">
      <div class="col-1"></div>
      <div class="col-10" style="padding-top: 8%;">
        <q-expansion-item v-model="expanded.inicio1" :hide-expand-icon="true">
        <q-card>
          <q-card-section>
            <CardTotals class="" title="Ingresos totales" :total="dashboardData?.total_ingresos" icon="trending_up"/>
            <CardTotals class="" title="Gastos totales" :total="dashboardData?.total_gastos" icon="trending_down" />
          </q-card-section>
        </q-card>
        </q-expansion-item>
      </div>
      <div class="col-1"></div>
    </div>

  </div>



<!--///////////////////////////////////////////////-->


      <div class="col-12 col-lg-8">
        <div class="row q-pa-md" :class="$q.screen.lt.lg || 'q-col-gutter-md '">
          <div class="row q-col-gutter-md q-px-md">
          <div class="col-12 col-lg-8 items-center justify-between" horizontal>    
                    <q-btn-group unelevated class="row q-pb-sm" style="width:100%;">
                    <div class="col-1"></div>
                    <q-btn size="sm" :color="filterDays === 7 ? 'grey-4' : 'grey-2'"
                      :text-color="filterDays === 7 ? 'black' : 'grey-7'" label="Semana" @click="filterDays = 7" class="col-3 q-mr-lg"/>
                    <q-btn size="sm" :color="filterDays === 30 ? 'grey-4' : 'grey-2'"
                      :text-color="filterDays === 30 ? 'black' : 'grey-7'" label="Mes" @click="filterDays = 30" class="col-3  q-mr-lg"/>
                    <q-btn size="sm" :color="filterDays === 360 ? 'grey-4' : 'grey-2'"
                      :text-color="filterDays === 360 ? 'black' : 'grey-7'" label="Año" @click="filterDays = 360" class="col-3 q-mr-lg"/>
                    <div class="col-2"></div>
                    </q-btn-group>
                  
                  <!-- MODIFICAR LA CUENTA DE LOS DIAS-->
                <q-card>
                  <q-card-section>
                    <BarChart :data="movimientos" :range="filterDays" />
                  </q-card-section>
                </q-card>
          </div>
        </div>
        </div>
      </div>
<!--///////////////////////////////////////////////-->




<!-- FALTA ACOMODAR VISUALMENTE
          <div class="col-12">
            <q-card flat bordered>
              <q-card-section>
                <q-item-label>
                  <q-btn dense flat :icon="expanded.movimientos ? 'keyboard_arrow_down' : 'keyboard_arrow_up'"
                    @click="() => expanded.movimientos = !expanded.movimientos" />
                  Últimos 10 movimientos
                </q-item-label>
              </q-card-section>
              <q-expansion-item v-model="expanded.movimientos">
                <q-separator />
                <q-list>
                  <q-item v-for="movimiento in dashboardData?.ultimos_movimientos" :key="movimiento.id" class="q-my-sm" clickable
                    v-ripple>
                    <q-item-section avatar>
                      <q-avatar icon="trending_down" text-color="negative" v-if="movimiento.id % 2" />
                      <q-avatar icon="trending_up" text-color="positive" v-else />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>${{ movimiento.total.toFixed(2) }}</q-item-label>
                      <q-item-label caption lines="1">{{ movimiento.reason }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-badge color="secondary">{{ movimiento.account.name }}</q-badge>
                      {{ movimiento.created_at }}
                    </q-item-section>
                  </q-item>
                  <q-item v-if="!dashboardData?.ultimos_movimientos">
                    <q-item-label class="q-mt-sm" caption>No hay movimientos.</q-item-label>
                  </q-item>
                </q-list>
              </q-expansion-item>
            </q-card>
           </div> -->
<q-carousel 
  v-model="slide"
  transition-prev="scale"
  transition-next="scale"
  animated
  control-color="grey-10"
  padding
  arrows
  height="300px"
  class="rounded-borders"
>
  <q-carousel-slide name="style" class="column no-wrap flex-center">
    <div class="contenido2">
        <div class="circulo2">
          <q-icon name="las la-dollar-sign" color="white" size="25px" class="middle"></q-icon>
        </div>
      </div> 
  </q-carousel-slide>
</q-carousel>


  </q-page>
</template>

<style>
.user-avatar {
  color: var(--q-secondary);
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 1.5rem;
  font-size: 5rem;
}

/*.q-expansion-item__container>.q-link {
  display: none;
}*/

.q-date__header {
  border-radius: 0;
}
</style>

<script setup>

import { ref, reactive, computed, onMounted } from 'vue'
import BarChart from '../components/Dashboard/LineChart.vue'
import PieChart from '../components/Dashboard/PieChart.vue'
import { useRouter } from 'vue-router';
import CardTotals from 'src/components/Dashboard/CardTotals.vue';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';

const $q = useQuasar()
const router = useRouter()
const balances = reactive({
  total: null,
  ingresos: null,
  gastos: null
})

const expandIcon = 'las la-angle-down';
const expandedIcon = 'las la-angle-up';

const currentPage = ref({
  movimientos: 1
})

const filterDays = ref(7)

const movimientos = reactive([])

const cuentas = reactive([])

const dashboardData = ref(null)

function getMovimientos() {
  api.get('movimientos?with[]=account&page=' + currentPage.value.movimientos).then(response => {
    if (response.data?.data) {
      movimientos.push(...response.data.data)
    }
    if (response.data?.pagination?.lastPage && currentPage.value.movimientos < response.data.pagination.lastPage) {
      currentPage.value.movimientos++
      getMovimientos()
    } else {
      balances.ingresos = movimientos.filter(movimiento => {
        return movimiento.tipo === 1
      }).reduce((acc, movimiento) => {
        return movimiento.total + acc
      }, 0)

      balances.gastos = movimientos.filter(movimiento => {
        return movimiento.tipo === 2
      }).reduce((acc, movimiento) => {
        return movimiento.total + acc
      }, 0)
    }
  })
}


function fetchDashboard() {

  api.get('dashboard')
    .then(response => {
      if (response.data?.data) {
        dashboardData.value = response.data.data
        console.log(dashboardData.value);
      }
    })
    .catch(e => console.log(e))

  api.get('bank_account?page=1').then(response => {
    if (response.data?.data) {
      balances.total = response.data.data.reduce((acc, balance) => {
        return balance.saldo + acc
      }, 0)

      response.data.data.forEach(cuenta => {
        cuentas.push(cuenta)
      });
    }
  })

  getMovimientos()

}

onMounted(() => {
  let user = JSON.parse(localStorage.getItem('user'));
  if(user.form == 0) {
    router.push('registro_part2')
  }
  fetchDashboard()
})

const expanded = ref({
  finanzas: true,
  gastos: true,
  calendario: true,
  movimientos: true,
  inicio1: true
})

const today = new Date();
const year = today.getFullYear();
const month = (today.getMonth() + 1).toString().padStart(2, '0');
const day = today.getDate().toString().padStart(2, '0');
const date = ref(`${year}/${month}/${day}`)

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Cuenta',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'saldo', align: 'center', label: 'Balance total', field: 'saldo', sortable: true, format: val => `$${val.toFixed(2)}` },
  { name: 'ingresos', align: 'center', label: 'Ingresos totales', field: 'ingresos', sortable: true, format: val => `$${val.toFixed(2)}` },
  //{ name: 'ult_ingreso', label: 'Últ. ingreso', field: 'ult_ingreso' },
  { name: 'gastos', label: 'Gastos totales', field: 'gastos', sortable: true, format: val => `$${val.toFixed(2)}` },
  //{ name: 'ult_gasto', label: 'Últ. gasto', field: 'ult_gasto' },
]

</script>
