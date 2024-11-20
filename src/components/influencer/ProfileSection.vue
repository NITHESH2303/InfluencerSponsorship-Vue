<template>
  <div class="profile-section">
    <h2>Profile</h2>
    <div v-if="influencer">
      <p><strong>About:</strong> {{ influencer.about }}</p>
      <p><strong>Category:</strong> {{ influencer.category }}</p>
      <p><strong>Followers:</strong> {{ influencer.followers }}</p>
      <h3>Social Media Profiles</h3>
      <ul>
        <li v-for="profile in influencer.social_media_profiles" :key="profile.platform">
          <strong>{{ profile.platform }}:</strong> {{ profile.username }}
        </li>
      </ul>
      <button @click="showEditModal = true">Edit Profile</button>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <h3>Edit Profile</h3>
        <form @submit.prevent="updateProfile">
          <label>About:</label>
          <textarea v-model="editForm.about"></textarea>
          <label>Category:</label>
          <input type="text" v-model="editForm.category" />
          <label>Social Media Profiles:</label>
          <div v-for="(profile, index) in editForm.social_media_profiles" :key="index">
            <input type="text" v-model="profile.platform" placeholder="Platform" />
            <input type="text" v-model="profile.username" placeholder="Username" />
          </div>
          <button type="button" @click="addSocialMediaProfile">Add Profile</button>
          <button type="submit">Save</button>
          <button type="button" @click="showEditModal = false">Cancel</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {fetchWithAuth} from "@/api.js";

export default {
  props: {
    influencer: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showEditModal: false,
      editForm: {
        about: "",
        category: "",
        social_media_profiles: [],
      },
    };
  },
  methods: {
    addSocialMediaProfile() {
      this.editForm.social_media_profiles.push({ platform: "", username: "" });
    },
    async updateProfile() {
      try {
        const response = await fetchWithAuth("/api/influencer/profile", {
          method: "PATCH",
          body: JSON.stringify(this.editForm),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        this.$emit("profileUpdated");
        this.showEditModal = false;
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    },
  },
  watch: {
    influencer: {
      immediate: true,
      handler(newInfluencer) {
        this.editForm = {
          about: newInfluencer.about,
          category: newInfluencer.category,
          social_media_profiles: [...newInfluencer.social_media_profiles],
        };
      },
    },
  },
};
</script>
