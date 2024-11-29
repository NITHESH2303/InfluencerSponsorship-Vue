<template>
  <div class="search-container">
    <h1>Search</h1>
    <div class="search-bar">
      <input
          type="text"
          v-model="searchParams.keyword"
          @input="handleSearch"
          class="form-control"
          placeholder="Enter search keyword"
      />
      <button @click="toggleFilters" class="btn btn-secondary">Filters &#x1F5C2;</button>
    </div>

    <!-- Filter Options -->
    <div v-if="showFilters" class="filter-options mt-3">
      <div class="form-group">
        <label for="searchType">Search Type</label>
        <select v-model="searchParams.type" id="searchType" class="form-control" @change="handleSearch">
          <option value="user">User</option>
          <option value="campaign">Campaign</option>
        </select>
      </div>

      <div v-if="searchParams.type === 'user'">
        <div class="form-group">
          <label for="role">Role</label>
          <select v-model="searchParams.role" id="role" class="form-control" @change="handleSearch">
            <option value="">Any</option>
            <option value="influencer">Influencer</option>
            <option value="sponsor">Sponsor</option>
          </select>
        </div>
        <div v-if="searchParams.role === 'influencer'" class="form-group">
          <label for="minFollowers">Minimum Followers</label>
          <input type="number" v-model.number="searchParams.min_followers" id="minFollowers" class="form-control" @input="handleSearch" />
        </div>
      </div>

      <div v-if="searchParams.type === 'campaign'">
        <div class="form-group">
          <label for="adsCount">Minimum Ads Count</label>
          <input type="number" v-model.number="searchParams.ads_count" id="adsCount" class="form-control" @input="handleSearch" />
        </div>
      </div>
    </div>

    <!-- Search Results -->
    <div v-if="results.length && searchPerformed" class="mt-4">
      <h2>Search Results</h2>
      <div v-for="result in results" :key="result.id" class="result-item">
        <div v-if="searchParams.type === 'user'">
          <h4>{{ result.first_name }} {{ result.last_name }}</h4>
          <p><strong>Email:</strong> {{ result.email }}</p>
          <p><strong>Username:</strong> {{ result.username }}</p>
          <p><strong>Role(s):</strong> {{ result.role.join(', ') }}</p>
        </div>
        <div v-else-if="searchParams.type === 'campaign'">
          <h4>{{ result.campaign_name }}</h4>
          <p><strong>Description:</strong> {{ result.description }}</p>
          <p><strong>Budget:</strong> ${{ result.budget }}</p>
          <p><strong>Status:</strong> {{ result.status }}</p>
          <p><strong>Progress:</strong> {{ result.progress_percentage }}%</p>
        </div>
      </div>
    </div>

    <!-- Default List -->
    <div v-else class="mt-4">
      <h2>{{ defaultListTitle }}</h2>
      <div v-for="item in defaultList" :key="item.id" class="default-item">
        <div v-if="searchParams.type === 'user'">
          <h4>{{ item.first_name }} {{ item.last_name }}</h4>
          <p><strong>Email:</strong> {{ item.email }}</p>
          <p><strong>Username:</strong> {{ item.username }}</p>
          <p><strong>Role(s):</strong> {{ item.role.join(', ') }}</p>
        </div>
        <div v-else-if="searchParams.type === 'campaign'">
          <h4>{{ item.campaign_name }}</h4>
          <p><strong>Description:</strong> {{ item.description }}</p>
          <p><strong>Budget:</strong> ${{ item.budget }}</p>
          <p><strong>Status:</strong> {{ item.status }}</p>
          <p><strong>Progress:</strong> {{ item.progress_percentage }}%</p>
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
    async fetchDefaultList(type) {
      try {
        let url = '';
        this.defaultListTitle = '';
        switch (type) {
          case 'user':
            url = 'http://127.0.0.1:5000/api/users';
            this.defaultListTitle = 'All Users';
            break;
          case 'campaign':
            url = 'http://127.0.0.1:5000/api/campaigns';
            this.defaultListTitle = 'All Campaigns';
            break;
        }
        const response = await fetchWithAuth(url, {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          this.defaultList = data.data || [];
        } else {
          console.error('Error response from server:', response.status);
        }
      } catch (error) {
        console.error('Error fetching default list:', error);
      }
    },
    async handleSearch() {
      try {
        this.searchPerformed = false;

        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(this.searchParams)) {
          if (value !== null && value !== '') {
            params.append(key, value);
          }
        }

        const response = await fetch(`http://127.0.0.1:5000/api/search?${params}`, {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          this.results = data.data || [];
        } else {
          console.error('Error response from server:', response.status);
        }

        this.searchPerformed = true;
      } catch (error) {
        console.error('Error performing search:', error);
      }
    }
  },
};
</script>


<style>
.search-bar {
  display: flex;
  align-items: center;
}

.search-bar input {
  flex: 1;
}

.search-bar button {
  margin-left: 10px;
}

.filter-options {
  background-color: #f9f9f9;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.default-item {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
}
</style>

