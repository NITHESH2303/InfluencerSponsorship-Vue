<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-xl shadow-lg p-8 animate-fade-in">
        <!-- Profile Header -->
        <div class="flex items-center space-x-6 mb-8">
          <div class="w-24 h-24 bg-gradient-to-br from-primary-500 to-blue-500 rounded-full flex items-center justify-center">
            <span class="text-3xl font-bold text-white">{{ getInitials }}</span>
          </div>
          <div>
            <h1 class="text-3xl font-bold gradient-text mb-2">{{ influencer.username }}</h1>
            <div class="flex items-center space-x-3">
              <span class="px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                {{ influencer.category }}
              </span>
              <span class="flex items-center text-gray-600">
                <i class="fas fa-users mr-2"></i>
                {{ formatNumber(influencer.followers) }} followers
              </span>
            </div>
          </div>
        </div>

        <!-- About Section -->
        <div class="card mb-8 transform hover:scale-[1.01] transition-all">
          <h2 class="text-xl font-semibold mb-4">About</h2>
          <p class="text-gray-600 leading-relaxed">{{ influencer.about }}</p>
        </div>

        <!-- Contact Information -->
        <div class="card mb-8 transform hover:scale-[1.01] transition-all">
          <h2 class="text-xl font-semibold mb-4">Contact Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center space-x-3">
              <i class="fas fa-envelope text-primary-600"></i>
              <span class="text-gray-600">{{ influencer.email }}</span>
            </div>
            <div class="flex items-center space-x-3">
              <i class="fas fa-user text-primary-600"></i>
              <span class="text-gray-600">{{ influencer.first_name }} {{ influencer.last_name }}</span>
            </div>
          </div>
        </div>

        <!-- Ad Campaigns -->
        <div class="card transform hover:scale-[1.01] transition-all">
          <h2 class="text-xl font-semibold mb-4">Recent Campaigns</h2>
          <div v-if="influencer.ads && influencer.ads.length" class="space-y-4">
            <div v-for="ad in influencer.ads"
                 :key="ad.id"
                 class="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <h3 class="font-medium text-gray-900">{{ ad.campaign_name }}</h3>
              <div class="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span class="flex items-center">
                  <i class="fas fa-calendar-alt mr-2"></i>
                  {{ formatDate(ad.created_at) }}
                </span>
                <span :class="getStatusClass(ad.status)">
                  {{ ad.status }}
                </span>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            <i class="fas fa-folder-open text-4xl mb-3"></i>
            <p>No campaigns found</p>
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
    influencerId: {
      type: Number,
      required: true,
    }
  },
  data() {
    return {
      influencer: {},
      error: "",
    };
  },
  computed: {
    getInitials() {
      if (!this.influencer.username) return '';
      return this.influencer.username.charAt(0).toUpperCase();
    }
  },
  methods: {
    formatNumber(num) {
      return new Intl.NumberFormat().format(num);
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    getStatusClass(status) {
      const classes = {
        'Active': 'text-green-600',
        'Completed': 'text-gray-600',
        'Pending': 'text-yellow-600'
      };
      return `${classes[status] || 'text-gray-600'} font-medium`;
    },
    async fetchInfluencerProfile() {
      try {
        const response = await fetchWithAuth(`http://127.0.0.1:5000/api/profile/influencer/${this.influencerId}`);
        if (response.ok) {
          const data = await response.json();
          this.influencer = data.data;
        } else {
          this.error = "Failed to load influencer profile";
        }
      } catch (error) {
        this.error = "An error occurred while fetching the profile";
      }
    }
  },
  async created() {
    await this.fetchInfluencerProfile();
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