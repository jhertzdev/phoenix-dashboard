<template>
  <q-card flat bordered class="card-totals">
    <q-item>
      <q-item-section avatar>
        <q-avatar size="lg" :icon="props.icon"/>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ props.title }}</q-item-label>
        <q-item-label caption v-if="!$q.screen.lt.lg">
          <q-skeleton type="QBadge" v-if="props.total === null || typeof(props.total) === 'undefined'"/>
          <span v-else>{{ props.total ? `$${parseFloat(props.total).toFixed(2)}` : '$0.00' }}</span>
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item v-if="$q.screen.lt.lg" style="min-height: 0">
      <q-item-section>
        <q-skeleton type="QBadge" class="q-mx-auto" v-if="props.total === null || typeof(props.total) === 'undefined'"/>
        <q-item-label class="text-center text-weight-bold" v-else>
          {{ props.total ? `$${parseFloat(props.total).toFixed(2)}` : '$0.00' }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<style scoped>
@media (max-width: 599.99px) {
  .q-card > .q-item {
    padding: 5px;
  }
  .q-card > .q-item .q-item__section--avatar {
    padding-right: 0;
    min-width: 0;
  }

  .row .q-card.card-totals {
    border-radius: 0;
  }
  .row > div:first-child > .q-card.card-totals {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    border-right: 0;
  }

  .row > div:last-child > .q-card.card-totals {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    border-left: 0;
  }
}

</style>

<script setup>

  import { useQuasar } from 'quasar';
  const $q = useQuasar()
  const props = defineProps(['title', 'total', 'icon'])

</script>