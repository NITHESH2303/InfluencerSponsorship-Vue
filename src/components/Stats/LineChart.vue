<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { Line } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

export default {
  extends: Line,
  props: ["chartData"],
  mounted() {
    this.renderChart(this.chartData, { responsive: true, maintainAspectRatio: false });
  },
};
</script>
