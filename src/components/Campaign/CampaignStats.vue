<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div v-if="stats" class="space-y-8 animate-fade-in">
        <!-- Overview Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">Total Campaigns</p>
                <p class="text-2xl font-bold text-primary-600">{{ stats.campaign_data.length }}</p>
              </div>
              <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <i class="fas fa-bullhorn text-primary-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">Total Ads</p>
                <p class="text-2xl font-bold text-blue-600">{{ stats.total_ads }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <i class="fas fa-ad text-blue-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">Total Spent</p>
                <p class="text-2xl font-bold text-green-600">${{ stats.total_spent.toFixed(2) }}</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <i class="fas fa-dollar-sign text-green-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">Budget Utilization</p>
                <p class="text-2xl font-bold text-purple-600">{{ stats.average_budget_utilization.toFixed(2) }}%</p>
              </div>
              <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <i class="fas fa-chart-pie text-purple-600 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- ROI Chart -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-semibold mb-4">Campaign ROI Distribution</h3>
            <div class="h-64">
              <Bar :data="roiChartData" :options="chartOptions" />
            </div>
          </div>

          <!-- Category Performance Chart -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-semibold mb-4">Category Performance</h3>
            <div class="h-64">
              <Doughnut :data="categoryChartData" :options="chartOptions" />
            </div>
          </div>
        </div>

        <!-- Top Campaigns Table -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h3 class="text-lg font-semibold mb-4">Top Performing Campaigns</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROI</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="campaign in stats.top_campaigns" :key="campaign.campaign_name" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">{{ campaign.campaign_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-green-600 font-medium">{{ (campaign.roi * 100).toFixed(2) }}%</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-medium rounded-full"
                          :class="getStatusClass(campaign.campaign_status)">
                      {{ campaign.campaign_status }}
                    </span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { Bar, Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default {
  components: {
    Bar,
    Doughnut
  },
  props: {
    stats: {
      type: Object,
      required: true
    }
  },
  computed: {
    roiChartData() {
      return {
        labels: this.stats.top_campaigns.map(c => c.campaign_name),
        datasets: [{
          label: 'ROI (%)',
          data: this.stats.top_campaigns.map(c => c.roi * 100),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1
        }]
      };
    },
    categoryChartData() {
      const categories = this.stats.audience_segmentation.top_performing_categories;
      return {
        labels: categories,
        datasets: [{
          data: categories.map(() => Math.random() * 100), // Example data
          backgroundColor: [
            'rgba(59, 130, 246, 0.5)',
            'rgba(16, 185, 129, 0.5)',
            'rgba(245, 158, 11, 0.5)',
            'rgba(239, 68, 68, 0.5)',
            'rgba(139, 92, 246, 0.5)'
          ]
        }]
      };
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      };
    }
  },
  methods: {
    getStatusClass(status) {
      const classes = {
        'Active': 'bg-green-100 text-green-800',
        'Completed': 'bg-gray-100 text-gray-800',
        'Pending': 'bg-yellow-100 text-yellow-800'
      };
      return classes[status] || 'bg-gray-100 text-gray-800';
    }
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>