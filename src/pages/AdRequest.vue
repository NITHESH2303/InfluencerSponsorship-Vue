<template>
  <div class="ad-request-list">
    <h2>Ad Requests for Campaign {{ campaignName }}</h2>
    <button @click="createAdRequest" class="create-button">+ Create Ad Request</button>
    <ul v-if="!loading && adRequests.length">
      <li v-for="ad in adRequests" :key="ad.ad_id">
        <h3>{{ ad.requirement }}</h3>
        <p><strong>Payment Amount:</strong> ${{ ad.amount }}</p>
        <p v-if="ad.negotiation_amount">
          <strong>Negotiated Amount:</strong> ${{ ad.negotiation_amount }}
        </p>
        <p><strong>Requested Influencer:</strong>
          <router-link :to="{ name: 'InfluencerProfile', params: { influencerId: ad.influencer_id } }">
            {{ ad.influencer_username }}
          </router-link>
        </p>
        <p><strong>Campaign Owner:</strong>
          <router-link :to="{ name: 'SponsorProfile', params: { sponsorId: ad.sponsor_id } }">
            {{ ad.sponsor_username }}
          </router-link>
        </p>
        <p><strong>Status:</strong> <span :class="statusClass(ad.status)">{{ ad.status }}</span></p>
        <div class="actions">
          <button v-if="canEditOrDelete(ad.status)" @click="editAdRequest(ad)">Edit</button>
          <button v-if="canEditOrDelete(ad.status)" @click="deleteAdRequest(ad.ad_id)">Delete</button>
          <button v-if="ad.negotiation_amount && ad.status === 'Negotiation'" @click="acceptNegotiation(ad)">
            Accept Negotiation
          </button>
          <button v-if="ad.status === 'Accepted'" @click=completeAdRequest(ad.ad_id)>Mark As Completed</button>
        </div>
      </li>
    </ul>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="!loading && !adRequests.length && !error">No ad requests found for this campaign.</p>
    <p v-if="loading">Loading ad requests...</p>
  </div>
</template>

<script>
import { fetchWithAuth } from "@/api";

const API_BASE = "http://127.0.0.1:5000";

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
      adStatuses: [],
      error: "",
      loading: true,
    };
  },
  methods: {
    async fetchAdStatus() {
      try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/adstatus");
        if (response.ok) {
          const data = await response.json();
          this.adStatuses = data.data;
        } else {
          console.error("Failed to load ad statuses.");
        }
      } catch (error) {
        console.error("An error occurred: ", error.message);
      }
    },
    async fetchAdRequests() {
      this.loading = true;
      try {
        const response = await fetchWithAuth(`${API_BASE}/api/adrequests/${this.campaignId}`, {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          this.adRequests = data.data.map((ad) => ({
            ...ad,
          }));
        } else {
          const errorData = await response.json();
          this.error = errorData.message || "Failed to load ad requests.";
        }
      } catch (error) {
        this.error = "An error occurred: " + error.message;
      } finally {
        this.loading = false;
      }
    },
    canEditOrDelete(status) {
      return status !== 'Accepted' && status !== 'Completed';
    },
    createAdRequest() {
      this.$router.push(`/campaigns/${this.campaignId}/ads/new`);
    },
    editAdRequest(ad) {
      this.$router.push({ name: "EditAdRequest", params: { adId: ad.ad_id, campaignId: this.campaignId } });
    },
    async completeAdRequest(adId) {
      await this.updateStatus(adId, "Completed");
    },
    async deleteAdRequest(adRequestId) {
      if (confirm("Are you sure you want to delete this ad request?")) {
        try {
          const response = await fetchWithAuth(`${API_BASE}/api/adrequests/${adRequestId}`, { method: "DELETE" });
          if (response.ok) {
            this.adRequests = this.adRequests.filter((ad) => ad.ad_id !== adRequestId);
          } else {
            this.error = "Failed to delete the ad request.";
          }
        } catch (error) {
          this.error = "An error occurred: " + error.message;
        }
      }
    },
    async updateStatus(adRequestId, status) {
      try {
        const response = await fetchWithAuth(`${API_BASE}/api/influencer/ad-requests/${adRequestId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
        if (response.ok) {
          alert(`Ad request marked as ${status.toLowerCase()}.`);
          await this.fetchAdRequests();
        } else {
          this.error = "Failed to update the ad request status.";
        }
      } catch (error) {
        this.error = "An error occurred: " + error.message;
      }
    },
    async acceptNegotiation(ad) {
      try {
        const response = await fetchWithAuth(`${API_BASE}/api/adrequests/${ad.ad_id}/accept_negotiation`, {
          method: "PATCH",
        });
        if (response.ok) {
          alert("Negotiation accepted successfully.");
          await this.fetchAdRequests();
        } else {
          this.error = "Failed to accept the negotiation.";
        }
      } catch (error) {
        this.error = "An error occurred: " + error.message;
      }
    },
    statusClass(status) {
      const normalizedStatus = status?.toLowerCase() || "unknown";
      if (this.adStatuses.map((s) => s.toLowerCase()).includes(normalizedStatus)) {
        return `${normalizedStatus}-label`;
      }
      return "unknown-status";
    },
  },
  async created() {
    await Promise.all([this.fetchAdRequests(), this.fetchAdStatus()]);
  },
};
</script>

<style scoped>
.ad-request-list {
  margin-top: 20px;
}
.create-button {
  margin-bottom: 10px;
}
.actions {
  margin-top: 10px;
}
.error {
  color: red;
}
</style>
