<template>
  <div class="sponsor-dashboard">
    <h1>Welcome, {{sponsorMeta.company_name}}</h1>
    <CampaignStats :stats="campaignStats" />
    <CampaignList :sponsorId="sponsorMeta.sponsorid" />
    <button @click="createNewCampaign">Create New Campaign</button>
  </div>
</template>

<script>
import CampaignStats from "@/components/Campaign/CampaignStats.vue";
import CampaignList from "@/components/Campaign/ListSponsorCampaigns.vue";

export default {
  props: {
    sponsorMeta: {
      type: Object,
      required: true,
    }
  },
  components: { CampaignStats, CampaignList },
  data() {
    return {
      campaignStats: {},
      error: ""
    };
  },
  methods: {
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
