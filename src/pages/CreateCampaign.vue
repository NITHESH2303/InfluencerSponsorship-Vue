<template>
  <div class="create-campaign">
    <h1>Create New Campaign</h1>
    <form @submit.prevent="submitCampaign">
      <div>
        <label for="name">Campaign Name:</label>
        <input type="text" v-model="campaign.name" required />
      </div>
      <div>
        <label for="description">Description:</label>
        <textarea v-model="campaign.description" required></textarea>
      </div>
      <div>
        <label for="budget">Budget:</label>
        <input type="number" v-model="campaign.budget" required />
      </div>
      <div>
        <label for="start_date">Start Date:</label>
        <input type="date" v-model="campaign.start_date" required />
      </div>
      <div>
        <label for="end_date">End Date:</label>
        <input type="date" v-model="campaign.end_date" required />
      </div>
      <div>
        <label for="visibility">Visibility:</label>
        <select v-model="campaign.visibility" required>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>
      <div>
        <label for="niche">Niche:</label>
        <input type="text" v-model="campaign.niche" required />
      </div>
      <button type="submit">Create Campaign</button>
    </form>
  </div>
</template>

<script>
import { fetchWithAuth } from "@/api";

export default {
  data() {
    return {
      campaign: {
        name: "",
        description: "",
        budget: 0,
        start_date: "",
        end_date: "",
        visibility: "private",
        niche: ""
      },
      error: ""
    };
  },
  methods: {
    async submitCampaign() {
      try {
        console.log(typeof(this.campaign.start_date));
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/campaigns/create_new_campaign", {
          method: "POST",
          body: JSON.stringify({
            name: this.campaign.name,
            description: this.campaign.description,
            budget: this.campaign.budget,
            start_date: this.campaign.start_date,
            end_date: this.campaign.end_date,
            visibility: this.campaign.visibility,
            niche: this.campaign.niche
          }),
        });
        if (response.ok) {
          this.$router.push("/sponsor/dashboard");
        } else {
          this.error = "Failed to create campaign.";
        }
      } catch (error) {
        this.error = "An error occurred: " + error.message;
      }
    },
  },
};
</script>

<style scoped>
.create-campaign {
  padding: 20px;
}
</style>
