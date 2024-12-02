<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">

      <div class="bg-white rounded-xl shadow-lg p-8 mb-8 animate-fade-in">
        <div class="flex items-center space-x-6">
          <div class="w-24 h-24 bg-gradient-to-br from-primary-500 to-blue-500 rounded-full flex items-center justify-center">
            <span class="text-3xl font-bold text-white">{{ getInitials }}</span>
          </div>
          <div>
            <h1 class="text-3xl font-bold gradient-text mb-2">{{ profile.username }}</h1>
            <div class="flex items-center space-x-3">
              <span v-for="role in profile.role" :key="role"
                    class="px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                {{ role }}
              </span>
              <span v-if="!profile.role || profile.role.length === 0"
                    class="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                No role assigned
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div class="md:col-span-2 space-y-6">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-semibold">Profile Information</h2>
              <button @click="editUserDetails"
                      class="btn-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-gray-400 hover:text-primary-600 transition-all">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232a3 3 0 014.243 4.243L7.05 21.9a1.5 1.5 0 01-.682.394l-4.036 1.009a.375.375 0 01-.46-.46l1.009-4.036a1.5 1.5 0 01.394-.682L15.232 5.232z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 7.5L19.5 4.5" />
                </svg>
              </button>

            </div>
            <div class="space-y-4">
              <div class="flex items-center space-x-4">
                <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <i class="fas fa-user text-primary-600"></i>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Full Name</p>
                  <p class="font-medium">{{ profile.first_name }} {{ profile.last_name }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <i class="fas fa-envelope text-blue-600"></i>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Email</p>
                  <p class="font-medium">{{ profile.email }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-xl font-semibold mb-6">Security Settings</h2>
            <div class="space-y-4">
              <button @click="changeEmail"
                      class="btn-setting">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <i class="fas fa-envelope text-green-600"></i>
                  </div>
                  <div class="text-left">
                    <p class="font-medium">Change Email</p>
                    <p class="text-sm text-gray-500">Update your email address</p>
                  </div>
                </div>
                <i class="fas fa-chevron-right text-gray-400"></i>
              </button>

              <button @click="changePassword"
                      class="btn-setting">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <i class="fas fa-lock text-red-600"></i>
                  </div>
                  <div class="text-left">
                    <p class="font-medium">Change Password</p>
                    <p class="text-sm text-gray-500">Update your password</p>
                  </div>
                </div>
                <i class="fas fa-chevron-right text-gray-400"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Account Status -->
        <div class="bg-white rounded-xl shadow-lg p-6 h-fit">
          <h2 class="text-xl font-semibold mb-6">Account Status</h2>
          <div class="space-y-4">
            <div class="p-4 rounded-lg bg-gray-50">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-500">Account Status</span>
                <span class="px-2 py-1 text-xs font-medium rounded-full"
                      :class="profile.is_flagged ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'">
                  {{ profile.is_flagged ? 'Flagged' : 'Active' }}
                </span>
              </div>
              <div v-if="profile.is_flagged" class="mt-2">
                <p class="text-sm text-red-600">Reason: {{ profile.flag_reason }}</p>
              </div>
            </div>

            <div class="p-4 rounded-lg bg-gray-50">
              <span class="text-sm font-medium text-gray-500">Account ID</span>
              <p class="mt-1 font-mono text-sm">{{ profile.id }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <!-- Edit Profile Modal -->
    <div v-if="isEditingUserDetails" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-content">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold">Edit Profile</h3>
            <button @click="cancelEdit('userDetails')" class="text-gray-400 hover:text-gray-500">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <form @submit.prevent="saveUserDetails" class="space-y-4">
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
              <input type="text" id="username" v-model="editableProfile.username" required class="input" />
            </div>
            <div>
              <label for="first_name" class="block text-sm font-medium text-gray-700">First Name</label>
              <input type="text" id="first_name" v-model="editableProfile.first_name" required class="input" />
            </div>
            <div>
              <label for="last_name" class="block text-sm font-medium text-gray-700">Last Name</label>
              <input type="text" id="last_name" v-model="editableProfile.last_name" required class="input" />
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <button type="button" @click="cancelEdit('userDetails')" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Change Email Modal -->
    <div v-if="isChangingEmail" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-content">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold">Change Email</h3>
            <button @click="cancelEdit('email')" class="text-gray-400 hover:text-gray-500">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <form @submit.prevent="saveEmailChange" class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">New Email</label>
              <input type="email" id="email" v-model="newEmail" required class="input" />
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Current Password</label>
              <input type="password" id="password" v-model="password" required class="input" />
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <button type="button" @click="cancelEdit('email')" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary">Update Email</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div v-if="isChangingPassword" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-content">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold">Change Password</h3>
            <button @click="cancelEdit('password')" class="text-gray-400 hover:text-gray-500">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <form @submit.prevent="savePasswordChange" class="space-y-4">
            <div>
              <label for="old_password" class="block text-sm font-medium text-gray-700">Current Password</label>
              <input type="password" id="old_password" v-model="oldPassword" required class="input" />
            </div>
            <div>
              <label for="new_password" class="block text-sm font-medium text-gray-700">New Password</label>
              <input type="password" id="new_password" v-model="newPassword" required class="input" />
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <button type="button" @click="cancelEdit('password')" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary">Update Password</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchWithAuth } from "@/api.js";
import {useToast} from "vue-toastification";

export default {
  props: {
    userMeta: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      profile: {},
      editableProfile: {},
      isEditingUserDetails: false,
      isChangingEmail: false,
      isChangingPassword: false,
      newEmail: "",
      password: "",
      oldPassword: "",
      newPassword: "",
      toast: useToast()
    };
  },
  computed: {
    getInitials() {
      if (!this.profile.username) return '';
      return this.profile.username.charAt(0).toUpperCase();
    }
  },
  mounted() {
    this.fetchProfile();
  },
  methods: {
    async fetchProfile() {
      try {
        const response = await fetchWithAuth(`http://127.0.0.1:5000/api/user/profile/${this.userMeta.id}`);
        if (response.ok) {
          const data = await response.json();
          this.profile = data.data;
          this.editableProfile = { ...this.profile };
        } else {
          this.toast.error("Error fetching profile.");
        }
      } catch (error) {
        console.error("Error:", error);
        this.toast.error("An error occurred while fetching profile.");
      }
    },
    editUserDetails() {
      this.isEditingUserDetails = true;
    },
    async saveUserDetails() {
      try {
        const response = await fetchWithAuth(`http://127.0.0.1:5000/api/user/profile/edit`, {
          method: "PATCH",
          body: JSON.stringify(this.editableProfile),
        });
        if (response.ok) {
          this.profile = { ...this.editableProfile };
          this.isEditingUserDetails = false;
          this.toast.success("Profile updated successfully.");
        } else {
          this.toast.error("Error updating profile.");
        }
      } catch (error) {
        console.error("Error:", error);
        this.toast.error("An error occurred while updating profile.");
      }
    },
    changeEmail() {
      this.isChangingEmail = true;
    },
    async saveEmailChange() {
      try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/auth/change_auth", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ identifier: this.newEmail, password: this.password }),
        });
        if (response.ok) {
          this.profile.email = this.newEmail;
          this.isChangingEmail = false;
          this.toast.success("Email updated successfully.");
        } else {
          this.toast.error("Error updating email.");
        }
      } catch (error) {
        console.error("Error:", error);
        this.toast.error("An error occurred while updating email.");
      }
    },
    changePassword() {
      this.isChangingPassword = true;
    },
    async savePasswordChange() {
      try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/auth/change_password", {
          method: "PUT",
          body: JSON.stringify({ old_password: this.oldPassword, new_password: this.newPassword }),
        });
        if (response.ok) {
          this.isChangingPassword = false;
          this.toast.success("Password changed successfully.");
        } else {
          this.toast.error("Error changing password.");
        }
      } catch (error) {
        console.error("Error:", error);
        this.toast.error("An error occurred while changing password.");
      }
    },
    cancelEdit(type) {
      if (type === "userDetails") {
        this.isEditingUserDetails = false;
        this.editableProfile = {...this.profile};
      } else if (type === "email") {
        this.isChangingEmail = false;
        this.newEmail = "";
        this.password = "";
      } else if (type === "password") {
        this.isChangingPassword = false;
        this.oldPassword = "";
        this.newPassword = "";
      }
    },
  },
};
</script>

<style scoped>
.gradient-text {
  @apply bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent;
}

.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-all duration-200;
}

.btn-primary {
  @apply bg-gradient-to-r from-primary-600 to-blue-600 text-white
  hover:from-primary-700 hover:to-blue-700;
}

.btn-secondary {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
}

.btn-icon {
  @apply w-8 h-8 flex items-center justify-center rounded-full text-gray-400
  hover:text-primary-600 hover:bg-primary-50 transition-all duration-200;
}

.btn-setting {
  @apply w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-50
  transition-all duration-200 text-left;
}

.input {
  @apply w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500
  focus:border-primary-500 transition-all duration-200;
}

.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.modal-container {
  @apply w-full max-w-md mx-4;
}

.modal-content {
  @apply bg-white rounded-xl shadow-xl p-6;
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