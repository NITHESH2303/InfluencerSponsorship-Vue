<template>
  <div class="space-y-6">
    <div v-if="sponsors.length" class="grid grid-cols-1 gap-6">
      <ListCard
          v-for="sponsor in sponsors"
          :key="sponsor.id"
          :title="sponsor.company_name || sponsor.name"
          :subtitle="sponsor.industry"
      >
        <div class="mt-4 space-y-4">
          <div class="flex items-center space-x-4">
            <StatusBadge :status="getVerificationStatus(sponsor.verification_status)" />
            <StatusBadge
                v-if="sponsor.is_flagged"
                status="Flagged"
            />
          </div>

          <div v-if="sponsor.is_flagged" class="bg-red-50 border-l-4 border-red-500 p-4">
            <p class="text-sm text-red-700">
              <strong>Flag Reason:</strong> {{ sponsor.flag_reason }}
            </p>
          </div>

          <div v-if="isAdmin" class="flex justify-end space-x-3">
            <button
                v-if="sponsor.is_flagged"
                @click="unflagUser(sponsor)"
                class="btn btn-secondary"
            >
              <i class="fas fa-flag mr-2"></i> Unflag
            </button>
            <button
                v-else
                @click="flagUser(sponsor)"
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
        <i class="fas fa-building text-4xl"></i>
      </div>
      <h3 class="text-lg font-medium text-gray-900">No sponsors found</h3>
      <p class="text-gray-500">Check back later for new sponsors</p>
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
      sponsors: [],
      isAdmin: false,
      error: ""
    };
  },
  methods: {
    getVerificationStatus(status) {
      const statuses = {
        0: 'Pending',
        1: 'Verification Initiated',
        2: 'Verified'
      };
      return statuses[status] || 'Unknown';
    },
    async fetchSponsors() {
      try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/sponsors/list");
        if (response.ok) {
          const data = await response.json();
          this.sponsors = data.data;
        }
      } catch (error) {
        this.error = "Failed to load sponsors";
      }
    },
    async flagUser(sponsor) {
      const reason = prompt("Enter a reason for flagging this user:");
      if (!reason) return;

      try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/admin/operation/flag_user", {
          method: "POST",
          body: JSON.stringify({
            user_id: sponsor.user_id,
            role: "sponsor",
            reason: reason
          })
        });
        if (response.ok) {
          await this.fetchSponsors();
        }
      } catch (error) {
        this.error = "Failed to flag user";
      }
    },
    async unflagUser(sponsor) {
      try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/admin/operation/unflag_user", {
          method: "POST",
          body: JSON.stringify({
            user_id: sponsor.user_id
          })
        });
        if (response.ok) {
          await this.fetchSponsors();
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
    await this.fetchSponsors();
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