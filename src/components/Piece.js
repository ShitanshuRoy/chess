import React from "react";
import "./css/Piece.css";
import classNames from "classnames";
export default class Square extends React.Component {
  render() {
    let pieceClass = "";
    let armyClass = "";
    if (!isNaN(parseInt(this.props.piece))) {
      pieceClass = "";
    } else {
      const symbol = this.props.piece.toUpperCase();
      switch (symbol) {
        case "P":
          pieceClass = "-pawn";
          break;
        case "R":
          pieceClass = "-rook";
          break;
        case "N":
          pieceClass = "-knight";
          break;
        case "B":
          pieceClass = "-bishop";
          break;
        case "K":
          pieceClass = "-king";
          break;
        case "Q":
          pieceClass = "-queen";
          break;
        default:
          pieceClass = "";
          break;
      }
      if (this.props.piece === this.props.piece.toUpperCase()) {
        armyClass = "-white";
      } else if (this.props.piece !== this.props.piece.toUpperCase()) {
        armyClass = "-black";
      }
    }

    let className = classNames("Piece", `Piece${pieceClass}${armyClass}`, {});

    return (
      <div
        className={className}
        ref={div => {
          this.squareDiv = div;
        }}
      />
    );
  }
}
