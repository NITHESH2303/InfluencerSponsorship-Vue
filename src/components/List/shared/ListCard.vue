<template>
  <div class="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
    <div class="flex items-center space-x-4">
      <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-blue-500 rounded-full flex items-center justify-center">
        <span class="text-lg font-bold text-white">{{ getInitials }}</span>
      </div>
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        <p class="text-sm text-gray-500">{{ subtitle }}</p>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: true
    }
  },
  computed: {
    getInitials() {
      return this.title.charAt(0).toUpperCase();
    }
  }
};
</script>

<style scoped>
.card {
  @apply bg-white rounded-xl shadow-md p-6 mb-4;
}
</style>