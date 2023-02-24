<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section class="q-dialog__title" v-if="props.title">
        {{ props.title }}
      </q-card-section>
      <q-card-section class="q-dialog__message" v-if="props.message">
        {{ props.message }}
      </q-card-section>
      
      <template v-if="props.options">
        <q-card-section class="q-dialog-plugin__form">
          <div class="text-subtitle2" v-if="props.options.label">{{ props.options.label}}</div>
          <q-radio v-model="filters.option" :val="option.value" :label="option.label" v-for="option in props.options.items" />
        </q-card-section>
      </template>

      <q-card-section>
        <div class="text-subtitle2">Búsqueda por nombre</div>
        <q-input v-model="filters.name" class="q-mb-sm" clearable>
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-radio v-model="filters.nameType" :val="option.value" :label="option.label" v-for="option in queryOptions" :disable="!filters.name"/>

      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="onOKClick" />
        <q-btn color="primary" label="Cancel" @click="onDialogCancel" />
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script setup>

import { reactive, watch } from 'vue';
import { useDialogPluginComponent } from 'quasar'

const props = defineProps(['title', 'message', 'options', 'queryName', 'queryType'])

const queryOptions = [
  { label: 'En categorías', value: 'categorias' },
  { label: 'En sub-categorías', value: 'sub-categorias' },
]

const filters = reactive({
  option: props.options.selected || null,
  name: props.queryName || null,
  nameType: props.queryType || null,
})

watch(filters, fs => {
  if (!fs.name) {
    filters.nameType = null
  } else if (!fs.nameType) {
    filters.nameType = props.queryType || 'categorias'
  }
})

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits
])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
// dialogRef      - Vue ref to be applied to QDialog
// onDialogHide   - Function to be used as handler for @hide on QDialog
// onDialogOK     - Function to call to settle dialog with "ok" outcome
//                    example: onDialogOK() - no payload
//                    example: onDialogOK({ /*...*/ }) - with payload
// onDialogCancel - Function to call to settle dialog with "cancel" outcome

// this is part of our example (so not required)
function onOKClick() {
  // on OK, it is REQUIRED to
  // call onDialogOK (with optional payload)
  onDialogOK( {...filters} )
  // or with payload: onDialogOK({ ... })
  // ...and it will also hide the dialog automatically
}
</script>