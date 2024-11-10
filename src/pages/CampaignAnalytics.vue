<template>
  <div class="campaign-analytics">
    <h2>Campaign Analytics</h2>
    <p>Total Views: {{ stats.views }}</p>
    <p>Total Clicks: {{ stats.clicks }}</p>
    <p>Engagement Rate: {{ engagementRate }}%</p>
  </div>
</template>

<script>
export default {
  props: {
    stats: {
      type: Object,
      required: true
    }
  },
  computed: {
    engagementRate() {
      return this.stats.clicks && this.stats.views
          ? ((this.stats.clicks / this.stats.views) * 100).toFixed(2)
          : 0;
    }
  }
};
</script>

<style scoped>
.campaign-analytics {
  border: 1px solid #ccc;
  padding: 20px;
}
</style>
