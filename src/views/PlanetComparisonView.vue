<script setup>
import usePlanetComparison from '../composables/usePlanetComparison';
const { planets, commonVehicles, updateSelection } = usePlanetComparison();
</script>

<template>
  <div>
    <h1>Select Planets for Comparison</h1>
    <div v-for="planet in planets" :key="planet.name">
      <input type="checkbox" :value="planet" @change="updateSelection(planet)">
      {{ planet.name }}
    </div>
    <h2>Common Vehicles</h2>
    <ul>
      <li v-for="vehicle in commonVehicles" :key="vehicle.name">{{ vehicle.name }}</li>
    </ul>
  </div>
</template>
