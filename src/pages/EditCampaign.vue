<template>
  <div class="edit-campaign">
    <h1>Edit Campaign</h1>
    <form @submit.prevent="updateCampaign">
      <div>
        <label for="name">Campaign Name:</label>
        <input type="text" v-model="campaign.campaign_name" required />
      </div>
      <div>
        <label for="description">Description:</label>
        <textarea v-model="campaign.description" required></textarea>
      </div>
      <div>
        <label for="start_date">Start Date:</label>
        <input type="date" v-model="formattedStartDate" required />
      </div>
      <div>
        <label for="end_date">End Date:</label>
        <input type="date" v-model="formattedEndDate" required />
      </div>
      <div>
        <label for="budget">Budget:</label>
        <input type="number" v-model="campaign.budget" required />
      </div>
      <div>
        <label for="visibility">Visibility:</label>
        <input type="checkbox" v-model="campaign.visibility" />
        <span>{{ campaign.visibility ? 'Public' : 'Private' }}</span>
      </div>
      <div>
        <select v-model="campaign.niche" required>
          <option v-for="niche in this.nicheOptions" :key="niche" :value="niche">{{ niche }}</option>
        </select>
      </div>
      <button type="submit">Update Campaign</button>
      <button
          v-if="campaign.status !== 'Active'"
          @click="updateStatus('Active')">Activate</button>
      <button
          v-if="campaign.status !== 'Completed'"
          @click="updateStatus('Completed')">Mark as Completed</button>
      <DeleteCampaign :campaignId="campaign.id" :onDeleted="handleDelete"/>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="isLoading">Updating...</p>
  </div>
</template>

<script>
import { fetchWithAuth } from "@/api";
import DeleteCampaign from "@/components/Campaign/DeleteCampaign.vue";

export default {
  components: { DeleteCampaign },
  props: {
    campaignId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      campaign: {
        name: "",
        description: "",
        budget: 0,
        start_date: "",
        end_date: "",
        visibility: "",
        niche: ""
      },
      formattedStartDate: "",
      formattedEndDate: "",
      nicheOptions: "",
      error: "",
      isLoading: false,
    };
  },
  watch: {
    formattedStartDate(newDate) {
      this.campaign.start_date = newDate;
    },
    formattedEndDate(newDate) {
      this.campaign.end_date = newDate;
    },
    'campaign.start_date': {
      immediate: true,
      handler(newDate) {
        this.formattedStartDate = newDate ? newDate.split(' ')[0] : '';
      },
    },
    'campaign.end_date': {
      immediate: true,
      handler(newDate) {
        this.formattedEndDate = newDate ? newDate.split(' ')[0] : '';
      },
    },
  },
  async created() {
    await this.fetchNicheOptions();
    await this.fetchCampaign();
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
    async fetchCampaign() {
      try {
        const response = await fetchWithAuth(`http://127.0.0.1:5000/api/campaigns/${this.campaignId}`);
        if (response.ok) {
          const data = await response.json();
          this.campaign = data.data;
          this.formattedStartDate = this.campaign.start_date ? this.campaign.start_date.split(' ')[0] : '';
          this.formattedEndDate = this.campaign.end_date ? this.campaign.end_date.split(' ')[0] : '';
        } else {
          this.error = "Failed to load campaign data.";
        }
      } catch (error) {
        this.error = "An error occurred: " + error.message;
      }
    },
    async updateCampaign() {
      this.isLoading = true;
      try {
        const payload = { ...this.campaign, visibility: !!this.campaign.visibility };
        const response = await fetchWithAuth(`http://127.0.0.1:5000/api/campaigns/edit/${this.campaignId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          this.$router.push("/sponsor-dashboard");
        } else {
          this.error = "Failed to update campaign.";
        }
      } catch (error) {
        this.error = "An error occurred: " + error.message;
      } finally {
        this.isLoading = false;
      }
    },
    async updateStatus(status) {
      try {
        const response = await fetchWithAuth(
            `http://127.0.0.1:5000/api/sponsor/campaigns/${this.campaignId}/status`,
            {
              method: "PUT",
              body: JSON.stringify({status}),
            }
        );
        if (response.ok) {
          const result = await response.json();
          this.campaign.status = result.status;
          alert("Campaign status updated successfully!");
        } else {
          this.error = "Failed to update campaign status.";
          console.error("Failed to update status.");
        }
      } catch (error) {
        console.error("An error occurred: ", error.message);
      }
    },
    handleDelete(campaignId) {
      this.$router.push("/sponsor-dashboard");
    },
  },
};
</script>

<style scoped>
.edit-campaign {
  padding: 20px;
}

.error {
  color: red;
}
</style>
