<template>
  <div class="influencer-dashboard">
    <h1>Welcome, {{ influencerMeta.username }}</h1>
    <ProfileSection :influencerMeta="influencerMeta" @profileUpdated="fetchMetaData"/>
    <CampaignList :campaigns="campaigns" />
    <AdRequestList
        :adRequests="adRequests"
        @adUpdated="fetchAdRequests"
    />
  </div>
</template>

<script>
import ProfileSection from "@/components/influencer/ProfileSection.vue";
import AdRequestList from "@/components/influencer/InfluencerAdRequests.vue";
import InfluencerCampaigns from "@/components/influencer/InfluencerCampaigns.vue";
import { fetchWithAuth } from "@/api.js";

export default {
  components: {
    ProfileSection,
    InfluencerCampaigns,
    AdRequestList,
  },
  props: {
    influencerMeta: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      campaigns: [],
      adRequests: [],
    };
  },
  methods: {
    async fetchMetaData() {
      try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/influencer/meta", {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          this.influencerMeta = data.data;
        }
      } catch (error) {
        console.error("Failed to fetch influencer meta:", error);
      }
    },
  },
};
</script>


<style scoped>
.influencer-dashboard {
  padding: 20px;
}
</style>
