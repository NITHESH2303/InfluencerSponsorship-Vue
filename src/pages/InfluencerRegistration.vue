<template>
  <div class="influencer-registration">
    <h1>Register as Influencer</h1>
    <form @submit.prevent="handleInfluencerRegistration">
      <TextInput v-model="about" placeholder="About Your Content" required />
      <div>
        <label for="category">Select Category:</label>
        <select v-model="selectedCategory" required>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>

      <div>
        <h3>Social Media Profiles</h3>
        <div v-for="(profile, index) in social_media_profiles" :key="index">
          <select v-model="profile.platform" required>
            <option value="" disabled>Select Platform</option>
            <option v-for="platform in getAvailablePlatforms(index)" :key="platform" :value="platform">{{ platform }}</option>
          </select>
          <TextInput v-model="profile.username" placeholder="Username" required />
          <button type="button" @click="removeSocialMediaProfile(index)">Remove</button>
        </div>
        <button type="button" @click="addSocialMediaProfile">Add Social Media Profile</button>
      </div>
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
      social_media_profiles : [
        {platform: '', username: ''}
      ],
      about : '',
      selectedCategory: '',
      categories: [
        "Education",
        "Daily Updates",
        "Comics",
        "Movie & Series",
        "Travel",
        "Food",
        "Fashion",
        "Technology"
      ],
      error: ''
    }
  },
  methods: {
    addSocialMediaProfile(){
      this.social_media_profiles.push({platform: '', username: ''});
    },
    removeSocialMediaProfile(index){
      this.social_media_profiles.splice(index, 1);
    },
    getAvailablePlatforms(index) {
      const selectedPlatforms = this.social_media_profiles.map(profile => profile.platform);
      const currentPlatform = this.social_media_profiles[index].platform;
      return ["Instagram", "Twitter", "YouTube"].filter(platform => !selectedPlatforms.includes(platform) || platform === currentPlatform);
    },
    async handleInfluencerRegistration(){
      try {
        const filledProfiles = this.social_media_profiles.filter(profile => profile.platform && profile.username);
        const accesstoken = localStorage.getItem('access_token');
        const response = await fetch("http://127.0.0.1:5000/api/register/influencer", {
          method: "POST",
          body: JSON.stringify({
            social_media_profiles: filledProfiles,
            about: this.about,
            category: this.selectedCategory,
          }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accesstoken}`
          },
        });
        if (response.ok) {
          this.$router.push("/influencer-dashboard");
        } else {
          const errorData = await response.json();
          this.error = errorData.message || "Registration failed.";
        }
      } catch (err) {
        this.error = "An error occurred: " + err.message;
      }
    }
  },
}
</script>

<style>
.influencer-registration select {
  width: 100%;
  max-width: 300px;
  padding: 8px;
  box-sizing: border-box;
}
</style>
