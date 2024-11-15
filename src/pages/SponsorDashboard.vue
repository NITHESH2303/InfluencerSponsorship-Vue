<template>
  <div class="sponsor-dashboard">
    <h1>Welcome to Sponsor Dashboard</h1>
    <CampaignStats :stats="campaignStats" />
    <CampaignList :campaigns="campaigns" />
    <button @click="createNewCampaign">Create New Campaign</button>
  </div>
</template>

<script>
import CampaignStats from "@/components/CampaignStats.vue";
import CampaignList from "@/components/CampaignList.vue";
import {fetchWithAuth} from "@/api.js";

export default {
  components: { CampaignStats, CampaignList },
  data() {
    return {
      campaigns: [],
      campaignStats: {},
      error: ""
    };
  },
  async created() {
    await this.fetchCampaignData();
  },
  methods: {
    async fetchCampaignData() {
      const token = localStorage.getItem('access_token');
      try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/campaigns", {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          this.campaigns = data.campaigns;
          this.campaignStats = data.stats;
        } else {
          this.error = "Failed to load campaigns.";
        }
      } catch (error) {
        this.error = "An error occurred: " + error.message;
      }
    },
    createNewCampaign() {
      this.$router.push("/campaign/create");
    }
  }
};
</script>

<style scoped>
.sponsor-dashboard {
  padding: 20px;
}
</style>
