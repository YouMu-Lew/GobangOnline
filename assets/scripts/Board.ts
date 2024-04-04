// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { GM } from "./GM";
import Piece from "./Piece";
import TouchDot from "./TouchDot";

const { ccclass, property } = cc._decorator;

//const hLines = 19;                       // 水平线数量
//const vLines = 19;                       // 垂直线数量

//const enum pieceType { BLACK, WHITE, NONE };

@ccclass
export default class Board extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    @property(cc.Prefab)
    touchDotPrefab: cc.Prefab = null;   // 触摸点预制体

    @property(cc.Prefab)
    piecePrefab: cc.Prefab = null;      // 棋子预制体

    blockWidth: number;
    blockHeight: number;
    boardStatus: Array<Array<GM.pieceType>> = [];
    currentPlayer: GM.pieceType;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.debug.setDisplayStats(false);

        this.blockWidth = (this.node.width / (GM.vLines - 1));     // 每块区域的宽度
        this.blockHeight = (this.node.height / (GM.hLines - 1));   // 每块区域的高度

        this.initBoard();

        this.currentPlayer = GM.pieceType.BLACK;        // 黑子先手
    }

    initBoard() {
        let tempArray: Array<GM.pieceType> = [];
        for (let y = 0; y < GM.vLines; y++) {
            tempArray = [];
            for (let x = 0; x < GM.hLines; x++) {
                tempArray.push(GM.pieceType.NONE);
                this.initTouchDot(x, y);
            }
            this.boardStatus.push(tempArray);
        }
    }

    // 添加触摸点
    initTouchDot(x: number, y: number) {
        let touchDot = cc.instantiate(this.touchDotPrefab);
        this.node.addChild(touchDot);
        touchDot.getComponent(TouchDot).init(this, x, y);
        touchDot.setPosition(x * this.blockWidth, y * this.blockHeight);
    }

    putPiece(x: number, y: number) {
        // 放置棋子
        if (!this.check(x, y))
            return;

        this.boardStatus[x][y] = this.currentPlayer;

        let piece = cc.instantiate(this.piecePrefab);
        this.node.addChild(piece);
        piece.getComponent(Piece).setPic(this.currentPlayer);
        piece.setPosition(x * this.blockWidth, y * this.blockHeight);

        if (this.isOver(x, y))
            this.GG();

        if (this.currentPlayer == GM.pieceType.BLACK) {
            this.currentPlayer = GM.pieceType.WHITE;
        }
        else {
            this.currentPlayer = GM.pieceType.BLACK;
        }
    }

    check(x: number, y: number) {
        // 查看当前位置是否可以着步
        return this.boardStatus[x][y] == GM.pieceType.NONE;
    }

    // 判断棋局是否结束
    // 条件1：黑子或白子完成五子连珠获胜；
    // 条件2：棋盘已无处落子，则平局。
    isOver(x: number, y: number): boolean {
        return false;
    }

    // 游戏结束，结算
    GG() {

    }
}
