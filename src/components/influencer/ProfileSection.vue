<template>
  <div class="profile-section">
    <h2>Profile</h2>
    <p><strong>About:</strong> {{ influencerMeta.about }}</p>
    <p><strong>Category:</strong> {{ influencerMeta.category }}</p>
    <p><strong>Followers:</strong> {{ influencerMeta.followers }}</p>

    <h3>Social Media Profiles</h3>
    <ul>
      <li v-for="profile in influencerMeta.social_media_profiles" :key="profile.platform">
        <strong>{{ profile.platform }}:</strong> {{ profile.username }}
      </li>
    </ul>
    <button @click="showEditModal = true">Edit Profile</button>

    <h3>Ad Requests</h3>
    <ul v-if="influencerMeta.ads.length">
      <li v-for="ad in influencerMeta.ads" :key="ad.ad_id">
        <p><strong>Campaign:</strong> {{ ad.campaign_name }}</p>
        <p><strong>Requirement:</strong> {{ ad.requirement }}</p>
        <p><strong>Amount:</strong> ${{ ad.amount }}</p>
        <p><strong>Status:</strong> {{ ad.status }}</p>
      </li>
    </ul>
    <p v-else>No ads found.</p>

    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <h3>Edit Profile</h3>
        <form @submit.prevent="updateProfile">
          <div>
            <label>About:</label>
            <textarea v-model="editForm.about"></textarea>
          </div>
          <div>
            <label for="category">Select Category:</label>
            <select v-model="editForm.category" required>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div>
            <label>Social Media Profiles:</label>
            <div v-for="(profile, index) in editForm.social_media_profiles" :key="index">
              <select v-model="profile.platform" required>
                <option value="" disabled>Select Platform</option>
                <option v-for="platform in getAvailablePlatforms(index)" :key="platform" :value="platform">{{ platform }}</option>
              </select>
              <TextInput v-model="profile.username" placeholder="Username" required />
              <button type="button" @click="removeSocialMediaProfile(index)">Remove</button>
            </div>
            <button type="button" @click="addSocialMediaProfile">Add Profile</button>
          </div>
          <button type="submit">Save</button>
          <button type="button" @click="showEditModal = false">Cancel</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchWithAuth } from "@/api.js";
import TextInput from "@/components/TextInput.vue";

export default {
  components: { TextInput },
  props: {
    influencerMeta: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showEditModal: false,
      categories: [
        "Education",
        "Daily Updates",
        "Comics",
        "Movie & Series",
        "Travel",
        "Food",
        "Fashion",
        "Technology",
      ],
      editForm: {
        about: this.influencerMeta.about,
        category: this.influencerMeta.category,
        social_media_profiles: JSON.parse(JSON.stringify(this.influencerMeta.social_media_profiles)),
      },
    };
  },
  watch: {
    influencerMeta: {
      immediate: true,
      deep: true,
      handler(newMeta) {
        this.editForm.about = newMeta.about;
        this.editForm.category = newMeta.category;
        this.editForm.social_media_profiles = JSON.parse(JSON.stringify(newMeta.social_media_profiles));
      },
    },
  },
  methods: {
    getAvailablePlatforms(index) {
      const selectedPlatforms = this.editForm.social_media_profiles.map(profile => profile.platform);
      const currentPlatform = this.editForm.social_media_profiles[index].platform;
      return ["Instagram", "Twitter", "YouTube"].filter(
          platform => !selectedPlatforms.includes(platform) || platform === currentPlatform
      );
    },
    removeSocialMediaProfile(index) {
      this.editForm.social_media_profiles.splice(index, 1);
    },
    addSocialMediaProfile() {
      this.editForm.social_media_profiles.push({ platform: "", username: "" });
    },
    async updateProfile() {
      try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/influencer/profile/edit", {
          method: "PATCH",
          body: JSON.stringify(this.editForm),
        });
        if (response.ok) {
          const data = await response.json();
          this.$emit("profileUpdated", data.data);
          this.showEditModal = false;
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    },
  },
};
</script>

<style scoped>
.profile-section {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 500px;
}
</style>
