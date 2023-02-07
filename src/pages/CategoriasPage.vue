<template>
  <q-page class="flex column flex-center q-pa-md" v-if="isLoading">
    <q-spinner color="primary" size="3em" />
  </q-page>
  <template v-else>

    <q-page class="flex column q-pa-md">
      
      <div class="q-gutter-xs q-mb-md">
        <q-btn size="sm" class="q-px-sm" color="primary" @click="handleClickNewCategory(1)" label="Ingreso" icon="add"/>
        <q-btn size="sm" class="q-px-sm" color="primary" @click="handleClickNewCategory(2)" label="Gasto" icon="add"/>
        <!-- <q-btn size="sm" class="q-px-sm" color="primary" @click="handleClickFilterCategories" label="Filtrar" icon="filter_alt"/> -->
        <q-btn size="sm" class="q-px-sm" color="negative" @click="handleClickDeleteSelectedCategory(selectedCategory)" icon="delete" v-if="selectedCategory"/>
        <!-- <q-btn size="sm" class="q-px-sm" color="secondary" @click="handleClickEditSelectedCategory" icon="edit" v-if="selectedCategory"/> -->
      </div>
      <div class="categories-wrapper">
        <q-tree 
          :nodes="categories"
          v-model:selected="selectedCategory"
          node-key="key"
          default-expand-all
          @lazy-load="lazyLoadSubCategory"
          no-nodes-label="No hay categorías disponibles." 
        >
          <template v-slot:header-add-subcategory="prop">
            <q-btn size="sm" class="q-px-sm" @click="handleClickNewCategory(prop.node.type, prop.node.parentId)" color="primary" label="Agregar subcategoría" icon="add"/>
          </template>
        </q-tree>
      </div>
      <div class="pagination-wrapper q-px-md q-pt-md flex flex-center">
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
  .categories-wrapper {
    flex: 0 0 calc(100vh - 180px);
    overflow: auto;
  }

  .q-tree__node-header-content {
    transition: 0.2s;
  }

  .q-tree__node--selected .q-tree__node-header-content {
    background-color: #eee;
    border-radius: 3px;
    padding: 5px;
    color: #000;
    font-weight: 600;
  }

</style>

<script setup>

import { ref, watch, onMounted } from 'vue'
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';

const $q = useQuasar()

const isLoading = ref(true)

const selectedCategory = ref(null)

const categories = ref([])

const currentPage = ref(1)
const maxPages = ref(0)

//Tipo => 1: Ingreso, 2: Gasto
const handleClickNewCategory = (type, parentCategoryId = null) => {

  let message = 'Escribe el nombre de la categoría:'
  if (parentCategoryId !== null) {
    let parentCategory = categories.value.find(cat => cat.id == parentCategoryId)
    message = `Escribe el nombre de la subcategoría (${parentCategory.label}):`
  }
  
  const dialog = $q.dialog({
    title: `Nuevo ${type == 1 ? 'ingreso' : (type == 2 ? 'gasto' : '')}`,
    message,
    prompt: {
      model: '',
      isValid: val => val.length > 1,
      type: 'text'
    },
    cancel: true,
    persistent: true
  }).onOk(categoryName => {

    const dialog = $q.dialog({
      progress: true,
      persistent: true,
      ok: false,
    })

    let endpoint = parentCategoryId !== null ? 'sub-categorias' : 'categorias'

    let postData = {name: categoryName, tipo: type}

    if (parentCategoryId !== null)  {
      postData.categori_id = parentCategoryId
    }

    api.post(endpoint, postData).then(response => {
      if (response.data?.data) {
  
        let createdCategory = {
          label: response.data.data.name,
          key: endpoint == 'categorias' ? 'cat-' + response.data.data.id : 'sub-' + response.data.data.id,
          id: response.data.data.id,
          type: response.data.data.tipo,
        }

        if (endpoint == 'categorias') {
          createdCategory.icon = response.data.data.tipo == 1 ? 'trending_up' : (response.data.data.tipo == 2 ? 'trending_down' : 'stop');
          createdCategory.iconColor = response.data.data.tipo == 1 ? 'positive' : (response.data.data.tipo == 2 ? 'negative' : 'primary');
          createdCategory.lazy = true;
          categories.value.unshift(createdCategory)
        } else if (endpoint == 'sub-categorias') {
          let categoryIndex = categories.value.findIndex(cat => cat.id == parentCategoryId)
          categories.value[categoryIndex].children.unshift(createdCategory)
        }

        $q.notify({
          type: 'positive',
          message: 'Categoría creada.',
        })
      } else {
        $q.notify({
          type: 'negative',
          message: 'No se pudo crear la categoría.',
        })
      }
    })
    .catch(e => {
      console.log(e)
      $q.notify({
        type: 'negative',
        message: 'Ha ocurrido un error. Vuelve a intentarlo más tarde.',
      })
    })
    .finally(() => dialog.hide())    

  })

}

