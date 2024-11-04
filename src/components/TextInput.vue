<template>
  <div>
    <input :type="type" :placeholder="placeholder" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" :required="required"/>
  </div>
</template>

<script>
export default {
  props: ['modelValue', 'type', 'placeholder', 'required'],
};
</script>

<style scoped>
input {
  margin: 10px 0;
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>