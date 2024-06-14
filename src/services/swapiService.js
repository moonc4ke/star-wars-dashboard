import axios from 'axios';

const BASE_URL = 'https://swapi.dev/api/';
const BATCH_SIZE = 10;
const CACHE_DURATION = 30 * 60 * 1000;
const inMemoryCache = new Map();

async function fetchData(url) {
  const cacheKey = `swapi:${url}`;

  if (inMemoryCache.has(cacheKey)) {
    const memCache = inMemoryCache.get(cacheKey);
    if (Date.now() < memCache.expiry) {
      return memCache.data;
    } else {
      inMemoryCache.delete(cacheKey);
    }
  }

  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    const { data, expiry } = JSON.parse(cachedData);
    if (Date.now() < expiry) {
      inMemoryCache.set(cacheKey, { data, expiry });
      return data;
    } else {
      localStorage.removeItem(cacheKey);
    }
  }

  try {
    const response = await axios.get(url);
    const dataToCache = {
      data: response.data,
      expiry: Date.now() + CACHE_DURATION,
    };
    localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
    inMemoryCache.set(cacheKey, dataToCache);
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
    const responses = await Promise.all(batch.map((url) => fetchData(url)));
    results = results.concat(responses.map((res) => (res.results ? res.results : res)).flat());
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
