<template>
  <q-page>
    <div class="row">
      <div class="col-12 col-lg-8">
        <div class="row q-pa-md" :class="$q.screen.lt.lg || 'q-col-gutter-md '">
          <div class="col-4">
            <CardTotals class="" title="Balance total" :total="dashboardData?.balance" icon="account_balance_wallet" />
          </div>
          <div class="col-4">
            <CardTotals class="" title="Ingresos totales" :total="dashboardData?.total_ingresos" icon="trending_up" />
          </div>
          <div class="col-4">
            <CardTotals class="" title="Gastos totales" :total="dashboardData?.total_gastos" icon="trending_down" />
          </div>
        </div>
        <div class="row q-col-gutter-md q-px-md">
          <div class="col-12 col-lg-8">
            <q-card flat bordered>
              <q-card-section class="items-center justify-between" horizontal>
                <q-card-section>
                  <q-item-label>
                    <q-btn dense flat :icon="expanded.finanzas ? 'keyboard_arrow_down' : 'keyboard_arrow_up'"
                      @click="() => expanded.finanzas = !expanded.finanzas" />
                    Finanzas
                  </q-item-label>
                </q-card-section>
                <q-card-section>
                  <q-btn-group unelevated>
                    <q-btn size="sm" :color="filterDays === 7 ? 'primary' : 'orange-2'"
                      :text-color="filterDays !== 7 && 'secondary'" label="7D" @click="filterDays = 7" />
                    <q-btn size="sm" :color="filterDays === 15 ? 'primary' : 'orange-2'"
                      :text-color="filterDays !== 15 && 'secondary'" label="15D" @click="filterDays = 15" />
                    <q-btn size="sm" :color="filterDays === 30 ? 'primary' : 'orange-2'"
                      :text-color="filterDays !== 30 && 'secondary'" label="30D" @click="filterDays = 30" />
                  </q-btn-group>
                </q-card-section>
              </q-card-section>

              <q-expansion-item v-model="expanded.finanzas">
                <q-separator />
                <q-card-section>
                  <BarChart :data="movimientos" :range="filterDays" />
                </q-card-section>
              </q-expansion-item>
            </q-card>
          </div>
          <div class="col-12 col-lg-4">
            <q-card flat bordered>
              <q-card-section class="items-center justify-between" horizontal>
                <q-card-section>
                  <q-item-label>
                    <q-btn dense flat :icon="expanded.gastos ? 'keyboard_arrow_down' : 'keyboard_arrow_up'"
                      @click="() => expanded.gastos = !expanded.gastos" />
                    Gastos
                  </q-item-label>
                </q-card-section>
              </q-card-section>
              <q-expansion-item v-model="expanded.gastos">
                <q-separator />
                <q-card-section>
                  <PieChart :data="dashboardData?.banks || []" />
                </q-card-section>
                <q-card-section>
                  <div class="row q-col-gutter-sm">
                    <div class="col">
                      <q-item-section>
                        <q-item-label>Hoy</q-item-label>
                        <q-skeleton type="QBadge" v-if="typeof(dashboardData?.movimientos_por_fecha.dia) === 'undefined'"/>
                        <q-item-label caption v-else>
                          ${{ dashboardData?.movimientos_por_fecha.dia.toFixed(2) }}
                        </q-item-label>
                      </q-item-section>
                    </div>
                    <div class="col" hidden>
                      <q-item-section>
                        <q-item-label>Semana</q-item-label>
                        <q-skeleton type="QBadge" v-if="typeof(dashboardData?.movimientos_por_fecha.semana) === 'undefined'"/>
                        <q-item-label caption v-else>
                          ${{ dashboardData?.movimientos_por_fecha.semana.toFixed(2) }}
                        </q-item-label>
                      </q-item-section>
                    </div>
                    <div class="col">
                      <q-item-section>
                        <q-item-label>Mes</q-item-label>
                        <q-skeleton type="QBadge" v-if="typeof(dashboardData?.movimientos_por_fecha.mes) === 'undefined'"/>
                        <q-item-label caption v-else>
                          ${{ dashboardData?.movimientos_por_fecha.mes.toFixed(2) }}
                        </q-item-label>
                      </q-item-section>
                    </div>
                  </div>
                </q-card-section>
              </q-expansion-item>
            </q-card>
          </div>
        </div>
        <div class="row q-col-gutter-md q-pa-md">
          <div class="col-12">
            <q-card flat bordered>
              <q-table title="Mis cuentas" :rows="dashboardData?.banks" :columns="columns" row-key="name"
                no-data-label="No hay cuentas disponibles."
              />
            </q-card>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-4">
        <div class="row q-col-gutter-md q-pa-md">
          <div class="col-12">
            <q-card flat bordered style="background-color: #fff;">
              <q-card-section class="items-center justify-between" horizontal>
                <q-card-section>
                  <q-item-label>
                    <q-btn dense flat :icon="expanded.calendario ? 'keyboard_arrow_down' : 'keyboard_arrow_up'"
                      @click="() => expanded.calendario = !expanded.calendario" />
                    Calendario
                  </q-item-label>
                </q-card-section>
              </q-card-section>
              <q-expansion-item v-model="expanded.calendario">
                <q-date flat v-model="date" style="width: 100%" :minimal="$q.screen.lt.lg" />
              </q-expansion-item>
            </q-card>
          </div>
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



          </div>
        </div>
      </div>
    </div>



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

.q-expansion-item__container>.q-link {
  display: none;
}

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
