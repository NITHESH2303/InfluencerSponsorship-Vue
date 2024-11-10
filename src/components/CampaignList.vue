<template>
  <div class="campaign-list">
    <h2>Your Campaigns</h2>
    <ul>
      <li v-for="campaign in campaigns" :key="campaign.id">
        <router-link :to="`/campaigns/${campaign.id}`">{{ campaign.name }}</router-link>
        <span v-if="campaign.status === 'active'" class="active-label">Active</span>
        <span v-else class="completed-label">Completed</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    campaigns: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped>
.campaign-list {
  border: 1px solid #ccc;
  padding: 10px;
}
.active-label {
  color: green;
  font-weight: bold;
}
.completed-label {
  color: gray;
}
</style>
