<template>
  <div class="signUp">
    <h1>Register as a new user</h1>
    <form @submit.prevent="handleSignUp">
      <TextInput v-model="username" type="text" placeholder="Username" required/>
      <TextInput v-model="firstname" type="text" placeholder="First Name" required/>
      <TextInput v-model="lastname" type="text" placeholder="Last Name" required/>
      <TextInput v-model="email" type="email" placeholder="Email" required/>
      <TextInput v-model="password" type="password" placeholder="Password" required/>
      <TextInput v-model="confirmpassword" type="password" placeholder="Confirm Password" required/>
      <button type="submit" class="submit-button">Sign Up</button>
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
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmpassword: '',
      error: '',
    }
  },
  computed: {
    isEmailValid() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(this.email);
    },
    isPasswordValid() {
      return this.password === this.confirmpassword;
    },
    validationErrors() {
      const errors = [];
      if (!this.username || this.username.length < 6) {
        errors.push('Username should be at least 6 characters.');
      }
      if (!this.firstname) {
        errors.push('First name is required.');
      }
      if (!this.isEmailValid) {
        errors.push('Please enter a valid email address.');
      }
      if (!this.password || this.password.length < 8) {
        errors.push('Password should be at least 8 characters.');
      }
      if (!this.isPasswordValid) {
        errors.push('Passwords do not match.');
      }
      return errors;
    }
  },
  methods: {
    async handleSignUp() {
      this.error = '';
      if (this.validationErrors.length === 0) {
        try {
          const response = await fetch("http://127.0.0.1:5000/api/user/signup", {
            method: "POST",
            body: JSON.stringify({
              username: this.username,
              firstname: this.firstname,
              lastname: this.lastname,
              email: this.email,
              password: this.password,
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if (response.ok) {
            this.$router.push('/login');
          } else if (response.status === 400) {
            const errorData = await response.json();
            this.error = errorData.message || 'An error occurred during registration.';
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
.signUp {
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
