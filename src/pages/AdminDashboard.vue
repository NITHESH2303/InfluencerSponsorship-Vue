<template>
  <div class="admin-dashboard">
    <h1>Admin Dashboard</h1>
    <section class="overview">
      <h2>Overview</h2>
      <div v-if="overviewStats">
        <p>Total Users: {{ overviewStats.total_users }}</p>
        <p>Total Campaigns: {{ overviewStats.total_campaigns }}</p>
        <p>Flagged Sponsors: {{ overviewStats.flagged_sponsors }}</p>
        <p>Flagged Influencers: {{ overviewStats.flagged_influencers }}</p>
      </div>
      <p v-else>Loading overview stats...</p>
    </section>

    <section class="pending-approvals">
      <h2>Pending Sponsor Approvals</h2>
      <ul v-if="pendingSponsors.length > 0">
        <li v-for="sponsor in pendingSponsors" :key="sponsor.id">
          {{ sponsor.name }}
          <button @click="approveSponsor(sponsor.id)">Approve</button>
        </li>
      </ul>
      <p v-else>No pending sponsors for approval.</p>
    </section>

    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      overviewStats: null,
      pendingSponsors: [],
      error: ""
    };
  },
  methods: {
    async fetchOverviewStats() {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/admin/overview");
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
        const response = await fetch("http://127.0.0.1:5000/api/admin/operation/approve_sponsor");
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
        const response = await fetch(`http://127.0.0.1:5000/api/admin/operation/approve_sponsor/${sponsorId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          this.pendingSponsors = this.pendingSponsors.filter(sponsor => sponsor.id !== sponsorId);
        } else {
          const errorData = await response.json();
          this.error = errorData.data.message || "Failed to approve sponsor.";
        }
      } catch (error) {
        this.error = "An error occurred while approving the sponsor.";
      }
    }
  },
  mounted() {
    this.fetchOverviewStats();
    this.fetchPendingSponsors();
  }
};
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
}

.overview, .pending-approvals {
  margin-bottom: 20px;
}

.error-message {
  color: red;
}
</style>