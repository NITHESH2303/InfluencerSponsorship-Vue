<template>
  <div class="campaign-details" v-if="campaign">
    <h2>Details of the campaign {{ campaign.campaign_name }}</h2>
    <p><strong>Description:</strong> {{ campaign.description }}</p>
    <p><strong>Budget:</strong> {{ campaign.budget }}</p>
    <p><strong>Start Date:</strong> {{ campaign.start_date }}</p>
    <p><strong>End Date:</strong> {{ campaign.end_date }}</p>
    <p><strong>Status:</strong> {{ campaign.status }}</p>
    <p><strong>Visibility:</strong> {{ campaign.visibility }}</p>
    <button @click="viewAdRequests(campaign)" class="view-ads-button">Manage Ad Requests</button>
  </div>
  <p v-else>Loading campaign details...</p>
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
  async created() {
    await this.fetchCampaignDetails();
  },
  methods: {
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
    viewAdRequests(campaign) {
      console.log(campaign.campaign_name);
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
.campaign-details {
  padding: 20px;
  border: 1px solid #ccc;
  margin-top: 10px;
}
</style>
