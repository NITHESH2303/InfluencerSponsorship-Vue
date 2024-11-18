<template>
  <div class="ad-request-list">
    <h2>Ad Requests for "{{ campaignName }}"</h2>
    <button @click="createAdRequest" class="create-button">+ Create Ad Request</button>
    <ul>
      <li v-for="ad in adRequests" :key="ad.ad_request_id">
        <h3>{{ ad.request_title }}</h3>
        <p>Requirements: {{ ad.requirements }}</p>
        <p>Payment Amount: ${{ ad.payment_amount }}</p>
        <p>Status: <span :class="statusClass(ad.status)">{{ ad.status }}</span></p>
        <button @click="editAdRequest(ad)">Edit</button>
        <button @click="deleteAdRequest(ad.ad_request_id)">Delete</button>
      </li>
    </ul>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="!adRequests.length && !error">No ad requests found for this campaign.</p>
  </div>
</template>

<script>
import { fetchWithAuth } from "@/api";

export default {
  props: {
    campaignId: {
      type: Number,
      required: true,
    },
    campaignName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      adRequests: [],
      error: "",
    };
  },
  methods: {
    async fetchAdRequests() {
      try {
        const response = await fetchWithAuth(`http://127.0.0.1:5000/api/ads/${this.campaignId}`, {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          this.adRequests = data.data;
        } else {
          this.error = "Failed to load ad requests.";
        }
      } catch (error) {
        this.error = "An error occurred: " + error.message;
      }
    },
    createAdRequest() {
      this.$router.push(`/campaigns/${this.campaignId}/ads/new`);
    },
    editAdRequest(ad) {
      this.$router.push({
        name: "EditAdRequest",
        params: {adRequestId: ad.ad_request_id, adData: ad},
      });
    },
    async deleteAdRequest(adRequestId) {
      if (confirm("Are you sure you want to delete this ad request?")) {
        try {
          const response = await fetchWithAuth(`http://127.0.0.1:5000/api/ads/${adRequestId}`, {
            method: "DELETE",
          });
          if (response.ok) {
            this.adRequests = this.adRequests.filter(
                (ad) => ad.ad_request_id !== adRequestId
            );
          } else {
            this.error = "Failed to delete the ad request.";
          }
        } catch (error) {
          this.error = "An error occurred: " + error.message;
        }
      }
    },
    statusClass(status) {
      return {
        pending: "pending-label",
        accepted: "accepted-label",
        rejected: "rejected-label",
      }[status.toLowerCase()] || "unknown-status";
    },
  },
  async created() {
    await this.fetchAdRequests();
  },
};
</script>

<style scoped>
.ad-request-list {
  padding: 20px;
}

.pending-label {
  color: orange;
  font-weight: bold;
}

.accepted-label {
  color: green;
  font-weight: bold;
}

.rejected-label {
  color: red;
  font-weight: bold;
}

.create-button {
  margin-bottom: 15px;
}

.error {
  color: red;
}
</style>
