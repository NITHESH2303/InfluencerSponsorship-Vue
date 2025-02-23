<template>
  <div class="profile-section">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold gradient-text">Profile</h2>
      <button @click="showEditModal = true" class="btn btn-primary flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
        <span>Edit Profile</span>
      </button>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <!-- Profile Info -->
      <div class="space-y-4">
        <div class="card bg-white/80 backdrop-blur-sm p-6 hover:shadow-lg transition-all">
          <h3 class="text-lg font-semibold mb-3 text-gray-800">About Me</h3>
          <p class="text-gray-600">{{ influencerMeta.about }}</p>
        </div>

        <div class="card bg-white/80 backdrop-blur-sm p-6 hover:shadow-lg transition-all">
          <h3 class="text-lg font-semibold mb-3 text-gray-800">Category</h3>
          <span class="px-3 py-1 rounded-full text-sm font-medium"
                :class="getCategoryClass(influencerMeta.category)">
            {{ influencerMeta.category }}
          </span>
        </div>
      </div>

      <!-- Social Media Profiles -->
      <div class="card bg-white/80 backdrop-blur-sm p-6 hover:shadow-lg transition-all">
        <h3 class="text-lg font-semibold mb-4 text-gray-800">Social Media Profiles</h3>
        <ul class="space-y-3">
          <li v-for="profile in influencerMeta.social_media_profiles"
              :key="profile.platform"
              class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all">
            <div class="platform-icon" :class="getPlatformClass(profile.platform)">
              <i :class="getPlatformIcon(profile.platform)"></i>
            </div>
            <div>
              <p class="font-medium text-gray-800">{{ profile.platform }}</p>
              <p class="text-sm text-gray-600">@{{ profile.username }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Edit Modal -->
    <transition name="modal">
      <div v-if="showEditModal" class="fixed inset-0 z-50 overflow-y-auto"
           aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
               aria-hidden="true"
               @click="showEditModal = false"></div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div class="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div class="absolute top-0 right-0 pt-4 pr-4">
              <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-500">
                <span class="sr-only">Close</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form @submit.prevent="updateProfile" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">About</label>
                <textarea v-model="editForm.about"
                          class="input h-32 resize-none"
                          placeholder="Tell us about yourself"></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Category</label>
                <select v-model="editForm.category" class="input" required>
                  <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
              </div>

              <div class="space-y-3">
                <label class="block text-sm font-medium text-gray-700">Social Media Profiles</label>
                <div v-for="(profile, index) in editForm.social_media_profiles"
                     :key="index"
                     class="flex items-center space-x-2">
                  <select v-model="profile.platform" class="input flex-1" required>
                    <option value="" disabled>Select Platform</option>
                    <option v-for="platform in getAvailablePlatforms(index)"
                            :key="platform"
                            :value="platform">{{ platform }}</option>
                  </select>
                  <input v-model="profile.username"
                         type="text"
                         class="input flex-1"
                         placeholder="Username"
                         required />
                  <button type="button"
                          @click="removeSocialMediaProfile(index)"
                          class="btn btn-danger">
                    Remove
                  </button>
                </div>
                <button type="button"
                        @click="addSocialMediaProfile"
                        class="btn btn-secondary w-full">
                  Add Profile
                </button>
              </div>

              <div class="flex justify-end space-x-3 mt-6">
                <button type="button"
                        @click="showEditModal = false"
                        class="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { fetchWithAuth } from "@/api.js";

export default {
  props: {
    influencerMeta: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showEditModal: false,
      categories: [
        "Education",
        "Daily Updates",
        "Comics",
        "Movie & Series",
        "Travel",
        "Food",
        "Fashion",
        "Technology",
      ],
      editForm: {
        about: '',
        category: '',
        social_media_profiles: []
      },
    };
  },
  methods: {
    getCategoryClass(category) {
      const classes = {
        'Education': 'bg-blue-100 text-blue-800',
        'Daily Updates': 'bg-green-100 text-green-800',
        'Comics': 'bg-purple-100 text-purple-800',
        'Movie & Series': 'bg-red-100 text-red-800',
        'Travel': 'bg-yellow-100 text-yellow-800',
        'Food': 'bg-orange-100 text-orange-800',
        'Fashion': 'bg-pink-100 text-pink-800',
        'Technology': 'bg-indigo-100 text-indigo-800'
      };
      return classes[category] || 'bg-gray-100 text-gray-800';
    },
    getPlatformClass(platform) {
      const classes = {
        'Instagram': 'bg-gradient-to-r from-purple-500 to-pink-500',
        'Twitter': 'bg-blue-400',
        'YouTube': 'bg-red-600'
      };
      return classes[platform] || 'bg-gray-500';
    },
    getPlatformIcon(platform) {
      const icons = {
        'Instagram': 'fab fa-instagram',
        'Twitter': 'fab fa-twitter',
        'YouTube': 'fab fa-youtube'
      };
      return icons[platform] || 'fas fa-link';
    },
    getAvailablePlatforms(index) {
      const selectedPlatforms = this.editForm.social_media_profiles.map(profile => profile.platform);
      const currentPlatform = this.editForm.social_media_profiles[index].platform;
      return ["Instagram", "Twitter", "YouTube"].filter(
          platform => !selectedPlatforms.includes(platform) || platform === currentPlatform
      );
    },
    removeSocialMediaProfile(index) {
      this.editForm.social_media_profiles.splice(index, 1);
    },
    addSocialMediaProfile() {
      this.editForm.social_media_profiles.push({ platform: "", username: "" });
    },
    async updateProfile() {
      try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/influencer/profile/edit", {
          method: "PATCH",
          body: JSON.stringify(this.editForm),
        });
        if (response.ok) {
          const data = await response.json();
          this.$emit("profileUpdated", data.data);
          this.showEditModal = false;
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    },
    initializeEditForm() {
      this.editForm = {
        about: this.influencerMeta.about,
        category: this.influencerMeta.category,
        social_media_profiles: JSON.parse(JSON.stringify(this.influencerMeta.social_media_profiles))
      };
    }
  },
  watch: {
    showEditModal(newVal) {
      if (newVal) {
        this.initializeEditForm();
      }
    }
  }
};
</script>

<style scoped>
.platform-icon {
  @apply w-10 h-10 rounded-full flex items-center justify-center text-white;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.input {
  @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50;
}

.btn-danger {
  @apply bg-red-600 text-white hover:bg-red-700 px-3 py-2 rounded-lg transition-colors duration-200;
}

.gradient-text {
  @apply bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent;
}

.card {
  @apply rounded-xl shadow-md transition-all duration-300;
}

.btn {
  @apply px-4 py-2 rounded-lg font-semibold transition-all duration-300;
}

.btn-primary {
  @apply bg-gradient-to-r from-primary-600 to-blue-600 text-white hover:from-primary-700 hover:to-blue-700;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-700 hover:bg-gray-300;
}
</style>