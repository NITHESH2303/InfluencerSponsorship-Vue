<template>
  <span :class="[baseClasses, statusClasses[status.toLowerCase()]]">
    {{ status }}
  </span>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      baseClasses: 'px-3 py-1 rounded-full text-sm font-medium',
      statusClasses: {
        'active': 'bg-green-100 text-green-800',
        'completed': 'bg-gray-100 text-gray-800',
        'pending': 'bg-yellow-100 text-yellow-800',
        'flagged': 'bg-red-100 text-red-800',
        'verified': 'bg-blue-100 text-blue-800'
      }
    }
  }
};
</script>