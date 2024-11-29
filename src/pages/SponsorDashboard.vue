<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <SponsorHeader
        :companyName="sponsorMeta.company_name"
        :industry="sponsorMeta.industry_type"
        :verificationStatus="sponsorMeta.verification_status"
    />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
<!--      <QuickStats-->
<!--          :activeCampaigns="campaignStats.active"-->
<!--          :totalBudget="campaignStats.totalBudget"-->
<!--          :adRequests="campaignStats.totalRequests"-->
<!--      />-->

      <div class="mt-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold gradient-text">Your Campaigns</h2>
          <button
              @click="createNewCampaign"
              class="btn btn-primary flex items-center space-x-2"
          >
            <span>Create Campaign</span>
            <i class="fas fa-plus"></i>
          </button>
        </div>

        <CampaignList :sponsorId="sponsorMeta.sponsorid" />
      </div>
    </main>
  </div>
</template>

<script>
import SponsorHeader from '@/components/sponsor/SponsorHeader.vue';
import QuickStats from '@/components/sponsor/QuickStats.vue';
import CampaignList from '@/components/campaigns/CampaignList.vue';
import { fetchWithAuth } from "@/api";

export default {
  components: {
    SponsorHeader,
    QuickStats,
    CampaignList
  },
  props: {
    sponsorMeta: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      campaignStats: {
        active: 0,
        totalBudget: 0,
        totalRequests: 0
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
        const response = await fetchWithAuth(
            `http://127.0.0.1:5000/api/sponsor/stats/${this.sponsorMeta.sponsorid}`
        );
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
.btn {
  @apply px-4 py-2 rounded-lg font-semibold transition-all duration-300;
}

.btn-primary {
  @apply bg-gradient-to-r from-primary-600 to-blue-600 text-white
  hover:from-primary-700 hover:to-blue-700;
}

.gradient-text {
  @apply bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent;
}
</style>