import { ref, onMounted } from 'vue';
import { fetchPlanets, fetchResidents, fetchVehicles } from '../services/swapiService';

export default function useTopPlanets() {
  const topPlanets = ref([]);
  const commonVehicles = ref([]);

  async function loadTopPlanets() {
    const allPlanets = await fetchPlanets();
    const sortedPlanets = allPlanets
      .filter((p) => p.population !== 'unknown')
      .sort((a, b) => Number(b.population) - Number(a.population));
    topPlanets.value = sortedPlanets.slice(0, 3);

    const residentUrls = topPlanets.value.flatMap((p) => p.residents).filter((url) => url);
    if (residentUrls.length > 0) {
      const residents = await fetchResidents(residentUrls);
      const vehicleUrls = [...new Set(residents.flatMap((r) => r.vehicles))];
      if (vehicleUrls.length > 0) {
        const vehicles = await fetchVehicles();
        commonVehicles.value = vehicles.filter((v) => vehicleUrls.includes(v.url));
      }
    }
  }

  onMounted(loadTopPlanets);

  return { topPlanets, commonVehicles };
}
