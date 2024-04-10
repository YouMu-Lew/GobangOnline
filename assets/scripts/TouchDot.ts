import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

import Board from "./Board";

@ccclass('TouchDot')
export default class TouchDot extends Component {
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
        this.board.dotOnTouch(this.x, this.y);
    }
}