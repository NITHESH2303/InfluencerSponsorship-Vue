<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { Bar } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  extends: Bar,
  props: ["chartData"],
  mounted() {
    this.renderChart(this.chartData, { responsive: true, maintainAspectRatio: false });
  },
};
</script>
