<template>
  <q-page class="flex column flex-center q-pa-md" v-if="isLoading">
    <q-spinner color="primary" size="3em" />
  </q-page>
  <template v-else>
    <q-page class="flex column flex-center q-pa-md" v-if="!cuentas.length">
      <p>No se han encontrado datos.</p>
      <q-btn color="primary" @click="retryFetchCuentas">Volver a intentar</q-btn>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="add" color="secondary" to="/cuentas/new" />
      </q-page-sticky>
    </q-page>
    <q-page class="flex column q-pa-md" v-else>
      <q-list bordered>
        <q-item v-for="cuenta in cuentas" :key="cuenta.id" class="q-my-sm">
  
          <q-item-section>
            <q-item-label>{{ cuenta.name }}</q-item-label>
            <q-item-label caption>
              {{  cuenta.description }}
            </q-item-label>
          </q-item-section>          
  
          <q-item-section side>
            <q-btn-dropdown color="primary" padding="xs">
              <q-list>
                <q-item clickable v-close-popup :to="`/cuentas/${cuenta.id}`">
                  <q-item-section avatar>
                    <q-avatar icon="edit"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Editar</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="handleDeleteCuenta(cuenta.id)">
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
        <q-btn fab icon="add" color="secondary" to="/cuentas/new" />
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

const cuentas = ref([])
const isLoading = ref(true)

const currentPage = ref(1)
const maxPages = ref(0)

watch(currentPage, () => {
  fetchCuentas()
})

const retryFetchCuentas = () => {
  if (currentPage.value !== 1) currentPage.value = 1
  else fetchCuentas()
}

function fetchCuentas() {
  isLoading.value = true
  api.get('bank_account?page=' + currentPage.value).then(response => {
    console.log(response);
    if (response.data?.data) {
      cuentas.value = response.data.data

      let uniqueCategories = [...new Set(cuentas.value.map(cuenta => cuenta.categori_id).filter(cuenta => cuenta > 0))]
      let uniqueSubCategories = [...new Set(cuentas.value.map(cuenta => cuenta.sub_categori_id).filter(cuenta => cuenta > 0))]

      // Obtener categorías
      uniqueCategories.forEach(cat_id => {
        api.get('categorias/' + cat_id).then(response => {
          cuentas.value = cuentas.value.map(cuenta => {
            if (cuenta.categori_id === response.data.id) {
              cuenta.categori_name = response.data.name
            }
            return cuenta
          })
        })
      });

      // Obtener subcategorías
      uniqueSubCategories.forEach(subcat_id => {
        api.get('sub-categorias/' + subcat_id).then(response => {
          cuentas.value = cuentas.value.map(cuenta => {
            if (cuenta.sub_categori_id === response.data.id) {
              cuenta.sub_categori_name = response.data.name
            }
            return cuenta
          })
        })
      });

    }
    if (response.data?.pagination) {
      maxPages.value = response.data.pagination.lastPage
    }
  }).finally(() => isLoading.value = false)
}

const handleDeleteCuenta = cuentaId => {
  
  let cuenta = cuentas.value.find(cuenta => cuenta.id === cuentaId)
  
  if (cuenta !== undefined) {
    $q.dialog({
      title: 'Eliminar cuenta',
      message: `¿Estás seguro de eliminar ${cuenta.name ? '"' + cuenta.name + '"' : 'este cuenta' }? Esta acción no se puede deshacer.`,
      cancel: true,
    }).onOk(() => {
      api.delete('bank_account/' + cuentaId)
      .then(response => {
        if (response.data?.status === 200) {
          cuentas.value = cuentas.value.filter(cuenta => cuenta.id !== cuentaId)
          $q.notify({
            type: 'positive',
            message: 'Cuenta eliminada.',
          })
        } else {
          console.log(response.data);
            $q.notify({
            type: 'negative',
            message: 'No se pudo eliminar la cuenta.',
          })
        }
      })
    })
  } else {
    $q.notify({
      type: 'negative',
      message: 'No se encuentra la cuenta seleccionada.',
    })
  }
}

onMounted(() => { fetchCuentas() })

</script>
