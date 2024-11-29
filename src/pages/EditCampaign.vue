<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-xl shadow-lg p-8 animate-fade-in">
        <h1 class="text-3xl font-bold gradient-text mb-8">Edit Campaign</h1>

        <form @submit.prevent="updateCampaign" class="space-y-6">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Campaign Name
              <span class="text-red-500">*</span>
            </label>
            <input
                type="text"
                v-model="campaign.campaign_name"
                required
                class="input"
                placeholder="Enter campaign name"
            />
          </div>

          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Description
              <span class="text-red-500">*</span>
            </label>
            <textarea
                v-model="campaign.description"
                required
                rows="4"
                class="input"
                placeholder="Describe your campaign"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Start Date
                <span class="text-red-500">*</span>
              </label>
              <input
                  type="date"
                  v-model="formattedStartDate"
                  required
                  class="input"
              />
            </div>

            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                End Date
                <span class="text-red-500">*</span>
              </label>
              <input
                  type="date"
                  v-model="formattedEndDate"
                  required
                  class="input"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Budget
                <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span class="absolute left-3 top-2 text-gray-500">$</span>
                <input
                    type="number"
                    v-model="campaign.budget"
                    required
                    min="0"
                    step="0.01"
                    class="input pl-8"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Niche
                <span class="text-red-500">*</span>
              </label>
              <select
                  v-model="campaign.niche"
                  required
                  class="select"
              >
                <option value="" disabled>Select a niche</option>
                <option
                    v-for="niche in nicheOptions"
                    :key="niche"
                    :value="niche"
                >
                  {{ niche }}
                </option>
              </select>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <input
                type="checkbox"
                id="visibility"
                v-model="campaign.visibility"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label for="visibility" class="text-sm text-gray-700">
              Make campaign visible to influencers
            </label>
          </div>

          <div class="flex flex-wrap gap-4 mt-8">
            <button
                type="submit"
                class="btn btn-primary"
                :disabled="isLoading"
            >
              <span v-if="isLoading" class="loading-dots">Updating</span>
              <span v-else>Update Campaign</span>
            </button>

            <button
                v-if="campaign.status !== 'Active'"
                @click.prevent="updateStatus('Active')"
                class="btn btn-success"
            >
              <i class="fas fa-play mr-2"></i>
              Activate
            </button>

            <button
                v-if="campaign.status !== 'Completed'"
                @click.prevent="updateStatus('Completed')"
                class="btn btn-info"
            >
              <i class="fas fa-flag-checkered mr-2"></i>
              Mark as Completed
            </button>

            <DeleteCampaign
                :campaignId="campaign.id"
                :onDeleted="handleDelete"
                class="btn btn-danger"
            />
          </div>
        </form>

        <div v-if="error"
             class="mt-6 bg-red-50 border-l-4 border-red-500 p-4"
             role="alert"
        >
          <p class="text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchWithAuth } from "@/api";
import DeleteCampaign from "@/components/Campaign/DeleteCampaign.vue";
import {useToast} from "vue-toastification";

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
        campaign_name: "",
        description: "",
        budget: 0,
        start_date: "",
        end_date: "",
        visibility: false,
        niche: "",
        status: "",
      },
      formattedStartDate: "",
      formattedEndDate: "",
      nicheOptions: [],
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
  methods: {
    async fetchNicheOptions() {
      try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/niches");
        if (response.ok) {
          const data = await response.json();
          this.nicheOptions = data.data;
        } else {
          console.error("Failed to load niches.");
        }
      } catch (error) {
        console.error("An error occurred: ", error.message);
      }
    },
    async fetchCampaign() {
      try {
        const response = await fetchWithAuth(
            `http://127.0.0.1:5000/api/campaigns/${this.campaignId}`
        );
        if (response.ok) {
          const data = await response.json();
          this.campaign = data.data;
        } else {
          this.error = "Failed to load campaign data.";
        }
      } catch (error) {
        this.error = "An error occurred: " + error.message;
      }
    },
    async updateCampaign() {
      const toast = useToast();
      this.isLoading = true;
      try {
        const response = await fetchWithAuth(
            `http://127.0.0.1:5000/api/campaigns/edit/${this.campaignId}`,
            {
              method: "PATCH",
              body: JSON.stringify(this.campaign),
            }
        );
        if (response.ok) {
          toast.success("Campaign updated successfully");
          this.$router.push("/sponsor/dashboard");
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
        const toast = useToast();
        const response = await fetchWithAuth(
            `http://127.0.0.1:5000/api/sponsor/campaigns/${this.campaignId}/status`,
            {
              method: "PUT",
              body: JSON.stringify({status}),
            }
        );
        if (response.ok) {
          toast.success("Campaign status updated successfully");
          this.campaign.status = status;
        } else {
          this.error = "Failed to update campaign status.";
        }
      } catch (error) {
        this.error = "An error occurred: " + error.message;
      }
    },
    handleDelete() {
      this.$router.push("/sponsor/dashboard");
    },
  },
  async created() {
    await Promise.all([this.fetchNicheOptions(), this.fetchCampaign()]);
  },
};
</script>

<style scoped>
.input {
  @apply w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500
  focus:border-primary-500 transition-all duration-200;
}

.select {
  @apply w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500
  focus:border-primary-500 transition-all duration-200;
}

.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center;
}

.btn-primary {
  @apply bg-gradient-to-r from-primary-600 to-blue-600 text-white
  hover:from-primary-700 hover:to-blue-700 disabled:opacity-50;
}

.btn-success {
  @apply bg-green-600 text-white hover:bg-green-700;
}

.btn-info {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.btn-danger {
  @apply bg-red-600 text-white hover:bg-red-700;
}

.gradient-text {
  @apply bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>