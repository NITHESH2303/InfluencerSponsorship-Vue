<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-xl shadow-lg p-8 animate-fade-in">
        <div class="flex items-center space-x-6 mb-8">
          <div class="w-24 h-24 bg-gradient-to-br from-primary-500 to-blue-500 rounded-full flex items-center justify-center">
            <span class="text-3xl font-bold text-white">{{ getInitials }}</span>
          </div>
          <div>
            <h1 class="text-3xl font-bold gradient-text mb-2">{{ sponsor.company_name }}</h1>
            <div class="flex items-center space-x-3">
              <span class="px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                {{ sponsor.industry_type }}
              </span>
              <span :class="getVerificationClass">
                <i class="fas fa-check-circle mr-1"></i>
                {{ getVerificationStatus }}
              </span>
            </div>
          </div>
        </div>

        <div class="card mb-8 transform hover:scale-[1.01] transition-all">
          <h2 class="text-xl font-semibold mb-4">About the Company</h2>
          <p class="text-gray-600 leading-relaxed">{{ sponsor.description }}</p>
        </div>

        <div class="card mb-8 transform hover:scale-[1.01] transition-all">
          <h2 class="text-xl font-semibold mb-4">Contact Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center space-x-3">
              <i class="fas fa-envelope text-primary-600"></i>
              <span class="text-gray-600">{{ sponsor.email }}</span>
            </div>
            <div class="flex items-center space-x-3">
              <i class="fas fa-user text-primary-600"></i>
              <span class="text-gray-600">{{ sponsor.first_name }} {{ sponsor.last_name }}</span>
            </div>
          </div>
        </div>

        <!-- Active Campaigns -->
        <div class="card transform hover:scale-[1.01] transition-all">
          <h2 class="text-xl font-semibold mb-4">Active Campaigns</h2>
          <div v-if="sponsor.campaigns && sponsor.campaigns.length" class="space-y-4">
            <div v-for="campaign in sponsor.campaigns"
                 :key="campaign.id"
                 class="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-medium text-gray-900">{{ campaign.name }}</h3>
                  <div class="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span class="flex items-center">
                      <i class="fas fa-calendar-alt mr-2"></i>
                      {{ formatDate(campaign.start_date) }} - {{ formatDate(campaign.end_date) }}
                    </span>
                  </div>
                </div>
                <span :class="getCampaignStatusClass(campaign.status)"
                      class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ campaign.status }}
                </span>
              </div>
              <div class="mt-3">
                <div class="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{{ campaign.progress_percentage }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-primary-600 rounded-full h-2 transition-all duration-300"
                       :style="{ width: `${campaign.progress_percentage}%` }"></div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            <i class="fas fa-folder-open text-4xl mb-3"></i>
            <p>No active campaigns</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchWithAuth } from "@/api.js";

export default {
  props: {
    sponsorId: {
      type: Number,
      required: true,
    }
  },
  data() {
    return {
      sponsor: {},
      error: "",
    };
  },
  computed: {
    getInitials() {
      if (!this.sponsor.company_name) return '';
      return this.sponsor.company_name.charAt(0).toUpperCase();
    },
    getVerificationStatus() {
      const status = {
        0: 'Not Verified',
        1: 'Verification Pending',
        2: 'Verified'
      };
      console.log(this.sponsor.verification_status);
      return status[this.sponsor.verification_status] || 'Unknown';
    },
    getVerificationClass() {
      const classes = {
        0: 'text-red-600',
        1: 'text-yellow-600',
        2: 'text-green-600'
      };
      return `${classes[this.sponsor.verification_status] || 'text-gray-600'} flex items-center`;
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    getCampaignStatusClass(status) {
      const classes = {
        'Active': 'bg-green-100 text-green-800',
        'Completed': 'bg-gray-100 text-gray-800',
        'Pending': 'bg-yellow-100 text-yellow-800'
      };
      return classes[status] || 'bg-gray-100 text-gray-800';
    },
    async fetchSponsorProfile() {
      try {
        const response = await fetchWithAuth(`http://127.0.0.1:5000/api/profile/sponsor/${this.sponsorId}`);
        if (response.ok) {
          const data = await response.json();
          this.sponsor = data.data;
        } else {
          this.error = "Failed to load sponsor profile";
        }
      } catch (error) {
        this.error = "An error occurred while fetching the profile";
      }
    }
  },
  async created() {
    await this.fetchSponsorProfile();
  }
};
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow-sm p-6 border border-gray-100;
}

.gradient-text {
  @apply bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent;
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