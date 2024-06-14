import axios from 'axios';

const BASE_URL = 'https://swapi.dev/api/';
const CACHE_DURATION = 30 * 60 * 1000;
const MAX_CONCURRENT_REQUESTS = 5;
const BATCH_SIZE = 10;
let pendingRequests = 0;
const inMemoryCache = new Map();
const requestQueue = [];

const processQueue = () => {
  if (pendingRequests < MAX_CONCURRENT_REQUESTS && requestQueue.length) {
    const { url, resolve, reject } = requestQueue.shift();
    pendingRequests++;
    axios
      .get(url)
      .then((response) => {
        const data = response.data;
        const cacheKey = `swapi:${url}`;
        pendingRequests--;
        inMemoryCache.set(cacheKey, { data, expiry: Date.now() + CACHE_DURATION });
        localStorage.setItem(cacheKey, JSON.stringify({ data, expiry: Date.now() + CACHE_DURATION }));
        processQueue();
        resolve(data);
      })
      .catch((error) => {
        pendingRequests--;
        processQueue();
        reject(error);
      });
  }
};

async function requestHandler(url) {
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

  return new Promise((resolve, reject) => {
    requestQueue.push({ url, resolve, reject });
    processQueue();
  });
}

async function batchFetch(urls, batchSize) {
  let results = [];
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, Math.min(i + batchSize, urls.length));
    const responses = await Promise.all(batch.map((url) => requestHandler(url)));
    results = results.concat(responses.map((res) => (res.results ? res.results : res)).flat());
  }
  return results;
}

async function fetchAllPagesInBatches(baseUrl) {
  const firstPage = await requestHandler(baseUrl);
  const totalPages = Math.ceil(firstPage.count / firstPage.results.length);
  let allPageUrls = [baseUrl];
  for (let i = 2; i <= totalPages; i++) {
    allPageUrls.push(`${baseUrl}?page=${i}`);
  }
  return await batchFetch(allPageUrls, BATCH_SIZE);
}

export const fetchPlanets = () => fetchAllPagesInBatches(`${BASE_URL}planets/`);
export const fetchVehicles = () => fetchAllPagesInBatches(`${BASE_URL}vehicles/`);
export const fetchResidents = async (urls) => {
  const dynamicBatchSize = Math.max(1, Math.ceil(urls.length / BATCH_SIZE));
  return await batchFetch(urls, dynamicBatchSize);
};
