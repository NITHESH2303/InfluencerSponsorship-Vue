<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
      <!-- Animated SVG -->
      <div class="mb-8 animate-float">
        <svg class="mx-auto h-48 w-48 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-4V8m0 0V6m0 2h2m-2 0H9m3 10a9 9 0 110-18 9 9 0 010 18z" />
        </svg>
      </div>

      <!-- Error Message -->
      <h1 class="text-4xl font-bold gradient-text mb-4">
        Access Denied
      </h1>
      <p class="text-xl text-gray-600 mb-8">
        {{ message || "You don't have permission to access this page" }}
      </p>

      <!-- Action Buttons -->
      <div class="space-y-4">
        <button
            @click="$router.push('/login')"
            class="btn btn-primary w-full"
        >
          <i class="fas fa-sign-in-alt mr-2"></i>
          Sign In
        </button>
        <button
            @click="$router.push('/')"
            class="btn btn-secondary w-full"
        >
          <i class="fas fa-home mr-2"></i>
          Go Home
        </button>
      </div>

      <!-- Decorative Elements -->
      <div class="absolute top-0 left-0 -z-10">
        <div class="w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-60 animate-pulse-slow"></div>
      </div>
      <div class="absolute bottom-0 right-0 -z-10">
        <div class="w-48 h-48 bg-blue-100 rounded-full blur-3xl opacity-60 animate-pulse-slow"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: ''
    }
  }
};
</script>

<style scoped>
.btn {
  @apply px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center;
}

.btn-primary {
  @apply bg-gradient-to-r from-primary-600 to-blue-600 text-white
  hover:from-primary-700 hover:to-blue-700;
}

.btn-secondary {
  @apply bg-white text-gray-700 border border-gray-300
  hover:bg-gray-50 hover:border-gray-400;
}

.gradient-text {
  @apply bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>