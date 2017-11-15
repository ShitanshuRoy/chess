export function pathKnight(x, y) {
  const pathArray = [];
  x + 2 < 8 && y + 1 < 8
    ? pathArray.push({ x: x + 2, y: y + 1 })
    : "outSideBoard";
  x + 2 < 8 && y - 1 >= 0
    ? pathArray.push({ x: x + 2, y: y - 1 })
    : "outSideBoard";
  x - 2 >= 0 && y + 1 < 8
    ? pathArray.push({ x: x - 2, y: y + 1 })
    : "outSideBoard";
  x - 2 >= 0 && y - 1 >= 0
    ? pathArray.push({ x: x - 2, y: y - 1 })
    : "outSideBoard";
  x + 1 < 8 && y + 2 < 8
    ? pathArray.push({ x: x + 1, y: y + 2 })
    : "outSideBoard";
  x + 1 < 8 && y - 2 >= 0
    ? pathArray.push({ x: x + 1, y: y - 2 })
    : "outSideBoard";
  x - 1 >= 0 && y + 2 < 8
    ? pathArray.push({ x: x - 1, y: y + 2 })
    : "outSideBoard";
  x - 1 >= 0 && y - 2 >= 0
    ? pathArray.push({ x: x - 1, y: y - 2 })
    : "outSideBoard";
  return pathArray;
}

export function pathBishop(x, y) {
  const allPaths = [];
  let pathArray = [];
  let x1 = x;
  let y1 = y;
  while (x1 < 7 && y1 < 7) {
    x1++;
    y1++;

    pathArray.push({ x: x1, y: y1 });
  }
  allPaths.push(pathArray);
  pathArray = [];
  x1 = x;
  y1 = y;
  while (x1 < 7 && y1 > 0) {
    x1++;
    y1--;
    pathArray.push({ x: x1, y: y1 });
  }
  allPaths.push(pathArray);
  pathArray = [];
  x1 = x;
  y1 = y;
  while (x1 > 0 && y1 < 7) {
    x1--;
    y1++;
    pathArray.push({ x: x1, y: y1 });
  }
  allPaths.push(pathArray);
  pathArray = [];
  x1 = x;
  y1 = y;
  while (x1 > 0 && y1 > 0) {
    x1--;
    y1--;
    pathArray.push({ x: x1, y: y1 });
  }
  allPaths.push(pathArray);
  pathArray = [];
  return allPaths;
}

export function pathRook(x, y) {
  const allPaths = [];
  let pathArray = [];
  let x1 = x;
  let y1 = y;
  while (x1 < 7) {
    x1++;
    pathArray.push({ x: x1, y: y1 });
  }
  allPaths.push(pathArray);
  pathArray = [];
  x1 = x;
  y1 = y;
  while (y1 > 0) {
    y1--;
    pathArray.push({ x: x1, y: y1 });
  }
  allPaths.push(pathArray);
  pathArray = [];
  x1 = x;
  y1 = y;
  while (y1 < 7) {
    y1++;
    pathArray.push({ x: x1, y: y1 });
  }
  allPaths.push(pathArray);
  pathArray = [];
  x1 = x;
  y1 = y;
  while (x1 > 0) {
    x1--;
    pathArray.push({ x: x1, y: y1 });
  }
  allPaths.push(pathArray);
  pathArray = [];
  return allPaths;
}
export function pathQueen(x, y) {
  const horizontalPathing = pathRook(x, y);
  const diagonalPathing = pathBishop(x, y);
  const allPaths = horizontalPathing;
  diagonalPathing.map(path => {
    allPaths.push(path);
  });
  return allPaths;
}
export function pathKing(x, y) {
  const pathArray = [];
  x + 1 < 8 && y + 1 < 8
    ? pathArray.push({ x: x + 1, y: y + 1 })
    : "outSideBoard";
  x + 1 < 8 && y - 1 >= 0
    ? pathArray.push({ x: x + 1, y: y - 1 })
    : "outSideBoard";
  x - 1 >= 0 && y + 1 < 8
    ? pathArray.push({ x: x - 1, y: y + 1 })
    : "outSideBoard";
  x - 1 >= 0 && y - 1 >= 0
    ? pathArray.push({ x: x - 1, y: y - 1 })
    : "outSideBoard";
  x + 1 < 8 ? pathArray.push({ x: x + 1, y: y }) : "outSideBoard";
  y - 1 >= 0 ? pathArray.push({ x: x, y: y - 1 }) : "outSideBoard";
  x - 1 >= 0 ? pathArray.push({ x: x - 1, y: y }) : "outSideBoard";
  y + 1 < 8 ? pathArray.push({ x: x, y: y + 1 }) : "outSideBoard";
  return pathArray;
}

// function bishopCollision(x1, y1, layout, army) {
//   const pathArray = [];
//   let army1 = "";
//   console.log(x1);
//   console.log(y1);
//   console.log(layout[x1][y1]);
//   if (layout[x1][y1] === 0 || layout[x1][y1] === "0") {
//     pathArray.push({ x: x1, y: y1 });
//   } else {
//     if (layout[x1][y1] === layout[x1][y1].toUpperCase()) {
//       army1 = "white";
//     } else {
//       army1 = "black";
//     }
//     if (army === army1) {
//       return;
//     } else {
//       pathArray.push({ x: x1, y: y1 });
//       return;
//     }
//   }
//   return pathArray;
// }
