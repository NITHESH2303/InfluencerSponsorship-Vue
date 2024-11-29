<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-xl shadow-lg p-8 animate-fade-in">
        <h2 class="text-3xl font-bold gradient-text mb-8">
          {{ isEdit ? "Edit Ad Request" : "Create Ad Request" }}
        </h2>

        <form @submit.prevent="submitAdRequest" class="space-y-6">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Requirements
              <span class="text-red-500">*</span>
            </label>
            <textarea
                v-model="adRequest.requirement"
                required
                rows="4"
                class="input"
                placeholder="Describe your requirements for this ad request"
            ></textarea>
          </div>

          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Select Influencer
              <span class="text-red-500">*</span>
            </label>
            <select
                v-model="adRequest.influencer_id"
                required
                class="select"
            >
              <option value="" disabled>Choose an influencer</option>
              <option
                  v-for="influencer in influencers"
                  :key="influencer.influencer_id"
                  :value="influencer.influencer_id"
              >
                {{ influencer.username }} ({{ influencer.category }})
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Payment Amount
              <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="absolute left-3 top-2 text-gray-500">$</span>
              <input
                  type="number"
                  v-model="adRequest.amount"
                  required
                  min="0"
                  step="0.01"
                  class="input pl-8"
                  placeholder="Enter amount"
              />
            </div>
          </div>

          <div class="flex justify-end space-x-4 mt-8">
            <button
                type="button"
                @click="$router.go(-1)"
                class="btn btn-secondary"
            >
              Cancel
            </button>
            <button
                type="submit"
                class="btn btn-primary"
                :disabled="isSubmitting"
            >
              <span v-if="isSubmitting" class="loading-dots">
                {{ isEdit ? "Updating" : "Creating" }}
              </span>
              <span v-else>
                {{ isEdit ? "Update" : "Create" }} Ad Request
              </span>
            </button>
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
import {useToast} from "vue-toastification";

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
        requirement: "",
        amount: "",
        influencer_id: null,
      },
      influencers: [],
      error: "",
      isSubmitting: false,
      toast: useToast()
    };
  },
  methods: {
    async fetchAdRequest() {
      if (this.isEdit) {
        try {
          const response = await fetchWithAuth(
              `http://127.0.0.1:5000/api/campaign/${this.campaignId}/adrequests/${this.adId}`
          );
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
    async fetchInfluencers() {
      try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/influencers/list");
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
      this.isSubmitting = true;
      this.error = "";

      const url = this.isEdit
          ? `http://127.0.0.1:5000/api/adrequests/${this.adId}/edit`
          : `http://127.0.0.1:5000/api/adrequests/${this.adRequest.influencer_id}/new`;

      try {
        const response = await fetchWithAuth(url, {
          method: this.isEdit ? "PUT" : "POST",
          body: JSON.stringify({
            ...this.adRequest,
            campaign_id: this.campaignId,
          }),
        });

        if (response.ok) {
          this.toast.success(
              `Ad request ${this.isEdit ? "updated" : "created"} successfully`
          );
          this.$router.push(`/campaigns/${this.campaignId}`);
        } else {
          const data = await response.json();
          this.error = data.message || "Failed to save ad request.";
        }
      } catch (error) {
        this.error = "An error occurred: " + error.message;
      } finally {
        this.isSubmitting = false;
      }
    },
  },
  async created() {
    await Promise.all([this.fetchInfluencers(), this.fetchAdRequest()]);
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
  @apply px-6 py-2 rounded-lg font-medium transition-all duration-200;
}

.btn-primary {
  @apply bg-gradient-to-r from-primary-600 to-blue-600 text-white
  hover:from-primary-700 hover:to-blue-700 disabled:opacity-50;
}

.btn-secondary {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
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