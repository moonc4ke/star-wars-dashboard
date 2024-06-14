<script setup>
import usePlanetComparison from '../composables/usePlanetComparison';
const { planets, commonVehicles, updateSelection, loading, loadingCommonVehicles } = usePlanetComparison();
</script>

<template>
  <div>
    <div v-if="loading">Loading Planet Comparison Data...</div>
    <div v-else>
      <h1 class="text-xl font-bold mb-2">Select Planets for Comparison</h1>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <tbody class="divide-y divide-gray-200">
            <tr v-for="planet in planets" :key="planet.name">
              <td class="px-4 py-2 w-8">
                <label class="sr-only" :for="planet.name">{{ planet.name }}</label>

                <input
                  class="size-5 rounded border-gray-300"
                  type="checkbox"
                  :id="planet.name"
                  :value="planet"
                  @change="updateSelection(planet)"
                />
              </td>
              <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{{ planet.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 class="mt-3 text-xl font-bold mb-2">Common Vehicles</h2>
      <div v-if="loadingCommonVehicles">Loading Common Vehicles...</div>
      <div v-else>
        <div v-if="commonVehicles.length > 0" class="flow-root">
          <dl v-for="vehicle in commonVehicles" :key="vehicle.name" class="-my-3 divide-y divide-gray-100 text-sm">
            <h3 class="text-base font-bold mt-6 mb-2">Common Vehicle Data:</h3>
            
            <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt class="font-medium text-gray-900">Name</dt>
              <dd class="text-gray-700 sm:col-span-2">{{ vehicle.name }}</dd>
            </div>

            <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt class="font-medium text-gray-900">Model</dt>
              <dd class="text-gray-700 sm:col-span-2">{{ vehicle.model }}</dd>
            </div>
          </dl>
        </div>
        <p v-else>No common vehicles found.</p>
      </div>
    </div>
  </div>
</template>
