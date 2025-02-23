<template>
  <div class="space-y-6">
    <div v-if="campaigns.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <CampaignCard v-for="campaign in campaigns"
                    :key="campaign.campaign_id"
                    :campaign="campaign"
                    @edit="handleEdit"
                    @complete="handleComplete"
                    @delete="handleDelete" />
    </div>
    <div v-else class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <i class="fas fa-folder-open text-4xl"></i>
      </div>
      <h3 class="text-lg font-medium text-gray-900">No campaigns yet</h3>
      <p class="text-gray-500">Get started by creating your first campaign</p>
    </div>
  </div>
</template>

<script>
import CampaignCard from './CampaignCard.vue';
import { fetchWithAuth } from "@/api";

export default {
  components: { CampaignCard },
  props: {
    sponsorId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      campaigns: [],
      error: ""
    };
  },
  async created() {
    await this.fetchCampaigns();
  },
  methods: {
    async fetchCampaigns() {
      try {
        const response = await fetchWithAuth(`http://127.0.0.1:5000/api/sponsor/campaigns/${this.sponsorId}`);
        if (response.ok) {
          const data = await response.json();
          this.campaigns = data.data;
        }
      } catch (error) {
        this.error = "Failed to load campaigns";
      }
    },
    handleEdit(campaign) {
      this.$router.push({
        name: 'EditCampaign',
        params: { campaignId: campaign.campaign_id }
      });
    },
    async handleComplete(campaign) {
      try {
        const response = await fetchWithAuth(
            `http://127.0.0.1:5000/api/sponsor/campaigns/${campaign.campaign_id}/status`,
            {
              method: "PUT",
              body: JSON.stringify({ status: 'Completed' })
            }
        );
        if (response.ok) {
          await this.fetchCampaigns();
        }
      } catch (error) {
        this.error = "Failed to update campaign status";
      }
    },
    async handleDelete(campaign) {
      if (confirm('Are you sure you want to delete this campaign?')) {
        try {
          const response = await fetchWithAuth(
              `http://127.0.0.1:5000/api/campaigns/${campaign.campaign_id}/delete`,
              { method: "DELETE" }
          );
          if (response.ok) {
            await this.fetchCampaigns();
          }
        } catch (error) {
          this.error = "Failed to delete campaign";
        }
      }
    }
  }
};
</script>