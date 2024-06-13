import axios from 'axios';

const BASE_URL = 'https://swapi.dev/api/';
const BATCH_SIZE = 10;

async function fetchData(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
}

async function batchFetch(urls, batchSize) {
  let results = [];
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const responses = await Promise.all(batch.map(url => fetchData(url)));
    results = results.concat(responses.map(res => res.results ? res.results : res).flat());
  }
  return results;
}

async function fetchAllPagesInBatches(baseUrl) {
  const firstPage = await fetchData(baseUrl);
  const totalPages = Math.ceil(firstPage.count / firstPage.results.length);
  let allPageUrls = [baseUrl];
  for (let i = 2; i <= totalPages; i++) {
    allPageUrls.push(`${baseUrl}?page=${i}`);
  }

  const dynamicBatchSize = Math.max(1, Math.ceil(totalPages / BATCH_SIZE));
  const allPagesResults = await batchFetch(allPageUrls, dynamicBatchSize);
  return allPagesResults;
}

export const fetchPlanets = () => fetchAllPagesInBatches(`${BASE_URL}planets/`);
export const fetchVehicles = () => fetchAllPagesInBatches(`${BASE_URL}vehicles/`);
export const fetchResidents = async (urls) => {
  const dynamicBatchSize = Math.max(1, Math.ceil(urls.length / BATCH_SIZE));
  return await batchFetch(urls, dynamicBatchSize);
};
