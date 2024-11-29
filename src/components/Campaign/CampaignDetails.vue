<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <div v-if="campaign" class="space-y-6 animate-fade-in">
        <!-- Campaign Header -->
        <div class="bg-white rounded-xl shadow-lg p-8">
          <div class="flex justify-between items-start mb-6">
            <h1 class="text-3xl font-bold gradient-text">{{ campaign.campaign_name }}</h1>
            <span :class="getStatusClass(campaign.status)"
                  class="px-3 py-1 rounded-full text-sm font-medium">
              {{ campaign.status }}
            </span>
          </div>
          <p class="text-gray-600 leading-relaxed">{{ campaign.description }}</p>
        </div>

        <!-- Financial Overview -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all">
            <h3 class="text-sm font-medium text-gray-500 mb-2">Total Budget</h3>
            <p class="text-2xl font-bold text-primary-600">{{ formatCurrency(campaign.budget) }}</p>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all">
            <h3 class="text-sm font-medium text-gray-500 mb-2">Spent Amount</h3>
            <p class="text-2xl font-bold text-blue-600">{{ formatCurrency(campaign.spent_amount) }}</p>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all">
            <h3 class="text-sm font-medium text-gray-500 mb-2">Remaining Budget</h3>
            <p class="text-2xl font-bold text-green-600">{{ formatCurrency(remainingBudget) }}</p>
          </div>
        </div>

        <!-- Campaign Timeline -->
        <div class="bg-white rounded-xl shadow-lg p-8">
          <h2 class="text-xl font-semibold mb-6">Campaign Timeline</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <h3 class="text-sm font-medium text-gray-500">Start Date</h3>
              <p class="text-lg font-medium flex items-center">
                <i class="fas fa-calendar-alt text-primary-600 mr-2"></i>
                {{ formatDate(campaign.start_date) }}
              </p>
            </div>
            <div class="space-y-2">
              <h3 class="text-sm font-medium text-gray-500">End Date</h3>
              <p class="text-lg font-medium flex items-center">
                <i class="fas fa-calendar-check text-primary-600 mr-2"></i>
                {{ formatDate(campaign.end_date) }}
              </p>
            </div>
          </div>

          <div class="mt-8">
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-sm font-medium text-gray-500">Campaign Progress</h3>
              <span class="text-sm font-medium text-primary-600">{{ campaignProgress }}% completed</span>
            </div>
            <div class="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div class="h-full bg-gradient-to-r from-primary-500 to-blue-500 transition-all duration-500"
                   :style="{ width: `${campaignProgress}%` }"></div>
            </div>
          </div>
        </div>

        <!-- Campaign Settings -->
        <div class="bg-white rounded-xl shadow-lg p-8">
          <h2 class="text-xl font-semibold mb-6">Campaign Settings</h2>
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-gray-500">Visibility:</span>
            <span class="px-3 py-1 rounded-full text-sm font-medium"
                  :class="campaign.visibility ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
              {{ campaign.visibility ? 'Public' : 'Private' }}
            </span>
          </div>
        </div>

        <!-- Action Button -->
        <div class="flex justify-end">
          <button @click="viewAdRequests(campaign)"
                  class="btn btn-primary transform hover:scale-105 transition-all">
            <i class="fas fa-tasks mr-2"></i>
            Manage Ad Requests
          </button>
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
import { fetchWithAuth } from "@/api";

export default {
  props: {
    campaignId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      campaign: null,
      error: "",
      campaignName: null,
    };
  },
  computed: {
    remainingBudget() {
      return this.campaign.budget - (this.campaign.spent_amount || 0);
    },
    campaignProgress() {
      const startDate = new Date(this.campaign.start_date);
      const endDate = new Date(this.campaign.end_date);
      const today = new Date();

      if (today <= startDate) return 0;
      if (today >= endDate) return 100;

      const totalDuration = endDate - startDate;
      const elapsedDuration = today - startDate;
      return Math.floor((elapsedDuration / totalDuration) * 100);
    },
  },
  async created() {
    await this.fetchCampaignDetails();
  },
  methods: {
    getStatusClass(status) {
      const classes = {
        'Active': 'bg-green-100 text-green-800',
        'Completed': 'bg-gray-100 text-gray-800',
        'Pending': 'bg-yellow-100 text-yellow-800'
      };
      return classes[status] || 'bg-gray-100 text-gray-800';
    },
    async fetchCampaignDetails() {
      try {
        const response = await fetchWithAuth(`http://127.0.0.1:5000/api/campaigns/${this.campaignId}`);
        if (response.ok) {
          const data = await response.json();
          this.campaign = data.data;
          this.campaignName = this.campaign.campaign_name;
        } else {
          this.error = "Failed to load campaign details.";
        }
      } catch (error) {
        this.error = "An error occurred: " + error.message;
      }
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(amount);
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    viewAdRequests(campaign) {
      this.$router.push({
        name: "AdRequests",
        params: {
          campaignId: campaign.campaign_id,
          campaignName: this.campaignName,
        },
      });
    },
  },
};
</script>

<style scoped>
.gradient-text {
  @apply bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent;
}

.btn {
  @apply px-6 py-3 rounded-lg font-semibold transition-all duration-300;
}

.btn-primary {
  @apply bg-gradient-to-r from-primary-600 to-blue-600 text-white
  hover:from-primary-700 hover:to-blue-700;
}

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