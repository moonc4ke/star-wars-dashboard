<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Top Planets</RouterLink>
        <RouterLink to="/compare">Planet Comparison</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>
