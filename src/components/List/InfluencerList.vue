<template>
  <div class="influencers-list">
    <h2>Influencers</h2>
    <ul v-if="influencers.length">
      <li v-for="influencer in influencers" :key="influencer.influencer_id">
        <h3>{{ influencer.username }} - {{ influencer.category }}</h3>
        <p>Followers: {{ influencer.followers }}</p>
        <p>About: {{ influencer.about }}</p>
        <div>
          <h4>Social Media Profiles:</h4>
          <ul>
            <li v-for="profile in influencer.social_media_profiles" :key="profile.platform">
              {{ profile.platform }}: {{ profile.username }} (Followers: {{ profile.followers }})
            </li>
          </ul>
        </div>
        <div v-if="influencer.ads.length">
          <h4>Ads:</h4>
          <ul>
            <li v-for="ad in influencer.ads" :key="ad.ad_id">
              {{ ad.campaign_name }} - {{ ad.requirement }} - Status: {{ ad.status }} - Amount: ${{ ad.amount }}
            </li>
          </ul>
        </div>
        <div>
          <p v-if="influencer.is_flagged"><strong>Flagged Reason:</strong> {{ influencer.flag_reason }}</p>
          <button v-if="isAdmin" @click="toggleFlag(influencer)">
            {{ influencer.is_flagged ? "Unflag User" : "Flag User" }}
          </button>
        </div>
      </li>
    </ul>
    <p v-else>Loading influencers...</p>
  </div>
</template>

<script>
import { fetchWithAuth } from "@/api.js";

export default {
  data() {
    return {
      influencers: [],
      isAdmin: false,
      error: "",
    };
  },
  methods: {
    async fetchInfluencers() {
      try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/influencers/list");
        if (response.ok) {
          const data = await response.json();
          this.influencers = data.data;
        } else {
          this.error = "Failed to fetch influencers.";
        }
      } catch (error) {
        this.error = "An error occurred while fetching influencers.";
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
            user_id: influencer.user_id,
            role: "influencer",
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
    this.fetchInfluencers();
    this.checkAdminRole();
  },
};
</script>

<style scoped>
.influencers-list {
  margin: 20px;
}

.influencers-list h3 {
  margin-bottom: 5px;
  font-size: 1.2em;
}

.influencers-list p {
  margin: 0;
}

.influencers-list ul {
  padding-left: 20px;
}

.influencers-list li {
  margin-bottom: 10px;
}
</style>
