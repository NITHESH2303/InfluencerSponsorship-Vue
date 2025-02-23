<template>
  <div class="space-y-6">
    <div v-if="influencers.length" class="grid grid-cols-1 gap-6">
      <ListCard
          v-for="influencer in influencers"
          :key="influencer.influencer_id"
          :title="influencer.username"
          :subtitle="influencer.category"
      >
        <div class="mt-4 space-y-4">
          <p class="text-gray-600">{{ influencer.about }}</p>

          <div class="flex items-center space-x-4">
            <span class="flex items-center text-gray-600">
              <i class="fas fa-users mr-2"></i>
              {{ formatNumber(influencer.followers) }} followers
            </span>
            <StatusBadge
                v-if="influencer.is_flagged"
                status="Flagged"
            />
          </div>

          <div v-if="influencer.social_media_profiles.length" class="space-y-2">
            <h4 class="text-sm font-medium text-gray-700">Social Media Profiles</h4>
            <div class="flex flex-wrap gap-2">
              <a
                  v-for="profile in influencer.social_media_profiles"
                  :key="profile.platform"
                  href="#"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <i :class="getSocialIcon(profile.platform)" class="mr-2"></i>
                {{ profile.username }}
              </a>
            </div>
          </div>

          <div v-if="isAdmin" class="flex justify-end space-x-3">
            <button
                v-if="influencer.is_flagged"
                @click="unflagUser(influencer)"
                class="btn btn-secondary"
            >
              <i class="fas fa-flag mr-2"></i> Unflag
            </button>
            <button
                v-else
                @click="flagUser(influencer)"
                class="btn btn-danger"
            >
              <i class="fas fa-flag mr-2"></i> Flag
            </button>
          </div>
        </div>
      </ListCard>
    </div>

    <div v-else class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <i class="fas fa-users text-4xl"></i>
      </div>
      <h3 class="text-lg font-medium text-gray-900">No influencers found</h3>
      <p class="text-gray-500">Check back later for new influencers</p>
    </div>
  </div>
</template>

<script>
import { fetchWithAuth } from "@/api";
import ListCard from './shared/ListCard.vue';
import StatusBadge from './shared/StatusBadge.vue';

export default {
  components: { ListCard, StatusBadge },
  data() {
    return {
      influencers: [],
      isAdmin: false,
      error: ""
    };
  },
  methods: {
    formatNumber(num) {
      return new Intl.NumberFormat().format(num);
    },
    getSocialIcon(platform) {
      const icons = {
        'Instagram': 'fab fa-instagram',
        'Twitter': 'fab fa-twitter',
        'YouTube': 'fab fa-youtube'
      };
      return icons[platform] || 'fas fa-link';
    },
    async fetchInfluencers() {
      try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/influencers/list");
        if (response.ok) {
          const data = await response.json();
          this.influencers = data.data;
        }
      } catch (error) {
        this.error = "Failed to load influencers";
      }
    },
    async flagUser(influencer) {
      const reason = prompt("Enter a reason for flagging this user:");
      if (!reason) return;

      try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/admin/operation/flag_user", {
          method: "POST",
          body: JSON.stringify({
            user_id: influencer.user_id,
            role: "influencer",
            reason: reason
          })
        });
        if (response.ok) {
          await this.fetchInfluencers();
        }
      } catch (error) {
        this.error = "Failed to flag user";
      }
    },
    async unflagUser(influencer) {
      try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/admin/operation/unflag_user", {
          method: "POST",
          body: JSON.stringify({
            user_id: influencer.user_id
          })
        });
        if (response.ok) {
          await this.fetchInfluencers();
        }
      } catch (error) {
        this.error = "Failed to unflag user";
      }
    },
    checkAdminRole() {
      try {
        const roles = JSON.parse(localStorage.getItem("role"));
        this.isAdmin = roles && roles.includes("admin");
      } catch (error) {
        this.isAdmin = false;
      }
    }
  },
  async created() {
    this.checkAdminRole();
    await this.fetchInfluencers();
  }
};
</script>

<style scoped>
.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-all duration-200;
}

.btn-secondary {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
}

.btn-danger {
  @apply bg-red-100 text-red-600 hover:bg-red-200;
}
</style>