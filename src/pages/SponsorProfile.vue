<template>
  <div class="profile-page">
    <h2>{{ influencer.company_name }}</h2>
    <p><strong>Industry:</strong> {{ sponsor.industry_type }}</p>
    <p><strong>Description:</strong> {{ sponsor.description }}</p>
    <p><strong>Email:</strong> {{ sponsor.email }}</p>
    <p><strong>Full Name:</strong> {{ sponsor.first_name }} {{ sponsor.last_name }}</p>

    <h3>Campaigns</h3>
    <ul v-if="sponsor.campaigns.length">
      <li v-for="campaign in sponsor.campaigns" :key="campaign.id">
        {{ campaign.name }} ({{ campaign.start_date }} - {{ campaign.end_date }})
      </li>
    </ul>
    <p v-else>No campaigns found.</p>
  </div>
</template>

<script>
import {fetchWithAuth} from "@/api.js";

export default {
  props: {
    sponsorId: {
      type: Number,
      required: true,
    }
  },
  data() {
    return {
      sponsor: {},
    };
  },
  async created() {
    await this.fetchSponsorProfile();
  },
  methods: {
    async fetchSponsorProfile() {
      try {
        console.log(this.sponsorId)
        const response = await fetchWithAuth(`http://127.0.0.1:5000/api/profile/sponsor/${this.sponsorId}`, {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          this.sponsor = data.data;
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
