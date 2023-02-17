<template>
  <q-page class="flex column flex-center q-pa-md" v-if="isLoading">
    <q-spinner color="primary" size="3em" />
  </q-page>
  <template v-else>

    <q-page class="flex column q-pa-md">
      
      <div class="q-gutter-xs q-mb-md">
        <q-btn size="sm" class="q-px-sm" color="primary" @click="handleClickNewCategory(1)" label="Ingreso" icon="add"/>
        <q-btn size="sm" class="q-px-sm" color="primary" @click="handleClickNewCategory(2)" label="Gasto" icon="add"/>
        <q-btn size="sm" class="q-px-sm" color="negative" @click="handleClickDeleteSelectedCategory(selectedCategory)" icon="delete" v-if="selectedCategory"/>
        <q-btn size="sm" class="q-px-sm" color="secondary" @click="handleClickEditSelectedCategory(selectedCategory)" icon="edit" v-if="selectedCategory"/>
      </div>
      <div class="categories-wrapper" v-if="!filterOptions.name">
        <q-tree 
          :nodes="categories"
          v-model:selected="selectedCategory"
          node-key="key"
          no-nodes-label="No hay categorías disponibles." 
        >
          <template v-slot:header-add-subcategory="prop">
            <q-btn size="sm" class="q-px-sm" @click="handleClickNewCategory(prop.node.type, prop.node.parentId)" color="primary" label="Agregar subcategoría" icon="add"/>
          </template>
        </q-tree>
      </div>
      <div v-else>
        <p>Resultados de "{{ filterOptions.name }}" en {{ filterOptions.nameType == 'categorias' ? 'categorías' : 'sub-categorías'}}:</p>
        <q-tree 
          :nodes="categories"
          v-model:selected="selectedCategory"
          node-key="key"
          no-nodes-label="No hay resultados disponibles." 
        >
          <template v-slot:header-add-subcategory="prop">
            <q-btn size="sm" class="q-px-sm" @click="handleClickNewCategory(prop.node.type, prop.node.parentId)" color="primary" label="Agregar subcategoría" icon="add"/>
          </template>
        </q-tree>
      </div>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="filter_alt" color="primary" @click="handleClickFilterCategories" />
      </q-page-sticky>
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
import DialogFiltros from 'src/components/DialogFiltros.vue';
import { useRouter } from 'vue-router';

const $q = useQuasar()
const router = useRouter()

const isLoading = ref(true)

const selectedCategory = ref(null)
const filterOptions = ref({
  option: null,
  name: null,
  nameType: null,
})

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
          createdCategory.children = [
            {
              selectable: false,
              type: response.data.data.tipo,
              parentId: response.data.data.id,
              header: 'add-subcategory',
            }
          ];
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
        
        // Chequear si fue duplicado
        if (response.data?.message?.includes('1062 Duplicate entry')) {
          $q.notify({
            type: 'negative',
            message: 'La categoría ya existe.',
          })
        } else {
          $q.notify({
            type: 'negative',
            message: 'No se pudo crear la categoría.',
          })
        }

        
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
  $q.dialog({
    component: DialogFiltros,
    componentProps: {      
      options: {
        label: 'Tipo',
        selected: filterOptions.value?.option,
        items: [
          { label: 'Ingreso', value: 1 },
          { label: 'Gasto', value: 2 },
          { label: 'Todos', value: null },
        ],
      },
      queryName: filterOptions.value?.name,
      queryType: filterOptions.value?.nameType,
    },
  }).onOk(data => {
    currentPage.value = 1
    filterOptions.value = data
    console.log(filterOptions.value);
    fetchCategories()
  }).onCancel(() => { 
    console.log('Cancel')
  }).onDismiss(() => {
    console.log('Called on OK or Cancel')
  })
}

const handleClickDeleteSelectedCategory = (deleteKey) => {

  let endpoint;
  let categoryIndex = -1;
  let category = categories.value.find(cat => cat.key === deleteKey)

  if (category !== undefined) {
    endpoint = 'categorias'
  } else {
    categoryIndex = categories.value.findIndex(cat => cat.children?.some(subcat => subcat.key === deleteKey));
    if (categoryIndex > -1) {
      category = categories.value[categoryIndex].children.find(subcat => subcat.key === deleteKey)
      endpoint = 'sub-categorias'
    }
  }

  if (endpoint && category) {
    $q.dialog({
      title: 'Eliminar categoría',
      message: '¿Estás seguro de eliminar la categoría? Esta acción no se puede deshacer.',
      cancel: true,
    }).onOk(() => {
      // Sobrescribir endpoint si está definido en categoría (aplicando filtros de nombre)
      let endpointDelete = category.endpoint || endpoint
      api.delete(endpointDelete + '/' + category.id)
      .then(response => {
        if (response.data?.status === 200) {

          if (endpoint == 'categorias') {
            categories.value = categories.value.filter(cat => cat.key !== deleteKey)
          } else if (endpoint == 'sub-categorias') {
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

const handleClickEditSelectedCategory = (categoryKey) => {
  let categoryType, categoryId
  [categoryType, categoryId] = categoryKey.split('-')
  router.push(`categorias/${categoryType}/${categoryId}`);
}

watch(currentPage, () => {
  fetchCategories()
})

function fetchCategories(options = null) {
  isLoading.value = true

  let baseUrl = filterOptions.value?.nameType || 'categorias'
  let keyPrefix = filterOptions.value?.nameType ? filterOptions.value?.nameType.slice(0, 3) + '-' : 'cat-'
  let endpoint = baseUrl + '?page=' + currentPage.value

  if (baseUrl === 'categorias') { endpoint += '&with[]=sub_categories' }  
  if (filterOptions.value?.option) { endpoint += '&tipo=' + filterOptions.value.option }
  if (filterOptions.value?.name) { endpoint += '&name=' + filterOptions.value.name }

  api.get(endpoint).then(response => {

    if (response.data?.data) {
      categories.value = response.data.data.map(cat => {
        let category = {
          label: cat.name,
          key: keyPrefix + cat.id,
          id: cat.id,
          icon: cat.tipo == 1 ? 'trending_up' : (cat.tipo == 2 ? 'trending_down' : 'stop'),
          iconColor: cat.tipo == 1 ? 'positive' : (cat.tipo == 2 ? 'negative' : 'primary'),
          type: cat.tipo,
          endpoint: baseUrl
        }

        if (baseUrl == 'categorias') {
          category.label += ` (${cat.sub_categories.length})`
          category.children = []
        }
                
        if (cat.sub_categories?.length) {
          category.children = cat.sub_categories.map(subcat => {
            let subcategory = {
              label: subcat.name,
              key: 'sub-' + subcat.id,
              id: subcat.id,
            }
            return subcategory
          }) 
        }

        if (baseUrl === 'categorias') {
          category.children.push({
            selectable: false,
            type: cat.tipo,
            parentId: cat.id,
            header: 'add-subcategory',
          })
        }        

        if (!filterOptions.value?.name) {
          category.subcategoriesPage = 1
        }

        return category
      })
    }

    console.log(categories.value);
    if (response.data?.pagination) {
      maxPages.value = response.data.pagination.lastPage
    }
  }).finally(() => isLoading.value = false)
}

onMounted(() => { fetchCategories() })

</script>
