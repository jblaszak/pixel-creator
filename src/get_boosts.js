const basePath = process.cwd();
const fs = require("fs");

// read json data
let rawdata = fs.readFileSync(`${basePath}/build/json/_metadata`);
let data = JSON.parse(rawdata);

// Check if pixel contains attribute
const check = (pixel, att) =>
  pixel.attributes.some((e) => e.trait_type === att);

// Find index of boost trait in array
const boostIndexFinder = (pixel) =>
  pixel.attributes.findIndex((e) => e.trait_type === "Boost");

let boostCounts = {};
let totalBoosts = 0;

for (let i = 0; i < data.length; i++) {
  const index = boostIndexFinder(data[i]);
  //   console.log(index);
  if (index !== -1) {
    const value = data[i].attributes[index].value;
    if (boostCounts[value]) {
      boostCounts[value]++;
    } else {
      boostCounts[value] = 1;
    }

    totalBoosts += value;
  }
}

console.log(boostCounts);
console.log(totalBoosts);
