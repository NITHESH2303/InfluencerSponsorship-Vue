<template>
  <div class="login">
    <h1>Login to your account</h1>
    <form @submit.prevent="handleLogin">
      <TextInput v-model="identifier" type="text" placeholder="Username or email" required/>
      <TextInput v-model="password" type="password" placeholder="Password" required/>
      <button type="submit" class="submit-button">Login</button>
      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import TextInput from "@/components/TextInput.vue";

export default {
  components: { TextInput },
  data() {
    return {
      identifier: '',
      password: '',
      error: '',
    }
  },
  computed: {
    validationErrors() {
      const errors = [];
      if (!this.identifier) errors.push('Username or email is required.');
      if (!this.password) errors.push('Password is required.');
      return errors;
    }
  },
  methods: {
    async handleLogin() {
      this.error = '';
      if (this.validationErrors.length === 0) {
        try {
          const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
              identifier: this.identifier,
              password: this.password,
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('access_token', data.data.access_token);
            this.$router.push('/home');
          } else if (response.status === 400) {
            const errorData = await response.json();
            this.error = errorData.message || 'An error occurred during login.';
          }
        } catch (error) {
          this.error = 'An error occurred: ' + error.message;
        }
      } else {
        this.error = this.validationErrors.join(' ');
      }
    }
  }
}
</script>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

form {
  display: flex;
  flex-direction: column;
  width: 300px;
}

.submit-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.submit-button:hover {
  background-color: #45a049;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}
</style>
