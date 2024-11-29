<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-xl shadow-lg p-8">
        <h1 class="text-3xl font-bold gradient-text mb-8">Create New Campaign</h1>

        <form @submit.prevent="submitCampaign" class="space-y-6">
          <FormInput
              id="campaign_name"
              label="Campaign Name"
              v-model="campaign.campaign_name"
              :required="true"
              :error="errors.campaign_name"
          />

          <FormTextarea
              id="description"
              label="Description"
              v-model="campaign.description"
              :required="true"
              placeholder="Describe your campaign goals and requirements"
              :error="errors.description"
          />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
                id="budget"
                label="Budget"
                type="number"
                v-model="campaign.budget"
                :required="true"
                :error="errors.budget"
            />

            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Niche
                <span class="text-red-500">*</span>
              </label>
              <select
                  v-model="campaign.niche"
                  required
                  class="select"
                  :class="{ 'select-error': errors.niche }"
              >
                <option value="" disabled>Select a niche</option>
                <option v-for="niche in nicheOptions" :key="niche" :value="niche">
                  {{ niche }}
                </option>
              </select>
              <p v-if="errors.niche" class="mt-1 text-sm text-red-500">{{ errors.niche }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
                id="start_date"
                label="Start Date"
                type="date"
                v-model="campaign.start_date"
                :required="true"
                :error="errors.start_date"
            />

            <FormInput
                id="end_date"
                label="End Date"
                type="date"
                v-model="campaign.end_date"
                :required="true"
                :error="errors.end_date"
            />
          </div>

          <div class="flex items-center space-x-2">
            <input
                type="checkbox"
                id="visibility"
                v-model="campaign.visibility"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label for="visibility" class="text-sm text-gray-700">
              Make campaign private
            </label>
          </div>

          <div class="flex justify-end space-x-4">
            <button
                type="button"
                @click="$router.push('/sponsor/dashboard')"
                class="btn btn-secondary"
            >
              Cancel
            </button>
            <button
                type="submit"
                class="btn btn-primary"
                :disabled="isSubmitting"
            >
              <span v-if="isSubmitting" class="loading-dots">Creating</span>
              <span v-else>Create Campaign</span>
            </button>
          </div>
        </form>

        <div v-if="error" class="mt-4 p-4 bg-red-50 rounded-lg text-red-600 text-sm">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FormInput from '@/components/forms/FormInput.vue';
import FormTextarea from '@/components/forms/FormTextarea.vue';
import { fetchWithAuth } from "@/api";

export default {
  components: {
    FormInput,
    FormTextarea
  },
  data() {
    return {
      campaign: {
        campaign_name: '',
        description: '',
        budget: '',
        start_date: '',
        end_date: '',
        visibility: false,
        niche: ''
      },
      nicheOptions: [],
      errors: {},
      error: '',
      isSubmitting: false
    };
  },
  async created() {
    await this.fetchNicheOptions();
  },
  methods: {
    async fetchNicheOptions() {
      try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/niches");
        if (response.ok) {
          const data = await response.json();
          this.nicheOptions = data.data;
        }
      } catch (error) {
        this.error = "Failed to load niche options";
      }
    },
    validateForm() {
      this.errors = {};
      if (!this.campaign.campaign_name) {
        this.errors.campaign_name = 'Campaign name is required';
      }
      if (!this.campaign.description) {
        this.errors.description = 'Description is required';
      }
      if (!this.campaign.budget || this.campaign.budget <= 0) {
        this.errors.budget = 'Valid budget is required';
      }
      if (!this.campaign.niche) {
        this.errors.niche = 'Please select a niche';
      }
      if (!this.campaign.start_date) {
        this.errors.start_date = 'Start date is required';
      }
      if (!this.campaign.end_date) {
        this.errors.end_date = 'End date is required';
      }
      return Object.keys(this.errors).length === 0;
    },
    async submitCampaign() {
      if (!this.validateForm()) return;

      this.isSubmitting = true;
      this.error = '';

      try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/campaigns/create_new_campaign", {
          method: "POST",
          body: JSON.stringify(this.campaign)
        });

        if (response.ok) {
          this.$router.push("/sponsor/dashboard");
        } else {
          const data = await response.json();
          this.error = data.message || "Failed to create campaign";
        }
      } catch (error) {
        this.error = "An error occurred while creating the campaign";
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>

<style scoped>
.select {
  @apply w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500
  focus:border-primary-500 transition-all duration-200;
}

.select-error {
  @apply border-red-500 focus:ring-red-200 focus:border-red-500;
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
</style>