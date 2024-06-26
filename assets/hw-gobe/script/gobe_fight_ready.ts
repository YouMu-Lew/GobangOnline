import { _decorator, Button, Component, director, instantiate, Label, Node, Prefab, ProgressBar } from 'cc';
import { global } from './hw_gobe_global_data';
import { GameSceneType } from './frame_sync';
//@ts-ignore
import { PlayerInfo, RecvFromServerInfo, RoomInfo, UpdateCustomPropertiesResponse, UpdateCustomStatusResponse } from '../../cs-huawei/hwgobe/GOBE/GOBE';
import { RoomUserItem } from './room_user_item';
// import { Console } from '../../prefabs/console';
import { sleep } from './gobe_util';
const { ccclass, property } = _decorator;

@ccclass('GobeFightReady')
export class GobeFightReady extends Component {
    // @property(Label)
    //roomNameEditBox: Label = null;

    // @property(Label)
    // roomIdEditBox: Label = null;
    // @property(Label)
    // isOwnerEditBox: Label = null;

    //放置的位置
    @property(RoomUserItem)
    selfPlayer: RoomUserItem = null;
    @property(RoomUserItem)
    otherPlayer: RoomUserItem = null;

    // @property(Node)
    // enterGameWaitPanel: Node = null;

    @property(Button)
    startGameBtn: Button;
    @property(Button)
    exitRoomBtn: Button;
    // @property(Button)
    // removeOtherPlaBtn: Button;
    // @property(Button)
    // delRoomBtn: Button;

    @property(Node)
    blockNode: Node = null;


    onEnable() {
        // this.setEnterGameWaitPanel(false);
        this._updateRoomView();
    }

    onDisable() {
    }


    // 设置开始按钮
    private _setStartBtn(active: boolean) {
        this.startGameBtn.node.active = active;
    }

    // 设置离开按钮
    private _setExitRoomBtn(active: boolean) {
        this.exitRoomBtn.node.active = active;
    }

    // 设置踢人按钮
    // private _setRemoveOtherPlaBtn(active: boolean) {
    //     this.removeOtherPlaBtn.node.active = active;
    // }

    // 设置解散按钮
    // private _setDismissBtn(active: boolean) {
    //     this.delRoomBtn.node.active = active;
    // }

    /**
     * 设置进入游戏的等待提示
    */
    // setEnterGameWaitPanel(showPanel: boolean) {
    //     this.enterGameWaitPanel.active = showPanel;
    // }

    //按钮----------------


    /**
     * 踢人（移除房间内玩家）
     * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gameobe-removeplayer-js-0000001242443357
    */
    removeOtherPla() {
        let playerId = "";
        global.room.players.forEach(function (player) {
            if (player.playerId != global.room.ownerId) {
                playerId = player.playerId;
            }
        });
        global.room.removePlayer(playerId).then(() => {
            // 踢人成功
            console.log("踢人成功");
            this._updateRoomView();
        }).catch((e) => {
            // 踢人失败
            console.log("踢人失败", e);
        });
    }

    /**
     * 离开房间
     * https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gameobe-leaveroom-js-0000001185489262
    */
    exitRoom() {
        console.log(`正在退出房间`);
        global.client.leaveRoom().then((client) => {
            // 退出房间成功
            console.log("退出房间成功");
            global.client = client;
            director.loadScene("gobe_hall");
        }).catch((e) => {
            // 退出房间失败
            console.log("退出房间失败", e);
        });
    }


    /**
     * 解散房间
    */
    delRoom() {
        console.log(`正在解散房间`);
        global.client.dismissRoom().then((client) => {
            // 退出房间成功
            console.log("解散房间成功");
            global.client = client;
            director.loadScene("gobe_hall");
        }).catch((e) => {
            // 退出房间失败
            console.log("解散房间失败", e);
        });
    }


