const createMazeBtn = document.querySelector("button");
const grid = document.querySelector(".grid");
const directions = {
  Top: { current: "Top", path: "Bottom", move: [-1, 0] },
  Bottom: { current: "Bottom", path: "Top", move: [1, 0] },
  Right: { current: "Right", path: "Left", move: [0, 1] },
  Left: { current: "Left", path: "Right", move: [0, -1] },
};
let gridBlocks = [];
let nodes = [];
let size = 0;
async function getUserInput() {
  const input = document.querySelector("input");
  size = input.value;
}

async function drawGrid() {
  await getUserInput();

  grid.innerHTML = ``;
  grid.style.gridTemplateColumns = `repeat(${size}, 40px)`;
  grid.style.gridTemplateRows = `repeat(${size}, 40px)`;
  for (let i = 0; i < size * size; i++) {
    const block = document.createElement("div");
    grid.appendChild(block);
  }
  nodes = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => 0),
  );
  gridBlocks = Array.from(grid.children);
  const begin = new Date();
  await drawMaze("Top", 0, 0);
  console.log(new Date() - begin + "ms");
}

// The delay between each move
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const sleepTime = 10;
async function getRandomDis(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  const randomValue = arr[randomIndex];
  const randomDis = directions[randomValue];
  arr.splice(randomIndex, 1);
  return randomDis;
}
async function drawMaze(source, row, col) {
  if (row >= size || row < 0 || col >= size || col < 0 || nodes[row][col] == 1)
    return false;
  nodes[row][col] = 1;
  let index = row * size + col;
  gridBlocks[index].classList.add(`hide-${source.toLowerCase()}`);
  gridBlocks[index].classList.add(`track`);
  const arr = Object.keys(directions);
  await sleep(sleepTime);
  while (true) {
    index = row * size + col;
    gridBlocks[index].classList.remove(`track`);
    if (arr.length == 0) {
      return true;
    }
    const randomDir = await getRandomDis(arr);
    const current = randomDir.current;
    const path = randomDir.path;

    if (current == source) {
      continue;
    }
    gridBlocks[index].classList.add(`hide-${current.toLowerCase()}`);
    if (
      !(await drawMaze(path, row + randomDir.move[0], col + randomDir.move[1]))
    ) {
      if (
        row + randomDir.move[0] >= size ||
        row + randomDir.move[0] < 0 ||
        col + randomDir.move[1] >= size ||
        col + randomDir.move[1] < 0
      ) {
        gridBlocks[index].classList.remove(`hide-${current.toLowerCase()}`);
      } else {
        gridBlocks[index].classList.remove(`hide-${current.toLowerCase()}`);

        index = (row + randomDir.move[0]) * size + (col + randomDir.move[1]);
        gridBlocks[index].classList.remove(`hide-${path.toLowerCase()}`);
      }
    } else {
      gridBlocks[index].classList.add(`track`);
      await sleep(sleepTime);
      gridBlocks[index].classList.remove(`track`);
    }
    ////////////
  }
}

createMazeBtn.addEventListener("click", async (e) => {
  grid.innerHTML = ``;
  await drawGrid();
});
