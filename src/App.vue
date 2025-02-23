<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
    <header class="glass fixed w-full z-50 shadow-sm">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-2">
              <span class="text-2xl font-bold gradient-text">Influencer Sponsorship Platform</span>
            </router-link>
          </div>

          <div class="hidden sm:flex sm:items-center sm:space-x-8 font-poppins">
            <router-link to="/explore" class="nav-link">
              <i class="fas fa-compass mr-1"></i> Explore
            </router-link>

            <div v-if="roles.length > 0" class="flex items-center space-x-4">
              <router-link v-if="hasRole('influencer')" to="/influencer/dashboard" class="nav-link">
                <i class="fas fa-user-circle mr-1"></i> Influencer Dashboard
              </router-link>
              <router-link v-if="hasRole('sponsor')" to="/sponsor/dashboard" class="nav-link">
                <i class="fas fa-briefcase mr-1"></i> Sponsor Dashboard
              </router-link>
              <router-link v-if="hasRole('admin')" to="/admin/overview" class="nav-link">
                <i class="fas fa-shield-alt mr-1"></i> Admin Dashboard
              </router-link>
            </div>

            <router-link to="/settings" class="nav-link">
              <i class="fas fa-cog mr-1"></i> Settings
            </router-link>

            <div v-if="!hasBothRoles" class="relative">
              <button @click="toggleRegisterMenu" class="nav-link">Register</button>
              <div v-if="showRegisterMenu" class="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
                <router-link v-if="!hasRole('influencer')" to="/influencer/register" class="block px-4 py-2 text-gray-700 hover:bg-gray-100" @click.native="hideRegisterMenu">
                  Register as Influencer
                </router-link>
                <router-link v-if="!hasRole('sponsor')" to="/sponsor/register" class="block px-4 py-2 text-gray-700 hover:bg-gray-100" @click.native="hideRegisterMenu">
                  Register as Sponsor
                </router-link>
              </div>
            </div>

            <button @click="logout" class="nav-link flex items-center">
              <i class="fas fa-sign-out-alt mr-1"></i> Logout
            </button>
          </div>

          <div class="flex items-center sm:hidden">
            <button @click="isMobileMenuOpen = !isMobileMenuOpen"
                    class="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none">
              <span class="sr-only">Open main menu</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 6h16M4 12h16M4 18h16" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform -translate-y-4 opacity-0"
            enter-to-class="transform translate-y-0 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="transform translate-y-0 opacity-100"
            leave-to-class="transform -translate-y-4 opacity-0"
        >
          <div v-if="isMobileMenuOpen" class="sm:hidden py-2 space-y-1">
            <router-link to="/explore" class="mobile-nav-link">
              <i class="fas fa-compass mr-2"></i> Explore
            </router-link>

            <template v-if="roles.length > 0">
              <router-link v-if="hasRole('influencer')" to="/influencer/dashboard" class="mobile-nav-link">
                <i class="fas fa-user-circle mr-2"></i> Influencer Dashboard
              </router-link>
              <router-link v-if="hasRole('sponsor')" to="/sponsor/dashboard" class="mobile-nav-link">
                <i class="fas fa-briefcase mr-2"></i> Sponsor Dashboard
              </router-link>
              <router-link v-if="hasRole('admin')" to="/admin/overview" class="mobile-nav-link">
                <i class="fas fa-shield-alt mr-2"></i> Admin Dashboard
              </router-link>
            </template>

            <router-link to="/settings" class="mobile-nav-link">
              <i class="fas fa-cog mr-2"></i> Settings
            </router-link>

            <div v-if="!hasBothRoles">
              <button @click.prevent.stop="toggleRegisterMenuMobile" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Register</button>
              <div v-if="showRegisterMenuMobile">
                <router-link v-if="!hasRole('influencer')" to="/influencer/register" class="block px-4 py-2 text-gray-700 hover:bg-gray-100" @click.native="hideRegisterMenuMobile">Register as Influencer</router-link>
                <router-link v-if="!hasRole('sponsor')" to="/sponsor/register" class="block px-4 py-2 text-gray-700 hover:bg-gray-100" @click.native="hideRegisterMenuMobile">Register as Sponsor</router-link>
              </div>
            </div>

            <button @click="logout" class="mobile-nav-link w-full text-left">
              <i class="fas fa-sign-out-alt mr-2"></i> Logout
            </button>
          </div>
        </transition>
      </nav>
    </header>

    <main class="pt-16 min-h-screen">
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <router-view v-slot="{ Component }">
          <transition name="fade-scale" mode="out-in">
            <component :is="Component"/>
          </transition>
        </router-view>
      </div>
    </main>

    <footer class="glass mt-auto">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <p class="text-center text-gray-600">&copy; {{ new Date().getFullYear() }} Mad the MAD2</p>
      </div>
    </footer>
  </div>
</template>

<script>
import {useToast} from "vue-toastification";
import {fetchWithAuth} from "@/api.js";

export default {
  name: 'App',
  data() {
    return {
      isMobileMenuOpen: false,
      showRegisterMenu: false,
      showRegisterMenuMobile: false,
      toast: useToast()
    };
  },
  computed: {
    roles() {
      try {
        const role = localStorage.getItem('role');
        console.log(role);
        return role !== "undefined" && role !== null ? JSON.parse(role) : [];
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return [];
      }

    },
    hasBothRoles() {
      return this.roles.includes('influencer') && this.roles.includes('sponsor');
    },
    hasRole() {
      return (role) => this.roles.includes(role);
    },
  },
  methods: {
    toggleRegisterMenu() {
      this.showRegisterMenu = !this.showRegisterMenu;
    },
    hideRegisterMenu() {
      this.showRegisterMenu = false;
    },
    toggleRegisterMenuMobile() {
      this.showRegisterMenuMobile = !this.showRegisterMenuMobile;
    },
    hideRegisterMenuMobile() {
      this.showRegisterMenuMobile = false;
    },
    async logout() {
      try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/auth/logout", {
          method: "DELETE",
        });

        if (response.ok) {
          localStorage.removeItem('role');
          localStorage.removeItem('access_token');
          this.toast.success("Logged out successfully");
          this.$router.push('/login');
        } else {
          this.toast.error('Failed to log out');
        }
      } catch (error) {
        console.error('Error logging out:', error);
        this.toast.error('An error occurred while logging out');
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    this.hideRegisterMenu();
    this.hideRegisterMenuMobile();
    next();
  },
  watch: {
    $route() {
      this.isMobileMenuOpen = false;
    }
  }
};
</script>

<style scoped>
.nav-link {
  @apply text-gray-600 hover:text-primary-600 transition-colors font-medium text-lg flex items-center;
}
.mobile-nav-link {
  @apply block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors flex items-center;
}

.gradient-text {
  @apply bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent;
}

.glass {
  @apply bg-white/70 backdrop-blur-lg;
}
</style>
