<template>
  <q-page class="flex column q-pa-md flex-center">

    <div class="row full-width">
      <div class="col-12 col-sm-8 offset-sm-2">
        <q-stepper v-model="step" ref="stepper" color="primary" animated class="full-width" :contracted="$q.screen.lt.sm">
          <q-step :name="1" title="Importar" icon="upload" active-icon="upload" :done="step > 1" class="q-pa-sm">
            <p>Agrega un archivo para importarlo (formatos permitidos: .CSV, .XLS o .XLSX)</p>
            <q-file filled v-model="selectedFile" label="Selecciona un archivo..." @update:model-value="handleFileAsync">
              <template v-slot:prepend>
                <q-icon name="cloud_upload" />
              </template>
            </q-file>
    
            <q-checkbox v-model="includeHeaders" label="El archivo contiene encabezados" class="q-mt-md"
              @update:model-value="convertUploadedFile" />
          </q-step>
    
          <q-step :name="2" title="Datos" icon="table_chart" active-icon="table_chart" :done="step > 2" class="q-pa-sm">
    
            <q-select v-model="selectedSheet" :options="Object.keys(workBook || {})" label="Selecciona una hoja" stack-label
              class="q-mb-md" @update:model-value="checkColumns" />
    
            <table class="full-width text-left">
              <thead>
                <tr>
                  <th style="width:50%">Columna en archivo</th>
                  <th style="width:50%">Campo</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(example, header) in workBook && workBook[selectedSheet] && workBook[selectedSheet][0] || []">
                  <td class="q-pb-sm">
                    {{ header }}
                    <br>
                    <span class="text-caption text-weight-light text-grey-5">Ejemplo: {{ example }}</span>
                  </td>
                  <td>
                    <q-select v-model="columns[header]" :options="options" label="Selecciona un campo" clearable stack-label>
                      <template v-slot:selected>
                        <template v-if="columns[header]">
                          {{ columns[header].label }}
                        </template>
                        <template v-else>
                          -- Ignorar --
                        </template>
                      </template>
                    </q-select>
                  </td>
                </tr>
              </tbody>
            </table>
    
          </q-step>
    
          <q-step :name="3" title="Asignar" icon="people" active-icon="people" :done="step > 3" class="q-pa-sm">
    
            <q-select class="q-mb-md" filled square label="Contador (opcional)" v-model="insertData.user" :options="availableUsers"
              :loading="usersLoading" @virtual-scroll="onUsersScroll"
              hint="Selecciona un contador."
              clearable v-if="authStore.user.role_name === 'contador'"/>
    
            <q-select filled square label="Cuenta *" v-model="insertData.account" :options="availableAccounts"
              :loading="accountsLoading" @virtual-scroll="onAccountsScroll"
              :rules="[val => val && val.value > 0 || 'Selecciona una cuenta.']" hint="Selecciona una cuenta." clearable />
    
          </q-step>
    
          <template v-slot:navigation>
            <q-stepper-navigation>
              <q-btn @click="$refs.stepper.next()" v-if="step !== 3" color="primary" label="Continuar"
                :disable="step === 1 && !selectedFile" />
              <q-btn @click="handleImport" v-else color="primary" label="Importar"
                :disable="step === 3 && !insertData.account" :loading="isLoadingData" />
              <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Atrás" class="q-ml-sm" />
            </q-stepper-navigation>
          </template>
    
        </q-stepper>
      </div>
    </div>



  </q-page>
</template>

