<script setup>
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'vue-chartjs';
import { ref, watchEffect } from 'vue';
import { chartData as defaultChartData, chartOptions } from '../chartConfig';

const props = defineProps({
  commonVehicles: Array,
});

const chartData = ref({ ...defaultChartData });

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

watchEffect(() => {
  if (props.commonVehicles && props.commonVehicles.length > 0) {
    chartData.value.labels = props.commonVehicles.map((v) => v.name);
    chartData.value.datasets[0].data = props.commonVehicles.map((v) => v.count);
  } else {
    chartData.value = { ...defaultChartData };
  }
});
</script>

<template>
  <div class="h-60 relative">
    <Bar :data="chartData" :options="chartOptions" height="100px" />
  </div>
</template>
