<template>
  <div class="sponsor-registration">
    <h1>Register as Sponsor</h1>
    <form @submit.prevent="handleSponsorRegistration">
      <TextInput v-model="company_name" placeholder="Company Name" required />
      <TextInput v-model="industry_type" placeholder="Industry Type" required />
      <textarea v-model="description" placeholder="Company Description"></textarea>
      <button type="submit">Register</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import TextInput from "@/components/TextInput.vue";

export default {
  components: {TextInput},
  data() {
    return {
      company_name: '',
      industry_type: '',
      description: '',
      error: '',
    };
  },
  methods: {
    async handleSponsorRegistration() {
      try {
        const accesstoken = localStorage.getItem('access_token');
        const response = await fetch("http://127.0.0.1:5000/api/register/sponsor", {
          method: "POST",
          body: JSON.stringify({
            company_name: this.company_name,
            industry_type: this.industry_type,
            description: this.description
          }),
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${accesstoken}`
          },
        });

        if (response.ok) {
          this.$router.push("/sponsor-dashboard");
        } else {
          const errorData = await response.json();
          this.error = errorData.message || "Registration failed.";
        }
      } catch (err) {
        this.error = "An error occurred: " + err.message;
      }
    },
  },
};
</script>
