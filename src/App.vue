<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <header class="glass fixed w-full z-50 shadow-sm">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-2">
              <span class="text-2xl font-bold gradient-text">Influencer Platform</span>
            </router-link>
          </div>

          <div class="hidden sm:flex sm:items-center sm:space-x-8 font-poppins">
            <router-link to="/explore" class="nav-link">Explore</router-link>

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

            <router-link to="/signup" class="nav-link">Sign Up</router-link>
            <router-link to="/login" class="nav-link">Login</router-link>
          </div>

          <div class="flex items-center sm:hidden">
            <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none">
              <span class="sr-only">Open main menu</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <transition enter-active-class="transition duration-300 ease-out"
                    enter-from-class="transform -translate-y-4 opacity-0"
                    enter-to-class="transform translate-y-0 opacity-100"
                    leave-active-class="transition duration-200 ease-in"
                    leave-from-class="transform translate-y-0 opacity-100"
                    leave-to-class="transform -translate-y-4 opacity-0">
          <div v-if="isMobileMenuOpen" class="sm:hidden py-2 font-poppins">
            <router-link to="/explore" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Explore</router-link>

            <div v-if="!hasBothRoles">
              <button @click.prevent.stop="toggleRegisterMenuMobile" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Register</button>
              <div v-if="showRegisterMenuMobile">
                <router-link v-if="!hasRole('influencer')" to="/influencer/register" class="block px-4 py-2 text-gray-700 hover:bg-gray-100" @click.native="hideRegisterMenuMobile">Register as Influencer</router-link>
                <router-link v-if="!hasRole('sponsor')" to="/sponsor/register" class="block px-4 py-2 text-gray-700 hover:bg-gray-100" @click.native="hideRegisterMenuMobile">Register as Sponsor</router-link>
              </div>
            </div>

            <router-link to="/signup" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Sign Up</router-link>
            <router-link to="/login" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Login</router-link>
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
export default {
  name: 'App',
  data() {
    return {
      isMobileMenuOpen: false,
      showRegisterMenu: false,
      showRegisterMenuMobile: false,
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
  },
  beforeRouteLeave(to, from, next) {
    this.hideRegisterMenu();
    this.hideRegisterMenuMobile();
    next();
  }
};
</script>

<style scoped>
.nav-link {
  @apply text-gray-600 hover:text-gray-900 transition-colors font-medium text-lg;
}
</style>
