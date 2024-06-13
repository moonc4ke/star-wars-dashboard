<script setup>
import useTopPlanets from '../composables/useTopPlanets';
const { topPlanets, commonVehicles } = useTopPlanets();
</script>

<template>
  <div>
    <h1>Top Populated Planets</h1>
    <ul>
      <li v-for="planet in topPlanets" :key="planet.name">{{ planet.name }} - Population: {{ planet.population }}</li>
    </ul>
    <h2>Common Vehicles</h2>
    <ul>
      <li v-for="vehicle in commonVehicles" :key="vehicle.name">{{ vehicle.name }}</li>
    </ul>
  </div>
</template>
