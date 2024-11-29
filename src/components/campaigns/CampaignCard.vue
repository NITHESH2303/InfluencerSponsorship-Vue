<template>
  <div class="campaign-card bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-xl font-bold text-gray-900">{{ campaign.campaign_name }}</h3>
        <p class="text-sm text-gray-500">{{ formatDate(campaign.start_date) }} - {{ formatDate(campaign.end_date) }}</p>
      </div>
      <span :class="getStatusClass(campaign.status)"
            class="px-3 py-1 rounded-full text-sm font-medium">
        {{ campaign.status }}
      </span>
    </div>

    <p class="text-gray-600 mb-4 line-clamp-2">{{ campaign.description }}</p>

    <div class="grid grid-cols-2 gap-4 mb-4">
      <div class="stat-item">
        <span class="text-sm text-gray-500">Budget</span>
        <p class="text-lg font-semibold">${{ campaign.budget }}</p>
      </div>
      <div class="stat-item">
        <span class="text-sm text-gray-500">Spent</span>
        <p class="text-lg font-semibold">${{ campaign.spent_amount || 0 }}</p>
      </div>
    </div>

    <div class="mb-4">
      <div class="flex justify-between text-sm text-gray-500 mb-1">
        <span>Progress</span>
        <span>{{ campaign.progress_percentage }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div class="bg-primary-600 rounded-full h-2 transition-all duration-300"
             :style="{ width: `${campaign.progress_percentage}%` }"></div>
      </div>
    </div>

    <div class="flex justify-between items-center">
      <div class="flex space-x-2">
        <button @click="$emit('edit', campaign)"
                class="btn btn-secondary">
          Edit
        </button>
        <button v-if="campaign.status !== 'Completed'"
                @click="$emit('complete', campaign)"
                class="btn btn-primary">
          Complete
        </button>
      </div>
      <button v-if="canDelete(campaign.status)"
              @click="$emit('delete', campaign)"
              class="btn btn-danger">
        Delete
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    campaign: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    getStatusClass(status) {
      const classes = {
        'Active': 'bg-green-100 text-green-800',
        'Completed': 'bg-gray-100 text-gray-800',
        'Pending': 'bg-yellow-100 text-yellow-800'
      };
      return classes[status] || 'bg-gray-100 text-gray-800';
    },
    canDelete(status) {
      return status !== 'Active' && status !== 'Completed';
    }
  }
};
</script>

<style scoped>
.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-all duration-200;
}

.btn-primary {
  @apply bg-primary-600 text-white hover:bg-primary-700;
}

.btn-secondary {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
}

.btn-danger {
  @apply bg-red-100 text-red-600 hover:bg-red-200;
}

.stat-item {
  @apply bg-gray-50 rounded-lg p-3;
}
</style>