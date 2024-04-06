export namespace GM {

    export const enum pieceType { BLACK, WHITE, NONE };

    export const hLines = 19;                       // 水平线数量
    export const vLines = 19;                       // 垂直线数量

    // 棋盘上落子总数
    let numOfPiece: number = 0;

    export function getNumOfPiece(): number {
        return numOfPiece;
    }

    export function addNumOfPiece(): void {
        numOfPiece++;
    }
}
