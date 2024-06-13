import { ref, onMounted } from 'vue';
import { fetchPlanets, fetchVehicles } from '../services/swapiService';

export default function usePlanetComparison() {
  const planets = ref([]);
  const selectedPlanets = ref([]);
  const commonVehicles = ref([]);
  const allVehicles = ref([]);

  async function loadPlanetsAndVehicles() {
    planets.value = await fetchPlanets();
    allVehicles.value = await fetchVehicles();
  }

  function updateSelection(planet) {
    const index = selectedPlanets.value.indexOf(planet);
    if (index > -1) {
      selectedPlanets.value.splice(index, 1);
    } else {
      selectedPlanets.value.push(planet);
    }
    updateCommonVehicles();
  }

  function updateCommonVehicles() {
    const vehiclesLists = selectedPlanets.value.map(p => p.vehicles).filter(v => v.length > 0);
    if (vehiclesLists.length > 0) {
      commonVehicles.value = allVehicles.value.filter(v => 
        vehiclesLists.every(list => list.includes(v.url))
      );
    } else {
      commonVehicles.value = [];
    }
  }

  onMounted(loadPlanetsAndVehicles);

  return { planets, selectedPlanets, commonVehicles, updateSelection };
}
