import { _decorator, Component, director, game, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MainMenu')
export class MainMenu extends Component {
    start() {

    }

    update(deltaTime: number) {

    }

    on_btn_start() {
        director.loadScene('ModeMenu');
    }

    on_btn_setting() { }

    on_btn_about() { }

    on_btn_exit() {
        game.end();
    }
}


