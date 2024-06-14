import { ref, onMounted } from 'vue';
import { fetchPlanets, fetchResidents, fetchVehicles } from '../services/swapiService';

export default function useTopPlanets() {
  const topPlanets = ref([]);
  const commonVehicles = ref([]);
  const loading = ref(false);

  async function loadTopPlanets() {
    loading.value = true;
    const allPlanets = await fetchPlanets();
    const sortedPlanets = allPlanets
      .filter((p) => p.population !== 'unknown')
      .sort((a, b) => Number(b.population) - Number(a.population));
    topPlanets.value = sortedPlanets.slice(0, 3);

    const residentUrls = topPlanets.value.flatMap((p) => p.residents).filter((url) => url);
    if (residentUrls.length > 0) {
      const residents = await fetchResidents(residentUrls);
      const vehicleUrls = residents.map((r) => r.vehicles).filter((v) => v.length > 0);

      if (vehicleUrls.length > 0) {
        const allVehicleUrls = vehicleUrls.flat();
        const vehicleFrequency = allVehicleUrls.reduce((acc, url) => {
          acc[url] = (acc[url] || 0) + 1;
          return acc;
        }, {});

        const commonVehicleUrls = Object.keys(vehicleFrequency).filter(
          (url) => vehicleFrequency[url] === topPlanets.value.length
        );
        if (commonVehicleUrls.length > 0) {
          const vehicles = await fetchVehicles();
          commonVehicles.value = vehicles.filter((v) => commonVehicleUrls.includes(v.url));
        }
      }
    }
    loading.value = false;
  }

  onMounted(loadTopPlanets);

  return { topPlanets, commonVehicles, loading };
}
