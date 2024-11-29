<template>
  <div class="campaign-stats">
    <h2>Campaign Statistics</h2>
<!--    <div class="stat">-->
<!--      <p>Total Campaigns:</p>-->
<!--      <span>{{ stats.total }}</span>-->
<!--    </div>-->
<!--    <div class="stat">-->
<!--      <p>Active Campaigns:</p>-->
<!--      <span>{{ stats.active }}</span>-->
<!--    </div>-->
<!--    <div class="stat">-->
<!--      <p>Completed Campaigns:</p>-->
<!--      <span>{{ stats.completed }}</span>-->
<!--    </div>-->
  </div>
</template>

<script>
export default {
  props: {
    stats: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
.campaign-stats {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 20px;
}
.stat {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}
</style>
