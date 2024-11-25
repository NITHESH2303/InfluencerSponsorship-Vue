<template>
  <div class="ad-requests">
    <h3>Your Ad Requests</h3>
    <table v-if="adRequests.length" class="table">
      <thead>
      <tr>
        <th>Campaign</th>
        <th>Sponsor</th>
        <th>Amount</th>
        <th>Negotiation Amount</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="ad in adRequests" :key="ad.id">
        <td>{{ ad.campaign_name }}</td>
        <td>{{ ad.sponsor_username }}</td>
        <td>${{ ad.amount }}</td>

        <td>${{ ad.negotiation_amount }}</td>

        <td>{{ ad.status }}</td>
        <td>
          <button v-if="ad.status === adStatuses[0]" @click="acceptRequest(ad.ad_id)">Accept</button> <!-- Pending -->
          <button v-if="ad.status === adStatuses[0]" @click="rejectRequest(ad.ad_id)">Reject</button> <!-- Pending -->
          <button v-if="ad.status === adStatuses[0]" @click="negotiateRequest(ad.ad_id)">Negotiate</button> <!-- Pending -->
          <button v-if="ad.status === adStatuses[1]" @click="negotiateRequest(ad.ad_id)">Negotiate</button> <!-- Negotiation -->
        </td>
      </tr>
      </tbody>
    </table>
    <p v-else>No ad requests found.</p>
  </div>
</template>

<script>
import { fetchWithAuth } from "@/api.js";

export default {
  props: {
    influencerId: {
      type: Number,
      required: true,
    }
  },
  data() {
    return {
      adRequests: [],
      adStatuses: [],
    };
  },
  computed: {
    showNegotiationColumn() {
      return this.adRequests.some(ad => ad.status === 'Negotiation');
    }
  },
  async created() {
    await this.fetchAdRequests();
    await this.fetchAdStatus(); // Fetching the statuses
  },
  methods: {
    async fetchAdStatus() {
      try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/adstatus");
        if (response.ok) {
          const data = await response.json();
          this.adStatuses = data.data; // Store fetched statuses
        } else {
          console.error("Failed to load ad statuses.");
        }
      } catch (error) {
        console.error("An error occurred: ", error.message);
      }
    },
    async fetchAdRequests() {
      try {
        const response = await fetchWithAuth(`http://127.0.0.1:5000/api/influencer/ad-requests/${this.influencerId}`, {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          this.adRequests = data.data;
        } else {
          console.error("Failed to fetch ad requests.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },
    async acceptRequest(adId) {
      await this.updateRequestStatus(adId, "Accepted");
    },
    async rejectRequest(adId) {
      await this.updateRequestStatus(adId, "Rejected");
    },
    async negotiateRequest(adId) {
      const newAmount = prompt("Enter the new amount:");
      if (newAmount) {
        try {
          const response = await fetchWithAuth(`http://127.0.0.1:5000/api/influencer/negotiate/${adId}`, {
            method: "PATCH",
            body: JSON.stringify({negotiation_amount: newAmount}),
          });
          if (response.ok) {
            alert("Negotiation request sent successfully.");
            await this.fetchAdRequests();
          } else {
            console.error("Failed to negotiate.");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    },
    async updateRequestStatus(adId, status) {
      try {
        const response = await fetchWithAuth(`http://127.0.0.1:5000/api/influencer/ad-requests/${adId}/status`, {
          method: "PATCH",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({status}),
        });
        if (response.ok) {
          alert(`Ad request ${status.toLowerCase()} successfully.`);
          await this.fetchAdRequests();
        } else {
          console.error("Failed to update ad request status.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },
  },
};
</script>

<style scoped>
.ad-requests {
  margin-top: 20px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
</style>