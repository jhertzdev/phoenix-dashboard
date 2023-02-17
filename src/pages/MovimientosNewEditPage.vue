<template>
  <q-page class="flex column q-pa-md flex-center text-center">
    <q-spinner
        color="primary"
        size="3em"
        v-if="isLoading"
    />
    <template v-else>
      <div v-if="!movimientoId || (movimientoId && movimientoData.id)" class="row justify-center full-width">
        <div class="col-12 col-sm-8 col-md-6">
          <h5 class="page-title" v-if="movimientoData?.id">Editar {{ movimientoData.reason ? `"${movimientoData.reason}"` : 'movimiento'}}</h5>
          <h5 class="page-title" v-else>Crear nuevo movimiento</h5>
          <q-form
            @submit="handleSubmitMovimiento"
            class="q-gutter-md"
          >
            <q-input
              filled
              square
              type="text"
              v-model="updateData.reason"
              label="Descripción"
            />
            <q-input
              filled
              square
              type="number"
              v-model.number="updateData.total"              
              label="Total"
              prefix="$"
              lazy-rules
              :rules="[ val => val > 0 || 'Ingresa un valor válido.' ]"
              hint="Ingresa un valor numérico"
            />
            <q-select
              filled
              square
              label="Cuenta"
              v-model="updateData.account"
              :options="availableAccounts"
              :loading="accountsLoading"
              @virtual-scroll="onAccountsScroll"
              clearable
            />
            <q-select
              filled
              square
              label="Tipo"
              v-model="updateData.tipo"
              :options="tiposCategoria"
              clearable
            />
            <q-select
              filled
              square
              label="Categoría"
              v-model="updateData.category"
              :options="availableCategories"
              :loading="categoriesLoading"
              @virtual-scroll="onCategoriesScroll"
              clearable
            />
            <q-select
              filled
              square
              label="Sub-categoría"
              v-model="updateData.subCategory"
              :options="availableSubCategories"
              :loading="subCategoriesLoading"
              @virtual-scroll="onSubCategoriesScroll"
              clearable
            />
            <div class="text-center q-mt-lg">
              <q-btn square label="Reestablecer" type="button" color="secondary" @click="handleResetForm" class="q-mr-sm" />
              <q-btn square label="Guardar" type="submit" color="primary" :loading="buttonLoading" />
            </div>
          </q-form>
        </div>
      </div>
      <template v-else>
        <p>No se pudo cargar la información.</p>
        <q-btn color="primary" @click="fetchData">Volver a intentar</q-btn>
      </template>
    </template>
  </q-page>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted, nextTick } from 'vue'
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth.store';

const $q = useQuasar()
const route = useRoute()
const authStore = useAuthStore()

const movimientoData = ref(null)

const updateData = ref({
  reason: null,
  total: null,
  tipo: null,
  category: null,
  subCategory: null,
  account: null,
  user_id: null,
})

const tiposCategoria = [
  {
    label: 'Ingreso',
    value: 1,
  },
  {
    label: 'Gasto',
    value: 2
  }
]

const movimientoId = route.params.id
const isLoading = ref(!!movimientoId)
const buttonLoading = ref(false)

// Cuentas:
const accountsLoading = ref(false)
const availableAccounts = ref([])
const nextPageAccounts = ref(1)
const lastPageAccounts = ref(0)

const onAccountsScroll = ({to, ref}) => {
  const lastIndex = availableAccounts.value.length - 1 
  if (accountsLoading.value !== true && nextPageAccounts.value <= lastPageAccounts.value && to === lastIndex) {
    accountsLoading.value = true
    getAccounts(nextPageAccounts.value, ref)
  }
}

function getAccounts(pageId, ref = null) {
  api.get('bank_account?page=' + pageId)
    .then(response => {
      availableAccounts.value = [...availableAccounts.value, ...response.data.data.map(acc => {
            return {
              value: acc.id,
              label: acc.name
            }
          }
        )
      ]
      nextPageAccounts.value++
      lastPageAccounts.value = response.data.pagination.lastPage

      if (ref !== null) {
        nextTick(() => {
          ref.refresh()
          accountsLoading.value = false
        })
      }

    })
    .catch(e => console.log('Error', e))
}

// Categorías:
const categoriesLoading = ref(false)
const availableCategories = ref([])
const nextPageCategories = ref(1)
const lastPageCategories = ref(0)

const onCategoriesScroll = ({to, ref}) => {
  const lastIndex = availableCategories.value.length - 1 
  if (categoriesLoading.value !== true && nextPageCategories.value <= lastPageCategories.value && to === lastIndex) {
    categoriesLoading.value = true
    getCategorias(nextPageCategories.value, ref)
  }
}

function getCategorias(pageId, ref = null) {
  api.get('categorias?page=' + pageId)
    .then(response => {        
      availableCategories.value = [...availableCategories.value, ...response.data.data.map(cat => {
            return {
              value: cat.id,
              label: cat.name
            }
          }
        )
      ]
      nextPageCategories.value++
      lastPageCategories.value = response.data.pagination.lastPage

      if (ref !== null) {
        nextTick(() => {
          ref.refresh()
          categoriesLoading.value = false
        })
      }

    })
    .catch(e => console.log('Error', e))
}

// Sub-Categorías:
const subCategoriesLoading = ref(false)
const availableSubCategories = ref([])
const nextPageSubCategories = ref(1)
const lastPageSubCategories = ref(0)

const onSubCategoriesScroll = ({to, ref}) => {
  const lastIndex = availableSubCategories.value.length - 1 
  if (subCategoriesLoading.value !== true && nextPageSubCategories.value <= lastPageSubCategories.value && to === lastIndex) {
    subCategoriesLoading.value = true
    getSubCategorias(nextPageSubCategories.value, ref)
  }
}

