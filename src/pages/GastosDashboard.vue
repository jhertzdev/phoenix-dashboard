<template>
  <q-page class="flex column flex-center q-pa-md" v-if="isLoading">
    <q-spinner color="primary" size="3em" />
  </q-page>
  <template v-else>
    <q-page class="flex column flex-center q-pa-md" v-if="!gastos.length">
      <p>No se han encontrado datos.</p>
      <q-btn color="primary" @click="retryFetchGastos">Volver a intentar</q-btn>
    </q-page>
    <q-page class="flex column q-pa-md" v-else>
      <q-list bordered>
        <q-item v-for="gasto in gastos" :key="gasto.id" class="q-my-sm">
  
          <q-item-section>
            <q-item-label>{{ gasto.reason }}<i v-if="!gasto.reason">Sin descripción</i></q-item-label>
            <q-item-label caption lines="1">
              <ul v-if="gasto.categori_name">
                <li>{{ gasto.categori_name }}</li>
                <li v-if="gasto.sub_categori_name">{{ gasto.sub_categori_name }}</li>
              </ul>  
            </q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label class="text-secondary text-weight-medium">${{ gasto.total.toFixed(2) }}</q-item-label>
            <q-item-label caption>{{ gasto.created_at }}</q-item-label>
          </q-item-section>
          
  
          <q-item-section side>
            <q-btn-dropdown color="primary" padding="xs">
              <q-list>
                <q-item clickable v-close-popup :to="`/gastos/${gasto.id}`">
                  <q-item-section avatar>
                    <q-avatar icon="edit"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Editar</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="handleDeleteGasto(gasto.id)">
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
        <q-btn fab icon="add" color="primary" to="/gastos/new" />
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

const gastos = ref([])
const isLoading = ref(true)

const currentPage = ref(1)
const maxPages = ref(0)

watch(currentPage, () => {
  fetchGastos()
})

const retryFetchGastos = () => {
  if (currentPage.value !== 1) currentPage.value = 1
  else fetchGastos()
}

function fetchGastos() {
  isLoading.value = true
  api.get('gastos?page=' + currentPage.value).then(response => {
    console.log(response);
    if (response.data?.data) {
      gastos.value = response.data.data

      let uniqueCategories = [...new Set(gastos.value.map(gasto => gasto.categori_id).filter(gasto => gasto > 0))]
      let uniqueSubCategories = [...new Set(gastos.value.map(gasto => gasto.sub_categori_id).filter(gasto => gasto > 0))]

      // Obtener categorías
      uniqueCategories.forEach(cat_id => {
        api.get('categorias/' + cat_id).then(response => {
          gastos.value = gastos.value.map(gasto => {
            if (gasto.categori_id === response.data.id) {
              gasto.categori_name = response.data.name
            }
            return gasto
          })
        })
      });

      // Obtener subcategorías
      uniqueSubCategories.forEach(subcat_id => {
        api.get('sub-categorias/' + subcat_id).then(response => {
          gastos.value = gastos.value.map(gasto => {
            if (gasto.sub_categori_id === response.data.id) {
              gasto.sub_categori_name = response.data.name
            }
            return gasto
          })
        })
      });

    }
    if (response.data?.pagination) {
      maxPages.value = response.data.pagination.lastPage
    }
  }).finally(() => isLoading.value = false)
}

const handleDeleteGasto = gastoId => {
  
  let gasto = gastos.value.find(gasto => gasto.id === gastoId)
  
  if (gasto !== undefined) {
    $q.dialog({
      title: 'Eliminar gasto',
      message: `¿Estás seguro de eliminar ${gasto.reason ? '"' + gasto.reason + '"' : 'este gasto' }? Esta acción no se puede deshacer.`,
      cancel: true,
    }).onOk(() => {
      api.delete('gastos/' + gastoId)
      .then(response => {
        if (response.data?.status === 200) {
          gastos.value = gastos.value.filter(gasto => gasto.id !== gastoId)
          $q.notify({
            type: 'positive',
            message: 'Gasto eliminado.',
          })
        } else {
          console.log(response.data);
            $q.notify({
            type: 'negative',
            message: 'No se pudo eliminar el gasto.',
          })
        }
      })
    })
  } else {
    $q.notify({
      type: 'negative',
      message: 'No se encuentra el gasto seleccionado.',
    })
  }
}

onMounted(() => { fetchGastos() })

</script>
