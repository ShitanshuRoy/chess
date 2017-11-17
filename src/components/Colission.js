export function path(path, layout, army) {
  const fullPath = path;
  const navigablePath = [];
  for (let i = 0; i < fullPath.length; i++) {
    const squareSymbol = layout[fullPath[i].x][fullPath[i].y];

    if (squareSymbol === 0 || squareSymbol === "0") {
      navigablePath.push({
        x: fullPath[i].x,
        y: fullPath[i].y,
        hasEnemy: false
      });
    } else {
      let squareArmy = "";
      if (squareSymbol === squareSymbol.toUpperCase()) {
        squareArmy = "white";
      } else {
        squareArmy = "black";
      }
      if (squareArmy !== army) {
        navigablePath.push({
          x: fullPath[i].x,
          y: fullPath[i].y,
          hasEnemy: true
        });
        break;
      } else {
        break;
      }
    }
  }
  return navigablePath;
}

export function points(points, layout, army) {
  const allPoints = points;
  const navigablePoints = [];
  for (let i = 0; i < allPoints.length; i++) {
    const squareSymbol = layout[allPoints[i].x][allPoints[i].y];

    if (squareSymbol === 0 || squareSymbol === "0") {
      navigablePoints.push({
        x: allPoints[i].x,
        y: allPoints[i].y,
        hasEnemy: false
      });
    } else {
      let squareArmy = "";
      if (squareSymbol === squareSymbol.toUpperCase()) {
        squareArmy = "white";
      } else {
        squareArmy = "black";
      }
      if (squareArmy !== army) {
        navigablePoints.push({
          x: allPoints[i].x,
          y: allPoints[i].y,
          hasEnemy: true
        });
      }
    }
  }

  return navigablePoints;
}

export function pawnCollision(path, layout, army) {
  const fullPath = path;
  const navigablePath = [];
  for (let i = 0; i < fullPath.length; i++) {
    const squareSymbol = layout[fullPath[i].x][fullPath[i].y];

    if (squareSymbol === 0 || squareSymbol === "0") {
      navigablePath.push({
        x: fullPath[i].x,
        y: fullPath[i].y,
        hasEnemy: false
      });
      // } else {
      //   let squareArmy = "";
      //   if (squareSymbol === squareSymbol.toUpperCase()) {
      //     squareArmy = "white";
      //   } else {
      //     squareArmy = "black";
      //   }
      //   if (squareArmy !== army) {
      //     navigablePath.push({
      //       x: fullPath[i].x,
      //       y: fullPath[i].y,
      //       hasEnemy: true
      //     });
      //     break;
      //   } else {
      //     break;
      //   }
      // }
    }
    if (i === 0) {
      if (
        layout[fullPath[i].x][fullPath[i].y + 1] !== 0 &&
        layout[fullPath[i].x][fullPath[i].y + 1] !== "0" &&
        fullPath[i].y + 1 < 8
      ) {
        const squareRightSymbol = layout[fullPath[i].x][fullPath[i].y + 1];
        let squareRightArmy = "";
        if (squareRightSymbol === squareRightSymbol.toUpperCase()) {
          squareRightArmy = "white";
        } else {
          squareRightArmy = "black";
        }
        if (army !== squareRightArmy) {
          navigablePath.push({
            x: fullPath[i].x,
            y: fullPath[i].y + 1,
            hasEnemy: true
          });
        }
      }
      if (
        layout[fullPath[i].x][fullPath[i].y - 1] !== 0 &&
        layout[fullPath[i].x][fullPath[i].y - 1] !== "0" &&
        fullPath[i].y - 1 >= 0
      ) {
        const squareLeftSymbol = layout[fullPath[i].x][fullPath[i].y - 1];
        let squareLeftArmy = "";
        if (squareLeftSymbol === squareLeftSymbol.toUpperCase()) {
          squareLeftArmy = "white";
        } else {
          squareLeftArmy = "black";
        }
        if (army !== squareLeftArmy) {
          navigablePath.push({
            x: fullPath[i].x,
            y: fullPath[i].y - 1,
            hasEnemy: true
          });
        }
      }
    }
    return navigablePath;
  }
}
