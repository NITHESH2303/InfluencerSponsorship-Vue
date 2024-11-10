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
        <label for="audience">Target Audience:</label>
        <input type="text" v-model="campaign.audience" required />
      </div>
      <div>
        <label for="budget">Budget:</label>
        <input type="number" v-model="campaign.budget" required />
      </div>
      <button type="submit">Update Campaign</button>
    </form>
  </div>
</template>

<script>
export default {
  props: ['id'],
  data() {
    return {
      campaign: {},
      error: ""
    };
  },
  async created() {
    await this.fetchCampaign();
  },
  methods: {
    async fetchCampaign() {
      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await fetch(`http://127.0.0.1:5000/api/sponsor/campaigns/${this.id}`, {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        });
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
        const accessToken = localStorage.getItem("access_token");
        const response = await fetch(`http://127.0.0.1:5000/api/sponsor/campaigns/${this.id}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(this.campaign)
        });
        if (response.ok) {
          this.$router.push("/sponsor-dashboard");
        } else {
          this.error = "Failed to update campaign.";
        }
      } catch (error) {
        this.error = "An error occurred: " + error.message;
      }
    }
  }
};
</script>

<style scoped>
.edit-campaign {
  padding: 20px;
}
</style>
