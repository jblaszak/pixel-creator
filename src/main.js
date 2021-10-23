"use strict";

const path = require("path");
const isLocal = typeof process.pkg === "undefined";
const basePath = isLocal ? process.cwd() : path.dirname(process.execPath);
const fs = require("fs");
const buildDir = path.join(basePath, "/build");
console.log(path.join(basePath, "/src/config.js"));
const { baseUri, projectName, description, attributeData } = require(path.join(
  basePath,
  "/src/config.js"
));
var metadataList = [];
var attributesList = [];

const buildSetup = () => {
  if (fs.existsSync(buildDir)) {
    fs.rmdirSync(buildDir, { recursive: true });
  }
  fs.mkdirSync(buildDir);
  fs.mkdirSync(path.join(buildDir, "/json"));
  fs.mkdirSync(path.join(buildDir, "/images"));
};

const addMetadata = (_edition) => {
  let dateTime = Date.now();
  let tempMetadata = {
    name: `${projectName} #${_edition}`,
    description: description,
    image: `${baseUri}/${_edition}.svg`,
    edition: _edition,
    date: dateTime,
    attributes: attributesList,
  };
  metadataList.push(tempMetadata);
  attributesList = [];
};

const addAttribute = (type, value) => {
  attributesList.push({
    trait_type: type,
    value: value,
  });
};

const writeMetaData = (_data) => {
  fs.writeFileSync(`${buildDir}/json/_metadata.json`, _data);
};

const saveMetaDataSingleFile = (_editionCount) => {
  let metadata = metadataList.find((meta) => meta.edition == _editionCount);

  fs.writeFileSync(
    `${buildDir}/json/${_editionCount}.json`,
    JSON.stringify(metadata, null, 2)
  );
};

const atts = [
  "Diagonal",
  "Edge",
  "42",
  "Musky",
  "Dead",
  "Flashy",
  "Hand Crafted",
  "Influential",
];
const coins = [
  "LUNA",
  "AVAX",
  "LINK",
  "UNI",
  "ETH",
  "ADA",
  "LTC",
  "DOT",
  "BTC",
  "BNB",
  "DOGE",
  "SOL",
  "XRP",
  "ALGO",
  "ATOM",
];

const startCreating = async () => {
  for (let i = 0; i < 21 * 10000; i += 21) {
    let pixel = {};

    pixel["R"] = +attributeData.slice(i, i + 3);
    addAttribute("R", pixel["R"]);
    pixel["G"] = +attributeData.slice(i + 3, i + 6);
    addAttribute("G", pixel["G"]);
    pixel["B"] = +attributeData.slice(i + 6, i + 9);
    addAttribute("B", pixel["B"]);
    addAttribute("From Center", +attributeData.slice(i + 9, i + 11));
    // for all attributes in atts list
    let isDead = false;
    let isFlashy = false;
    for (const att of atts) {
      if (attributeData[i + 11 + atts.indexOf(att)] === "1") {
        addAttribute(att, true);
        if (att === "Dead") isDead = true;
        if (att === "Flashy") isFlashy = true;
      }
    }

    const coinVal = +attributeData.slice(i + 19, i + 21);
    if (coinVal) {
      addAttribute("Coin", coins[coinVal - 1]);
    }

    let fillColor = `rgb(${pixel["R"]},${pixel["G"]},${pixel["B"]})`;
    if (isDead) {
      fillColor = "#000";
    }

    const regularRect = `<rect width='1' height='1' fill='${fillColor}' />`;
    const flashyRect = `<rect width='1' height='1'><animate attributeName='fill' values='red;yellow;green;blue;red' dur='2s' repeatCount='indefinite' /></rect>`;
    const data = `<svg viewbox='0 0 1 1' xmlns='http://www.w3.org/2000/svg'>${
      isFlashy ? flashyRect : regularRect
    }</svg>`;

    const edition = i / 21 + 1;

    fs.writeFileSync(`${buildDir}/images/${edition}.svg`, data);
    addMetadata(edition);
    saveMetaDataSingleFile(edition);
  }

  writeMetaData(JSON.stringify(metadataList, null, 2));
};

module.exports = { startCreating, buildSetup };
