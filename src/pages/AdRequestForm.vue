<template>
  <div class="ad-request-form">
    <h2>{{ isEdit ? "Edit Ad Request" : "Create Ad Request" }}</h2>
    <form @submit.prevent="submitAdRequest">
      <div>
        <label for="request">Title:</label>
        <input type="text" v-model="adRequest.request" required />
      </div>
      <div>
        <label for="requirements">Requirements:</label>
        <textarea v-model="adRequest.requirement" required></textarea>
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
    adRequestId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      isEdit: !!this.adRequestId,
      adRequest: {
        request: "",
        requirement: "",
        amount: 0,
      },
      error: "",
    };
  },
  methods: {
    async fetchAdRequest() {
      if (this.isEdit) {
        try {
          const response = await fetchWithAuth(`http://127.0.0.1:5000/api/adrequests/${this.adRequestId}`, {
            method: "GET",
          });
          if (response.ok) {
            const data = await response.json();
            this.adRequest = data.data;
          } else {
            this.error = "Failed to load ad request details.";
          }
        } catch (error) {
          this.error = "An error occurred: " + error.message;
        }
      }
    },
    async submitAdRequest() {
      const url = this.isEdit
          ? `http://127.0.0.1:5000/api/adrequests/${this.adRequestId}`
          : `http://127.0.0.1:5000/api/adrequests`;
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
    if (this.isEdit) await this.fetchAdRequest();
  },
};
</script>
