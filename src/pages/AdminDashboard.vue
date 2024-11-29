<template>
  <div class="admin-dashboard">
    <h1>Admin Dashboard</h1>

    <section class="overview">
      <h2>Overview</h2>
      <div v-if="overviewStats">
        <p>Total Users: {{ overviewStats.total_users }}</p>
        <p>Total Campaigns: {{ overviewStats.total_campaigns }}</p>
        <p v-if="overviewStats.flagged_sponsors">Flagged Sponsors: {{ overviewStats.flagged_sponsors }}</p>
        <p v-if="overviewStats.flagged_influencers">Flagged Influencers: {{ overviewStats.flagged_influencers }}</p>
      </div>
      <p v-else>Loading overview stats...</p>
    </section>

    <section class="pending-approvals">
      <h2>Pending Sponsor Approvals</h2>
      <ul v-if="pendingSponsors.length">
        <li v-for="sponsor in pendingSponsors" :key="sponsor.sponsorid">
          {{ sponsor.company_name }}
          <button v-if="sponsor.verification_status === sponsorStatus.not_verified" @click="approveSponsor(sponsor.sponsorid)">Verify Initiation</button>
          <button v-else-if="sponsor.verification_status === sponsorStatus.verification_initiated" @click="approveSponsor(sponsor.sponsorid)">Mark As Verified</button>
        </li>
      </ul>
      <p v-else>No pending sponsors for approval.</p>
    </section>

    <section class="flagged-users">
      <h2>Flagged Users</h2>
      <div v-if="flaggedUsers.length">
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Flag Reason</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="user in flaggedUsers" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.flag_reason }}</td>
            <td>
              <button @click="unflagUser(user.id)">Unflag</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <p v-else>No flagged users found.</p>
    </section>

    <h2>Lists</h2>
    <InfluencerList />
    <CampaignList />
    <SponsorList />
  </div>
</template>

<script>
// Ensure all imports are at the top
import InfluencerList from "@/components/List/InfluencerList.vue";
import CampaignList from "@/components/List/CampaignList.vue";
import SponsorList from "@/components/List/SponsorList.vue";
import { fetchWithAuth } from "@/api.js";

export default {
  components: {
    InfluencerList,  // Imported here
    CampaignList,
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
    async flagUser(userId, role, reason) {
      try {
        const response = await fetchWithAuth(`http://127.0.0.1:5000/api/admin/operation/flag_user`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({user_id: userId, role: role, reason: reason}),
        });

        if (response.ok) {
          alert("User flagged successfully.");
          this.fetchFlaggedUsers();
        } else {
          this.error = "Failed to flag user.";
        }
      } catch (error) {
        this.error = "An error occurred while flagging the user.";
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
          alert("User unflagged successfully.");
          this.fetchFlaggedUsers();
        } else {
          this.error = "Failed to unflag user.";
        }
      } catch (error) {
        this.error = "An error occurred while unflagging the user.";
      }
    },
  },
  mounted() {
    this.fetchOverviewStats();
    this.fetchPendingSponsors();
    this.fetchFlaggedUsers();
  },
};
</script>

<style scoped>
.flagged-users table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.flagged-users table th,
.flagged-users table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

.flagged-users table th {
  background-color: #f9f9f9;
}

.flagged-users button {
  padding: 5px 10px;
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.flagged-users button:hover {
  background-color: #c9302c;
}
</style>
