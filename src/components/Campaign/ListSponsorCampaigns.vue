<template>
  <div class="campaign-list">
    <h2>Your Campaigns</h2>
    <ul>
      <li v-for="campaign in campaigns" :key="campaign.campaign_id">
        <router-link :to="{ name: 'CampaignDetails', params: { campaignId: campaign.campaign_id } }">{{ campaign.campaign_name }}</router-link>
        <span v-if="campaign.status === 'YetToStart'" class="pending-label">YetToStart</span>
        <span v-else-if="campaign.status === 'Active'" class="active-label">Active</span>
        <span v-else-if="campaign.status === 'Completed'" class="completed-label">Completed</span>
        <button @click="goToEdit(campaign)" class="edit-button">Edit</button>
        <DeleteCampaign :campaignId="campaign.campaign_id" :onDeleted="handleDelete" />
      </li>
    </ul>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="!campaigns.length && !error">No campaigns found.</p>
  </div>
</template>

<script>
import { fetchWithAuth } from "@/api.js";
import DeleteCampaign from "@/components/Campaign/DeleteCampaign.vue";

export default {
  components: {DeleteCampaign},
  props: {
    sponsorId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      campaigns: [],
      error: "",
    };
  },
  async created() {
    await this.fetchCampaignData();
  },
  methods: {
    async fetchCampaignData() {
      try {
        const response = await fetchWithAuth(`http://127.0.0.1:5000/api/sponsor/campaigns/${this.sponsorId}`, {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          this.campaigns = data.data;
        } else {
          this.error = "Failed to load campaigns.";
        }
      } catch (error) {
        this.error = "An error occurred: " + error.message;
      }
    },
    goToEdit(campaign) {
      this.$router.push({name: 'EditCampaign', params: {campaignId: campaign.campaign_id}});
    },
    handleDelete(campaignId) {
      this.campaigns = this.campaigns.filter(campaign => campaign.campaign_id !== campaignId);
    },
  },
};
</script>

<style scoped>
.campaign-list {
  border: 1px solid #ccc;
  padding: 10px;
}

.delete-button {
  background-color: red;
  color: white;
  border: none;
  padding: 5px;
  cursor: pointer;
  margin-left: 10px;
}

.active-label {
  color: green;
  font-weight: bold;
}

.pending-label {
  color: orange;
  font-weight: bold;
}

.completed-label {
  color: gray;
}

.error {
  color: red;
}
</style>
