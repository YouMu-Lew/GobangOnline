import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Btn_back2MainMenu')
export class Btn_back2MainMenu extends Component {
    onClick() {
        director.loadScene('MainMenu');
    }
}