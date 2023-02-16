<template>
  <Line id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>

<script>
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

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  )

  export default {
    name: 'BarChart',
    components: { Line },
    data() {
      return {
        chartData: {
          labels: [
            'Ago-22',
            'Sep-22',
            'Oct-22',
            'Nov-22',
            'Dic-22',
            'Ene-23',
            'Feb-23',
          ],
          datasets: [{
            label: 'Ingresos',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          },
          {
            label: 'Gastos',
            data: [15, 9, 10, 41, 106, 15, 20],
            fill: false,
            borderColor: 'rgb(255, 15, 15)',
            tension: 0.1
          }]
        },
        chartOptions: {
          responsive: true
        }
      }
    }
  }
</script>