import React from "react";
import Square from "./Square";
import Piece from "./Piece";
import * as Pathing from "./Pathing.js";
import * as Colission from "./Colission.js";
import "./css/Board.css";
export default class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fen:
                // "0nbqk0nr/p0pppp0p/rp000N0b/0p000R00/0PQ00nK0/P00k0B00/00PPPPPP/RNB0K0NR",
                "rnbqkbnr/pppppppp/00000000/00000000/00000000/00000000/PPPPPPPP/RNBQKBNR",
            turn: "w",
            layout: [],
            boardCoordinates: {},
            mouseCoordinates: {},
            dragging: false,
            selectedPiece: "0",
            validTarget: false,
            fallenWhite: [],
            fallenBlack: [],
            inCheck: null
        };
        this.offsets = [];
    }
    componentDidMount() {
        let layout = this.state.fen.split("/").map(rank => {
            return rank.split("");
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
        if (!(start.x === end.x && start.y === end.y)) {
            let pos = this.state.layout;
            pos[start.x][start.y] = "0";
            //ADD ELIMINATED PIECES LOGIC GOES HERE

            if (Colission.hasPiece(pos[end.x][end.y])) {
                if (Colission.checkArmy(pos[end.x][end.y]) === "white") {
                    let fallenWhite = this.state.fallenWhite;
                    fallenWhite.push(pos[end.x][end.y]);

                    this.setState({ fallenWhite });
                } else {
                    const fallenBlack = this.state.fallenBlack;
                    fallenBlack.push(pos[end.x][end.y]);
                    this.setState({ fallenBlack });
                }
            }
            pos[end.x][end.y] = this.state.selectedPiece;

            this.setState({ layout: pos }, () => {
                this.resetSoft();
            });
        }
    }
    resetSoft() {
        this.setState({
            path: [],
            selectedCoordinates: false,
            validTarget: false
        });
    }
    getDraggedElement(piece) {
        this.setState({ selectedPiece: piece });
    }
    setNavigablePath = pathing => {
        this.setState({
            path: pathing.reduce((a, b) => {
                return a.concat(b);
            })
        });
    };
    getNavigablePath = pathing => {
        return pathing.reduce((a, b) => {
            return a.concat(b);
        });
    };
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
                            path =>
                                path.x === Math.floor(i / 8) && path.y === i % 8
                        )[0]
                    ) {
                        this.setState({
                            validTarget: { x: Math.floor(i / 8), y: i % 8 }
                        });
                    } else {
                        this.setState({ validTarget: false });
                    }
                }
            });
        }
    }
    handleMouseLeave() {
        this.setState({ mouseCoordinates: {} });
        this.setState({ draggedCoordinates: {} });
        this.setState({ dragging: false });
    }
    getAllPaths = () => {
        const filterLayout = [].concat(
            ...this.state.layout.map((row, i) => {
                return row
                    .map((column, j) => {
                        return { column, i, j };
                    })
                    .filter(val => {
                        return val.column !== "0";
                    });
            })
        );

        const checkMap = filterLayout.map(val => {
            const { i, j, column } = val;

            const army = column === column.toUpperCase() ? "white" : "black";

            switch (column.toUpperCase()) {
                case "P":
                    const pawnPathing = [];
                    const pawnPathingOptimistic = Pathing.pathPawn(i, j, army);
                    pawnPathing.push(
                        Colission.pawnCollision(
                            pawnPathingOptimistic,
                            this.state.layout,
                            army
                        )
                    );
                    return {
                        piece: column,
                        path: this.getNavigablePath(pawnPathing)
                    };
                    break;
                case "R":
                    const rookPathingOptimistic = Pathing.pathRook(i, j);
                    const rookPathing = rookPathingOptimistic.map(path => {
                        return Colission.path(path, this.state.layout, army);
                    });
                    return {
                        piece: column,
                        path: this.getNavigablePath(rookPathing)
                    };
                    break;
                case "N":
                    const knightPathing = [];
                    const knightPathingOptimistic = Pathing.pathKnight(i, j);
                    knightPathing.push(
                        Colission.points(
                            knightPathingOptimistic,
                            this.state.layout,
                            army
                        )
                    );
                    return {
                        piece: column,
                        path: this.getNavigablePath(knightPathing)
                    };

                    break;
                case "B":
                    const bishopPathingOptimistic = Pathing.pathBishop(i, j);
                    const bishopPathing = bishopPathingOptimistic.map(path => {
                        return Colission.path(path, this.state.layout, army);
                    });
                    //To test Pathing
                    return {
                        piece: column,
                        path: this.getNavigablePath(bishopPathing)
                    };

                    break;
                case "K":
                    const kingPathing = [];
                    const kingPathingOptimistic = Pathing.pathKing(i, j);

                    kingPathing.push(
                        Colission.points(
                            kingPathingOptimistic,
                            this.state.layout,
                            army
                        )
                    );
                    return {
                        piece: column,
                        path: this.getNavigablePath(kingPathing)
                    };
                    break;
                case "Q":
                    const queenPathingOptimistic = Pathing.pathQueen(i, j);
                    const queenPathing = queenPathingOptimistic.map(path => {
                        return Colission.path(path, this.state.layout, army);
                    });

                    return {
                        piece: column,
                        path: this.getNavigablePath(queenPathing)
                    };
                    break;
                default:
                    console.log("none");
                    break;
            }
        });

        const checks = checkMap
            .map(val => {
                return val.path.map(value => {
                    return { piece: val.piece, data: value };
                });
            })
            .filter(val => {
                return val
                    .map(val1 => {
                        return val1.data.hasKing;
                    })
                    .includes(true);
            });
        console.log(checks);
        if (checks.length > 0) {
            if (checks[0][0].piece === checks[0][0].piece.toUpperCase()) {
                this.setState({ inCheck: "black" });
            } else {
                this.setState({ inCheck: "white" });
            }
        } else {
            this.setState({ inCheck: null });
        }
    };

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
                const selectedPiece = this.state.layout[Math.floor(i / 8)][
                    i % 8
                ];

                this.setState({
                    selectedPiece: selectedPiece,
                    selectedCoordinates: { x: Math.floor(i / 8), y: i % 8 }
                });
                const symbol = selectedPiece.toUpperCase();
                const army = selectedPiece === symbol ? "white" : "black";

                switch (symbol) {
                    case "P":
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
                            path: pawnPathing.reduce((a, b) => {
                                return a.concat(b);
                            })
                        });
                        this.setNavigablePath(pawnPathing);
                        break;
                    case "R":
                        const rookPathingOptimistic = Pathing.pathRook(
                            Math.floor(i / 8),
                            i % 8
                        );
                        const rookPathing = rookPathingOptimistic.map(path => {
                            return Colission.path(
                                path,
                                this.state.layout,
                                army
                            );
                        });
                        //To test Pathing
                        this.setNavigablePath(rookPathing);
                        break;
                    case "N":
                        const knightPathing = [];
                        const knightPathingOptimistic = Pathing.pathKnight(
                            Math.floor(i / 8),
                            i % 8
                        );
                        knightPathing.push(
                            Colission.points(
                                knightPathingOptimistic,
                                this.state.layout,
                                army
                            )
                        );

                        this.setNavigablePath(knightPathing, army);
                        break;
                    case "B":
                        const bishopPathingOptimistic = Pathing.pathBishop(
                            Math.floor(i / 8),
                            i % 8
                        );
                        const bishopPathing = bishopPathingOptimistic.map(
                            path => {
                                return Colission.path(
                                    path,
                                    this.state.layout,
                                    army
                                );
                            }
                        );
                        //To test Pathing
                        this.setNavigablePath(bishopPathing, army);
                        break;
                    case "K":
                        const kingPathing = [];
                        const kingPathingOptimistic = Pathing.pathKing(
                            Math.floor(i / 8),
                            i % 8
                        );

                        kingPathing.push(
                            Colission.points(
                                kingPathingOptimistic,
                                this.state.layout,
                                army
                            )
                        );
                        this.setNavigablePath(kingPathing, army);
                        break;
                    case "Q":
                        const queenPathingOptimistic = Pathing.pathQueen(
                            Math.floor(i / 8),
                            i % 8
                        );
                        const queenPathing = queenPathingOptimistic.map(
                            path => {
                                return Colission.path(
                                    path,
                                    this.state.layout,
                                    army
                                );
                            }
                        );

                        this.setNavigablePath(queenPathing, army);
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
            this.changeLayout(
                this.state.selectedCoordinates,
                this.state.validTarget
            );
        }
        this.setState({ dragging: false });
        this.setState({ draggedCoordinates: {} });
        this.getAllPaths();
        this.resetSoft();
    }
    render() {
        let black = false;

        return (
            <div className="Board-holder">
                <div className="Board-fallen-pieces">
                    {this.state.fallenWhite &&
                        this.state.fallenWhite.map(piece => {
                            return <Piece piece={piece} />;
                        })}
                </div>
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
                                    updateOffset={offset =>
                                        this.updateOffset(offset)
                                    }
                                    mouseCoordinates={
                                        this.state.mouseCoordinates
                                    }
                                    dragging={this.state.dragging}
                                    validDragOver={this.state.validTarget}
                                    getDraggedElement={piece =>
                                        this.getDraggedElement(piece)
                                    }
                                    coOrdinates={{ x: x1, y: i }}
                                    path={this.state.path}
                                />
                            );
                        });
                    })}
                </div>
                <div className="Board-fallen-pieces">
                    {this.state.fallenBlack &&
                        this.state.fallenBlack.map(piece => {
                            return <Piece piece={piece} />;
                        })}
                </div>
            </div>
        );
    }
}
