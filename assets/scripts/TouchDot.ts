import Board from "./Board";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TouchDot extends cc.Component {

    board: Board = null;

    // 坐标
    x: number;
    y: number;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    }

    start() {

    }

    init(board: Board, x: number, y: number) {
        this.board = board;
        this.x = x;
        this.y = y;
    }

    onClick() {
        this.board.putPiece(this.x, this.y);
    }

}
