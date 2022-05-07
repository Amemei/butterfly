//=============================================================================
// PD_DelayTitle.js
//=============================================================================

/*:
 * @plugindesc タイトル画面の各画像の表示にディレイとフェードイン機能を追加します。
 * @author Shio_inu
 *
 *
 * @param Delay BG1
 * @desc 背景1を表示開始するフレーム数です。
 * @default 0
 *
 * @param Fade BG1
 * @desc 背景1のフェードインにかかるフレーム数です。
 * @default 60
 *
 * @param Delay BG2
 * @desc 背景1を表示開始するフレーム数です。
 * @default 60
 *
 * @param Fade BG2
 * @desc 背景1のフェードインにかかるフレーム数です。
 * @default 60
 *
 * @param Delay Title
 * @desc タイトルを表示開始するフレーム数です。
 * @default 120
 *
 * @param Fade Title
 * @desc タイトルのフェードインにかかるフレーム数です。
 * @default 60
 *
 * @param Delay Command
 * @desc コマンドを表示するフレーム数です。
 * @default 180
 *
 * @param Pass To Decide
 * @desc 決定キーで演出をスキップできるかの設定です。1:スキップ出来る　0:スキップ出来ない
 * @default 1
 * 
 * @help last update : 26th Jun 2017 v1.01
 *
 */

/*:ja
 * @plugindesc タイトル画面の各画像の表示にディレイとフェードイン機能を追加します。
 * @author しおいぬ
 *
 * @param Delay BG1
 * @desc 背景1を表示開始するフレーム数です。
 * @default 0
 *
 * @param Fade BG1
 * @desc 背景1のフェードインにかかるフレーム数です。
 * @default 60
 *
 * @param Delay BG2
 * @desc 背景1を表示開始するフレーム数です。
 * @default 60
 *
 * @param Fade BG2
 * @desc 背景1のフェードインにかかるフレーム数です。
 * @default 60
 *
 * @param Delay Title
 * @desc タイトルを表示開始するフレーム数です。
 * @default 120
 *
 * @param Fade Title
 * @desc タイトルのフェードインにかかるフレーム数です。
 * @default 60
 *
 * @param Delay Command
 * @desc コマンドを表示するフレーム数です。
 * @default 180
 *
 * @param Pass To Decide
 * @desc 決定キーで演出をスキップできるかの設定です。1:スキップ出来る　0:スキップ出来ない
 * @default 1
 * @help last update : 2017/06/26 v1.01
 *
 */
(function(){


    var parameters = PluginManager.parameters('PD_DelayTitle');
    var delayBG1 = Number(parameters['Delay BG1'] || 0);
    var fadeBG1 = Number(parameters['Fade BG1'] || 60);
    var delayBG2 = Number(parameters['Delay BG2'] || 0);
    var fadeBG2 = Number(parameters['Fade BG2'] || 60);
    var delayTitle = Number(parameters['Delay Title'] || 120);
    var fadeTitle = Number(parameters['Fade Title'] || 60);
    var delayCommand = Number(parameters['Delay Command'] || 180);
    var passToDecide = Number(parameters['Pass To Decide'] || 0);

    var endFrame = Math.max(delayBG1 + fadeBG1, delayBG2 + fadeBG2, delayTitle + fadeTitle, delayCommand);

Scene_Title.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createBackground();
    this.createForeground();
    this.createWindowLayer();
    this.createCommandWindow();
    this._frame = 0;
};

Scene_Title.prototype.update = function(){
    Scene_Base.prototype.update.call(this);
    //スキップ
    if (passToDecide == 1 && (Input.isTriggered('ok') || TouchInput.isPressed ()) && this._frame < endFrame) {
        this.skip();
    }
    //フェード開始確認
    if(this._frame === delayBG1){
        if(fadeBG1 === 0){
            this._backSprite1.opacity = 255;
        } else {
            this._backSprite1.opacity = 1;
        }
    }
    if(this._frame === delayBG2){
        if(fadeBG2 === 0){
            this._backSprite2.opacity = 255;
        } else {
            this._backSprite2.opacity = 1;
        }
    }
    if($dataSystem.optDrawTitle && this._frame === delayTitle){
        if(fadeTitle === 0){
            this._gameTitleSprite.opacity = 255;
        } else {
            this._gameTitleSprite.opacity = 1;
        }
    }
    if(this._frame === delayCommand){
        this._commandWindow.open();
    }
    //フェード処理
    if(this._backSprite1.opacity > 0 && this._backSprite1.opacity < 255){
        this._backSprite1.opacity += 255 / fadeBG1;
    }
    if(this._backSprite2.opacity > 0 && this._backSprite2.opacity < 255){
        this._backSprite2.opacity += 255 / fadeBG2;
    }
    if($dataSystem.optDrawTitle && this._gameTitleSprite.opacity > 0 && this._gameTitleSprite.opacity < 255){
        this._gameTitleSprite.opacity += 255 / fadeTitle;
    }

    this._frame ++ ;
}
Scene_Title.prototype.createBackground = function() {
    this._spritebutton = new Sprite
    this._backSprite1 = new Sprite(ImageManager.loadTitle1($dataSystem.title1Name));
    this._backSprite2 = new Sprite(ImageManager.loadTitle2($dataSystem.title2Name));
    this._backSprite1.opacity = 0;
    this._backSprite2.opacity = 0;
    this.addChild(this._backSprite1);
    this.addChild(this._backSprite2);
};

Scene_Title.prototype.drawGameTitle = function() {
    var x = 20;
    var y = Graphics.height / 4;
    var maxWidth = Graphics.width - x * 2;
    var text = $dataSystem.gameTitle;
    this._gameTitleSprite.bitmap.outlineColor = 'black';
    this._gameTitleSprite.bitmap.outlineWidth = 8;
    this._gameTitleSprite.bitmap.fontSize = 72;
    this._gameTitleSprite.bitmap.drawText(text, x, y, maxWidth, 48, 'center');
    this._gameTitleSprite.opacity = 0;
};

    Scene_Title.prototype.skip = function() {
        this._backSprite1.opacity = 255;
        this._backSprite2.opacity = 255;
        if($dataSystem.optDrawTitle){
            this._gameTitleSprite.opacity = 255;
        }
        this._commandWindow.open();
        this._frame = endFrame + 1;
    };
})();