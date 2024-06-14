<script setup>
import usePlanetComparison from '../composables/usePlanetComparison';
const { planets, commonVehicles, updateSelection, loading, loadingCommonVehicles } = usePlanetComparison();
</script>

<template>
  <div>
    <div v-if="loading">Loading Planet Comparison Data...</div>
    <div v-else>
      <h1>Select Planets for Comparison</h1>
      <div v-for="planet in planets" :key="planet.name">
        <input type="checkbox" :value="planet" @change="updateSelection(planet)" />
        {{ planet.name }}
      </div>
      <h2 class="mt-3">Common Vehicles</h2>
      <div v-if="loadingCommonVehicles">Loading Common Vehicles...</div>
      <div v-else>
        <ul v-if="commonVehicles.length > 0">
          <li v-for="vehicle in commonVehicles" :key="vehicle.name">{{ vehicle.name }}</li>
        </ul>
        <p v-else>No common vehicles found.</p>
      </div>
    </div>
  </div>
</template>
