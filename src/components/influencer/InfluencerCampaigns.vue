<template>
  <div class="influencer-campaigns">
    <h2>Campaigns</h2>
    <div v-if="campaigns.length">
      <div v-for="campaign in campaigns" :key="campaign.campaign_id" class="campaign-card">
        <h3>{{ campaign.campaign_name }}</h3>
        <p>{{ campaign.description }}</p>
        <p><strong>Budget:</strong> {{ campaign.budget }}</p>
        <p><strong>Niche:</strong> {{ campaign.niche }}</p>
      </div>
    </div>
    <p v-else>No campaigns available.</p>
  </div>
</template>

<script>
export default {
  props: {
    campaigns: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.influencer-campaigns {
  margin-bottom: 20px;
}
.campaign-card {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
