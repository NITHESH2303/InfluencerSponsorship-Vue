<template>
  <div class="campaign-details" v-if="campaign">
    <h2>Details of the campaign {{ campaign.campaign_name }}</h2>
    <p><strong>Description:</strong> {{ campaign.description }}</p>
    <p><strong>Budget:</strong> {{ formatCurrency(campaign.budget) }}</p>
    <p><strong>Spent Amount:</strong> {{ formatCurrency(campaign.spent_amount) }}</p>
    <p><strong>Remaining Budget:</strong> {{ formatCurrency(remainingBudget) }}</p>
    <p><strong>Start Date:</strong> {{ formatDate(campaign.start_date) }}</p>
    <p><strong>End Date:</strong> {{ formatDate(campaign.end_date) }}</p>
    <p><strong>Status:</strong> {{ campaign.status }}</p>
    <p><strong>Visibility:</strong> {{ campaign.visibility }}</p>

    <div class="progress-bar-container">
      <label for="progress-bar">Campaign Progress:</label>
      <div class="progress-bar">
        <div class="progress-bar-fill" :style="{ width: `${campaignProgress}%` }"></div>
      </div>
      <p>{{ campaignProgress }}% completed</p>
    </div>

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
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
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
.campaign-details {
  padding: 20px;
  border: 1px solid #ccc;
  margin-top: 10px;
}
.progress-bar-container {
  margin-top: 20px;
}
.progress-bar {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  height: 20px;
  position: relative;
  overflow: hidden;
}
.progress-bar-fill {
  background-color: #4caf50;
  height: 100%;
  width: 0%;
  transition: width 0.5s ease-in-out;
}

</style>
