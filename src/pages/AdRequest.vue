<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8 animate-fade-in">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-bold gradient-text">
            Ad Requests
          </h2>
          <button
              @click="createAdRequest"
              class="btn btn-primary flex items-center space-x-2 transform hover:scale-105 transition-all"
          >
            <i class="fas fa-plus"></i>
            <span>Create Ad Request</span>
          </button>
        </div>

        <div v-if="!loading && adRequests?.length" class="space-y-4">
          <div v-for="ad in adRequests"
               :key="ad.ad_id"
               class="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div class="flex justify-between items-start">
              <div class="space-y-2">
                <h3 class="text-xl font-semibold text-gray-800">{{ ad.requirement }}</h3>
                <p class="text-gray-600">
                  <span class="font-medium">Payment Amount:</span>
                  <span class="text-primary-600">${{ ad.amount }}</span>
                </p>
                <p v-if="ad.negotiation_amount" class="text-gray-600">
                  <span class="font-medium">Negotiated Amount:</span>
                  <span class="text-primary-600">${{ ad.negotiation_amount }}</span>
                </p>
              </div>
              <span :class="getStatusBadgeClass(ad.status)" class="px-3 py-1 rounded-full text-sm font-medium">
                {{ ad.status }}
              </span>
            </div>

            <div class="mt-4 flex items-center space-x-4">
              <router-link
                  :to="{ name: 'InfluencerProfile', params: { influencerId: ad.influencer_id }}"
                  class="text-primary-600 hover:text-primary-700 font-medium"
              >
                @{{ ad.influencer_username }}
              </router-link>
              <span class="text-gray-400">•</span>
              <router-link
                  :to="{ name: 'SponsorProfile', params: { sponsorId: ad.sponsor_id }}"
                  class="text-primary-600 hover:text-primary-700 font-medium"
              >
                {{ ad.sponsor_username }}
              </router-link>
            </div>

            <div class="mt-6 flex space-x-3">
              <button v-if="canEditOrDelete(ad.status)"
                      @click="editAdRequest(ad)"
                      class="btn btn-secondary">
                <i class="fas fa-edit mr-2"></i> Edit
              </button>
              <button v-if="canEditOrDelete(ad.status)"
                      @click="deleteAdRequest(ad.ad_id)"
                      class="btn btn-danger">
                <i class="fas fa-trash mr-2"></i> Delete
              </button>
              <button v-if="ad.negotiation_amount && ad.status === 'Negotiation'"
                      @click="acceptNegotiation(ad)"
                      class="btn btn-success">
                <i class="fas fa-check mr-2"></i> Accept Negotiation
              </button>
              <button v-if="ad.status === 'Accepted'"
                      @click="completeAdRequest(ad.ad_id)"
                      class="btn btn-primary">
                <i class="fas fa-flag-checkered mr-2"></i> Mark Complete
              </button>
            </div>
          </div>
        </div>

        <div v-else-if="!loading && !adRequests.length" class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <i class="fas fa-inbox text-6xl"></i>
          </div>
          <h3 class="text-xl font-medium text-gray-900">No ad requests found</h3>
          <p class="text-gray-500 mt-2">Get started by creating your first ad request</p>
        </div>

        <div v-if="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>

        <div v-if="error"
             class="bg-red-50 border-l-4 border-red-500 p-4 mt-6"
             role="alert"
        >
          <p class="text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { fetchWithAuth } from "@/api";
import {useToast} from "vue-toastification";

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
      toast: useToast()
    };
  },
  methods: {
    getStatusBadgeClass(status) {
      const classes = {
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Accepted': 'bg-green-100 text-green-800',
        'Completed': 'bg-gray-100 text-gray-800',
        'Negotiation': 'bg-blue-100 text-blue-800',
        'Rejected': 'bg-red-100 text-red-800'
      };
      return classes[status] || 'bg-gray-100 text-gray-800';
    },
    async fetchAdStatus() {
      try {
        const response = await fetchWithAuth(`${API_BASE}/api/adstatus`);
        if (response.ok) {
          const data = await response.json();
          this.adStatuses = data.data;
        }
      } catch (error) {
        console.error("Failed to load ad statuses:", error);
      }
    },
    async fetchAdRequests() {
      this.loading = true;
      try {
        const response = await fetchWithAuth(`${API_BASE}/api/adrequests/${this.campaignId}`);
        if (response.ok) {
          const data = await response.json();
          this.adRequests = data.data;
          if (this.adRequests.length === 0) {
            this.error = "No ad requests found.";
          }
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
      this.$router.push({
        name: "EditAdRequest",
        params: { adId: ad.ad_id, campaignId: this.campaignId }
      });
    },
    async completeAdRequest(adId) {
      await this.updateStatus(adId, "Completed");
    },
    async deleteAdRequest(adRequestId) {
      if (confirm("Are you sure you want to delete this ad request?")) {
        try {
          const response = await fetchWithAuth(`${API_BASE}/api/adrequests/${adRequestId}/delete`, {
            method: "DELETE"
          });
          if (response.ok) {
            this.adRequests = this.adRequests.filter((ad) => ad.ad_id !== adRequestId);
            this.toast.success("Ad request deleted successfully");
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
          body: JSON.stringify({ status }),
        });
        if (response.ok) {
          this.toast.success(`Ad request marked as ${status.toLowerCase()}`);
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
          this.toast.success("Negotiation accepted successfully");
          await this.fetchAdRequests();
        } else {
          this.error = "Failed to accept the negotiation.";
        }
      } catch (error) {
        this.error = "An error occurred: " + error.message;
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
  @apply px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center;
}

.btn-primary {
  @apply bg-gradient-to-r from-primary-600 to-blue-600 text-white hover:from-primary-700 hover:to-blue-700;
}

.btn-secondary {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
}

.btn-danger {
  @apply bg-red-100 text-red-600 hover:bg-red-200;
}

.btn-success {
  @apply bg-green-100 text-green-600 hover:bg-green-200;
}

.gradient-text {
  @apply bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent;
}

.card {
  @apply bg-white rounded-lg shadow p-6 border border-gray-100;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>