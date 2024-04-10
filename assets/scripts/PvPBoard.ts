// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Prefab } from 'cc';
import * as cc from 'cc';
const { ccclass, property } = _decorator;

import { GM } from "./GM";
import Piece from "./Piece";
import TouchDot from "./TouchDot";
import { global } from '../hw-gobe/script/hw_gobe_global_data';
import { RoomUserItem } from '../hw-gobe/script/room_user_item';
import Board from './Board';
const hLines = 19;                       // 水平线数量
const vLines = 19;                       // 垂直线数量
const enum pieceType { BLACK, WHITE, NONE };

@ccclass('PvPBoard')
export default class PvPBoard extends Board {

    private _myPieceType: GM.pieceType = null;

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        super.onLoad();

        if (global.room.playerId == global.room.ownerId)
            this._myPieceType = GM.pieceType.BLACK;
        else
            this._myPieceType = GM.pieceType.WHITE;

        global.room.onRecvFromClient((recvFromClientInfo) => {
            const sendPlayerId = recvFromClientInfo.sendPlayerId;
            if (sendPlayerId === global.room.playerId) {
                // 发送者是自己时，做相关游戏逻辑处理
            }
            else {
            }
            // 无论发送者是谁 
            // 解析数据并处理
            let [x, y] = this._parseData(recvFromClientInfo.msg);
            this.putPiece(x, y);
        });
    }

    private _parseData(msg: string) {
        let strX = '', strY = '';
        let index = 0;
        for (let c of msg) {
            if (c != ',') {
                if (index == 0) strX += c;
                else strY += c;
            } else {
                index++;
            }
        }
        return [Number(strX), Number(strY)];
    }

    dotOnTouch(x: number, y: number): void {
        if (!this.check(x, y))
            return;

        if (this.currentPlayer != this._myPieceType)
            return;

        let msgContent: string = x.toString() + ',' + y.toString();
        // 发送消息内容
        let sendToClientInfo = {
            type: 2,                             // 发送类型 2：发送给recvPlayerList的玩家
            msg: msgContent,                       // 具体的自定义消息内容
            recvPlayerList: global.room.players, // 接收消息的玩家ID集合
        }
        global.room.sendToClient(sendToClientInfo);
        global.room.onSendToClientFailed((error) => {
            // 发送消息异常，做相关的游戏逻辑处理
            console.log("发送消息失败");
        });
    }
}