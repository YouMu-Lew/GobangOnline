// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { GM } from "./GM";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Piece extends cc.Component {

    @property(cc.SpriteFrame)
    blackPic = null;

    @property(cc.SpriteFrame)
    whitePic = null;

    start() {

    }

    setPic(player: GM.pieceType) {
        if (player != GM.pieceType.BLACK)
            this.node.getComponent(cc.Sprite).spriteFrame = this.whitePic;
    }

    // update (dt) {}
}
