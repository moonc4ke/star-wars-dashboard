<script setup>
import { RouterView } from 'vue-router';
import NavigationBar from './components/NavigationBar.vue';
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-4 sm:px-8 mb-32">
    <NavigationBar class="mb-2" />

    <RouterView />
  </div>
</template>
