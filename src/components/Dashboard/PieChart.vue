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
  // Crear array con colores aleatorios
  const colors = [];
  for (let i = 0; i < Object.keys(props.data).length; i++) {
    colors.push(`rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`);
  }

  // Crear array de etiquetas y array de totales
  const labels = [];
  const dataValues = [];
  Object.values(props.data).forEach((elem) => {
    labels.push(elem.name);
    dataValues.push(elem.gastos);
  });

  console.log(dataValues);

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