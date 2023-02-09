<template>
  <q-page class="flex column q-pa-md flex-center text-center">
    <q-spinner
        color="primary"
        size="3em"
        v-if="isLoading"
    />
    <template v-else>
      <div v-if="categoryData.id" class="row justify-center full-width">
        <div class="col-12 col-sm-8 col-md-6">
          <h5 class="page-title">Editar "{{ categoryData.name }}"</h5>
          <q-form
            @submit="handleSubmitCategoria"
            class="q-gutter-md"
          >
            <q-input
              filled
              square
              type="text"
              v-model="updateData.name"
              label="Descripción"
            />
            <q-select
              filled
              square
              label="Tipo"
              v-model="updateData.tipo"
              :options="tiposCategoria"
              :rules="[ val => val?.value > 0 || 'Selecciona un tipo válido.' ]"
            />
            <q-select
              filled
              square
              label="Categoría padre"
              v-model="updateData.category"
              :options="availableCategories"
              :loading="categoriesLoading"
              @virtual-scroll="onCategoriesScroll"
              clearable
              :rules="[ val => val?.value > 0 || 'Selecciona una categoría válida.' ]"
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

const categoryData = ref(null)

const updateData = ref({
  name: null,
  tipo: null,
  category: null,
})

const categoryType = route.params.type
const categoryId = route.params.id

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

const isLoading = ref(true)
const buttonLoading = ref(false)

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

function fetchData() {  
  isLoading.value = true;
  let endpoint = categoryType == 'cat' ? 'categorias' : (categoryType == 'sub' ? 'sub-categorias' : '')
  
  if (!endpoint) return isLoading.value = false

  api.get(endpoint + '/' + categoryId)
    .then(response => {
      console.log(response);
      categoryData.value = response.data
      updateData.value.name = response.data.name
      if ([1, 2].includes(response.data?.tipo)) {
        updateData.value.tipo = {
          label: tiposCategoria.find(tipo => tipo.value === response.data.tipo)?.label,
          value: response.data.tipo
        }
      }
      if (response.data?.categori_id) {
        api.get('categorias/' + response.data.categori_id).then(response2 => {
          categoryData.value.categoryName = response2.data?.name || response.data.categori_id
          updateData.value.category = {
            label: categoryData.value.categoryName,
            value: response2.data?.id || response.data.categori_id
          }
        })
      }
    })
    .catch(e => console.log(e))
    .finally(() => isLoading.value = false)
}

onMounted(() => {
  fetchData()
  getCategorias(nextPageCategories.value)
})

const handleSubmitCategoria = () => {
  buttonLoading.value = true
  let endpoint = categoryType == 'cat' ? 'categorias' : (categoryType == 'sub' ? 'sub-categorias' : '')

  let postData = {
    name: updateData.value?.name,
    tipo: updateData.value?.tipo?.value
  }

  if (updateData.value?.category?.value) {
    postData.categori_id = updateData.value.category.value
  }

  // Actualizar categoría
  api.put(endpoint + '/' + categoryId, postData).then(response => {
    if (response.data?.status == 200) {
      categoryData.value = response.data?.data
      $q.notify({
        type: 'positive',
        message: 'Actualizado exitosamente.',
      })
    } else {
      console.log(response.data);
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
}

const handleResetForm = () => {
  updateData.value.name = categoryData.value?.name || null
  updateData.value.total = categoryData.value?.total || null
  if (categoryData.value?.categori_id) {
    updateData.value.category = {
      label: categoryData.value.categoryName || categoryData.value.categori_id,
      value: categoryData.value.categori_id,
    }
  } else { updateData.value.category = null }

  if ([1, 2].includes(categoryData.value?.tipo)) {
    updateData.value.tipo = {
      label: tiposCategoria.find(tipo => tipo.value === categoryData.value.tipo)?.label,
      value: categoryData.value.tipo
    }
  } else { updateData.value.tipo = null }
}

</script>