function getSubCategorias(pageId, ref = null) {
  api.get('sub-categorias?page=' + pageId)
    .then(response => {
      availableSubCategories.value = [...availableSubCategories.value, ...response.data.data.map(cat => {
            return {
              value: cat.id,
              label: cat.name
            }
          }
        )
      ]
      nextPageSubCategories.value++
      lastPageSubCategories.value = response.data.pagination.lastPage

      if (ref !== null) {
        nextTick(() => {
          ref.refresh()
          subCategoriesLoading.value = false
        })
      }

    })
    .catch(e => console.log('Error', e))
}

function fetchData() {  
  isLoading.value = true;
  api.get('movimiento/' + movimientoId)
    .then(response => {
      movimientoData.value = response.data
      updateData.value.reason = response.data.reason
      updateData.value.total = response.data.total
      if ([1, 2].includes(response.data?.tipo)) {
        updateData.value.tipo = {
          label: tiposCategoria.find(tipo => tipo.value === response.data.tipo)?.label,
          value: response.data.tipo
        }
      }
      if (response.data.account_id) {
        api.get('bank_account/' + response.data.account_id).then(response2 => {
          movimientoData.value.accountName = response2.data?.name || response.data.account_id
          updateData.value.account = {
            label: movimientoData.value.accountName,
            value: response2.data?.id || response.data.account_id
          }
        })
      }
      if (response.data.categori_id) {
        api.get('categorias/' + response.data.categori_id).then(response2 => {
          movimientoData.value.categoryName = response2.data?.name || response.data.categori_id
          updateData.value.category = {
            label: movimientoData.value.categoryName,
            value: response2.data?.id || response.data.categori_id
          }
        })
      }
      if (response.data.sub_categori_id) {
        api.get('sub-categorias/' + response.data.sub_categori_id).then(response2 => {
          movimientoData.value.subCategoryName = response2.data?.name || response.data.sub_categori_id
          updateData.value.subCategory = {
            label: movimientoData.value.subCategoryName,
            value: response2.data?.id || response.data.sub_categori_id
          }
        })
      }
    })
    .catch(e => console.log(e))
    .finally(() => isLoading.value = false)
}

onMounted(() => {
  if (movimientoId) fetchData()
  getCategorias(nextPageCategories.value)
  getSubCategorias(nextPageSubCategories.value)
  getAccounts(nextPageAccounts.value)
})

const handleSubmitMovimiento = () => {
  buttonLoading.value = true

  let postData = {
    reason: updateData.value.reason,
    total: updateData.value.total,
    tipo: updateData.value.tipo?.value,
  }

  if (updateData.value.account?.value) postData.account_id = updateData.value.account.value
  if (updateData.value.category?.value) postData.categori_id = updateData.value.category.value
  if (updateData.value.subCategory?.value) postData.sub_categori_id = updateData.value.subCategory.value

  if (authStore.user.role_name === 'contador') {
    postData.contador_id = authStore.user.id
    postData.user_id = updateData.value?.user_id?.value || null
  } else {
    postData.user_id = authStore.user.id
  }

  // Actualizar movimiento
  if (movimientoId) {
    console.log('Actualizar', postData);
    api.put('movimiento/' + movimientoId, postData).then(response => {
      if (response.data?.status == 200) {
        movimientoData.value = response.data?.data
        $q.notify({
          type: 'positive',
          message: 'Actualizado exitosamente.',
        })
      } else {
        $q.notify({
          type: 'negative',
          message: 'No se pudo actualizar.',
        })
      }
    })
    .catch(e => {
      console.log(e);
      $q.notify({
        type: 'negative',
        message: 'Ha ocurrido un error. Vuelve a intentarlo más tarde.',
      })
    })
    .finally(() => buttonLoading.value = false)
  // Crear nuevo
  } else {
    api.post('movimiento', postData).then(response => {
      console.log(response.data);
      if (response.data?.status == 200) {
        $q.notify({
          type: 'positive',
          message: 'Creado exitosamente.',
        })
        handleResetForm()
      } else {
        $q.notify({
          type: 'negative',
          message: 'No se pudo crear.',
        })
      }
    })
    .catch(e => {
      console.log(e);
      $q.notify({
        type: 'negative',
        message: 'Ha ocurrido un error. Vuelve a intentarlo más tarde.',
      })
    })
    .finally(() => buttonLoading.value = false)
  }

}


const handleResetForm = () => {
  updateData.value.reason = movimientoData.value?.reason || null
  updateData.value.total = movimientoData.value?.total || null

  if ([1, 2].includes(movimientoData.value?.tipo)) {
    updateData.value.tipo = {
      label: tiposCategoria.find(tipo => tipo.value === movimientoData.value.tipo)?.label,
      value: movimientoData.value.tipo
    }
  } else { updateData.value.tipo = null }

  if (movimientoData.value?.account_id) {
    updateData.value.account = {
      label: movimientoData.value.accountName || movimientoData.value.account_id,
      value: movimientoData.value.account_id,
    }
  } else { updateData.value.account = null }

  if (movimientoData.value?.categori_id) {
    updateData.value.category = {
      label: movimientoData.value.categoryName || movimientoData.value.categori_id,
      value: movimientoData.value.categori_id,
    }
  } else { updateData.value.category = null }

  if (movimientoData.value?.sub_categori_id) {
    updateData.value.subCategory = {
      label: movimientoData.value.subCategoryName || movimientoData.value.sub_categori_id,
      value: movimientoData.value.sub_categori_id,
    }
  } else { updateData.value.subCategory = null }
  
}

</script>
