<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h1 class="text-3xl font-bold gradient-text mb-6">Platform Statistics</h1>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="card bg-white/80 backdrop-blur-sm p-6">
            <h3 class="text-lg font-semibold mb-2">Total Users</h3>
            <p class="text-3xl font-bold gradient-text">
              {{ stats?.overview?.total_users || 0 }}
            </p>
          </div>
          <div class="card bg-white/80 backdrop-blur-sm p-6">
            <h3 class="text-lg font-semibold mb-2">Active Users</h3>
            <p class="text-3xl font-bold gradient-text">
              {{ stats?.overview?.active_users || 0 }}
            </p>
          </div>
          <div class="card bg-white/80 backdrop-blur-sm p-6">
            <h3 class="text-lg font-semibold mb-2">Total Campaigns</h3>
            <p class="text-3xl font-bold gradient-text">
              {{ stats?.campaigns?.total || 0 }}
            </p>
          </div>
          <div class="card bg-white/80 backdrop-blur-sm p-6">
            <h3 class="text-lg font-semibold mb-2">Total Ad Requests</h3>
            <p class="text-3xl font-bold gradient-text">
              {{ stats?.ad_requests?.total || 0 }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="card bg-white/80 backdrop-blur-sm p-6">
            <h3 class="text-lg font-semibold mb-2">Total Budget</h3>
            <p class="text-3xl font-bold gradient-text">
              ${{ formatNumber(stats?.monetary?.total_budget || 0) }}
            </p>
          </div>
          <div class="card bg-white/80 backdrop-blur-sm p-6">
            <h3 class="text-lg font-semibold mb-2">Average Budget</h3>
            <p class="text-3xl font-bold gradient-text">
              ${{ formatNumber(stats?.monetary?.avg_budget || 0) }}
            </p>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6">
          <h3 class="text-lg font-semibold mb-4">Ad Requests Trend</h3>
          <div class="chart-container">
            <Bar
                v-if="chartData"
                :data="chartData"
                :options="chartOptions"
            />
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 class="text-lg font-semibold mb-4">Ad Requests vs Campaigns</h3>
          <Bar
              v-if="trendChartData"
              :data="trendChartData"
              :options="chartOptions"
              class="h-[300px]"
          />
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';
import { fetchWithAuth } from "@/api.js";

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
);

export default {
  components: {
    Bar
  },
  data() {
    return {
      stats: null,
      timetrends: null,
      chartData: null,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      },
      trendChartData: null,
    };
  },
  methods: {
    formatNumber(number) {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(number);
    },
    prepareTrendChartData() {
      const timeTrends = this.timetrends;
      this.trendChartData = {
        labels: Object.keys(timeTrends.ad_requests),
        datasets: [
          {
            label: "Ad Requests",
            data: Object.values(timeTrends.ad_requests),
            backgroundColor: "rgba(14, 165, 233, 0.5)",
            borderColor: "rgb(14, 165, 233)",
            borderWidth: 1,
          },
          {
            label: "Campaigns",
            data: Object.values(timeTrends.campaigns),
            backgroundColor: "rgba(34, 197, 94, 0.5)",
            borderColor: "rgb(34, 197, 94)",
            borderWidth: 1,
          },
        ],
      };
    },
    async fetchStatistics() {
      try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/statistics");
        if (response.ok) {
          const data = await response.json();
          this.stats = data.data.statistics;
          console.log(data.data);
          this.timetrends = data.data.time_trends;
          this.prepareTrendChartData();

          const adRequestsByDate = this.stats.ad_requests.by_date;
          this.chartData = {
            labels: Object.keys(adRequestsByDate),
            datasets: [{
              label: 'Ad Requests',
              data: Object.values(adRequestsByDate),
              backgroundColor: 'rgba(14, 165, 233, 0.5)',
              borderColor: 'rgb(14, 165, 233)',
              borderWidth: 1
            }]
          };
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    }
  },
  mounted() {
    this.fetchStatistics();
  }
};
</script>

<style scoped>
.gradient-text {
  @apply bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent;
}

.card {
  @apply rounded-xl shadow-md transition-all duration-300;
}

.chart-container {
  max-height: 400px;
  overflow: hidden;
}
</style>
