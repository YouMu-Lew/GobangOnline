import { _decorator, Component, Label, Node } from 'cc';
import * as cc from 'cc';
import { global } from '../../hw-gobe/script/hw_gobe_global_data';
import { getCustomPlayerProperties, getPlayerMatchParams } from '../../hw-gobe/script/gobe_util';
import config from '../../hw-gobe/script/config';
const { ccclass, property } = _decorator;

const maxNumOfDot: number = 6;
const dotText: string = '.';

@ccclass('PvPMenu')
export class PvPMenu extends Component {
    loadingText: string = '在线匹配中';
    numOfDot: number = 0;

    @property(cc.Label)
    loadingLabel: cc.Label = null;

    @property(cc.Node)
    btnCancel: cc.Node = null;

    private _isInMatch: boolean = false;

    private get isInMatch(): boolean {
        return this._isInMatch;
    }
    private set isInMatch(val: boolean) {
        this._isInMatch = val;
        this.btnCancel.active = val;
    }

    private _onMatchEve = (onMatchResponse) => this._onMatch(onMatchResponse)

    /**
 * 监听匹配结果
*/
    private _onMatch(res: GOBE.OnMatchResponse) {
        if (res.rtnCode === 0) {
            console.log('在线匹配成功:' + res.room);
            global.room = res.room;
            global.player = res.room.player;
            // TODO 场景替换
            cc.director.loadScene("Game");
        } else {
            console.log("在线匹配失败", res);
            //是否是已经在匹配中//"101106 player already in one room"
            if (res.rtnCode == 101106) {
                console.error("101106 TODO")
            }
        }
        this.isInMatch = false;
    }

    start() {
        // 每0.5s执行一次
        this.schedule(this.updateText, 0.2);
        this.onFastMatchPlayer();
    }

    updateText() {
        if (this.numOfDot > maxNumOfDot) {
            this.numOfDot = 0;
            this.loadingText = '在线匹配中';
        }
        this.loadingLabel.string = this.loadingText;
        this.loadingText += dotText;
        this.numOfDot++;
    }

    update(deltaTime: number) {

    }

    /**
     * 快速匹配
    */
    async onFastMatchPlayer() {
        if (this.isInMatch) {
            console.error("正在匹配中,无需再次操作");
            return;
        }
        let player = {
            playerId: global.playerId,
            matchParams: getPlayerMatchParams()
        };

        this.isInMatch = true;
        //事件 
        global.client.onMatch.clear();
        global.client.onMatch(this._onMatchEve);
        // 调用GOBE的matchPlayer发起在线匹配
        global.client.matchPlayer(
            {
                playerInfo: player,
                teamInfo: null,
                matchCode: config.matchCode
            }, { customPlayerStatus: 0, customPlayerProperties: getCustomPlayerProperties() })
            .then((res: GOBE.MatchResponse) => {
                console.log("在线匹配开始")
            })
            .catch((e: GOBE.MatchResponse) => {
                //清除匹配事件
                global.client.onMatch.clear();
                this.isInMatch = false;
                console.log("在线匹配失败", e);
                //查询匹配结果时，玩家已不在匹配中，请重新发起匹配。
                if (e.rtnCode == 104211) {
                    //可能是自己取消了匹配
                }
            });
    }

    /**
    * 取消快速匹配
    */
    public onCancelMatch(showLog: boolean = true) {
        if (!this.isInMatch) {
            console.log("当前未在匹配");
            return;
        }
        this.isInMatch = false;
        //清除匹配事件
        global.client.onMatch.clear();
        global.client.cancelMatch()
            .then(() => {
                showLog && console.log('取消匹配成功');
                cc.director.loadScene('MainMenu');
            }).catch(() => {
                showLog && console.log('取消匹配失败');
            })
    }
}


