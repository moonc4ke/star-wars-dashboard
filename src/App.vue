<script setup>
import { RouterView } from 'vue-router';
import NavigationBar from './components/NavigationBar.vue';
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-2 sm:px-8">
    <NavigationBar />

    <RouterView />
  </div>
</template>
