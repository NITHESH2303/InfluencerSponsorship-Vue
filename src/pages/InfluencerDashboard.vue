<template>
  <div class="influencer-dashboard">
    <h1>Influencer Dashboard</h1>
    <ProfileSection :influencer="influencer" @profileUpdated="fetchProfile" />
    <CampaignList :campaigns="campaigns" />
    <AdRequestList :adRequests="adRequests" @adUpdated="fetchAdRequests" />
  </div>
</template>

<script>
import axios from "axios";
import ProfileSection from "@/components/influencer/ProfileSection.vue";
import AdRequestList from "@/components/influencer/InfluencerAdRequests.vue";
import InfluencerCampaigns from "@/components/influencer/InfluencerCampaigns.vue";

export default {
  components: {
    ProfileSection,
    InfluencerCampaigns,
    AdRequestList,
  },
  data() {
    return {
      influencer: null,
      campaigns: [],
      adRequests: [],
    };
  },
  methods: {
    async fetchProfile() {
      try {
        const response = await fetch("/api/influencer/profile");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.influencer = data.data; // Assuming the structure is the same
      } catch (error) {
        console.error("Error fetching influencer profile:", error);
      }
    },
    async fetchCampaigns() {
      try {
        const response = await fetch("/api/campaigns");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.campaigns = data.data; // Assuming the structure is the same
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    },
    async fetchAdRequests() {
      try {
        const response = await fetch("/api/ad-requests");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.adRequests = data.data; // Assuming the structure is the same
      } catch (error) {
        console.error("Error fetching ad requests:", error);
      }
    },
  },
  async created() {
    await Promise.all([this.fetchProfile(), this.fetchCampaigns(), this.fetchAdRequests()]);
  },
}
</script>

<style scoped>
.influencer-dashboard {
  padding: 20px;
}
</style>
