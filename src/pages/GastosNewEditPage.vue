<template>
  <q-page class="flex column q-pa-md flex-center text-center">
    <q-spinner
        color="primary"
        size="3em"
        v-if="isLoading"
    />
    <template v-else>
      <div v-if="!gastoId || (gastoId && gastoData.id)" class="row justify-center full-width">
        <div class="col-12 col-sm-8 col-md-6">
          <h5 class="page-title" v-if="gastoData?.id">Editar {{ gastoData.reason ? `"${gastoData.reason}"` : 'gasto'}}</h5>
          <h5 class="page-title" v-else>Crear nuevo gasto</h5>
          <q-form
            @submit="handleSubmitGasto"
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
              label="Usuario asignado"
              v-model="updateData.user_id"
              :options="availableUsers"
              :loading="usersLoading"
              @virtual-scroll="onUsersScroll"
              v-if="authStore.user.role_name === 'contador'"
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

const gastoData = ref(null)

const updateData = ref({
  reason: null,
  total: null,
  category: null,
  subCategory: null,
  user_id: null,
})

const gastoId = route.params.id
const isLoading = ref(!!gastoId)
const buttonLoading = ref(false)

// Usuarios:
const usersLoading = ref(false)
const availableUsers = ref([])
const nextPageUsers = ref(1)
const lastPageUsers = ref(0)

const onUsersScroll = ({to, ref}) => {
  const lastIndex = availableUsers.value.length - 1 
  if (usersLoading.value !== true && nextPageUsers.value <= lastPageUsers.value && to === lastIndex) {
    usersLoading.value = true
    getUsers(nextPageUsers.value, ref)
  }
}

function getUsers(pageId, ref = null) {
  api.get('users?page=' + pageId)
    .then(response => {        
      availableUsers.value = [...availableUsers.value, ...response.data.data.map(user => {
            return {
              value: user.id,
              label: `${user.name} (${user.email})`
            }
          }
        )
      ]
      nextPageUsers.value++
      lastPageUsers.value = response.data.pagination.lastPage

      if (ref !== null) {
        nextTick(() => {
          ref.refresh()
          usersLoading.value = false
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
  api.get('gastos/' + gastoId)
    .then(response => {
      gastoData.value = response.data
      updateData.value.reason = response.data.reason
      updateData.value.total = response.data.total
      if (response.data.categori_id) {
        api.get('categorias/' + response.data.categori_id).then(response2 => {
          gastoData.value.categoryName = response2.data?.name || response.data.categori_id
          updateData.value.category = {
            label: gastoData.value.categoryName,
            value: response2.data?.id || response.data.categori_id
          }
        })
      }
      if (response.data.sub_categori_id) {
        api.get('sub-categorias/' + response.data.sub_categori_id).then(response2 => {
          gastoData.value.subCategoryName = response2.data?.name || response.data.sub_categori_id
          updateData.value.subCategory = {
            label: gastoData.value.subCategoryName,
            value: response2.data?.id || response.data.sub_categori_id
          }
        })
      }
    })
    .catch(e => console.log(e))
    .finally(() => isLoading.value = false)
}

onMounted(() => {
  if (gastoId) fetchData()
  getCategorias(nextPageCategories.value)
  getSubCategorias(nextPageSubCategories.value)
  if (authStore.user.role_name == 'contador') {
    getUsers(nextPageUsers)
  }
})

const handleSubmitGasto = () => {
  buttonLoading.value = true

  let postData = {
    reason: updateData.value.reason,
    total: updateData.value.total
  }

  if (updateData.value.category?.value) postData.categori_id = updateData.value.category.value
  if (updateData.value.subCategory?.value) postData.sub_categori_id = updateData.value.subCategory.value

  if (authStore.user.role_name === 'contador') {
    postData.contador_id = authStore.user.id
    postData.user_id = updateData.value?.user_id?.value || null
  } else {
    postData.user_id = authStore.user.id
  }

  // Actualizar gasto
  if (gastoId) {
    console.log('Actualizar', postData);
    api.put('gastos/' + gastoId, postData).then(response => {
      if (response.data?.status == 200) {
        gastoData.value = response.data?.data
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
    api.post('gastos', postData).then(response => {
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
  updateData.value.reason = gastoData.value?.reason || null
  updateData.value.total = gastoData.value?.total || null
  if (gastoData.value?.categori_id) {
    updateData.value.category = {
      label: gastoData.value.categoryName || gastoData.value.categori_id,
      value: gastoData.value.categori_id,
    }
  } else { updateData.value.category = null }

  if (gastoData.value?.sub_categori_id) {
    updateData.value.subCategory = {
      label: gastoData.value.subCategoryName || gastoData.value.sub_categori_id,
      value: gastoData.value.sub_categori_id,
    }
  } else { updateData.value.subCategory = null }
  
}

</script>
