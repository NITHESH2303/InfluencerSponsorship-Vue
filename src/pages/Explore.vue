<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Search Header -->
      <div class="card mb-8 animate-fade-in">
        <h1 class="text-3xl font-bold gradient-text mb-6">Explore Platform</h1>

        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i class="fas fa-search text-gray-400"></i>
          </div>
          <input
              type="text"
              v-model="searchParams.keyword"
              @input="handleSearch"
              class="input pl-10"
              placeholder="Search for campaigns, influencers, or sponsors..."
          />
          <button
              @click="toggleFilters"
              class="absolute inset-y-0 right-0 px-4 flex items-center"
          >
            <i class="fas fa-sliders-h text-gray-500 hover:text-primary-600 transition-colors"></i>
          </button>
        </div>

        <!-- Filter Options -->
        <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform -translate-y-2 opacity-0"
            enter-to-class="transform translate-y-0 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="transform translate-y-0 opacity-100"
            leave-to-class="transform -translate-y-2 opacity-0"
        >
          <div v-if="showFilters" class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-1">Search Type</label>
                <select
                    v-model="searchParams.type"
                    class="select"
                    @change="handleSearch"
                >
                  <option value="user">User</option>
                  <option value="campaign">Campaign</option>
                </select>
              </div>

              <div v-if="searchParams.type === 'user'" class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                    v-model="searchParams.role"
                    class="select"
                    @change="handleSearch"
                >
                  <option value="">Any</option>
                  <option value="influencer">Influencer</option>
                  <option value="sponsor">Sponsor</option>
                </select>
              </div>

              <div v-if="searchParams.role === 'influencer'" class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-1">Minimum Followers</label>
                <input
                    type="number"
                    v-model.number="searchParams.min_followers"
                    class="input"
                    @input="handleSearch"
                    placeholder="Enter minimum followers count"
                />
              </div>

              <div v-if="searchParams.type === 'campaign'" class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-1">Minimum Ads Count</label>
                <input
                    type="number"
                    v-model.number="searchParams.ads_count"
                    class="input"
                    @input="handleSearch"
                    placeholder="Enter minimum ads count"
                />
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- Results Section -->
      <div class="space-y-6">
        <h2 class="text-xl font-semibold text-gray-900">
          {{ searchPerformed ? 'Search Results' : defaultListTitle }}
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <template v-if="(searchPerformed ? results : defaultList).length">
            <div
                v-for="item in (searchPerformed ? results : defaultList)"
                :key="item.id"
                class="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div v-if="searchParams.type === 'user'" class="space-y-4">
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span class="text-lg font-bold text-white">{{ item.username?.[0]?.toUpperCase() }}</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">{{ item.username }}</h3>
                    <p class="text-sm text-gray-500">{{ item.role.join(', ') }}</p>
                  </div>
                </div>
                <p class="text-gray-600">{{ item.email }}</p>
              </div>

              <div v-else class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-900">{{ item.campaign_name }}</h3>
                <p class="text-gray-600 line-clamp-2">{{ item.description }}</p>
                <div class="flex justify-between items-center">
                  <span class="text-primary-600 font-medium">${{ item.budget }}</span>
                  <span :class="getStatusClass(item.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                    {{ item.status }}
                  </span>
                </div>
                <div class="mt-2">
                  <div class="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{{ item.progress_percentage }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                        class="bg-primary-600 rounded-full h-2 transition-all duration-300"
                        :style="{ width: `${item.progress_percentage}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <div
              v-else
              class="col-span-full text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
          >
            <div class="text-gray-400 mb-4">
              <i class="fas fa-search text-6xl"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-900">No results found</h3>
            <p class="text-gray-500 mt-2">Try adjusting your search or filters</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchWithAuth } from "@/api.js";

export default {
  data() {
    return {
      searchParams: {
        type: 'user',
        keyword: '',
        role: '',
        min_followers: null,
        ads_count: null,
      },
      results: [],
      searchPerformed: false,
      defaultList: [],
      defaultListTitle: '',
      showFilters: false,
    };
  },
  watch: {
    'searchParams.type'(newType) {
      this.fetchDefaultList(newType);
      this.handleSearch();
    },
  },
  mounted() {
    this.fetchDefaultList(this.searchParams.type);
  },
  methods: {
    toggleFilters() {
      this.showFilters = !this.showFilters;
    },
    getStatusClass(status) {
      const classes = {
        'Active': 'bg-green-100 text-green-800',
        'Completed': 'bg-gray-100 text-gray-800',
        'Pending': 'bg-yellow-100 text-yellow-800'
      };
      return classes[status] || 'bg-gray-100 text-gray-800';
    },
    async fetchDefaultList(type) {
      try {
        let url = '';
        this.defaultListTitle = '';
        switch (type) {
          case 'user':
            url = 'http://127.0.0.1:5000/api/users';
            this.defaultListTitle = 'Recent Users';
            break;
          case 'campaign':
            url = 'http://127.0.0.1:5000/api/campaigns';
            this.defaultListTitle = 'Active Campaigns';
            break;
        }
        const response = await fetchWithAuth(url);
        if (response.ok) {
          const data = await response.json();
          this.defaultList = data.data || [];
        }
      } catch (error) {
        console.error('Error fetching default list:', error);
      }
    },
    async handleSearch() {
      if (!this.searchParams.keyword.trim()) {
        this.searchPerformed = false;
        return;
      }

      try {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(this.searchParams)) {
          if (value !== null && value !== '') {
            params.append(key, value);
          }
        }

        const response = await fetchWithAuth(`http://127.0.0.1:5000/api/search?${params}`);
        if (response.ok) {
          const data = await response.json();
          this.results = data.data || [];
          this.searchPerformed = true;
        }
      } catch (error) {
        console.error('Error performing search:', error);
      }
    }
  },
};
</script>

<style scoped>
.card {
  @apply bg-white rounded-xl shadow-md p-6;
}

.input {
  @apply w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500
  focus:border-primary-500 transition-all duration-200;
}

.select {
  @apply w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500
  focus:border-primary-500 transition-all duration-200;
}

.gradient-text {
  @apply bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>