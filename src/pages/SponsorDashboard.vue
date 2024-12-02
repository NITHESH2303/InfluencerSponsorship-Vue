<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

    <RestrictionBanner
        v-if="sponsorMeta.is_flagged"
        :reason="sponsorMeta.flag_reason"
    />

    <SponsorHeader
        :companyName="sponsorMeta.company_name"
        :industry="sponsorMeta.industry_type"
        :verificationStatus="sponsorMeta.verification_status"
    />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CampaignStats :stats="campaignStats" />

      <div class="mt-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold gradient-text">Your Campaigns</h2>
          <div class="flex items-center space-x-4">
            <button
                @click="createNewCampaign"
                class="btn btn-primary flex items-center space-x-2"
            >
              <span>Create Campaign</span>
              <i class="fas fa-plus"></i>
            </button>

            <!-- Export CSV Button -->
            <button
                @click="exportCampaigns"
                class="btn btn-secondary flex items-center space-x-2"
            >
              <span>Export to CSV</span>
              <i class="fas fa-file-csv"></i>
            </button>
          </div>
        </div>

        <CampaignList :sponsorId="sponsorMeta.sponsorid" />
      </div>
    </main>
  </div>
</template>

<script>
import SponsorHeader from '@/components/sponsor/SponsorHeader.vue';
import CampaignList from '@/components/campaigns/CampaignList.vue';
import { fetchWithAuth } from "@/api";
import CampaignStats from "@/components/Campaign/CampaignStats.vue";
import RestrictionBanner from "@/components/RestrictionBanner.vue";

export default {
  components: {
    RestrictionBanner,
    CampaignStats,
    SponsorHeader,
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
      campaignStats: null,
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
    },

    // Export Campaigns to CSV
    async exportCampaigns() {
      try {
        const response = await fetchWithAuth(
            `http://127.0.0.1:5000/api/export_campaigns/${this.sponsorMeta.sponsorid}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            }
        );

        if (!response.ok) {
          throw new Error('Failed to export campaigns');
        }

        const blob = await response.blob();

        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        link.download = 'campaigns.csv';
        link.click();

        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error exporting campaigns:', error);
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

.btn-secondary {
  @apply bg-gradient-to-r from-green-500 to-green-700 text-white
  hover:from-green-600 hover:to-green-800;
}

.gradient-text {
  @apply bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent;
}
</style>