<style scoped>
table th,
table td {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

<script setup>

import { ref, onMounted, nextTick } from 'vue'
import { useQuasar } from 'quasar';
import { api, axios } from 'src/boot/axios';
import { read, utils } from 'xlsx';
import { useAuthStore } from 'src/stores/auth.store';

const authStore = useAuthStore()
const $q = useQuasar()

const selectedFile = ref(null)
const selectedSheet = ref(null)
const step = ref(1)
const includeHeaders = ref(true)

const workBook = ref(null)

const isLoadingData = ref(false)

const insertData = ref({
  data: null,
  user: null,
  account: null,
})

const options = [
  {
    label: 'Descripción',
    value: 'reason'
  },
  {
    label: 'Tipo',
    value: 'tipo'
  },
  {
    label: 'Total',
    value: 'total'
  },
  {
    label: 'Categoría',
    value: 'category'
  },
  {
    label: 'Sub-categoría',
    value: 'sub_category'
  }
]

const fieldOptions = [
  {
    label: 'Descripción',
    value: 'reason'
  },
  {
    label: 'Total',
    value: 'total'
  },
  {
    label: 'Tipo',
    value: 'tipo'
  },
  {
    label: 'Categoría',
    value: 'category'
  },
  {
    label: 'Sub-categoría',
    value: 'sub_category'
  }
]

const columns = ref([])

function checkColumns() {
  let output = {}
  if (workBook.value && selectedSheet.value && workBook.value[selectedSheet.value][0]) {
    Object.keys(workBook.value[selectedSheet.value][0]).forEach((el, index) => {
      if (fieldOptions[index]) {
        output[el] = fieldOptions[index]
      } else {
        output[el] = null
      }
    });
  }

  columns.value = output
}

async function handleFileAsync(e) {
  const fileData = await convertUploadedFile()
  selectedSheet.value = fileData.SheetNames[0]
  checkColumns()
}

async function convertUploadedFile() {

  const file = selectedFile.value
  const data = await file.arrayBuffer();
  /* data is an ArrayBuffer */
  const fileData = read(data);

  const output = {};
  fileData.SheetNames.forEach(function (name) {
    // Opts: {header: 1} to skip header row
    if (!includeHeaders.value) {
      output[name] = utils.sheet_to_json(fileData.Sheets[name], { header: 1 });
    } else {
      output[name] = utils.sheet_to_json(fileData.Sheets[name]);
    }
  });

  workBook.value = output

  console.log(output);

  return fileData

}

// Usuarios:
const usersLoading = ref(false)
const availableUsers = ref([])
const nextPageUsers = ref(1)
const lastPageUsers = ref(0)

const onUsersScroll = ({ to, ref }) => {
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

// Cuentas:
const accountsLoading = ref(false)
const availableAccounts = ref([])
const nextPageAccounts = ref(1)
const lastPageAccounts = ref(0)

const onAccountsScroll = ({ to, ref }) => {
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

const handleImport = () => {

  isLoadingData.value = true

  let columnsData = {
    reason: null,
    tipo: null,
    total: null,
    category: null,
    sub_category: null,
  }

  for (const column in columns.value) {
    if (columns.value[column]) {
      columnsData[columns.value[column].value] = column
    }
  }

  if (Object.values(columnsData).some(val => val === null)) {
    $q.notify({
      type: 'negative',
      message: 'La estructura no es correcta. Selecciona una columna para cada tipo de dato.',
    })
    isLoadingData.value = false
    return;
  }

  let movimientos = []

  workBook.value[selectedSheet.value].forEach(row => {
    movimientos.push({
      reason: row[columnsData.reason],
      tipo: row[columnsData.tipo],
      total: row[columnsData.total],
      categori: row[columnsData.category],
      sub_categori: row[columnsData.sub_category],
    })
  });

  let postData = {
    data: movimientos,
    user_id: authStore.user.id,
    account_id: insertData.value?.account?.value,
    contador_id: insertData.value?.user?.value,
  }


  async function mypostData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  mypostData('https://webhook.site/3cd875fa-344b-4031-b23b-32a11cae7455', postData)
    .then((data) => {
      console.log(data); // JSON data parsed by `data.json()` call
    }).catch(e => console.log(e))

  api.post('movimiento_masive', postData).then(response => {
    console.log(postData, response);
    if (response.data?.status == 200) {

      selectedFile.value = null
      selectedSheet.value = null
      step.value = 1
      includeHeaders.value = true
      workBook.value = null

      $q.notify({
        type: 'positive',
        message: 'Importado exitosamente.',
      })

    } else {
      $q.notify({
        type: 'negative',
        message: 'No se pudo importar.',
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
    .finally(() => isLoadingData.value = false)

}

onMounted(() => {
  getAccounts(nextPageAccounts.value)
  getUsers(nextPageUsers.value)
})

</script>
