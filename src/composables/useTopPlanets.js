import { ref, onMounted } from 'vue';
import { fetchPlanets, fetchResidents, fetchVehicles } from '../services/swapiService';

export default function useTopPlanets() {
  const topPlanets = ref([]);
  const commonVehicles = ref([]);
  const loading = ref(false);

  async function loadTopPlanets() {
    loading.value = true;
    try {
      const allPlanets = await fetchPlanets();
      const sortedPlanets = allPlanets
        .filter((p) => p.population !== 'unknown')
        .sort((a, b) => Number(b.population) - Number(a.population));
      topPlanets.value = sortedPlanets.slice(0, 3);

      await updateCommonVehicles();
    } finally {
      loading.value = false;
    }
  }

  async function updateCommonVehicles() {
    const residentUrls = topPlanets.value.flatMap((p) => p.residents).filter((url) => url);
    if (residentUrls.length > 0) {
      const residents = await fetchResidents(residentUrls);
      const vehicleUrls = residents.flatMap((r) => r.vehicles).filter((v) => v);

      if (vehicleUrls.length > 0) {
        const vehicleCounts = vehicleUrls.reduce((acc, url) => {
          acc[url] = (acc[url] || 0) + 1;
          return acc;
        }, {});

        const commonVehicleUrls = Object.entries(vehicleCounts)
          .filter(([, count]) => count === topPlanets.value.length)
          .map(([url]) => url);

        if (commonVehicleUrls.length > 0) {
          const vehicles = await fetchVehicles();
          commonVehicles.value = vehicles
            .filter((v) => commonVehicleUrls.includes(v.url))
            .map((v) => ({
              name: v.name,
              count: vehicleCounts[v.url],
            }));
        }
      }
    }
  }

  onMounted(loadTopPlanets);

  return { topPlanets, commonVehicles, loading };
}
