<template>
  <div class="profile-page">
    <h2>{{ influencer.username }}</h2>
    <p><strong>Followers:</strong> {{ influencer.followers }}</p>
    <p><strong>About:</strong> {{ influencer.about }}</p>
    <p><strong>Category:</strong> {{ influencer.category }}</p>
    <p><strong>Email:</strong> {{ influencer.email }}</p>
    <p><strong>Full Name:</strong> {{ influencer.first_name }} {{ influencer.last_name }}</p>

    <h3>Campaigns</h3>
    <ul v-if="influencer.ads.length">
      <li v-for="ad in influencer.ads" :key="ad.id">
        {{ ad.campaign_name }}
      </li>
    </ul>
    <p v-else>No AdRequests found.</p>
  </div>
</template>

<script>
import {fetchWithAuth} from "@/api.js";

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
    };
  },
  async created() {
    await this.fetchSponsorProfile();
  },
  methods: {
    async fetchSponsorProfile() {
      try {
        console.log(this.sponsorId)
        const response = await fetchWithAuth(`http://127.0.0.1:5000/api/profile/influencer/${this.influencerId}`, {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          this.influencer = data.data;
        } else {
          console.error("error occurred");
        }
      } catch (error) {
        console.error("Failed to fetch sponsor profile:", error);
      }
    }
  }
};
</script>
