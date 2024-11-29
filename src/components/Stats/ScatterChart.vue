<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { Scatter } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale);

export default {
  extends: Scatter,
  props: ["chartData"],
  mounted() {
    this.renderChart(this.chartData, { responsive: true, maintainAspectRatio: false });
  },
};
</script>
