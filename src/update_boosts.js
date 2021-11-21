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

// Add boost values to data
for (let i = 0; i < data.length; i++) {
  console.log(`i: ${i}`);
  // If influential, add boost to 3x3 pixels
  if (check(data[i], "Influential")) {
    console.log(`influential`);

    // Sweep left to right
    for (let x = -3; x < 4; x++) {
      console.log(`x check: ${x}`);
      if ((i % 100) + x < 0) continue; // If outside left wall
      if ((i % 100) + x > 99) break; // If outside right wall

      // Sweep top to bottom
      for (let y = -300; y < 400; y = y + 100) {
        console.log(`y check: ${y}`);
        if (i + y < 0) continue; // If outside top wall
        if (i + y > 9999) break; // If outside bottom wall

        const pixel = i + y + x;
        const boostIndex = boostIndexFinder(data[pixel]);
        if (boostIndex !== -1) {
          data[pixel].attributes[boostIndex].value++;
        } else {
          data[pixel].attributes.push({ trait_type: "Boost", value: 1 });
        }
        data[pixel].description += ` Boosted by ${i + 1}.`;
      }
    }
  }
  console.log(`influential done`);

  // If load bearing, add boost to 5 pixels above
  if (check(data[i], "Load Bearing")) {
    // Sweep up
    for (let y = -500; y < 100; y = y + 100) {
      if (i + y < 0) continue; // If outside top wall

      const pixel = i + y;
      const boostIndex = boostIndexFinder(data[pixel]);
      if (boostIndex !== -1) {
        data[pixel].attributes[boostIndex].value++;
      } else {
        data[pixel].attributes.push({ trait_type: "Boost", value: 1 });
      }
      data[pixel].description += ` Boosted by ${i + 1}.`;
    }
  }
  console.log(`load bearing done`);

  // If structural support, add boost to 5 pixels left and right
  if (check(data[i], "Structural")) {
    // Sweep left to right
    for (let x = -5; x < 6; x++) {
      if ((i % 100) + x < 0) continue; // If outside left wall
      if ((i % 100) + x > 99) break; // If outside right wall

      const pixel = i + x;
      const boostIndex = boostIndexFinder(data[pixel]);
      if (boostIndex !== -1) {
        data[pixel].attributes[boostIndex].value++;
      } else {
        data[pixel].attributes.push({ trait_type: "Boost", value: 1 });
      }
      data[pixel].description += ` Boosted by ${i + 1}.`;
    }
  }
  console.log(`structural done`);

  // If queen, add boost to 3x3 pixels
  if (check(data[i], "Queen")) {
    // X,Y movements for focus
    const moveArray = [
      [-5, -500],
      [0, -500],
      [5, -500],
      [-4, -400],
      [0, -400],
      [4, -400],
      [-3, -300],
      [0, -300],
      [3, -300],
      [-2, -200],
      [0, -200],
      [2, -200],
      [-1, -100],
      [0, -100],
      [1, -100],
      [-1, 100],
      [0, 100],
      [1, 100],
      [-2, 200],
      [0, 200],
      [2, 200],
      [-3, 300],
      [0, 300],
      [3, 300],
      [-4, 400],
      [0, 400],
      [4, 400],
      [-5, 500],
      [0, 500],
      [5, 500],
    ];

    // Do each item in movement array
    for (let j = 0; j < moveArray.length; j++) {
      const x = moveArray[j][0];
      const y = moveArray[j][1];

      if ((i % 100) + x < 0) continue; // If outside left wall
      if ((i % 100) + x > 99) break; // If outside right wall

      if (i + y < 0) continue; // If outside top wall
      if (i + y > 9999) break; // If outside bottom wall

      const pixel = i + y + x;
      const boostIndex = boostIndexFinder(data[pixel]);
      if (boostIndex !== -1) {
        data[pixel].attributes[boostIndex].value++;
      } else {
        data[pixel].attributes.push({ trait_type: "Boost", value: 1 });
      }
      data[pixel].description += ` Boosted by ${i + 1}.`;
    }

    // do the 0th row
    // Sweep left to right
    for (let x = -5; x < 6; x++) {
      if ((i % 100) + x < 0) continue; // If outside left wall
      if ((i % 100) + x > 99) break; // If outside right wall

      const pixel = i + x;
      const boostIndex = boostIndexFinder(data[pixel]);
      if (boostIndex !== -1) {
        data[pixel].attributes[boostIndex].value++;
      } else {
        data[pixel].attributes.push({ trait_type: "Boost", value: 1 });
      }
      data[pixel].description += ` Boosted by ${i + 1}.`;
    }
    console.log(`queen done`);
  }
}

// Update existing files
data.forEach((item) => {
  fs.writeFileSync(
    `${basePath}/build/json/${item.edition}`,
    JSON.stringify(item, null, 2)
  );
});

fs.writeFileSync(
  `${basePath}/build/json/_metadata`,
  JSON.stringify(data, null, 2)
);
