<template>
  <div class="edit-campaign">
    <h1>Edit Campaign</h1>
    <form @submit.prevent="updateCampaign">
      <div>
        <label for="name">Campaign Name:</label>
        <input type="text" v-model="campaign.name" disabled />
      </div>
      <div>
        <label for="description">Description:</label>
        <textarea v-model="campaign.description" required></textarea>
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
        <label for="budget">Budget:</label>
        <input type="number" v-model="campaign.budget" required />
      </div>
      <div>
        <label for="visibility">Visibility:</label>
        <select v-model="campaign.visibility">
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>
      </div>
      <div>
        <label for="niche">Niche:</label>
        <input type="text" v-model="campaign.niche" required />
      </div>
      <button type="submit">Update Campaign</button>
      <button @click="updateStatus('ACTIVE')">Activate</button>
      <button @click="updateStatus('COMPLETED')">Mark as Completed</button>
    </form>
  </div>
</template>

<script>
import { fetchWithAuth } from "@/api";

export default {
  props: ["id"],
  data() {
    return {
      campaign: {},
      error: "",
    };
  },
  async created() {
    await this.fetchCampaign();
  },
  methods: {
    async fetchCampaign() {
      try {
        const response = await fetchWithAuth(`http://127.0.0.1:5000/api/sponsor/campaigns/${this.id}`);
        if (response.ok) {
          this.campaign = await response.json();
        } else {
          this.error = "Failed to load campaign data.";
        }
      } catch (error) {
        this.error = "An error occurred: " + error.message;
      }
    },
    async updateCampaign() {
      try {
        const response = await fetchWithAuth(`http://127.0.0.1:5000/api/sponsor/campaigns/${this.id}`, {
          method: "PUT",
          body: JSON.stringify(this.campaign),
        });
        if (response.ok) {
          this.$router.push("/sponsor-dashboard");
        } else {
          this.error = "Failed to update campaign.";
        }
      } catch (error) {
        this.error = "An error occurred: " + error.message;
      }
    },
    async updateStatus(status) {
      const response = await fetchWithAuth(
          `http://127.0.0.1:5000/api/sponsor/campaigns/${this.campaign.id}/status`,
          {
            method: "PATCH",
            body: JSON.stringify({ status })
          }
      );

      if (response.ok) {
        const result = await response.json();
        this.campaign.status = result.status;
      } else {
        console.error("Failed to update status");
      }
    },
  },
};
</script>

<style scoped>
.edit-campaign {
  padding: 20px;
}
</style>
