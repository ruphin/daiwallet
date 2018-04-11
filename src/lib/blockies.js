const randseed = new Array(4);

const seedrand = seed => {
  randseed.fill(0);
  for (let i = 0; i < seed.length; i++) {
    randseed[i % 4] = (randseed[i % 4] << 5) - randseed[i % 4] + seed.charCodeAt(i);
  }
};

const rand = () => {
  let t = randseed[0] ^ (randseed[0] << 11);
  randseed[0] = randseed[1];
  randseed[1] = randseed[2];
  randseed[2] = randseed[3];
  randseed[3] = randseed[3] ^ (randseed[3] >> 19) ^ t ^ (t >> 8);
  return (randseed[3] >>> 0) / ((1 << 31) >>> 0);
};

const createColor = () => {
  const h = Math.floor(rand() * 360);
  const s = `${rand() * 60 + 40}%`;
  const l = `${(rand() + rand() + rand() + rand()) * 25}%`;
  return `hsl(${h},${s},${l})`;
};

const createImageData = size => {
  const width = size;
  const height = size;
  const dataWidth = Math.ceil(width / 2);
  const mirrorWidth = width - dataWidth;
  let data = [];
  for (let y = 0; y < height; y++) {
    let row = [];
    for (let x = 0; x < dataWidth; x++) {
      row[x] = Math.floor(rand() * 2.3);
    }
    const r = row.slice(0, mirrorWidth);
    r.reverse();
    row = row.concat(r);
    data = data.concat(row);
  }
  return data;
};

const createCanvas = (imageData, color, scale, bgcolor, spotcolor) => {
  const canvas = document.createElement('canvas');
  const width = Math.sqrt(imageData.length);
  canvas.width = canvas.height = width * scale;
  const context = canvas.getContext('2d');
  context.fillStyle = bgcolor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = color;
  imageData.forEach((data, index) => {
    const row = Math.floor(index / width);
    const col = index % width;
    context.fillStyle = data == 1 ? color : spotcolor;
    if (data) {
      context.fillRect(col * scale, row * scale, scale, scale);
    }
  });
  return canvas;
};

export const create = opts => {
  opts = opts || {};
  const size = opts.size || 8;
  const scale = opts.scale || 4;
  const seed = opts.seed || Math.floor(Math.random() * Math.pow(10, 16)).toString(16);
  seedrand(seed);
  const color = opts.color || createColor();
  const bgcolor = opts.bgcolor || createColor();
  const spotcolor = opts.spotcolor || createColor();
  const imageData = createImageData(size);
  const canvas = createCanvas(imageData, color, scale, bgcolor, spotcolor);
  return canvas;
};
