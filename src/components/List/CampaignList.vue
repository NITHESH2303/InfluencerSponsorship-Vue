<template>
  <div class="space-y-6">
    <div v-if="campaigns.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ListCard
          v-for="campaign in campaigns"
          :key="campaign.campaign_id"
          :title="campaign.campaign_name"
          :subtitle="`Budget: $${campaign.budget}`"
      >
        <div class="mt-4 space-y-4">
          <p class="text-gray-600 line-clamp-2">{{ campaign.description }}</p>

          <div class="flex justify-between items-center">
            <StatusBadge :status="campaign.status" />
            <span class="text-sm text-gray-500">
              {{ formatDate(campaign.start_date) }} - {{ formatDate(campaign.end_date) }}
            </span>
          </div>

          <div>
            <div class="flex justify-between text-sm text-gray-500 mb-1">
              <span>Progress</span>
              <span>{{ campaign.progress_percentage }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                  class="bg-primary-600 rounded-full h-2 transition-all duration-300"
                  :style="{ width: `${campaign.progress_percentage}%` }"
              ></div>
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button
                @click="handleEdit(campaign)"
                class="btn btn-secondary"
            >
              <i class="fas fa-edit mr-2"></i> Edit
            </button>
            <button
                v-if="campaign.status !== 'Completed'"
                @click="handleComplete(campaign)"
                class="btn btn-primary"
            >
              <i class="fas fa-check mr-2"></i> Complete
            </button>
            <button
                v-if="canDelete(campaign.status)"
                @click="handleDelete(campaign)"
                class="btn btn-danger"
            >
              <i class="fas fa-trash mr-2"></i> Delete
            </button>
          </div>
        </div>
      </ListCard>
    </div>

    <div v-else class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <i class="fas fa-folder-open text-4xl"></i>
      </div>
      <h3 class="text-lg font-medium text-gray-900">No campaigns yet</h3>
      <p class="text-gray-500">Get started by creating your first campaign</p>
    </div>
  </div>
</template>

<script>
import { fetchWithAuth } from "@/api";
import ListCard from './shared/ListCard.vue';
import StatusBadge from './shared/StatusBadge.vue';

export default {
  components: { ListCard, StatusBadge },
  props: {
    sponsorId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      campaigns: [],
      error: ""
    };
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    canDelete(status) {
      return status !== 'Active' && status !== 'Completed';
    },
    async fetchCampaigns() {
      try {
        const response = await fetchWithAuth(`http://127.0.0.1:5000/api/sponsor/campaigns/${this.sponsorId}`);
        if (response.ok) {
          const data = await response.json();
          this.campaigns = data.data;
        }
      } catch (error) {
        this.error = "Failed to load campaigns";
      }
    },
    handleEdit(campaign) {
      this.$router.push({
        name: 'EditCampaign',
        params: { campaignId: campaign.campaign_id }
      });
    },
    async handleComplete(campaign) {
      try {
        const response = await fetchWithAuth(
            `http://127.0.0.1:5000/api/sponsor/campaigns/${campaign.campaign_id}/status`,
            {
              method: "PUT",
              body: JSON.stringify({ status: 'Completed' })
            }
        );
        if (response.ok) {
          await this.fetchCampaigns();
        }
      } catch (error) {
        this.error = "Failed to update campaign status";
      }
    },
    async handleDelete(campaign) {
      if (confirm('Are you sure you want to delete this campaign?')) {
        try {
          const response = await fetchWithAuth(
              `http://127.0.0.1:5000/api/campaigns/${campaign.campaign_id}/delete`,
              { method: "DELETE" }
          );
          if (response.ok) {
            await this.fetchCampaigns();
          }
        } catch (error) {
          this.error = "Failed to delete campaign";
        }
      }
    }
  },
  async created() {
    await this.fetchCampaigns();
  }
};
</script>

<style scoped>
.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-all duration-200;
}

.btn-primary {
  @apply bg-primary-600 text-white hover:bg-primary-700;
}

.btn-secondary {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
}

.btn-danger {
  @apply bg-red-100 text-red-600 hover:bg-red-200;
}
</style>