const handleClickFilterCategories = () => {

}

const handleClickDeleteSelectedCategory = (deleteKey) => {

  let endpoint;
  let categoryIndex = -1;
  let category = categories.value.find(cat => cat.key === deleteKey)

  if (category !== undefined) {
    endpoint = 'categorias/'
  } else {
    categoryIndex = categories.value.findIndex(cat => cat.children?.some(subcat => subcat.key === deleteKey));
    if (categoryIndex > -1) {
      category = categories.value[categoryIndex].children.find(subcat => subcat.key === deleteKey)
      endpoint = 'sub-categorias/'
    }
  }

  if (endpoint && category) {
    $q.dialog({
      title: 'Eliminar categoría',
      message: '¿Estás seguro de eliminar la categoría? Esta acción no se puede deshacer.',
      cancel: true,
    }).onOk(() => {
      api.delete(endpoint + category.id)
      .then(response => {
        if (response.data?.status === 200) {

          if (endpoint == 'categorias/') {
            categories.value = categories.value.filter(cat => cat.key !== deleteKey)
          } else if (endpoint == 'sub-categorias/') {
            categories.value[categoryIndex].children = categories.value[categoryIndex].children.filter(subcat => subcat.key !== deleteKey)
          }

          $q.notify({
            type: 'positive',
            message: 'Categoría eliminada.',
          })
        } else {
          console.log(deleteKey, response.data);
          $q.notify({
            type: 'negative',
            message: 'No se pudo eliminar la categoría.',
          })
        }
      })
    })
  } else {
    $q.notify({
      type: 'negative',
      message: 'No se encuentra la categoría.',
    })
  }

}

const handleClickEditSelectedCategory = () => {
  console.log('Editar categoría');
}

watch(currentPage, () => {
  fetchCategories()
})

function fetchCategories() {
  isLoading.value = true
  api.get('categorias?page=' + currentPage.value).then(response => {
    if (response.data?.data) {
      categories.value = response.data.data.map(cat => {
        let category = {
          label: cat.name,
          key: 'cat-' + cat.id,
          id: cat.id,
          icon: cat.tipo == 1 ? 'trending_up' : (cat.tipo == 2 ? 'trending_down' : 'stop'),
          iconColor: cat.tipo == 1 ? 'positive' : (cat.tipo == 2 ? 'negative' : 'primary'),
          type: cat.tipo,
          subcategoriesPage: 1,
          lazy: true
        }
        return category
      })
    }
    if (response.data?.pagination) {
      maxPages.value = response.data.pagination.lastPage
    }
  }).finally(() => isLoading.value = false)
}

const lazyLoadSubCategory = ({ node, key, done, fail }) => {

  api.get('sub-categorias?page=' + node.subcategoriesPage).then(response => {
    if (response.data?.data) {

      let subcategories = response.data.data.map(cat => {
        let subcategory = {
          label: cat.name,
          key: 'sub-' + cat.id,
          id: cat.id,
        }
        return subcategory
      })      

      subcategories.push({
        selectable: false,
        type: node.type,
        parentId: node.id,
        header: 'add-subcategory',
      })

      done(subcategories);

    } else {

      return fail()    

    }
  }).catch(e => fail())

}    

onMounted(() => { fetchCategories() })

</script>
