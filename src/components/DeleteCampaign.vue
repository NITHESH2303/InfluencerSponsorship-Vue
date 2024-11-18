<template>
  <button @click="confirmDelete" class="delete-button">Delete Campaign</button>
</template>

<script>
import { fetchWithAuth } from "@/api";

export default {
  props: {
    campaignId: {
      type: Number,
      required: true,
    },
    onDeleted: {
      type: Function,
      required: true,
    },
  },
  methods: {
    confirmDelete() {
      if (confirm("Are you sure you want to delete this campaign?")) {
        this.deleteCampaign();
      }
    },
    async deleteCampaign() {
      try {
        const response = await fetchWithAuth(`http://127.0.0.1:5000/api/campaigns/${this.campaignId}/delete`, {
          method: "DELETE",
        });
        if (response.ok) {
          this.onDeleted(this.campaignId);
        } else {
          console.error("Failed to delete campaign.");
        }
      } catch (error) {
        console.error("An error occurred: ", error.message);
      }
    },
  },
};
</script>

<style scoped>
.delete-button {
  background-color: red;
  color: white;
  border: none;
  padding: 5px;
  cursor: pointer;
}
</style>