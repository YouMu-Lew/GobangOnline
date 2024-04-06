// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

import { GM } from "./GM";

@ccclass('Piece')
export default class Piece extends Component {
    @property(SpriteFrame)
    blackPic = null;
    @property(SpriteFrame)
    whitePic = null;
    start() {

    }
    setPic(player: GM.pieceType) {
        if (player != GM.pieceType.BLACK)
            this.node.getComponent(Sprite).spriteFrame = this.whitePic;
    }
    //    // update (dt) {}
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html
// 
// import { GM } from "./GM";
// 
// const { ccclass, property } = cc._decorator;
// 
// @ccclass
// export default class Piece extends cc.Component {
// 
//     @property(cc.SpriteFrame)
//     blackPic = null;
// 
//     @property(cc.SpriteFrame)
//     whitePic = null;
// 
//     start() {
// 
//     }
// 
//     setPic(player: GM.pieceType) {
//         if (player != GM.pieceType.BLACK)
//             this.node.getComponent(cc.Sprite).spriteFrame = this.whitePic;
//     }
// 
//     // update (dt) {}
// }
