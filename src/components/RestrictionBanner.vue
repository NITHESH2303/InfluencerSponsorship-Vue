<template>
  <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <i class="fas fa-exclamation-triangle text-red-500 text-xl"></i>
      </div>
      <div class="ml-3">
        <h3 class="text-lg font-medium text-red-800">
          Account Restricted
        </h3>
        <div class="mt-2 text-red-700">
          <p>{{ reason || 'Your account has been flagged and access is restricted.' }}</p>
          <p class="mt-2">Please contact support for assistance.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    reason: {
      type: String,
      default: ''
    }
  }
};
</script>