<template>
  <q-page class="flex column flex-center q-pa-md" v-if="isLoading">
    <q-spinner color="primary" size="3em" />
  </q-page>
  <template v-else>
    <q-page class="flex column flex-center q-pa-md" v-if="!movimientos.length">
      <p>No se han encontrado datos.</p>
      <q-btn color="primary" @click="retryFetchMovimientos">Volver a intentar</q-btn>

      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-fab color="secondary" icon="keyboard_arrow_up" direction="up" vertical-actions-align="right">
          <q-fab-action label="Importar desde archivo" color="secondary" icon="upload" to="/movimientos/importar" external-label label-position="left"/>
          <q-fab-action label="Nuevo movimiento" color="secondary" icon="add" to="/movimientos/new" external-label label-position="left"/>
        </q-fab>
      </q-page-sticky>


      
    </q-page>
    <q-page class="flex column q-pa-md" v-else>
      <q-list bordered>
        <q-item v-for="movimiento in movimientos" :key="movimiento.id" class="q-my-sm">

          <q-item-section avatar>
            <q-avatar text-color="positive" icon="trending_up" v-if="movimiento.tipo == 1"/>
            <q-avatar text-color="negative" icon="trending_down" v-if="movimiento.tipo == 2"/>
          </q-item-section>
  
          <q-item-section>
            <q-item-label>{{ movimiento.reason }}<i v-if="!movimiento.reason">Sin descripción</i></q-item-label>
            <q-item-label>
              <q-badge color="secondary" v-if="movimiento.account?.name">{{ movimiento.account.name }}</q-badge>
            </q-item-label>
            <q-item-label caption lines="1">
              <ul v-if="movimiento.categori_name">
                <li>{{ movimiento.categori_name }}</li>
                <li v-if="movimiento.sub_categori_name">{{ movimiento.sub_categori_name }}</li>
              </ul>  
            </q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label class="text-secondary text-weight-medium">${{ movimiento.total.toFixed(2) }}</q-item-label>
            <q-item-label caption>{{ movimiento.created_at }}</q-item-label>
          </q-item-section>
          
  
          <q-item-section side>
            <q-btn-dropdown color="primary" padding="xs">
              <q-list>
                <q-item clickable v-close-popup :to="`/movimientos/${movimiento.id}`">
                  <q-item-section avatar>
                    <q-avatar icon="edit"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Editar</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="handleDeleteMovimiento(movimiento.id)">
                  <q-item-section avatar>
                    <q-avatar icon="delete"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Eliminar</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-item-section>
        </q-item>
      </q-list>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-fab color="secondary" icon="keyboard_arrow_up" direction="up" vertical-actions-align="right">
          <q-fab-action label="Importar desde archivo" color="secondary" icon="upload" to="/movimientos/importar" external-label label-position="left"/>
          <q-fab-action label="Nuevo movimiento" color="secondary" icon="add" to="/movimientos/new" external-label label-position="left"/>
        </q-fab>
      </q-page-sticky>
      <div class="q-pa-lg flex flex-center">
        <q-pagination
          v-model="currentPage"
          :max="maxPages"
          :max-pages="6"
          :boundary-numbers="false"
        />
      </div>
    </q-page>
  </template>
</template>

<style>

.q-item__label.q-item__label--caption ul {
  display: flex;
  padding-left: 0;
  list-style: none;
}

.q-item__label.q-item__label--caption ul li:not(:last-child):after {
  content: '\2794';
  margin: 0 5px;
}

</style>

<script setup>

import { ref, watch, onMounted } from 'vue'
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const movimientos = ref([])
const isLoading = ref(true)

const currentPage = ref(1)
const maxPages = ref(0)

watch(currentPage, () => {
  fetchMovimientos()
})

const retryFetchMovimientos = () => {
  if (currentPage.value !== 1) currentPage.value = 1
  else fetchMovimientos()
}

function fetchMovimientos() {
  isLoading.value = true
  api.get('movimientos?page=' + currentPage.value + '&with[]=account').then(response => {
    if (response.data?.data) {

      console.log(response.data.data);
      movimientos.value = response.data.data

      let uniqueCategories = [...new Set(movimientos.value.map(movimiento => movimiento.categori_id).filter(movimiento => movimiento > 0))]
      
      // Obtener categorías
      uniqueCategories.forEach(cat_id => {
        api.get('categorias/' + cat_id + '?with[]=sub_categories').then(response => {

          movimientos.value = movimientos.value.map(movimiento => {
            if (response.data) {
              if (movimiento.categori_id === response.data.id) {
                movimiento.categori_name = response.data.name
                movimiento.sub_categori_name = response.data.sub_categories.length &&
                  (response.data.sub_categories.find(subcat => subcat.id === movimiento.sub_categori_id)?.name || 'Otros')
              }
            }
            return movimiento
          })
        })
      });

      // Obtener subcategorías
      /*uniqueSubCategories.forEach(subcat_id => {
        api.get('sub-categorias/' + subcat_id).then(response => {
          movimientos.value = movimientos.value.map(movimiento => {
            if (movimiento.sub_categori_id === response.data.id) {
              movimiento.sub_categori_name = response.data.name
            }
            return movimiento
          })
        })
      });*/

    }
    if (response.data?.pagination) {
      maxPages.value = response.data.pagination.lastPage
    }
  }).finally(() => isLoading.value = false)
}

const handleDeleteMovimiento = movimientoId => {
  
  let movimiento = movimientos.value.find(movimiento => movimiento.id === movimientoId)
  
  if (movimiento !== undefined) {
    $q.dialog({
      title: 'Eliminar movimiento',
      message: `¿Estás seguro de eliminar ${movimiento.reason ? '"' + movimiento.reason + '"' : 'este movimiento' }? Esta acción no se puede deshacer.`,
      cancel: true,
    }).onOk(() => {
      api.delete('movimiento/' + movimientoId)
      .then(response => {
        if (response.data?.status === 200) {
          movimientos.value = movimientos.value.filter(movimiento => movimiento.id !== movimientoId)
          $q.notify({
            type: 'positive',
            message: 'Movimiento eliminado.',
          })
        } else {
          console.log(response.data);
            $q.notify({
            type: 'negative',
            message: 'No se pudo eliminar el movimiento.',
          })
        }
      })
    })
  } else {
    $q.notify({
      type: 'negative',
      message: 'No se encuentra el movimiento seleccionado.',
    })
  }
}

onMounted(() => { fetchMovimientos() })

</script>
