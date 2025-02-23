<template>
  <header class="bg-white shadow-sm mb-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold gradient-text">{{ companyName }}</h1>
          <p class="text-gray-600 mt-1">{{ industry }}</p>
        </div>
        <div class="flex items-center space-x-4">
          <span class="px-3 py-1 rounded-full text-sm font-medium"
                :class="getStatusClass(verificationStatus)">
            {{ getStatusText(verificationStatus) }}
          </span>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  props: {
    companyName: {
      type: String,
      required: true
    },
    industry: {
      type: String,
      required: true
    },
    verificationStatus: {
      type: Number,
      required: true
    }
  },
  methods: {
    getStatusClass(status) {
      const classes = {
        0: 'bg-red-100 text-red-800',
        1: 'bg-yellow-100 text-yellow-800',
        2: 'bg-green-100 text-green-800'
      };
      return classes[status] || 'bg-gray-100 text-gray-800';
    },
    getStatusText(status) {
      const texts = {
        0: 'Not Verified',
        1: 'Verification Pending',
        2: 'Verified'
      };
      return texts[status] || 'Unknown';
    }
  }
};
</script>

<style scoped>
.gradient-text {
  @apply bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent;
}
</style>