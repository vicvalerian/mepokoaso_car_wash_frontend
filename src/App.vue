<template>
  <!-- <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
    <router-view/>
  </div> -->
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script>
  export default {
    name: "App",
  };
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

.v-application {
  font-family: 'Poppins', sans-serif !important;
}

.v-data-table-header th {
    font-weight: bold !important;
    font-size: 14px !important;
    color: black !important;
}

.red-chip{
  color: #900A0A !important;
  background-color: #FFE3E3 !important;
  font-weight: bolder;
  letter-spacing: 0.5px;
}

.orange-chip{
  color: #e28f0a !important;
  background-color: #FFF1DA !important;
  font-weight: bolder;
  letter-spacing: 0.5px;
}

.green-chip{
  color: #2E7D32 !important;
  background-color: #E1FAEA !important;
  font-weight: bolder;
  letter-spacing: 0.5px;
}

.blue-chip{
  color: #113B98 !important;
  background-color: #EBF0FB !important;
  font-weight: bolder;
  letter-spacing: 0.5px;
}

.light-blue-chip{
  color: #5965DB !important;
  background-color: #EBEDFB !important;
  font-weight: bolder;
  letter-spacing: 0.5px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

/* nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
} */
</style>
