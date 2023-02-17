<template>
  <Doughnut :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'
import { computed } from 'vue'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps(['data'])

const chartData = computed(() => {
  // Crear objeto para agrupar elementos por categoría y sumar los totales
  const categoryTotals = {};
  props.data.forEach((elem) => {
    const account_id = elem.account_id;
    const account_name = elem.account.name;
    const total = elem.total;
    if (categoryTotals[account_id]) {
      categoryTotals[account_id].total += total;
    } else {
      categoryTotals[account_id] = {
        account_name: account_name,
        total: total,
      };
    }
  });

  // Crear array con colores aleatorios
  const colors = [];
  for (let i = 0; i < Object.keys(categoryTotals).length; i++) {
    colors.push(`rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`);
  }

  // Crear array de etiquetas y array de totales
  const labels = [];
  const dataValues = [];
  Object.values(categoryTotals).forEach((elem) => {
    labels.push(elem.account_name);
    dataValues.push(elem.total);
  });

  console.log('Hey', labels);

  return {
    labels: labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: colors,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  aspectRatio: 2,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        boxWidth: 10
      }
    }
  }
}

</script>