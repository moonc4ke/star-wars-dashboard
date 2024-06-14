<script setup>
import useTopPlanets from '../composables/useTopPlanets';
import VehicleChart from '../components/VehicleChart.vue';

// commonVehicles is not used anywhere because top three planets does not have any vehicles
const { topPlanets, commonVehicles } = useTopPlanets();
</script>

<template>
  <div>
    <h1>Top Populated Planets</h1>
    <ul>
      <li v-for="planet in topPlanets" :key="planet.name">{{ planet.name }} - Population: {{ planet.population }}</li>
    </ul>
    <h2 class="mt-5">Common Vehicles of Top 3 Planets:</h2>
    <VehicleChart />
  </div>
</template>
