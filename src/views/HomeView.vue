<script setup>
import useTopPlanets from '../composables/useTopPlanets';
import VehicleChart from '../components/VehicleChart.vue';

const { topPlanets, commonVehicles, loading } = useTopPlanets();
</script>

<template>
  <div>
    <div v-if="loading">Loading Top Populated Planets Data...</div>
    <div v-else>
      <h1>Top Populated Planets</h1>
      <ul>
        <li v-for="planet in topPlanets" :key="planet.name">{{ planet.name }} - Population: {{ planet.population }}</li>
      </ul>
      <h2 class="mt-5">Common Vehicles of Top 3 Planets:</h2>
      <VehicleChart :commonVehicles="commonVehicles" />
    </div>
  </div>
</template>
