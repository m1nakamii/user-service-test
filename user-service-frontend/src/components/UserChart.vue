<template>
  <div>
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

export default {
  name: 'UserChart',
  components: {
    Line
  },
  props: {
    userStats: {
      type: Array,
      required: true
    }
  },
  computed: {
    chartData() {
      return {
        labels: this.userStats.map(entry => entry.date),
        datasets: [
          {
            label: 'Новые пользователи',
            data: this.userStats.map(entry => entry.count),
            fill: false,
            borderColor: '#42A5F5',
            tension: 0.1
          }
        ]
      }
    },
    chartOptions() {
      return {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: 'Новые пользователи по дням'
          }
        }
      }
    }
  }
}
</script>
