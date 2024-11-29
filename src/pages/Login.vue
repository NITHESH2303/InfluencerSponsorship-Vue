<template>
  <div class="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="card max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold gradient-text">
          Welcome Back
        </h2>
        <p class="mt-2 text-gray-600">Sign in to your account</p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div class="relative">
            <label for="identifier" class="block text-sm font-medium text-gray-700 mb-1">
              Username or Email
            </label>
            <input
                id="identifier"
                v-model="identifier"
                type="text"
                required
                class="input"
                :class="{ 'animate-shake': validationErrors.includes('Username or email is required.') }"
            />
          </div>

          <div class="relative">
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
                id="password"
                v-model="password"
                type="password"
                required
                class="input"
                :class="{ 'animate-shake': validationErrors.includes('Password is required.') }"
            />
          </div>
        </div>

        <div>
          <button
              type="submit"
              class="btn btn-primary w-full group"
              :disabled="isLoading"
          >
            <span class="flex items-center justify-center">
              <span v-if="isLoading" class="loading-dots">Signing in</span>
              <span v-else>Sign in</span>
            </span>
          </button>
        </div>

        <transition name="slide-up">
          <div v-if="error" class="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
            <p class="text-red-600 text-sm text-center">{{ error }}</p>
          </div>
        </transition>
      </form>

      <div class="text-center">
        <p class="text-sm text-gray-600">
          Don't have an account?
          <router-link to="/signup" class="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-300">
            Sign up
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchWithAuth } from "@/api.js";

export default {
  data() {
    return {
      identifier: '',
      password: '',
      error: '',
      isLoading: false
    }
  },
  computed: {
    validationErrors() {
      const errors = [];
      if (!this.identifier) errors.push('Username or email is required.');
      if (!this.password) errors.push('Password is required.');
      return errors;
    }
  },
  methods: {
    async handleLogin() {
      this.error = '';
      this.isLoading = true;

      if (this.validationErrors.length === 0) {
        try {
          const response = await fetchWithAuth("http://127.0.0.1:5000/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
              identifier: this.identifier,
              password: this.password,
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('access_token', data.data.access_token);
            const roles = data.data.user.role;
            localStorage.setItem('role', JSON.stringify(roles));

            if (roles.includes('sponsor')) {
              this.$router.push('/sponsor/dashboard');
            } else if (roles.includes('influencer')) {
              this.$router.push('/influencer/dashboard');
            } else if (roles.includes('admin')) {
              this.$router.push('/admin/overview');
            } else {
              this.$router.push('/explore');
            }
          } else if (response.status === 400) {
            const errorData = await response.json();
            this.error = errorData.message || 'An error occurred during login.';
          }
        } catch (error) {
          this.error = 'An error occurred: ' + error.message;
        } finally {
          this.isLoading = false;
        }
      } else {
        this.error = this.validationErrors.join(' ');
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.animate-shake {
  animation: shake 0.5s cubic-bezier(.36, .07, .19, .97) both;
}
</style>