<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="card mb-8 transform hover:scale-[1.01] transition-all">
        <h1 class="text-3xl font-bold gradient-text mb-4">Admin Dashboard</h1>
        <p class="text-gray-600">Monitor and manage platform activities</p>
      </div>

      <!-- Overview Stats -->
      <section class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card bg-white/80 backdrop-blur-sm p-6 transform hover:scale-[1.02] transition-all">
          <h3 class="text-lg font-semibold mb-2">Total Users</h3>
          <p class="text-3xl font-bold gradient-text">
            {{ overviewStats?.total_users || 0 }}
          </p>
        </div>
        <div class="card bg-white/80 backdrop-blur-sm p-6 transform hover:scale-[1.02] transition-all">
          <h3 class="text-lg font-semibold mb-2">Total Campaigns</h3>
          <p class="text-3xl font-bold gradient-text">
            {{ overviewStats?.total_campaigns || 0 }}
          </p>
        </div>
        <div class="card bg-white/80 backdrop-blur-sm p-6 transform hover:scale-[1.02] transition-all">
          <h3 class="text-lg font-semibold mb-2">Flagged Sponsors</h3>
          <p class="text-3xl font-bold gradient-text">
            {{ overviewStats?.flagged_sponsors || 0 }}
          </p>
        </div>
        <div class="card bg-white/80 backdrop-blur-sm p-6 transform hover:scale-[1.02] transition-all">
          <h3 class="text-lg font-semibold mb-2">Flagged Influencers</h3>
          <p class="text-3xl font-bold gradient-text">
            {{ overviewStats?.flagged_influencers || 0 }}
          </p>
        </div>
      </section>

      <!-- Pending Approvals -->
      <section class="card mb-8 animate-fade-in">
        <h2 class="text-2xl font-bold gradient-text mb-6">Pending Sponsor Approvals</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="sponsor in pendingSponsors" :key="sponsor.sponsorid" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">{{ sponsor.company_name }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(sponsor.verification_status)">
                    {{ getStatusText(sponsor.verification_status) }}
                  </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                    @click="approveSponsor(sponsor.sponsorid)"
                    class="btn btn-primary text-sm"
                >
                  {{ sponsor.verification_status === sponsorStatus.not_verified ? 'Verify Initiation' : 'Mark As Verified' }}
                </button>
              </td>
            </tr>
            <tr v-if="pendingSponsors.length === 0">
              <td colspan="3" class="px-6 py-4 text-center text-gray-500">
                No pending sponsors for approval
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Flagged Users -->
      <section class="card mb-8 animate-fade-in">
        <h2 class="text-2xl font-bold gradient-text mb-6">Flagged Users</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flag Reason</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in flaggedUsers" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">{{ user.username }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ user.role }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ user.flag_reason }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                    @click="unflagUser(user.id)"
                    class="btn btn-secondary text-sm"
                >
                  Unflag
                </button>
              </td>
            </tr>
            <tr v-if="flaggedUsers.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                No flagged users found
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- User Lists -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
        <section class="card">
          <h2 class="text-2xl font-bold gradient-text mb-6">Influencers</h2>
          <InfluencerList />
        </section>
        <section class="card">
          <h2 class="text-2xl font-bold gradient-text mb-6">Sponsors</h2>
          <SponsorList />
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import InfluencerList from "@/components/List/InfluencerList.vue";
import SponsorList from "@/components/List/SponsorList.vue";
import { fetchWithAuth } from "@/api.js";

export default {
  components: {
    InfluencerList,
    SponsorList,
  },
  data() {
    return {
      sponsorStatus: {
        not_verified: 0,
        verification_initiated: 1,
        verified: 2,
      },
      overviewStats: null,
      pendingSponsors: [],
      flaggedUsers: [],
      error: "",
    };
  },
  methods: {
    getStatusClass(status) {
      const classes = {
        [this.sponsorStatus.not_verified]: 'text-red-600',
        [this.sponsorStatus.verification_initiated]: 'text-yellow-600',
        [this.sponsorStatus.verified]: 'text-green-600',
      };
      return classes[status] || 'text-gray-600';
    },
    getStatusText(status) {
      const texts = {
        [this.sponsorStatus.not_verified]: 'Not Verified',
        [this.sponsorStatus.verification_initiated]: 'Verification Initiated',
        [this.sponsorStatus.verified]: 'Verified',
      };
      return texts[status] || 'Unknown';
    },
    async fetchOverviewStats() {
      try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/admin/overview");
        if (response.ok) {
          const data = await response.json();
          this.overviewStats = data.data;
        } else {
          this.error = "Failed to fetch overview stats.";
        }
      } catch (error) {
        this.error = "An error occurred while fetching overview stats.";
      }
    },
    async fetchPendingSponsors() {
      try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/admin/operation/sponsor_approval");
        if (response.ok) {
          const data = await response.json();
          this.pendingSponsors = data.data;
        } else {
          this.error = "Failed to fetch pending sponsors.";
        }
      } catch (error) {
        this.error = "An error occurred while fetching pending sponsors.";
      }
    },
    async approveSponsor(sponsorId) {
      try {
        const response = await fetchWithAuth(`http://127.0.0.1:5000/api/admin/operation/approve_sponsor/${sponsorId}`, {
          method: "POST",
        });

        if (response.ok) {
          this.pendingSponsors = this.pendingSponsors.filter(sponsor => sponsor.sponsorid !== sponsorId);
          await this.fetchOverviewStats();
        } else {
          const errorData = await response.json();
          this.error = errorData.data.message || "Failed to approve sponsor.";
        }
      } catch (error) {
        this.error = "An error occurred while approving the sponsor.";
      }
    },
    async fetchFlaggedUsers() {
      try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/admin/operation/flagged_users");
        if (response.ok) {
          const data = await response.json();
          this.flaggedUsers = data.data;
        } else {
          this.error = "Failed to fetch flagged users.";
        }
      } catch (error) {
        this.error = "An error occurred while fetching flagged users.";
      }
    },
    async unflagUser(userId) {
      try {
        const response = await fetchWithAuth(`http://127.0.0.1:5000/api/admin/operation/unflag_user`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({user_id: userId}),
        });

        if (response.ok) {
          await this.fetchFlaggedUsers();
          await this.fetchOverviewStats();
        } else {
          this.error = "Failed to unflag user.";
        }
      } catch (error) {
        this.error = "An error occurred while unflagging the user.";
      }
    },
  },
  async mounted() {
    await this.fetchOverviewStats();
    await this.fetchPendingSponsors();
    await this.fetchFlaggedUsers();
  },
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

.btn-secondary {
  @apply bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800;
}
</style>