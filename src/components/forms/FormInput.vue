<template>
  <div class="form-group">
    <label :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
        :id="id"
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :required="required"
        :placeholder="placeholder"
        class="input"
        :class="{ 'input-error': error }"
    />
    <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    modelValue: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    required: {
      type: Boolean,
      default: false
    },
    placeholder: String,
    error: String
  },
  emits: ['update:modelValue']
};
</script>

<style scoped>
.input {
  @apply w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500
  focus:border-primary-500 transition-all duration-200;
}

.input-error {
  @apply border-red-500 focus:ring-red-200 focus:border-red-500;
}
</style>