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
      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await fetch("http://127.0.0.1:5000/api/sponsor/campaigns", {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        });
        if (response.ok) {
          const data = await response.json();
          this.campaigns = data.campaigns;
          this.campaignStats = data.stats;  // Assuming the API returns some stats data
        } else {
          this.error = "Failed to load campaigns.";
        }
      } catch (error) {
        this.error = "An error occurred: " + error.message;
      }
    },
    createNewCampaign() {
      this.$router.push("/create-campaign");
    }
  }
};
</script>

<style scoped>
.sponsor-dashboard {
  padding: 20px;
}
</style>
