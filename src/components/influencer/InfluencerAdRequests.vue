<template>
  <div class="ad-request-list">
    <h2>Ad Requests</h2>
    <div v-if="adRequests.length">
      <div v-for="ad in adRequests" :key="ad.ad_id" class="ad-request-card">
        <h3>Campaign ID: {{ ad.campaign_id }}</h3>
        <p><strong>Requirement:</strong> {{ ad.requirement }}</p>
        <p><strong>Amount:</strong> {{ ad.amount }}</p>
        <p><strong>Status:</strong> {{ ad.status }}</p>
        <button @click="respondToAd(ad.ad_id, 'approve')">Approve</button>
        <button @click="respondToAd(ad.ad_id, 'negotiate')">Negotiate</button>
        <button @click="respondToAd(ad.ad_id, 'reject')">Reject</button>
      </div>
    </div>
    <p v-else>No ad requests available.</p>
  </div>
</template>

<script>
import {fetchWithAuth} from "@/api.js";

export default {
  props: {
    adRequests: {
      type: Array,
      required: true,
    },
  },
  methods: {
    async respondToAd(adId, action) {
      try {
        const payload = {status: action === "approve" ? "APPROVED" : action.toUpperCase()};
        const response = await fetchWithAuth(`/api/ad-requests/${adId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          this.$emit("adU pdated");
        }
      } catch (error) {
        console.error("Error responding to ad request:", error);
      }
    },
  },
};
</script>

<style scoped>
.ad-request-card {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
