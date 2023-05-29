<template>
  <Line id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>
<style scoped>

  #my-chart-id {
    height: 100% !important;
    width: 100% !important;
  }

</style>
<script setup>
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { computed } from 'vue'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps(['data', 'range'])

// Crear objeto de configuración para el gráfico de ChartJS
const chartOptions = {
  responsive: true
};

const chartData = computed(() => {
  // Crear objeto para agrupar totales por día
  const ingresosDia = {};
  const gastosDia = {};
  props.data.forEach((elem) => {
    const dateParts = elem.created_at.split('/');
    const date = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
    const saldo = elem.total;

    if (elem.tipo === 1) {
      if (ingresosDia[date]) {
        ingresosDia[date] += saldo
      } else {
        ingresosDia[date] = saldo;
      }
    } else if (elem.tipo === 2) {
      if (gastosDia[date]) {
        gastosDia[date] += saldo
      } else {
        gastosDia[date] = saldo;
      }
    }
  });

  // Crear array de etiquetas y array de totales
  const labels = [];
  const ingresosValues = [];
  const gastosValues = [];
  const endDate = new Date();
  for (let i = (props.range - 1); i >= 0; i--) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const dateString = `${day}/${month}/${year}`;
    labels.push(dateString);
    ingresosValues.push(ingresosDia[`${year}-${month}-${day}`] || 0);
    gastosValues.push(gastosDia[`${year}-${month}-${day}`] || 0);
  }

  return {
    labels: labels,
    datasets: [
      {
        label: 'Ingresos',
        data: ingresosValues,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Gastos',
        data: gastosValues,
        borderColor: 'rgb(255, 10, 10)',
        tension: 0.1,
      },
    ],
  }
})
</script>