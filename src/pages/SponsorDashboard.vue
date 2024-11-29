<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Welcome Section -->
      <div class="card mb-8 transform hover:scale-[1.01] transition-all">
        <h1 class="text-3xl font-bold gradient-text mb-4">
          Welcome, {{ sponsorMeta.company_name }}
        </h1>
        <p class="text-gray-600">
          Manage your campaigns and track your advertising performance
        </p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="card bg-white/80 backdrop-blur-sm p-6 transform hover:scale-[1.02] transition-all">
          <h3 class="text-lg font-semibold mb-2">Active Campaigns</h3>
          <p class="text-3xl font-bold gradient-text">
            {{ campaignStats.active || 0 }}
          </p>
        </div>
        <div class="card bg-white/80 backdrop-blur-sm p-6 transform hover:scale-[1.02] transition-all">
          <h3 class="text-lg font-semibold mb-2">Total Budget</h3>
          <p class="text-3xl font-bold gradient-text">
            ${{ campaignStats.totalBudget || 0 }}
          </p>
        </div>
        <div class="card bg-white/80 backdrop-blur-sm p-6 transform hover:scale-[1.02] transition-all">
          <h3 class="text-lg font-semibold mb-2">Ad Requests</h3>
          <p class="text-3xl font-bold gradient-text">
            {{ campaignStats.totalRequests || 0 }}
          </p>
        </div>
      </div>

      <!-- Campaign List Section -->
      <div class="card mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold gradient-text">Your Campaigns</h2>
          <button
              @click="createNewCampaign"
              class="btn btn-primary flex items-center space-x-2"
          >
            <span>Create Campaign</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <CampaignList :sponsorId="sponsorMeta.sponsorid" />
      </div>

      <!-- Analytics Section -->
      <div class="card">
        <h2 class="text-2xl font-bold gradient-text mb-6">Campaign Analytics</h2>
        <CampaignStats :stats="campaignStats" />
      </div>
    </div>
  </div>
</template>

<script>
import CampaignStats from "@/components/Campaign/CampaignStats.vue";
import CampaignList from "@/components/Campaign/ListSponsorCampaigns.vue";
import { fetchWithAuth } from "@/api";

export default {
  props: {
    sponsorMeta: {
      type: Object,
      required: true,
    }
  },
  components: { CampaignStats, CampaignList },
  data() {
    return {
      campaignStats: {
        active: 0,
        totalBudget: 0,
        totalRequests: 0,
        views: 0,
        clicks: 0
      },
      error: ""
    };
  },
  methods: {
    createNewCampaign() {
      this.$router.push("/campaign/create");
    },
    async fetchCampaignStats() {
      try {
        const response = await fetchWithAuth(`http://127.0.0.1:5000/api/sponsor/stats/${this.sponsorMeta.sponsorid}`);
        if (response.ok) {
          const data = await response.json();
          this.campaignStats = data.data;
        }
      } catch (error) {
        this.error = "Failed to load campaign statistics";
      }
    }
  },
  async created() {
    await this.fetchCampaignStats();
  }
};
</script>

<style scoped>
.gradient-text {
  @apply bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent;
}

.card {
  @apply bg-white rounded-xl shadow-lg p-6 transition-all duration-300;
}

.btn {
  @apply px-4 py-2 rounded-lg font-semibold transition-all duration-300;
}

.btn-primary {
  @apply bg-gradient-to-r from-primary-600 to-blue-600 text-white hover:from-primary-700 hover:to-blue-700;
}
</style>