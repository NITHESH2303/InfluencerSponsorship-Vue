<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-xl shadow-lg p-8">
        <h1 class="text-3xl font-bold gradient-text mb-8">Register as Sponsor</h1>

        <form @submit.prevent="handleSponsorRegistration" class="space-y-6">
          <FormInput
              id="company_name"
              label="Company Name"
              v-model="company_name"
              :required="true"
              placeholder="Enter your company name"
              :error="errors.company_name"
          />

          <FormInput
              id="industry_type"
              label="Industry Type"
              v-model="industry_type"
              :required="true"
              placeholder="e.g., Technology, Fashion, Food"
              :error="errors.industry_type"
          />

          <FormTextarea
              id="description"
              label="Company Description"
              v-model="description"
              :required="true"
              placeholder="Tell us about your company and advertising goals"
              :error="errors.description"
          />

          <div class="flex justify-end space-x-4 mt-8">
            <button
                type="button"
                @click="$router.push('/login')"
                class="btn btn-secondary"
            >
              Cancel
            </button>
            <button
                type="submit"
                class="btn btn-primary"
                :disabled="isSubmitting"
            >
              <span v-if="isSubmitting" class="loading-dots">Registering</span>
              <span v-else>Complete Registration</span>
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
      company_name: '',
      industry_type: '',
      description: '',
      errors: {},
      error: '',
      isSubmitting: false
    };
  },
  methods: {
    validateForm() {
      this.errors = {};
      if (!this.company_name) {
        this.errors.company_name = 'Company name is required';
      }
      if (!this.industry_type) {
        this.errors.industry_type = 'Industry type is required';
      }
      if (!this.description) {
        this.errors.description = 'Company description is required';
      }
      return Object.keys(this.errors).length === 0;
    },
    async handleSponsorRegistration() {
      if (!this.validateForm()) return;

      this.isSubmitting = true;
      this.error = '';

      try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/register/sponsor", {
          method: "POST",
          body: JSON.stringify({
            company_name: this.company_name,
            industry_type: this.industry_type,
            description: this.description
          })
        });

        if (response.ok) {
          this.$router.push("/sponsor/dashboard");
        } else {
          const data = await response.json();
          this.error = data.message || "Registration failed";
        }
      } catch (error) {
        this.error = "An error occurred during registration";
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>

<style scoped>
.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-all duration-200;
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