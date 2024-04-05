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

    @property(cc.Node)
    GGmenu: cc.Node = null;      //  结算界面

    @property(cc.Node)
    whiteWin: cc.Node = null;      //  white win

    @property(cc.Node)
    blackWin: cc.Node = null;      //  black win

    @property(cc.Node)
    drawNode: cc.Node = null;      //  draw 和棋

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
        this.initUI();

        cc.debug.setDisplayStats(false);

        this.blockWidth = (this.node.width / (GM.vLines - 1));     // 每块区域的宽度
        this.blockHeight = (this.node.height / (GM.hLines - 1));   // 每块区域的高度

        this.initBoard();

        this.currentPlayer = GM.pieceType.BLACK;        // 黑子先手
    }

    initUI() {
        this.GGmenu.active = false;
        this.blackWin.active = false;
        this.whiteWin.active = false;
        this.drawNode.active = false;
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

        GM.numOfPiece++;

        this.boardStatus[x][y] = this.currentPlayer;

        let piece = cc.instantiate(this.piecePrefab);
        this.node.addChild(piece);
        piece.getComponent(Piece).setPic(this.currentPlayer);
        piece.setPosition(x * this.blockWidth, y * this.blockHeight);

        // 是否五子连珠
        if (this.isFIR(x, y)) {
            this.GG();
            return;
        }
        // 是否棋盘已无处落子
        if (GM.numOfPiece == GM.hLines * GM.vLines) {
            this.GG(GM.pieceType.NONE);
            return;
        }

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

    // 判断是否 Five In A Row
    // 条件1：黑子或白子完成五子连珠获胜；
    // 条件2：棋盘已无处落子，则平局。
    isFIR(x: number, y: number): boolean {

        return (
            // 水平方向 ——
            //this.horizontalFIR(x, y) ||
            this.checkFIR(x, y, 1, 0) ||
            // 竖直方向 |
            //this.verticalFIR(x, y) ||
            this.checkFIR(x, y, 0, 1) ||
            // 斜杠方向 \
            //this.slashFIR(x, y) ||
            this.checkFIR(x, y, 1, 1) ||
            // 反斜杠方向 /
            //this.backslashFIR(x, y)
            this.checkFIR(x, y, 1, -1)
        );

    }

    checkFIR(x: number, y: number, dx: number, dy: number): boolean {
        let count = 1;
        let i = x, j = y;
        // d 用于计算当前已经判断过的方向个数
        // 单次需判断两个相反的方向
        let d = 0;
        while (d < 2) {
            i += dx;
            j += dy;
            if (this.checkValid(i, j)) {
                if (this.boardStatus[i][j] == this.boardStatus[x][y]) {
                    count++;
                    if (count >= 5) return true;
                }
                else {
                    i = x; j = y; dx = -dx; dy = -dy;
                    d++;
                }
            }
            else {
                i = x; j = y; dx = -dx; dy = -dy;
                d++;
            }
        }
        return false;
    }

    // 判断坐标是否在有效值范围内
    checkValid(x: number, y: number) {
        return (x > -1 && x < GM.hLines && y > -1 && y < GM.vLines);
    }

    // 游戏结束，结算
    GG(winner: GM.pieceType = this.currentPlayer) {
        this.GGmenu.active = true;
        switch (winner) {
            case GM.pieceType.NONE:
                this.drawNode.active = true;
                break;
            case GM.pieceType.BLACK:
                this.blackWin.active = true;
                break;
            case GM.pieceType.WHITE:
                this.whiteWin.active = true;
                break;
        }
    }
}
