<template>
  <div class="influencer-dashboard">
    <h1>Welcome, {{ influencerMeta.username }}</h1>
    <ProfileSection :influencerMeta="influencerMeta" @profileUpdated="fetchMetaData"/>
    <InfluencerAdRequests :influencerId="influencerMeta.influencer_id" />
  </div>
</template>

<script>
import ProfileSection from "@/components/influencer/ProfileSection.vue";
import InfluencerAdRequests from "@/components/influencer/InfluencerAdRequests.vue";

export default {
  components: {
    InfluencerAdRequests,
    ProfileSection,
  },
  props: {
    influencerMeta: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
    };
  },
  async created() {

  },
  methods: {

  },
};
</script>


<style scoped>
.influencer-dashboard {
  padding: 20px;
}
</style>
