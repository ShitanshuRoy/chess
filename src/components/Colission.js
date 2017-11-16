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
      // let squareArmy =
      //   squareSymbol === squareSymbol.toUpperCase() ? "white" : "black";
      //   if(squareArmy ===army){
      //     break;
      //   }else{

      //   }
      // console.log(layout[fullPath[i].x][fullPath[i].y]);
      break;
    }
  }

  return navigablePath;
}
