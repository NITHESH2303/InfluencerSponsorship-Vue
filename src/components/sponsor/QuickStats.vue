<template>
  <div>
    <p v-if="error" class="text-red-500 text-center">{{ error }}</p>

    <div v-else-if="campaign" class="campaign-card bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-xl font-bold text-gray-900">{{ campaign.campaign_name }}</h3>
          <p class="text-sm text-gray-500">{{ formatDate(campaign.start_date) }} - {{ formatDate(campaign.end_date) }}</p>
        </div>
        <span :class="getStatusClass(campaign.status)"
              class="px-3 py-1 rounded-full text-sm font-medium">
          {{ campaign.status }}
        </span>
      </div>

      <p class="text-gray-600 mb-4 line-clamp-2">{{ campaign.description }}</p>

      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="stat-item">
          <span class="text-sm text-gray-500">Budget</span>
          <p class="text-lg font-semibold">${{ campaign.budget }}</p>
        </div>
        <div class="stat-item">
          <span class="text-sm text-gray-500">Spent</span>
          <p class="text-lg font-semibold">${{ campaign.spent_amount || 0 }}</p>
        </div>
      </div>

      <div class="mb-4">
        <div class="flex justify-between text-sm text-gray-500 mb-1">
          <span>Progress</span>
          <span>{{ campaign.progress_percentage }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="bg-primary-600 rounded-full h-2 transition-all duration-300"
               :style="{ width: `${campaign.progress_percentage}%` }"></div>
        </div>
      </div>

      <div v-if="campaign.sponsor_username" class="mt-4">
        <p class="text-sm text-gray-500">Sponsor:
          <span class="font-semibold">
            <router-link
                :to="{ name: 'SponsorProfile', params: { sponsorId: campaign.sponsor_id } }"
                class="sponsor-button"
            >
              {{ campaign.sponsor_username }}
            </router-link>
          </span></p>
      </div>
    </div>

    <p v-else class="text-gray-500 text-center">Loading campaign details...</p>
  </div>
</template>

<script>
import { fetchWithAuth } from "@/api.js";

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
      error: ""
    };
  },
  async mounted() {
    await this.fetchCampaignDetails();
  },
  methods: {
    async fetchCampaignDetails() {
      try {
        const response = await fetchWithAuth(`http://127.0.0.1:5000/api/campaigns/${this.campaignId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            this.campaign = data.data;
          } else {
            this.error = "Campaign details not found.";
          }
        } else {
          this.error = `Failed to load campaign details: ${response.status}`;
        }
      } catch (error) {
        this.error = "An error occurred: " + error.message;
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    getStatusClass(status) {
      const classes = {
        Active: "bg-green-100 text-green-800",
        Completed: "bg-gray-100 text-gray-800",
        Pending: "bg-yellow-100 text-yellow-800",
      };
      return classes[status] || "bg-gray-100 text-gray-800";
    },
  },
};
</script>

<style scoped>
.sponsor-button {
  @apply inline-block px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 transition-all duration-200;
}

.stat-item {
  @apply bg-gray-50 rounded-lg p-3;
}
</style>
