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
        <label for="audience">Target Audience:</label>
        <input type="text" v-model="campaign.audience" required />
      </div>
      <div>
        <label for="budget">Budget:</label>
        <input type="number" v-model="campaign.budget" required />
      </div>
      <button type="submit">Create Campaign</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      campaign: {
        name: "",
        description: "",
        audience: "",
        budget: 0
      },
      error: ""
    };
  },
  methods: {
    async submitCampaign() {
      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await fetch("http://127.0.0.1:5000/api/sponsor/campaigns", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(this.campaign)
        });
        if (response.ok) {
          this.$router.push("/sponsor-dashboard");
        } else {
          this.error = "Failed to create campaign.";
        }
      } catch (error) {
        this.error = "An error occurred: " + error.message;
      }
    }
  }
};
</script>

<style scoped>
.create-campaign {
  padding: 20px;
}
</style>
