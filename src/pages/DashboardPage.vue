<template>
  <q-page>
    <div class="row">
      <div class="col-12 col-lg-8">
        <div class="row q-pa-md" :class="$q.screen.lt.lg || 'q-col-gutter-md '">
          <div class="col-4">
            <CardTotals class="" title="Balance" total="300" icon="account_balance_wallet" />
          </div>
          <div class="col-4">
            <CardTotals class="" title="Total ingresos" total="150" icon="trending_up" />
          </div>
          <div class="col-4">
            <CardTotals class="" title="Total gastos" total="100" icon="trending_down" />
          </div>
        </div>
        <div class="row q-col-gutter-md q-px-md">
          <div class="col-12 col-lg-8">
            <q-card flat bordered>
              <q-card-section class="items-center justify-between" horizontal>
                <q-card-section>
                  <q-item-label>
                    <q-btn 
                      dense 
                      flat 
                      :icon="expanded.finanzas ? 'keyboard_arrow_down' : 'keyboard_arrow_up'" 
                      @click="() => expanded.finanzas = !expanded.finanzas"
                      
                    />
                    Finanzas
                  </q-item-label>
                </q-card-section>
                <q-card-section>
                  <q-btn-group unelevated>
                    <q-btn size="sm" color="primary" label="7D" />
                    <q-btn size="sm" color="orange-2" text-color="secondary" label="15D" />
                    <q-btn size="sm" color="orange-2"  text-color="secondary" label="30D" />
                  </q-btn-group>
                </q-card-section>
              </q-card-section>

              <q-expansion-item v-model="expanded.finanzas">
                <q-separator />
                <q-card-section>
                  <BarChart />
                </q-card-section>
              </q-expansion-item>



            </q-card>
          </div>
          <div class="col-12 col-lg-4">
            <q-card flat bordered>
              <q-card-section class="items-center justify-between" horizontal>
                <q-card-section>
                  <q-item-label>
                    <q-btn 
                      dense 
                      flat 
                      :icon="expanded.gastos ? 'keyboard_arrow_down' : 'keyboard_arrow_up'" 
                      @click="() => expanded.gastos = !expanded.gastos"
                      
                    />
                    Gastos
                  </q-item-label>
                </q-card-section>
              </q-card-section>
              <q-expansion-item v-model="expanded.gastos">
                <q-separator />
                <q-card-section>
                  <PieChart />
                </q-card-section>
                <q-card-section>
                  <div class="row q-col-gutter-sm">
                    <div class="col">
                      <q-item-section>
                        <q-item-label>Hoy</q-item-label>
                        <q-item-label caption>
                          $12,34
                        </q-item-label>
                      </q-item-section>
                    </div>
                    <div class="col">
                      <q-item-section>
                        <q-item-label>Semana</q-item-label>
                        <q-item-label caption>
                          $123,45
                        </q-item-label>
                      </q-item-section>
                    </div>
                    <div class="col">
                      <q-item-section>
                        <q-item-label>Mes</q-item-label>
                        <q-item-label caption>
                          $1.234,50
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
              <q-table title="Mis cuentas" :rows="rows" :columns="columns" row-key="name" />            
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
                    <q-btn 
                      dense 
                      flat 
                      :icon="expanded.calendario ? 'keyboard_arrow_down' : 'keyboard_arrow_up'" 
                      @click="() => expanded.calendario = !expanded.calendario"
                      
                    />
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
                  <q-btn 
                    dense 
                    flat 
                    :icon="expanded.movimientos ? 'keyboard_arrow_down' : 'keyboard_arrow_up'" 
                    @click="() => expanded.movimientos = !expanded.movimientos"
                    
                  />
                  Últimos movimientos
                </q-item-label>
              </q-card-section>
              <q-expansion-item v-model="expanded.movimientos">
                <q-separator/>
                <q-list>
                  <q-item v-for="movimiento in movimientos" :key="movimiento.id" class="q-my-sm" clickable v-ripple>
                    <q-item-section avatar>
                      <q-avatar icon="trending_down" text-color="negative" v-if="movimiento.id % 2" />
                      <q-avatar icon="trending_up" text-color="positive" v-else />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>${{ movimiento.total.toFixed(2) }}</q-item-label>
                      <q-item-label caption lines="1">{{ movimiento.name }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      {{  movimiento.created_at }}
                    </q-item-section>
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

.q-expansion-item__container > .q-link {
  display: none;
}

.q-date__header {
  border-radius: 0;
}
</style>

<script setup>

import { useAuthStore } from 'src/stores/auth.store';
import BarChart from '../components/Dashboard/BarChart.vue'
import PieChart from '../components/Dashboard/PieChart.vue'

import CardTotals from 'src/components/Dashboard/CardTotals.vue';
import { useQuasar } from 'quasar';
import { ref } from 'vue'

const $q = useQuasar()

const expanded = ref({
  finanzas: true,
  gastos: true,
  calendario: true,
  movimientos: true,
})

const date = ref('2023/02/15')

const movimientos = [{
  id: 1,
  name: 'Pago de Internet',
  total: 35.25,
  created_at: '2023/02/16'
}, {
  id: 2,
  name: 'Venta de producto',
  total: 150.12,
  created_at: '2023/02/15'
}, {
  id: 3,
  name: 'Alquiler apartamento',
  total: 300,
  created_at: '2023/02/14'
}, {
  id: 4,
  name: 'Bono de servicio',
  total: 10,
  created_at: '2023/02/13'
}]

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Dessert (100g serving)',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
  { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
  { name: 'protein', label: 'Protein (g)', field: 'protein' },
  { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' }
]

const rows = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    sodium: 87
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    sodium: 129
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    sodium: 337
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    sodium: 327
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    sodium: 50
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    sodium: 326
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    sodium: 54
  }
]


const authStore = useAuthStore()

</script>
