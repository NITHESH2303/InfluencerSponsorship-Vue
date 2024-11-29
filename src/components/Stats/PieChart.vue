<template>
  <div>
    <Pie :chartData="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

export default {
  components: {
    Pie
  },
  props: {
    chartData: {
      type: Object,
      required: true
    },
    chartOptions: {
      type: Object,
      default: () => {
        return { responsive: true, maintainAspectRatio: false }
      }
    }
  }
}
</script>