    /**
     * 开始游戏
    */
    startGame() {
        if (global.room.isSyncing == false) {
            console.log(`开始游戏`);
            //https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gameobe-sync-js-0000001185000956
            //开始帧同步
            global.room.startFrameSync()
                .then(() => {
                    // 开始帧同步成功
                    console.log("startGame 开始帧同步成功");
                }).catch((e) => {
                    // 开始帧同步失败
                    console.log("startGame 开始帧同步失败", e);
                });
        } else {
            console.log("请勿重复点击");
        }
    }

    // 不开启帧同步
    myStartGame() {
        this.blockNode.active = false;
        this.startGameBtn.node.active = false;
    }



    //事件----------------


    onJoin(playerInfo: PlayerInfo) {
        console.log("有用户加入房间 刷新room");
        this._updateRoomView()
    }


    //房主 移除房间内指定玩家 自己主动离开 房间监听
    //https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/gameobe-removeplayer-js-0000001242443357
    //https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/gameobe-room-js-0000001192950624#section2284318513
    onLeave(playerInfo: PlayerInfo) {
        console.log("有人离开房间：" + playerInfo.playerId);
        //刷新房间显示
        if (global.playerId != playerInfo.playerId) {
            this._updateRoomView();
        }
        //自己被踢下线
        else {
            director.loadScene("gobe_hall");
        }
    }

    //房间解散监听
    //https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/gameobe-room-js-0000001192950624#section98426481967
    onDismiss() {
        console.log("房间被解散")
        global.room.removeAllListeners();
        global.room = null;
        director.loadScene("gobe_hall");
    }



    //玩家属性更新监听
    //https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/gameobe-room-js-0000001192950624#section1749013421039
    onUpdateCustomProperties(playerInfo: UpdateCustomPropertiesResponse) {
        console.log("onUpdateCustomProperties", playerInfo)
    }
    //房间信息更新监听
    //https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/gameobe-room-js-0000001192950624#section591542849
    onRoomPropertiesChange(roomInfo: RoomInfo) {
        console.log('onRoomPropertiesChange ' + JSON.stringify(roomInfo));
    }


    /**
     * 更新房间消息
    */
    private _updateRoomView() {
        if (global.room == null) {
            console.warn("global.room == null");
            return;
        }
        global.room.update()
            .then((room) => {
                const selfIsOwner = global.room.ownerId === global.playerId;

                //顶部信息
                // this.isOwnerEditBox.string = "是否是房间主：" + (selfIsOwner ? "是" : "否");
                // this.roomNameEditBox.string = "房间名：" + (global.room.roomName || "");
                // this.roomIdEditBox.string = "房间id：" + (global.room.roomId || "");

                //刷新 item ui
                //先重置（必要）
                this.selfPlayer.setUserInfo(null, false);
                this.otherPlayer.setUserInfo(null, false);

                global.room.players.forEach((player: PlayerInfo) => {
                    if (player.playerId === global.playerId) {
                        this.selfPlayer.setUserInfo(player, global.room.ownerId === player.playerId);
                    } else {
                        this.otherPlayer.setUserInfo(player, global.room.ownerId === player.playerId);
                    }
                });

                //设置按钮状态
                let playerCount = global.room.players.length;
                //开始游戏按钮
                this._setStartBtn(selfIsOwner && playerCount == 2);
                // 房间只有一人时，肯定为房主
                if (playerCount === 1) {
                    // 一开始只有房主，默认不显示踢人按钮
                    // this._setRemoveOtherPlaBtn(false);
                    // 房主才有解散按钮，只在按钮存在即可解散，即有响应
                    // this._setDismissBtn(true)
                    // 房主和非房主均有离开按钮
                    this._setExitRoomBtn(true);
                } else {
                    // 房间有两人时，得看是初始化房主还是非房主的界面
                    if (selfIsOwner) {
                        // this._setRemoveOtherPlaBtn(true);
                        // this._setDismissBtn(true);
                        this._setExitRoomBtn(true);
                    } else {
                        // 非房主
                        // this._setRemoveOtherPlaBtn(false);
                        // this._setDismissBtn(false);
                        this._setExitRoomBtn(true);//TODO
                    }
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }



}

