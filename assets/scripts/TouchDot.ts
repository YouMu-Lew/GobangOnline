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
        this.board.putPiece(this.x, this.y);
    }
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// import Board from "./Board";
// 
// const { ccclass, property } = cc._decorator;
// 
// @ccclass
// export default class TouchDot extends cc.Component {
// 
//     board: Board = null;
// 
//     // 坐标
//     x: number;
//     y: number;
// 
//     // LIFE-CYCLE CALLBACKS:
// 
//     onLoad() {
// 
//     }
// 
//     start() {
// 
//     }
// 
//     init(board: Board, x: number, y: number) {
//         this.board = board;
//         this.x = x;
//         this.y = y;
//     }
// 
//     onClick() {
//         this.board.putPiece(this.x, this.y);
//     }
// 
// }
