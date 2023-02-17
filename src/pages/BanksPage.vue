<template>
  <q-page class="flex column flex-center q-pa-md" v-if="isLoading">
    <q-spinner color="primary" size="3em" />
  </q-page>
  <template v-else>
    <q-page class="flex column flex-center q-pa-md" v-if="!bancos.length">
      <p>No se han encontrado datos.</p>
      <q-btn color="primary" @click="retryFetchBancos">Volver a intentar</q-btn>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="add" color="secondary" @click="handleCreateBanco" />
      </q-page-sticky>
    </q-page>
    <q-page class="flex column q-pa-md" v-else>
      <q-list bordered>
        <q-item v-for="banco in bancos" :key="banco.id" class="q-my-sm">
          <q-item-section>
            <q-item-label>{{ banco.name }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn-dropdown color="primary" padding="xs">
              <q-list>
                <q-item clickable v-close-popup @click="handleEditBanco(banco.id)">
                  <q-item-section avatar>
                    <q-avatar icon="edit"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Editar</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="handleDeleteBanco(banco.id)">
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
        <q-btn fab icon="add" color="secondary" @click="handleCreateBanco" />
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

const bancos = ref([])
const isLoading = ref(true)

const currentPage = ref(1)
const maxPages = ref(0)

watch(currentPage, () => {
  fetchBancos()
})

const retryFetchBancos = () => {
  if (currentPage.value !== 1) currentPage.value = 1
  else fetchBancos()
}

function fetchBancos() {
  isLoading.value = true
  api.get('bank?page=' + currentPage.value).then(response => {
    console.log(response);
    if (response.data?.data) {
      bancos.value = response.data.data

      let uniqueCategories = [...new Set(bancos.value.map(banco => banco.categori_id).filter(banco => banco > 0))]
      let uniqueSubCategories = [...new Set(bancos.value.map(banco => banco.sub_categori_id).filter(banco => banco > 0))]

      // Obtener categorías
      uniqueCategories.forEach(cat_id => {
        api.get('categorias/' + cat_id).then(response => {
          bancos.value = bancos.value.map(banco => {
            if (banco.categori_id === response.data.id) {
              banco.categori_name = response.data.name
            }
            return banco
          })
        })
      });

      // Obtener subcategorías
      uniqueSubCategories.forEach(subcat_id => {
        api.get('sub-categorias/' + subcat_id).then(response => {
          bancos.value = bancos.value.map(banco => {
            if (banco.sub_categori_id === response.data.id) {
              banco.sub_categori_name = response.data.name
            }
            return banco
          })
        })
      });

    }
    if (response.data?.pagination) {
      maxPages.value = response.data.pagination.lastPage
    }
  }).finally(() => isLoading.value = false)
}

const handleCreateBanco = () => {

  $q.dialog({
    title: 'Nuevo banco',
    message: 'Escribe el nombre del banco o cuenta a agregar.',
    prompt: {
      model: '',
      isValid: val => val.length > 1,
      type: 'text'
    },
    cancel: true,
    persistent: true
  }).onOk(name => {

    const dialog = $q.dialog({
      progress: true,
      persistent: true,
      ok: false,
    })

    api.post('bank', { name }).then(response => {
      if (response.data?.data) {
        let nuevoBanco = response.data.data
        bancos.value.push(nuevoBanco)
        $q.notify({
          type: 'positive',
          message: 'Banco agregado.',
        })
      } else {
        $q.notify({
          type: 'negative',
          message: 'No se pudo agregar el banco.',
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

const handleDeleteBanco = bancoId => {
  
  let banco = bancos.value.find(banco => banco.id === bancoId)
  
  if (banco !== undefined) {
    $q.dialog({
      title: 'Eliminar banco',
      message: `¿Estás seguro de eliminar ${banco.name ? '"' + banco.name + '"' : 'este banco' }? Esta acción no se puede deshacer.`,
      cancel: true,
    }).onOk(() => {
      api.delete('bank/' + bancoId)
      .then(response => {
        if (response.data?.status === 200) {
          bancos.value = bancos.value.filter(banco => banco.id !== bancoId)
          $q.notify({
            type: 'positive',
            message: 'Banco eliminado.',
          })
        } else {
          console.log(response.data);
            $q.notify({
            type: 'negative',
            message: 'No se pudo eliminar el banco.',
          })
        }
      })
    })
  } else {
    $q.notify({
      type: 'negative',
      message: 'No se encuentra el banco seleccionado.',
    })
  }
}

const handleEditBanco = bancoId => {

$q.dialog({
  title: 'Editar banco',  
  prompt: {
    model: bancos.value.find(banco => banco.id === bancoId)?.name,
    isValid: val => val.length > 1,
    type: 'text'
  },
  cancel: true,
  persistent: true
}).onOk(name => {

  const dialog = $q.dialog({
    progress: true,
    persistent: true,
    ok: false,
  })

  api.put('bank/' + bancoId, { name }).then(response => {
    if (response.data?.status == 200) {
      let bancoIndex = bancos.value.findIndex(banco => banco.id === bancoId)
      bancos.value[bancoIndex].name = response.data.data.name
      $q.notify({
        type: 'positive',
        message: 'Banco editado exitosamente.',
      })
    } else {
      $q.notify({
        type: 'negative',
        message: 'No se pudo editar el banco.',
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

onMounted(() => { fetchBancos() })

</script>