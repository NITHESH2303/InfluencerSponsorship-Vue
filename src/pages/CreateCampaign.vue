<template>
  <div class="create-campaign">
    <h1>Create New Campaign</h1>
    <form @submit.prevent="submitCampaign">
      <div>
        <label for="name">Campaign Name:</label>
        <input type="text" v-model="campaign.campaign_name" required />
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
        <input type="checkbox" v-model="campaign.visibility" />
        <span>{{ campaign.visibility ? 'Private' : 'Public' }}</span>
      </div>
      <div>
        <label for="niche">Niche:</label>
        <select v-model="campaign.niche" required>
          <option v-for="niche in this.nicheOptions" :key="niche" :value="niche">{{ niche }}</option>
        </select>
      </div>
      <button type="submit">Create Campaign</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { fetchWithAuth } from "@/api";

export default {
  data() {
    return {
      campaign: {
        campaign_name: "",
        description: "",
        budget: 0,
        start_date: "",
        end_date: "",
        visibility: false,
        niche: ""
      },
      nicheOptions: "",
      error: ""
    };
  },
  async created() {
    await this.fetchNicheOptions();
  },
  methods: {
    async fetchNicheOptions() {
      try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/niches");
        if (response.ok) {
          const niches = await response.json();
          this.nicheOptions = niches.data;
        } else {
          console.error("Failed to load niches.");
        }
      } catch (error) {
        console.error("An error occurred: ", error.message);
      }
    },
    async submitCampaign() {
      try {
        const payload = {
          campaign_name: this.campaign.campaign_name,
          description: this.campaign.description,
          budget: this.campaign.budget,
          start_date: this.campaign.start_date,
          end_date: this.campaign.end_date,
          visibility: this.campaign.visibility ? true : false,
          niche: this.campaign.niche
        };
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/campaigns/create_new_campaign", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
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
.error {
  color: red;
}
</style>
