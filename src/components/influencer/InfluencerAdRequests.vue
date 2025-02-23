```vue
<template>
  <div class="ad-requests">
    <h3 class="text-2xl font-bold gradient-text mb-6">Your Ad Requests</h3>

    <div class="overflow-x-auto">
      <table v-if="adRequests.length" class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sponsor</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Negotiation</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="ad in adRequests"
            :key="ad.id"
            class="hover:bg-gray-50 transition-colors duration-200">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900">{{ ad.campaign_name }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <router-link :to="{ name: 'SponsorProfile', params: { sponsorId: ad.sponsor_id } }" class="text-sm text-gray-900">
              {{ ad.sponsor_username }}
            </router-link>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900">${{ ad.amount }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">${{ ad.negotiation_amount || '-' }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getStatusClass(ad.status)">
                {{ ad.status }}
              </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
            <div class="flex space-x-2">
              <button v-if="ad.status === adStatuses[0]"
                      @click="acceptRequest(ad.ad_id)"
                      class="btn btn-success">
                Accept
              </button>
              <button v-if="ad.status === adStatuses[0]"
                      @click="rejectRequest(ad.ad_id)"
                      class="btn btn-danger">
                Reject
              </button>
              <button v-if="canNegotiate(ad.status)"
                      @click="negotiateRequest(ad.ad_id)"
                      class="btn btn-primary">
                Negotiate
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
      <p v-else class="text-center text-gray-500 py-4">No ad requests found.</p>
    </div>
  </div>
</template>

<script>
import { fetchWithAuth } from "@/api.js";
import {useToast} from "vue-toastification";

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
      toast: useToast()
    };
  },
  methods: {
    getStatusClass(status) {
      const classes = {
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Accepted': 'bg-green-100 text-green-800',
        'Rejected': 'bg-red-100 text-red-800',
        'Negotiation': 'bg-blue-100 text-blue-800',
        'Completed': 'bg-gray-100 text-gray-800'
      };
      return classes[status] || 'bg-gray-100 text-gray-800';
    },
    canNegotiate(status) {
      return status === this.adStatuses[0] || status === this.adStatuses[1];
    },
    async fetchAdStatus() {
      try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/adstatus");
        if (response.ok) {
          const data = await response.json();
          this.adStatuses = data.data;
        }
      } catch (error) {
        console.error("Error fetching ad statuses:", error);
      }
    },
    async fetchAdRequests() {
      try {
        const response = await fetchWithAuth(`http://127.0.0.1:5000/api/influencer/ad-requests/${this.influencerId}`);
        if (response.ok) {
          const data = await response.json();
          this.adRequests = data.data;
        }
      } catch (error) {
        console.error("Error fetching ad requests:", error);
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
      if (newAmount && !isNaN(newAmount)) {
        try {
          const response = await fetchWithAuth(`http://127.0.0.1:5000/api/influencer/negotiate/${adId}`, {
            method: "PATCH",
            body: JSON.stringify({negotiation_amount: newAmount}),
          });
          if (response.ok) {
            this.toast.success("Negotiation request sent successfully");
            await this.fetchAdRequests();
          }
        } catch (error) {
          this.toast.error("Failed to negotiate");
        }
      }
    },
    async updateRequestStatus(adId, status) {
      try {
        const response = await fetchWithAuth(`http://127.0.0.1:5000/api/influencer/ad-requests/${adId}/status`, {
          method: "PATCH",
          body: JSON.stringify({status}),
        });
        if (response.ok) {
          this.toast.success(`Ad request ${status.toLowerCase()} successfully`);
          await this.fetchAdRequests();
        }
      } catch (error) {
        this.toast.error(`Failed to update ad request status`);
      }
    },
  },
  async created() {
    await Promise.all([this.fetchAdRequests(), this.fetchAdStatus()]);
  },
};
</script>

<style scoped>
.btn {
  @apply px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200;
}

.btn-success {
  @apply bg-green-600 text-white hover:bg-green-700;
}

.btn-danger {
  @apply bg-red-600 text-white hover:bg-red-700;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.gradient-text {
  @apply bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent;
}
</style>
```