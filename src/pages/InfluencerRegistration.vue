<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-xl shadow-lg p-8">
        <h1 class="text-3xl font-bold gradient-text mb-8">Become an Influencer</h1>

        <form @submit.prevent="handleInfluencerRegistration" class="space-y-6">
          <FormTextarea
              id="about"
              label="About Your Content"
              v-model="about"
              :required="true"
              placeholder="Tell us about your content and audience"
              :error="errors.about"
          />

          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Category
              <span class="text-red-500">*</span>
            </label>
            <select
                v-model="selectedCategory"
                required
                class="select"
                :class="{ 'select-error': errors.category }"
            >
              <option value="" disabled>Select your content category</option>
              <option v-for="cat in categories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
            <p v-if="errors.category" class="mt-1 text-sm text-red-500">{{ errors.category }}</p>
          </div>

          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">Social Media Profiles</h3>
            <div v-for="(profile, index) in social_media_profiles"
                 :key="index"
                 class="flex items-center space-x-4">
              <div class="flex-1">
                <select
                    v-model="profile.platform"
                    required
                    class="select"
                >
                  <option value="" disabled>Select Platform</option>
                  <option v-for="platform in getAvailablePlatforms(index)"
                          :key="platform"
                          :value="platform">
                    {{ platform }}
                  </option>
                </select>
              </div>
              <div class="flex-1">
                <input
                    v-model="profile.username"
                    type="text"
                    required
                    placeholder="Username"
                    class="input"
                />
              </div>
              <button
                  type="button"
                  @click="removeSocialMediaProfile(index)"
                  class="btn btn-danger"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
            <button
                type="button"
                @click="addSocialMediaProfile"
                class="btn btn-secondary w-full"
            >
              <i class="fas fa-plus mr-2"></i>
              Add Social Media Profile
            </button>
          </div>

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
import FormTextarea from '@/components/forms/FormTextarea.vue';
import { fetchWithAuth } from "@/api";

export default {
  components: { FormTextarea },
  data() {
    return {
      social_media_profiles: [
        { platform: '', username: '' }
      ],
      about: '',
      selectedCategory: '',
      categories: [
        "Education",
        "Daily Updates",
        "Comics",
        "Movie & Series",
        "Travel",
        "Food",
        "Fashion",
        "Technology"
      ],
      errors: {},
      error: '',
      isSubmitting: false
    };
  },
  methods: {
    addSocialMediaProfile() {
      this.social_media_profiles.push({ platform: '', username: '' });
    },
    removeSocialMediaProfile(index) {
      this.social_media_profiles.splice(index, 1);
    },
    getAvailablePlatforms(index) {
      const selectedPlatforms = this.social_media_profiles.map(profile => profile.platform);
      const currentPlatform = this.social_media_profiles[index].platform;
      return ["Instagram", "Twitter", "YouTube"].filter(
          platform => !selectedPlatforms.includes(platform) || platform === currentPlatform
      );
    },
    validateForm() {
      this.errors = {};
      if (!this.about) {
        this.errors.about = 'Please tell us about your content';
      }
      if (!this.selectedCategory) {
        this.errors.category = 'Please select a category';
      }
      return Object.keys(this.errors).length === 0;
    },
    async handleInfluencerRegistration() {
      if (!this.validateForm()) return;

      this.isSubmitting = true;
      this.error = '';

      try {
        const filledProfiles = this.social_media_profiles.filter(
            profile => profile.platform && profile.username
        );

        const response = await fetchWithAuth("http://127.0.0.1:5000/api/register/influencer", {
          method: "POST",
          body: JSON.stringify({
            social_media_profiles: filledProfiles,
            about: this.about,
            category: this.selectedCategory,
          })
        });

        if (response.ok) {
          this.$router.push("/influencer/dashboard");
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
.select {
  @apply w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500
  focus:border-primary-500 transition-all duration-200;
}

.select-error {
  @apply border-red-500 focus:ring-red-200 focus:border-red-500;
}

.input {
  @apply w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500
  focus:border-primary-500 transition-all duration-200;
}

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

.btn-danger {
  @apply bg-red-100 text-red-600 hover:bg-red-200;
}

.gradient-text {
  @apply bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent;
}
</style>