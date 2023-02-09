<template>
  <q-page class="flex column flex-center q-pa-md" v-if="isLoading">
    <q-spinner color="primary" size="3em" />
  </q-page>
  <template v-else>
    <q-page class="flex column flex-center q-pa-md" v-if="!ingresos.length">
      <p>No se han encontrado datos.</p>
      <q-btn color="primary" @click="retryFetchIngresos">Volver a intentar</q-btn>
    </q-page>
    <q-page class="flex column q-pa-md" v-else>
      <q-list bordered>
        <q-item v-for="ingreso in ingresos" :key="ingreso.id" class="q-my-sm">
  
          <q-item-section>
            <q-item-label>{{ ingreso.reason }}<i v-if="!ingreso.reason">Sin descripción</i></q-item-label>
            <q-item-label caption lines="1">
              <ul v-if="ingreso.categori_name">
                <li>{{ ingreso.categori_name }}</li>
                <li v-if="ingreso.sub_categori_name">{{ ingreso.sub_categori_name }}</li>
              </ul>  
            </q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label class="text-secondary text-weight-medium">${{ ingreso.total.toFixed(2) }}</q-item-label>
            <q-item-label caption>{{ ingreso.created_at }}</q-item-label>
          </q-item-section>
          
  
          <q-item-section side>
            <q-btn-dropdown color="primary" padding="xs">
              <q-list>
                <q-item clickable v-close-popup :to="`/ingresos/${ingreso.id}`">
                  <q-item-section avatar>
                    <q-avatar icon="edit"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Editar</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="handleDeleteIngreso(ingreso.id)">
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
        <q-btn fab icon="add" color="secondary" to="/ingresos/new" />
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

const ingresos = ref([])
const isLoading = ref(true)

const currentPage = ref(1)
const maxPages = ref(0)

watch(currentPage, () => {
  fetchIngresos()
})

const retryFetchIngresos = () => {
  if (currentPage.value !== 1) currentPage.value = 1
  else fetchIngresos()
}

function fetchIngresos() {
  isLoading.value = true
  api.get('ingresos?page=' + currentPage.value).then(response => {
    console.log(response);
    if (response.data?.data) {
      ingresos.value = response.data.data

      let uniqueCategories = [...new Set(ingresos.value.map(ingreso => ingreso.categori_id).filter(ingreso => ingreso > 0))]
      let uniqueSubCategories = [...new Set(ingresos.value.map(ingreso => ingreso.sub_categori_id).filter(ingreso => ingreso > 0))]

      // Obtener categorías
      uniqueCategories.forEach(cat_id => {
        api.get('categorias/' + cat_id).then(response => {
          ingresos.value = ingresos.value.map(ingreso => {
            if (ingreso.categori_id === response.data.id) {
              ingreso.categori_name = response.data.name
            }
            return ingreso
          })
        })
      });

      // Obtener subcategorías
      uniqueSubCategories.forEach(subcat_id => {
        api.get('sub-categorias/' + subcat_id).then(response => {
          ingresos.value = ingresos.value.map(ingreso => {
            if (ingreso.sub_categori_id === response.data.id) {
              ingreso.sub_categori_name = response.data.name
            }
            return ingreso
          })
        })
      });

    }
    if (response.data?.pagination) {
      maxPages.value = response.data.pagination.lastPage
    }
  }).finally(() => isLoading.value = false)
}

const handleDeleteIngreso = ingresoId => {
  
  let ingreso = ingresos.value.find(ingreso => ingreso.id === ingresoId)
  
  if (ingreso !== undefined) {
    $q.dialog({
      title: 'Eliminar ingreso',
      message: `¿Estás seguro de eliminar ${ingreso.reason ? '"' + ingreso.reason + '"' : 'este ingreso' }? Esta acción no se puede deshacer.`,
      cancel: true,
    }).onOk(() => {
      api.delete('ingresos/' + ingresoId)
      .then(response => {
        if (response.data?.status === 200) {
          ingresos.value = ingresos.value.filter(ingreso => ingreso.id !== ingresoId)
          $q.notify({
            type: 'positive',
            message: 'Ingreso eliminado.',
          })
        } else {
          console.log(response.data);
            $q.notify({
            type: 'negative',
            message: 'No se pudo eliminar el ingreso.',
          })
        }
      })
    })
  } else {
    $q.notify({
      type: 'negative',
      message: 'No se encuentra el ingreso seleccionado.',
    })
  }
}

onMounted(() => { fetchIngresos() })

</script>
