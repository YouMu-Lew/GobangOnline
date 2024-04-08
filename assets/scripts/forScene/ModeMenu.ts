import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ModeMenu')
export class ModeMenu extends Component {
    start() {

    }

    update(deltaTime: number) {

    }

    onBtn_solo() {
        director.loadScene('Game');
    }

    onBtn_PvE() { }

    onBtn_PvP() { }
}


