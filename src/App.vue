<template>
  <div>
    <!--    <nav>-->
    <!--      <router-link to="/">Login</router-link> |-->
    <!--      <router-link to="/form">Arrival Form</router-link> |-->
    <!--      <router-link to="/dashboard">Dashboard</router-link>-->
    <!--    </nav>-->
    <router-view/>
  </div>
</template>

<script>
export default {name: 'App'}
</script>

<style>
nav {
  padding: 1rem;
  background: #ddd;
}

nav a {
  margin-right: 10px;
}
</style>
