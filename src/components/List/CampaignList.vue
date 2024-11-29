<template>
  <div class="campaigns-list">
    <h2>Campaigns</h2>
    <ul v-if="campaigns.length">
      <li v-for="campaign in campaigns" :key="campaign.campaign_id">
        <h3>{{ campaign.campaign_name }} - Status: {{ campaign.status }}</h3>
        <p>Description: {{ campaign.description }}</p>
        <p>Niche: {{ campaign.niche }}</p>
        <p>Start Date: {{ campaign.start_date }}</p>
        <p>End Date: {{ campaign.end_date }}</p>
        <p>Budget: ${{ campaign.budget }}</p>
        <p>Spent Amount: ${{ campaign.spent_amount }}</p>
        <p>Remaining Budget: ${{ campaign.remaining_budget }}</p>
        <p>Progress: {{ campaign.progress_percentage }}%</p>
        <p>Visibility: {{ campaign.visibility ? 'Visible' : 'Hidden' }}</p>
      </li>
    </ul>
    <p v-else>Loading campaigns...</p>
  </div>
</template>

<script>
import { fetchWithAuth } from "@/api.js";

export default {
  data() {
    return {
      campaigns: [],
      error: "",
    };
  },
  methods: {
    async fetchCampaigns() {
      try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/campaigns");
        if (response.ok) {
          const data = await response.json();
          this.campaigns = data.data;
        } else {
          this.error = "Failed to fetch campaigns.";
        }
      } catch (error) {
        this.error = "An error occurred while fetching campaigns.";
      }
    },
  },
  mounted() {
    this.fetchCampaigns();
  },
};
</script>

<style scoped>
.campaigns-list {
  margin: 20px;
}
.campaigns-list h3 {
  margin-bottom: 5px;
  font-size: 1.2em;
}
.campaigns-list p {
  margin: 0;
}
.campaigns-list ul {
  padding-left: 20px;
}
.campaigns-list li {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}
</style>
