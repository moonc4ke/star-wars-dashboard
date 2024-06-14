import { ref, onMounted } from 'vue';
import { fetchPlanets, fetchResidents, fetchVehicles } from '../services/swapiService';

export default function usePlanetComparison() {
  const planets = ref([]);
  const selectedPlanets = ref([]);
  const commonVehicles = ref([]);
  const allVehicles = ref([]);
  const loading = ref(false);
  const loadingCommonVehicles = ref(false);

  async function loadPlanetsAndVehicles() {
    loading.value = true;
    planets.value = await fetchPlanets();
    allVehicles.value = await fetchVehicles();
    loading.value = false;
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

  async function updateCommonVehicles() {
    loadingCommonVehicles.value = true;
    if (selectedPlanets.value.length > 1) {
      const residentUrls = selectedPlanets.value.flatMap((p) => p.residents).filter((url) => url);
      const residents = await fetchResidents(residentUrls);
      const vehicleUrls = residents.flatMap((r) => r.vehicles);

      const vehicleCount = vehicleUrls.reduce((acc, url) => {
        acc[url] = (acc[url] || 0) + 1;
        return acc;
      }, {});

      const commonVehicleUrls = Object.keys(vehicleCount).filter(
        (url) => vehicleCount[url] === selectedPlanets.value.length
      );

      commonVehicles.value = allVehicles.value.filter((v) => commonVehicleUrls.includes(v.url));
    } else {
      commonVehicles.value = [];
    }
    loadingCommonVehicles.value = false;
  }

  onMounted(loadPlanetsAndVehicles);

  return { planets, selectedPlanets, commonVehicles, updateSelection, loading, loadingCommonVehicles };
}
