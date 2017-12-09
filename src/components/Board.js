import React from "react";
import Square from "./Square";
import * as Pathing from "./Pathing.js";
import * as Colission from "./Colission.js";
import "./css/Board.css";
export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fen:
        "0nbqk0nr/p0pppp0p/rp000N0b/0p000R00/0PQ00nK0/P00k0B00/00PPPPPP/RNB0K0NR",
      turn: "w",
      layout: [],
      boardCoordinates: {},
      mouseCoordinates: {},
      dragging: false,
      selectedPiece: "0",
      validTarget: false
    };
    this.offsets = [];
  }
  componentDidMount() {
    console.log("component mounted");
    let layout = this.state.fen.split("/").map(rank => {
      return rank.split("");
      // if (isNaN(parseInt(level3))) {
      //   console.log(level3);
      //   return level3;
      // } else {
      //   let tempArr = [];
      //   for (let k = 0; k < parseInt(level3); k++) {
      //     tempArr.push("nul");
      //   }
      //   return tempArr;
      // }
    });

    this.setState({ layout: layout });
    const boardCoordinates = {
      top: this.boardDiv.offsetTop,
      bottom: this.boardDiv.offsetHeight + this.boardDiv.offsetTop,
      left: this.boardDiv.offsetLeft,
      right: this.boardDiv.offsetWidth + this.boardDiv.offsetLeft
    };
    this.setState({ boardCoordinates: boardCoordinates });
  }
  updateOffset(offset) {
    this.offsets.push(offset);
  }
  changeLayout(start, end) {
    let pos = this.state.layout;
    let temp = (pos[start.x][start.y] = "0");
    pos[end.x][end.y] = this.state.selectedPiece;
    this.setState({ layout: pos }, () => {
      this.resetSoft();
    });
  }
  resetSoft() {
    this.setState({ path: [], selectedCoordinates: false });
  }
  getDraggedElement(piece) {
    this.setState({ selectedPiece: piece });
  }

  //onClick={() => this.changelayout({ y: 1, x: 7 }, { y: 2, x: 5 })}
  handleMouseMove(event) {
    const mouseCoordinates = { x: event.pageX, y: event.pageY };
    this.setState({ mouseCoordinates: mouseCoordinates });
    if (this.state.dragging) {
      this.offsets.forEach((offset, i) => {
        if (
          this.state.mouseCoordinates.x > offset.left &&
          this.state.mouseCoordinates.x < offset.right &&
          this.state.mouseCoordinates.y > offset.top &&
          this.state.mouseCoordinates.y < offset.bottom
        ) {
          if (
            this.state.path.filter(
              path => path.x === Math.floor(i / 8) && path.y === i % 8
            )[0]
          ) {
            this.setState({
              validTarget: { x: Math.floor(i / 8), y: i % 8 }
            });
            console.log(this.state.layout[Math.floor(i / 8)][i % 8]);
          } else {
            this.setState({ validTarget: false });
          }
          // console.log(
          //   "hasEnemy:" +
          //     this.state.path.includes({
          //       x: Math.floor(i / 8),
          //       y: i % 8,
          //       hasEnemy: true
          //     })
          // );
          // console.log(
          //   "doesNothaveEnemy:" +
          //     this.state.path.includes({
          //       x: Math.floor(i / 8),
          //       y: i % 8,
          //       hasEnemy: false
          //     })
          // );
        }
      });
    }
  }
  handleMouseLeave() {
    this.setState({ mouseCoordinates: {} });
    this.setState({ draggedCoordinates: {} });
    this.setState({ dragging: false });
  }
  handleMouseDown(event) {
    this.setState({ dragging: true });
    const mouseCoordinates = { x: event.pageX, y: event.pageY };
    this.setState({ draggedCoordinates: mouseCoordinates });
    this.offsets.forEach((offset, i) => {
      if (
        this.state.mouseCoordinates.x > offset.left &&
        this.state.mouseCoordinates.x < offset.right &&
        this.state.mouseCoordinates.y > offset.top &&
        this.state.mouseCoordinates.y < offset.bottom
      ) {
        const selectedPiece = this.state.layout[Math.floor(i / 8)][i % 8];
        //console.log(this.state.layout[Math.floor(i / 8)][i % 8]);
        // console.log(this.state.layout[0][1]);

        this.setState({
          selectedPiece: selectedPiece,
          selectedCoordinates: { x: Math.floor(i / 8), y: i % 8 }
        });
        const symbol = selectedPiece.toUpperCase();
        const army = selectedPiece === symbol ? "white" : "black";

        switch (symbol) {
          case "P":
            console.log("pawn");
            const pawnPathing = [];
            const pawnPathingOptimistic = Pathing.pathPawn(
              Math.floor(i / 8),
              i % 8,
              army
            );
            pawnPathing.push(
              Colission.pawnCollision(
                pawnPathingOptimistic,
                this.state.layout,
                army
              )
            );
            //To test Pathing
            this.setState({
              path: pawnPathing.reduce(function(a, b) {
                return a.concat(b);
              })
            });
            break;
          case "R":
            const rookPathingOptimistic = Pathing.pathRook(
              Math.floor(i / 8),
              i % 8
            );
            const rookPathing = rookPathingOptimistic.map(path => {
              return Colission.path(path, this.state.layout, army);
            });
            //To test Pathing

            this.setState({
              path: rookPathing.reduce(function(a, b) {
                return a.concat(b);
              })
            });
            break;
          case "N":
            const knightPathing = [];
            const knightPathingOptimistic = Pathing.pathKnight(
              Math.floor(i / 8),
              i % 8
            );
            knightPathing.push(
              Colission.points(knightPathingOptimistic, this.state.layout, army)
            );

            //To test Pathing
            this.setState({
              path: knightPathing.reduce(function(a, b) {
                return a.concat(b);
              })
            });
            break;
          case "B":
            const bishopPathingOptimistic = Pathing.pathBishop(
              Math.floor(i / 8),
              i % 8
            );
            const bishopPathing = bishopPathingOptimistic.map(path => {
              return Colission.path(path, this.state.layout, army);
            });
            //To test Pathing

            this.setState({
              path: bishopPathing.reduce(function(a, b) {
                return a.concat(b);
              })
            });
            break;
          case "K":
            const kingPathing = [];
            const kingPathingOptimistic = Pathing.pathKing(
              Math.floor(i / 8),
              i % 8
            );

            kingPathing.push(
              Colission.points(kingPathingOptimistic, this.state.layout, army)
            );

            //To test Pathing
            this.setState({
              path: kingPathing
            });
            //To test Pathing
            this.setState({
              path: kingPathing.reduce(function(a, b) {
                return a.concat(b);
              })
            });
            break;
          case "Q":
            const queenPathing = [];
            const queenPathingOptimistic = Pathing.pathQueen(
              Math.floor(i / 8),
              i % 8
            );
            queenPathingOptimistic.map(path => {
              queenPathing.push(Colission.path(path, this.state.layout, army));
            });

            //To test Pathing
            this.setState({
              path: queenPathing.reduce(function(a, b) {
                return a.concat(b);
              })
            });
            break;
          default:
            console.log("none");
            break;
        }
      } else {
        // DRAGGED = false;
      }
    });
  }
  handleMouseUp() {
    if (this.state.validTarget) {
      this.changeLayout(this.state.selectedCoordinates, this.state.validTarget);
    }
    this.setState({ dragging: false });
    this.setState({ draggedCoordinates: {} });
  }
  render() {
    let black = false;
    return (
      <div
        className="Board"
        ref={div => {
          this.boardDiv = div;
        }}
        onMouseMove={e => this.handleMouseMove(e)}
        onMouseLeave={() => this.handleMouseLeave()}
        onMouseDown={e => this.handleMouseDown(e)}
        onMouseUp={() => this.handleMouseUp()}
      >
        {this.state.layout.map((s, i) => {
          let isEven = i % 2 === 0 ? true : false;
          let x1 = i;
          return s.map((k, i) => {
            let adjustRowEven = i;
            if (isEven) {
              adjustRowEven = i + 1;
            }
            black = adjustRowEven % 2 === 0 ? true : false;
            return (
              <Square
                key={i}
                piece={k}
                black={black}
                updateOffset={offset => this.updateOffset(offset)}
                mouseCoordinates={this.state.mouseCoordinates}
                dragging={this.state.dragging}
                draggedCoordinates={this.state.draggedCoordinates}
                getDraggedElement={piece => this.getDraggedElement(piece)}
                coOrdinates={{ x: x1, y: i }}
                path={this.state.path}
              />
            );
          });
        })}
      </div>
    );
  }
}
