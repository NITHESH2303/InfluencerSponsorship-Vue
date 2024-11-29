<template>
  <div id="app">
    <header>
      <h1>Influencer Sponsorship Platform</h1>
      <nav>
        <router-link to="/signup">Sign Up</router-link>
        <router-link to="/login">Login</router-link>
        <router-link to="/explore">Explore</router-link>
        <router-link to="/statistics">Statistics</router-link>
        <!-- Add more links as needed -->
      </nav>
    </header>
    <main>
      <router-view />
    </main>
    <footer>
      <p>&copy; Mad the MAD2</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style scoped>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}

header {
  background-color: #f8f9fa;
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

nav {
  margin-top: 10px;
}

nav a {
  margin: 0 15px;
  text-decoration: none;
  color: #007bff;
}

nav a:hover {
  text-decoration: underline;
}

main {
  padding: 20px;
}

footer {
  margin-top: 20px;
  padding: 10px;
  background-color: #f1f1f1;
}
</style>
