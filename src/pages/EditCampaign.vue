<template>
  <div class="edit-campaign">
    <h1>Edit Campaign</h1>
    <form @submit.prevent="updateCampaign">
      <div>
        <label for="name">Campaign Name:</label>
        <input type="text" v-model="campaign.campaign_name" disabled />
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
      <DeleteCampaign :campaignId="campaign.id" :onDeleted="handleDelete"/>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="isLoading">Updating...</p>
  </div>
</template>

<script>
import { fetchWithAuth } from "@/api";
import DeleteCampaign from "@/components/DeleteCampaign.vue";

export default {
  components: {DeleteCampaign},
  props: {
    campaignId: {
      type: Number,
      required: true,
    },
    campaignMeta: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      campaign: {...this.campaignMeta},
      error: "",
      isLoading: false,
    };
  },
  computed: {
    formattedStartDate() {
      return this.campaign.start_date ? this.campaign.start_date.split('T')[0] : '';
    },
    formattedEndDate() {
      return this.campaign.end_date ? this.campaign.end_date.split('T')[0] : '';
    }
  },
  async created() {
    await this.fetchCampaign();
  },
  methods: {
    async fetchCampaign() {
      try {
        console.log(this.campaignId)
        const response = await fetchWithAuth(`http://127.0.0.1:5000/api/campaigns/${this.campaignId}`);
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
      this.isLoading = true;
      try {
        const response = await fetchWithAuth(`http://127.0.0.1:5000/api/campaigns/edit/${this.campaignId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
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
      finally {
        this.isLoading = false;
      }
    },
    async updateStatus(status) {
      try {
        const response = await fetchWithAuth(
            `http://127.0.0.1:5000/api/sponsor/campaigns/${this.campaign.id}/status`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ status }),
            }
        );
        if (response.ok) {
          const result = await response.json();
          this.campaign.status = result.status;
        } else {
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
