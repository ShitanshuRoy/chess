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
        "rnbqk0nr/pppppppp/0000000b/00000000/00000000/00000B00/PPPPPPPP/RNBQK0NR",
      turn: "w",
      layout: [],
      boardCoordinates: {},
      mouseCoordinates: {},
      dragging: false,
      selectedPiece: "0"
    };
    this.offsets = [];
  }
  componentDidMount() {
    let level1 = this.state.fen.split("/");
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
    pos[start.x][start.y] = "0";
    pos[end.x][end.y] = "N";
    this.setState({ layout: pos });
  }
  getDraggedElement(piece) {
    console.log(piece);
    this.setState({ selectedPiece: piece });
  }

  //onClick={() => this.changelayout({ y: 1, x: 7 }, { y: 2, x: 5 })}
  handleMouseMove(event) {
    const mouseCoordinates = { x: event.pageX, y: event.pageY };
    this.setState({ mouseCoordinates: mouseCoordinates });
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
          selectedPiece: selectedPiece
        });
        const symbol = selectedPiece.toUpperCase();
        const army = selectedPiece === symbol ? "white" : "black";

        switch (symbol) {
          case "P":
            console.log("pawn");

            const pawnPathing = Pathing.pathPawn(
              Math.floor(i / 8),
              i % 8,
              army
            );
            //To test Pathing
            this.setState({ path: pawnPathing });
            break;
          case "R":
            const rookPathing = Pathing.pathRook(Math.floor(i / 8), i % 8);
            console.log(rookPathing);
            //To test Pathing
            const flattened1 = rookPathing.reduce(function(a, b) {
              return a.concat(b);
            });
            this.setState({ path: flattened1 });
            break;
          case "N":
            const knightPathing = Pathing.pathKnight(Math.floor(i / 8), i % 8);
            //To test Pathing
            this.setState({ path: knightPathing });
            break;
          case "B":
            const bishopPathing = [];
            const bishopPathingOptimistic = Pathing.pathBishop(
              Math.floor(i / 8),
              i % 8
            );
            bishopPathingOptimistic.map(path => {
              bishopPathing.push(Colission.path(path, this.state.layout, army));
            });
            //To test Pathing
            const flattened2 = bishopPathing.reduce(function(a, b) {
              return a.concat(b);
            });
            this.setState({ path: flattened2 });
            break;
          case "K":
            const kingPathing = Pathing.pathKing(Math.floor(i / 8), i % 8);
            //To test Pathing
            this.setState({ path: kingPathing });
            break;
          case "Q":
            const queenPathing = Pathing.pathQueen(Math.floor(i / 8), i % 8);
            console.log(queenPathing);
            //To test Pathing
            const flattened3 = queenPathing.reduce(function(a, b) {
              return a.concat(b);
            });
            this.setState({ path: flattened3 });
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
