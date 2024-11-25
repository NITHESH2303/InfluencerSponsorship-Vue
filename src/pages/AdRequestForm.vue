<template>
  <div class="ad-request-form">
    <h2>{{ isEdit ? "Edit Ad Request" : "Create Ad Request" }}</h2>
    <form @submit.prevent="submitAdRequest">
      <div>
        <label for="requirements">Requirements:</label>
        <textarea v-model="adRequest.requirement" required></textarea>
      </div>
      <div>
        <label for="influencer">Select Influencer:</label>
        <select v-model="adRequest.influencer_id" required>
          <option v-for="influencer in influencers" :key="influencer.influencer_id" :value="influencer.influencer_id">
            {{ influencer.username }}
          </option>
        </select>
      </div>
      <div>
        <label for="amount">Payment Amount:</label>
        <input type="number" v-model="adRequest.amount" required />
      </div>
      <button type="submit">{{ isEdit ? "Update" : "Create" }}</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>


<script>
import { fetchWithAuth } from "@/api";

export default {
  props: {
    campaignId: {
      type: Number,
      required: true,
    },
    adId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      isEdit: !!this.adId,
      adRequest: {
        request: "",
        requirement: "",
        amount: 0,
        influencer_id: null,
      },
      influencers: [],
      error: "",
    };
  },
  methods: {
    async fetchAdRequest() {
      if (this.isEdit) {
        try {
          console.log(this.adId)
          const response = await fetchWithAuth(`http://127.0.0.1:5000/api/campaign/${this.campaignId}/adrequests/${this.adId}`, {
            method: "GET",
          });
          if (response.ok) {
            const data = await response.json();
            this.adRequest = data.data;
            console.log(this.adRequest);
          } else {
            this.error = "Failed to load ad request details.";
          }
        } catch (error) {
          this.error = "An error occurred: " + error.message;
        }
      }
    },
    async fetchInfluencers() {
      try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/influencers/list", {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          this.influencers = data.data;
        } else {
          this.error = "Failed to load influencers.";
        }
      } catch (error) {
        this.error = "An error occurred: " + error.message;
      }
    },
    async submitAdRequest() {
      const url = this.isEdit
          ? `http://127.0.0.1:5000/api/adrequests/${this.adId}/edit`
          : `http://127.0.0.1:5000/api/adrequests/${this.adRequest.influencer_id}/new`;
      const method = this.isEdit ? "PUT" : "POST";
      try {
        const response = await fetchWithAuth(url, {
          method,
          body: JSON.stringify({
            ...this.adRequest,
            campaign_id: this.campaignId,
          }),
        });
        if (response.ok) {
          this.$router.push(`/campaigns/${this.campaignId}`);
        } else {
          this.error = "Failed to save ad request.";
        }
      } catch (error) {
        this.error = "An error occurred: " + error.message;
      }
    },
  },
  async created() {
    await this.fetchInfluencers();
    if (this.isEdit) await this.fetchAdRequest();
  },
};
</script>
