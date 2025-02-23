<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">

      <RestrictionBanner
          v-if="influencerMeta.is_flagged"
          :reason="influencerMeta.flag_reason"
      />
      <!-- Welcome Section -->
      <div class="card mb-8 transform hover:scale-[1.01] transition-all">
        <h1 class="text-3xl font-bold gradient-text mb-4">
          Welcome, {{ influencerMeta.username }}
        </h1>
        <p class="text-gray-600">
          Manage your profile and ad requests
        </p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="card bg-white/80 backdrop-blur-sm p-6 transform hover:scale-[1.02] transition-all">
          <h3 class="text-lg font-semibold mb-2">Total Followers</h3>
          <p class="text-3xl font-bold gradient-text">
            {{ influencerMeta.followers }}
          </p>
        </div>
        <div class="card bg-white/80 backdrop-blur-sm p-6 transform hover:scale-[1.02] transition-all">
          <h3 class="text-lg font-semibold mb-2">Active Requests</h3>
          <p class="text-3xl font-bold gradient-text">
            {{ activeRequests }}
          </p>
        </div>
        <div class="card bg-white/80 backdrop-blur-sm p-6 transform hover:scale-[1.02] transition-all">
          <h3 class="text-lg font-semibold mb-2">Completed Ads</h3>
          <p class="text-3xl font-bold gradient-text">
            {{ completedAds }}
          </p>
        </div>
      </div>

      <!-- Profile Section -->
      <div class="card mb-8">
        <ProfileSection
            :influencerMeta="influencerMeta"
            @profileUpdated="handleProfileUpdate"
            class="animate-fade-in"
        />
      </div>

      <!-- Ad Requests Section -->
      <div class="card">
        <InfluencerAdRequests
            :influencerId="influencerMeta.influencer_id"
            class="animate-fade-in"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ProfileSection from "@/components/influencer/ProfileSection.vue";
import InfluencerAdRequests from "@/components/influencer/InfluencerAdRequests.vue";
import RestrictionBanner from "@/components/RestrictionBanner.vue";

export default {
  components: {
    RestrictionBanner,
    InfluencerAdRequests,
    ProfileSection,
  },
  props: {
    influencerMeta: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      activeRequests: 0,
      completedAds: 0
    };
  },
  methods: {
    handleProfileUpdate(updatedProfile) {
      this.$emit('profileUpdated', updatedProfile);
    },
    calculateStats() {
      if (this.influencerMeta.ads) {
        this.activeRequests = this.influencerMeta.ads.filter(ad =>
            ad.status === 'Pending' || ad.status === 'Negotiation'
        ).length;
        this.completedAds = this.influencerMeta.ads.filter(ad =>
            ad.status === 'Completed'
        ).length;
      }
    }
  },
  watch: {
    influencerMeta: {
      handler: 'calculateStats',
      immediate: true
    }
  }
};
</script>

<style scoped>
.gradient-text {
  @apply bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent;
}

.card {
  @apply bg-white rounded-xl shadow-lg p-6 transition-all duration-300;
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

.btn {
  @apply px-4 py-2 rounded-lg font-semibold transition-all duration-300;
}

.btn-primary {
  @apply bg-gradient-to-r from-primary-600 to-blue-600 text-white hover:from-primary-700 hover:to-blue-700;
}
</style>