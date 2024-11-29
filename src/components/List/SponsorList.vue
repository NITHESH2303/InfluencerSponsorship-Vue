<template>
  <div class="sponsors-list">
    <h2>Sponsors</h2>
    <ul v-if="sponsors.length">
      <li v-for="sponsor in sponsors" :key="sponsor.id">
        {{ sponsor.company_name || sponsor.name }} - Industry: {{ sponsor.industry }}
        <div>
          <p v-if="sponsor.is_flagged"><strong>Flagged Reason:</strong> {{ sponsor.flag_reason }}</p>
          <button v-if="isAdmin" @click="toggleFlag(sponsor)">
            {{ sponsor.is_flagged ? "Unflag User" : "Flag User" }}
          </button>
        </div>
      </li>
    </ul>
    <p v-else>Loading sponsors...</p>
  </div>
</template>

<script>
import { fetchWithAuth } from "@/api.js";

export default {
  data() {
    return {
      sponsors: [],
      error: "",
    };
  },
  methods: {
    async fetchSponsors() {
      try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/sponsors/list");
        if (response.ok) {
          const data = await response.json();
          this.sponsors = data.data;
        } else {
          this.error = "Failed to fetch sponsors.";
        }
      } catch (error) {
        this.error = "An error occurred while fetching sponsors.";
      }
    },
    async toggleFlag(influencer) {
      try {
        const action = influencer.is_flagged ? "unflag" : "flag";
        let reason = null;

        if (!influencer.is_flagged) {
          reason = prompt("Enter a reason for flagging this user:");
          if (!reason) {
            alert("Flagging canceled. Reason is required.");
            return;
          }
        }
        const response = await fetchWithAuth(`http://127.0.0.1:5000/api/admin/operation/${action}_user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: sponsor.user_id,
            role: "sponsor",
            reason: reason,
          }),
        });

        if (response.ok) {
          alert(`User ${action}ged successfully.`);
          await this.fetchFlaggedUsers();
          await this.fetchInfluencers();
        } else {
          this.error = `Failed to ${action} user.`;
        }
      } catch (error) {
        this.error = `An error occurred while ${action}ging the user.`;
      }
    },
    checkAdminRole() {
      try {
        const roles = JSON.parse(localStorage.getItem("role"));
        this.isAdmin = roles && roles.includes("admin");
      } catch (error) {
        console.error("Error reading roles from local storage", error);
        this.isAdmin = false;
      }
    },
  },
  mounted() {
    this.fetchSponsors();
    this.checkAdminRole();
  },
};
</script>
