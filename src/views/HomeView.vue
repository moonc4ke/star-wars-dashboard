<script setup>
import useTopPlanets from '../composables/useTopPlanets';
import VehicleChart from '../components/VehicleChart.vue';

const { topPlanets, commonVehicles, loading } = useTopPlanets();
</script>

<template>
  <div>
    <div v-if="loading">Loading Top Populated Planets Data...</div>
    <div v-else>
      <h2 class="text-xl font-bold mb-2">Top Populated Planets</h2>

      <div class="flow-root mt-6 mb-10">
        <dl class="-my-3 divide-y divide-gray-100 text-sm">
          <div
            v-for="planet in topPlanets"
            :key="planet.name"
            class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4"
          >
            <dt class="font-medium text-gray-900">{{ planet.name }}</dt>
            <dd class="text-gray-700 sm:col-span-2">Population: {{ planet.population }}</dd>
          </div>
        </dl>
      </div>

      <h2 class="mt-5 text-xl font-bold">Common Vehicles of Top 3 Planets:</h2>
      <VehicleChart :commonVehicles="commonVehicles" />
    </div>
  </div>
</template>
