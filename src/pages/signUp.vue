<template>
  <div class="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="card max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold gradient-text">
          Create Account
        </h2>
        <p class="mt-2 text-gray-600">Join our community today</p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSignUp">
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="relative">
              <label for="firstname" class="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                  id="firstname"
                  v-model="firstname"
                  type="text"
                  required
                  class="input"
                  :class="{ 'animate-shake': hasError('First name is required.') }"
              />
            </div>

            <div class="relative">
              <label for="lastname" class="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                  id="lastname"
                  v-model="lastname"
                  type="text"
                  required
                  class="input"
              />
            </div>
          </div>

          <div class="relative">
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
                id="username"
                v-model="username"
                type="text"
                required
                class="input"
                :class="{ 'animate-shake': hasError('Username should be at least 6 characters.') }"
            />
            <p v-if="username && username.length < 6" class="mt-1 text-sm text-red-500">
              Username must be at least 6 characters
            </p>
          </div>

          <div class="relative">
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
                id="email"
                v-model="email"
                type="email"
                required
                class="input"
                :class="{ 'animate-shake': hasError('Please enter a valid email address.') }"
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
                :class="{ 'animate-shake': hasError('Password should be at least 8 characters.') }"
            />
            <p v-if="password && password.length < 8" class="mt-1 text-sm text-red-500">
              Password must be at least 8 characters
            </p>
          </div>

          <div class="relative">
            <label for="confirmpassword" class="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
                id="confirmpassword"
                v-model="confirmpassword"
                type="password"
                required
                class="input"
                :class="{ 'animate-shake': hasError('Passwords do not match.') }"
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
              <span v-if="isLoading" class="loading-dots">Creating account</span>
              <span v-else>Sign up</span>
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
          Already have an account?
          <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-300">
            Sign in
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmpassword: '',
      error: '',
      isLoading: false
    }
  },
  computed: {
    isEmailValid() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(this.email);
    },
    isPasswordValid() {
      return this.password === this.confirmpassword;
    },
    validationErrors() {
      const errors = [];
      if (!this.username || this.username.length < 6) {
        errors.push('Username should be at least 6 characters.');
      }
      if (!this.firstname) {
        errors.push('First name is required.');
      }
      if (!this.isEmailValid) {
        errors.push('Please enter a valid email address.');
      }
      if (!this.password || this.password.length < 8) {
        errors.push('Password should be at least 8 characters.');
      }
      if (!this.isPasswordValid) {
        errors.push('Passwords do not match.');
      }
      return errors;
    }
  },
  methods: {
    hasError(errorMessage) {
      return this.error && this.validationErrors.includes(errorMessage);
    },
    async handleSignUp() {
      this.error = '';
      this.isLoading = true;

      if (this.validationErrors.length === 0) {
        try {
          const response = await fetch("http://127.0.0.1:5000/api/user/signup", {
            method: "POST",
            body: JSON.stringify({
              username: this.username,
              firstname: this.firstname,
              lastname: this.lastname,
              email: this.email,
              password: this.password,
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            this.$router.push('/login');
          } else if (response.status === 400) {
            const errorData = await response.json();
            this.error = errorData.message || 'An error occurred during registration.';
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
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}
</style>