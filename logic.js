// logic.js

// Import necessary utility functions
import { sumColumns } from './utils.js';

// Group indices for different sections of the roulette table
const groupIndices = {
  topIndices: [5, 22, 34, 15, 3, 24, 36, 13, 1, 37, 27, 10, 25, 29, 12, 8, 19, 31, 18],
  bottomIndices: [17, 32, 20, 7, 11, 30, 26, 9, 28, 0, 2, 14, 35, 23, 4, 16, 33, 21, 6],
  // Add other groupings as needed
};

// Function to calculate the difference between top and bottom sections
export function calculateTopBottomDifference(counts) {
  const topSum = sumColumns(counts, groupIndices.topIndices);
  const bottomSum = sumColumns(counts, groupIndices.bottomIndices);
  return topSum - bottomSum;
}

// Function to calculate density (sum of top 5 frequencies)
export function calculateDensity(counts) {
  return counts.slice().sort((a, b) => b - a).slice(0, 5).reduce((sum, val) => sum + val, 0);
}

// Function to calculate variance
export function calculateVariance(counts) {
  const mean = counts.reduce((a, b) => a + b, 0) / counts.length;
  return counts.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / counts.length;
}

// Function to calculate maximum hits
export function calculateMaxHits(counts) {
  return Math.max(...counts);
}

// Function to calculate maximum counts
export function calculateMaxCounts(counts) {
  const freq = new Array(38).fill(0);
  counts.forEach(num => freq[num]++);
  return Math.max(...freq);
}

// Function to calculate variance difference between top and bottom sections
export function calculateVarianceDifference(counts) {
  const topCounts = groupIndices.topIndices.map(i => counts[i]);
  const bottomCounts = groupIndices.bottomIndices.map(i => counts[i]);
  const topVar = calculateVariance(topCounts);
  const bottomVar = calculateVariance(bottomCounts);
  return topVar - bottomVar;
}

// Function to calculate points score based on reference data
export function calculatePointsScore(counts, refData) {
  let points = 0;

  function safeLookup(category, value) {
    const refCategory = refData[category];
    if (!refCategory) return 1.0;
    const closest = Object.keys(refCategory).map(parseFloat).reduce((a, b) => Math.abs(b - value) < Math.abs(a - value) ? b : a);
    return refCategory[closest] || 1.0;
  }

  const metrics = {
    "Top - Bottom": calculateTopBottomDifference(counts),
    "Density (Top 5 Sum)": calculateDensity(counts),
    "Variance (Within-Run Spread)": calculateVariance(counts),
    "Variance Difference (Top - Bottom)": calculateVarianceDifference(counts),
    "Max Hits": calculateMaxHits(counts),
    "Max Counts": calculateMaxCounts(counts),
    // Add other metrics as needed
  };

  for (const [category, value] of Object.entries(metrics)) {
    const pVal = safeLookup(category, parseFloat(value.toFixed(6)));
    if (pVal && pVal > 0) points += 1 / pVal;
  }

  return parseFloat(points.toFixed(3));
}
