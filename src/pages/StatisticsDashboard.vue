<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">Statistics Dashboard</h1>
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else>
      <section class="mb-5">
        <h2>Reach Distribution</h2>
        <PieChart :chartData="reachDistribution" />
      </section>

      <section class="mb-5">
        <h2>Top Categories</h2>
        <BarChart :chartData="topCategories" />
      </section>

      <section class="mb-5">
        <h2>Time-Based Trends</h2>
        <LineChart :chartData="timeTrends" />
      </section>

      <section>
        <h2>Influencer Clusters</h2>
        <ScatterChart :chartData="influencerClusters" />
      </section>
    </div>
  </div>
</template>

<script>

import PieChart from "@/components/Stats/PieChart.vue";
import BarChart from "@/components/Stats/BarChart.vue";
import LineChart from "@/components/Stats/LineChart.vue";
import ScatterChart from "@/components/Stats/ScatterChart.vue";
import { fetchWithAuth } from "@/api.js";

export default {
  components: { ScatterChart, LineChart, BarChart, PieChart },
  data() {
    return {
      loading: true,
      reachDistribution: null,
      topCategories: null,
      timeTrends: null,
      influencerClusters: null,
    };
  },
  methods: {
    async fetchStatistics() {
      try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/statistics", {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          const stats = data.data;

          console.log(stats);
          console.log(stats.statistics.ad_requests.by_date)
          this.reachDistribution = this.formatPieChart(stats.statistics.ad_requests.by_date);
          this.topCategories = this.formatBarChart(stats.statistics.campaigns.by_date);
          this.timeTrends = this.formatLineChart(stats.time_trends.ad_requests);
          this.influencerClusters = this.formatScatterChart(stats.influencer_clusters);

          console.log("Reach Distribution:", this.reachDistribution);
          console.log("Top Categories:", this.topCategories);
          console.log("Time Trends:", this.timeTrends);
          console.log("Influencer Clusters:", this.influencerClusters);

        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        this.loading = false;
      }
    },
    formatPieChart(data) {
      if (!data || !Object.keys(data).length) {
        return {
          labels: ["No Data Available"],
          datasets: [
            {
              data: [1],
              backgroundColor: ["#E0E0E0"],
            },
          ],
        };
      }
      return {
        labels: Object.keys(data),
        datasets: [
          {
            data: Object.values(data),
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          },
        ],
      };
    },
    formatBarChart(data) {
      if (!data || !Object.keys(data).length) {
        return { labels: [], datasets: [] };
      }
      return {
        labels: Object.keys(data),
        datasets: [
          {
            label: "Ad Count",
            data: Object.values(data),
            backgroundColor: "#42A5F5",
          },
        ],
      };
    },
    formatLineChart(data) {
      if (!data || !Object.keys(data).length) {
        return { labels: [], datasets: [] };
      }
      return {
        labels: Object.keys(data),
        datasets: [
          {
            label: "Trend",
            data: Object.values(data),
            borderColor: "#FF6384",
            fill: false,
          },
        ],
      };
    },
    formatScatterChart(data) {
      if (data.message) {
        return {
          labels: ["Not enough data for clustering"],
          datasets: [],
        };
      }
      if (!data || !data.length) {
        return { labels: [], datasets: [] };
      }
      return {
        datasets: [
          {
            label: "Influencer Clusters",
            data: data.map((point) => ({
              x: point.followers,
              y: point.ad_count,
            })),
            backgroundColor: "#36A2EB",
          },
        ],
      };
    },
  },
  created() {
    this.fetchStatistics();
  },
};
</script>

<style scoped>
.container {
  max-width: 960px;
}
</style>
