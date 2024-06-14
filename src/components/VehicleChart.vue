<script setup>
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'vue-chartjs';
// Using hardcoded data because Top Three planets does not have any vehicles at all
import { chartData, chartOptions } from '../chartConfig';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
</script>

<template>
  <div class="h-60 relative">
    <Bar :data="chartData" :options="chartOptions" height="100px" />
  </div>
</template>
