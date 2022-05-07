//=============================================================================
// NRP_VisualTurn.js
//=============================================================================

/*:
 * @plugindesc v1.052 行動順序を戦闘画面へ表示します。
 * @author 砂川赳（http://newrpg.seesaa.net/）
 *
 * @help このプラグインにはプラグインコマンドはありません。
 *
 * CTBやCTTBに共通した画面表示処理を行います。
 * このプラグインは必ずターン制御を行うプラグインよりも下に配置してください。
 *
 * 細かい仕様については、以下をご覧ください。
 * http://newrpg.seesaa.net/article/472840225.html
 * 
 * 【利用規約】
 * 特に制約はありません。
 * 改変、再配布自由、商用可、権利表示も任意です。
 * 作者は責任を負いませんが、不具合については可能な範囲で対応します。
 *
 * @param ＜ウィンドウ関連＞
 * @desc 見出しです。
 *
 * @param horizon
 * @text ウィンドウの表示方向
 * @parent ＜ウィンドウ関連＞
 * @type select
 * @option 0:縦長 @value 0
 * @option 1:横長 @value 1
 * @default 0
 * @desc 行動順序の表示方向を切り替えます。
 * 0:縦長ウィンドウ、1:横長ウィンドウ
 *
 * @param autoHidden
 * @text ウィンドウを自動で隠す
 * @parent ＜ウィンドウ関連＞
 * @type select
 * @option 0:枠を隠さない @value 0
 * @option 1:枠を隠す @value 1
 * @default 0
 * @desc 1ならば行動実行時、自動的に行動順序表示枠を隠します。
 * メッセージとかぶって邪魔な場合などに。
 *
 * @param adjustX
 * @text 横位置調整
 * @parent ＜ウィンドウ関連＞
 * @type text
 * @min -999
 * @default 0
 * @desc 行動順序ウィンドウの位置を右方向に移動します。
 * "Graphics.boxWidth - this.width"で右寄せにできます。
 *
 * @param adjustY
 * @text 縦位置調整
 * @parent ＜ウィンドウ関連＞
 * @type text
 * @min -999
 * @default 64
 * @desc 行動順序ウィンドウを下へ移動します。"Graphics.boxHeight - this._statusWindow.height - this.height"で下寄せ可。
 *
 * @param windowPadding
 * @text ウィンドウの余白
 * @parent ＜ウィンドウ関連＞
 * @type number
 * @desc 行動順序ウィンドウの余白を指定します。初期値=18。
 *
 * @param windowOpacity
 * @text 不透明度
 * @parent ＜ウィンドウ関連＞
 * @type number
 * @default 255
 * @desc 枠の不透明度です。
 * 0で透明、255で不透明。
 *
 * @param windowDark
 * @text 暗くするか？
 * @parent ＜ウィンドウ関連＞
 * @type select
 * @option 0:通常 @value 0
 * @option 1:暗くする @value 1
 * @default 0
 * @desc 1ならばウィンドウを暗くします。
 *
 * @param windowBackImage
 * @text 背景画像
 * @parent ＜ウィンドウ関連＞
 * @type file
 * @dir img/pictures
 * @desc ウィンドウの上に背景となるピクチャーを指定します。
 * 例えばウィンドウ透明化と組み合わせて独自の枠を作れます。
 *
 * @param ＜画像関連＞
 * @desc 見出しです。
 *
 * @param graphicMode
 * @text 画像表示モード
 * @parent ＜画像関連＞
 * @type select
 * @option 0:名前表示 @value 0
 * @option 1:顔グラ表示 @value 1
 * @option 2:キャラグラ表示 @value 2
 * @option 3:SV戦闘キャラ表示 @value 3
 * @default 1
 * @desc 画像表示モードです。0:名前表示、1:顔グラ表示、2:キャラグラ表示、3:SV戦闘キャラ。
 *
 * @param width
 * @text 横幅
 * @parent ＜画像関連＞
 * @type number
 * @default 100
 * @desc シンボル画像の表示横幅です。指定なしなら100。
 *
 * @param height
 * @text 縦幅
 * @parent ＜画像関連＞
 * @type number
 * @default 32
 * @desc シンボル画像の表示縦幅です。指定なしなら32。
 *
 * @param zoom
 * @text 表示倍率
 * @parent ＜画像関連＞
 * @type number
 * @default 100
 * @desc シンボル画像の拡大率です。
 * 100を基準に設定してください。
 *
 * @param characterDirection
 * @text キャラグラの向き
 * @parent ＜画像関連＞
 * @type select
 * @default down
 * @option 下 @value down
 * @option 左 @value left
 * @option 右 @value right
 * @option 上 @value up
 * @desc キャラグラ表示の場合の向きです。
 * キャラグラ表示以外のモードでは無意味です。
 *
 * @param actorBackImage
 * @text 背景画像
 * @parent ＜画像関連＞
 * @type file
 * @dir img/pictures
 * @desc 味方個別の背景となるピクチャーを指定します。
 *
 * @param ＜敵の画像関連＞
 * @desc 見出しです。
 *
 * @param enemyGraphicMode
 * @text 画像表示モード
 * @parent ＜敵の画像関連＞
 * @type select
 * @option 指定なし @value
 * @option 0:名前表示 @value 0
 * @option 1:顔グラ表示 @value 1
 * @option 2:キャラグラ表示 @value 2
 * @option 3:SV戦闘キャラ表示 @value 3
 * @option 4:ピクチャー表示 @value 4
 * @desc 敵の画像表示モードです。0:名前,1:顔グラ,2:キャラグラ,3:SV戦闘キャラ,4:ピクチャー。指定なしなら味方と同じ。
 *
 * @param enemyFileName
 * @text 画像ファイル
 * @parent ＜敵の画像関連＞
 * @type string
 * @default Monster
 * @desc 敵シンボルのデフォルトファイル名。
 * 対象フォルダは表示モードに依存。指定なしなら"Monster"。
 *
 * @param enemyFileIndex
 * @text 画像のインデックス
 * @parent ＜敵の画像関連＞
 * @type number
 * @default 6
 * @desc enemyFileNameで指定した画像のインデックスを指定する。
 * 顔グラ・キャラグラ以外は不要。0始まり注意。指定なしなら6。
 *
 * @param enemyBackImage
 * @text 背景画像
 * @parent ＜敵の画像関連＞
 * @type file
 * @dir img/pictures
 * @desc 敵個別の背景となるピクチャーを指定します。
 *
 * @param ＜その他＞
 * @desc 見出しです。
 *
 * @param keepCommandWindow
 * @text コマンドを隠さない
 * @parent ＜その他＞
 * @type boolean
 * @default true
 * @desc 入力完了後にコマンドウィンドウを隠しません。
 * 画面下のウィンドウがせわしないのは嫌だという場合に。
 */

(function() {
"use strict";

function toNumber(str, def) {
    return isNaN(str) ? def : +(str || def);
}
function setDefault(str, def) {
    return str ? str : def;
}
function toBoolean(val, def) {
    if (val == "") {
        return def;
    } else if (typeof val === "boolean") {
        return val;
    }
    return val.toLowerCase() == "true";
}

var parameters = PluginManager.parameters("NRP_VisualTurn");

var paramHorizon = toNumber(parameters["horizon"], 0);
var paramAutoHidden = toNumber(parameters["autoHidden"], 0);
var paramAdjustX = setDefault(parameters["adjustX"], 0);
var paramAdjustY = setDefault(parameters["adjustY"], 0);
var paramWindowPadding = toNumber(parameters["windowPadding"], 18);
var paramWindowOpacity = toNumber(parameters["windowOpacity"], 255);
var paramWindowDark = toNumber(parameters["windowDark"], 0);
var paramWindowBackImage = parameters["windowBackImage"];

var paramGraphicMode = toNumber(parameters["graphicMode"], 1);
var paramEnemyGraphicMode = parameters["enemyGraphicMode"];
var paramWidth = toNumber(parameters["width"], 114);
var paramHeight = toNumber(parameters["height"], 32);
var paramZoom = toNumber(parameters["zoom"], 100) / 100;
var paramCharacterDirection = setDefault(parameters["characterDirection"], "down");
var paramActorBackImage = parameters["actorBackImage"];
    
var paramEnemyFileName = setDefault(parameters["enemyFileName"], "Monster");
var paramEnemyFileIndex = toNumber(parameters["enemyFileIndex"], 6);
var paramEnemyBackImage = parameters["enemyBackImage"];

var paramKeepCommandWindow = toBoolean(parameters["keepCommandWindow"], false);

// CTTB用のターン参加人数
var cttbCount = -1;

/**
 * ●行動順序の作成
 */
var _BattleManager_makeActionOrders = BattleManager.makeActionOrders;
BattleManager.makeActionOrders = function() {
    _BattleManager_makeActionOrders.call(this);
    
    // 有効なら数字が入るので、CTTBかどうかの判定に使う。
    cttbCount = this._cttbCount;

    // 表示処理を呼び出し。
    NrpVisualTurn.visualTurnList(this._actionBattlers);
}

function NrpVisualTurn() {
    throw new Error('This is a static class');
}

/**
 * ●CTB用ウィンドウの定義
 */
function Window_BattleCtb() {
    this.initialize.apply(this, arguments);
}

Window_BattleCtb.prototype = Object.create(Window_Base.prototype);
Window_BattleCtb.prototype.constructor = Window_BattleCtb;

/**
 * ●CTB用ウィンドウの初期化
 */
Window_BattleCtb.prototype.initialize = function() {
    var width = 0;
    var height = 0;
    var padding = this.standardPadding();

    // 縦
    if (paramHorizon == 0) {
        width = paramWidth + padding * 2;
        // この時点ではサイズ不明なので画面いっぱいまで確保する。
        // （行動順リストが設定されていないため）
        // ここで確保しておかないと初期描画ができない。
        height = Graphics.boxHeight;

    // 横
    } else if (paramHorizon == 1) {
        // この時点ではサイズ不明なので画面いっぱいまで確保する。
        width = Graphics.boxWidth;
        height = paramHeight + padding * 2;
    }
    
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    
    // 余白設定
    this.padding = padding;
};

/**
 * ●CTB用ウィンドウのサイズを参照して位置を調整
 */
Window_BattleCtb.prototype.setPositionBySize = function() {
    var winX = eval(paramAdjustX);
    var winY = eval(paramAdjustY);
    this.move(winX, winY, this.width, this.height);
}

/**
 * ●CTB用ウィンドウの余白
 */
Window_BattleCtb.prototype.standardPadding = function() {
    return paramWindowPadding;
};

/**
 * ●CTB用ウインドウの設定
 */
NrpVisualTurn.setCtbWindow = function(ctbWindow) {
    this._ctbWindow = ctbWindow;
};

/**
 * 戦闘画面用にWindowを追加する。
 */
var _Scene_Battle_prototype_createAllWindows = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function() {
    _Scene_Battle_prototype_createAllWindows.apply(this, arguments);
    
    this.createCtbWindow();
};

/**
 * 戦闘表示関連の準備
 */
var _Scene_Battle_prototype_createDisplayObjects = Scene_Battle.prototype.createDisplayObjects;
Scene_Battle.prototype.createDisplayObjects = function() {
    _Scene_Battle_prototype_createDisplayObjects.apply(this, arguments);
    
    // 各背景画像を先読みしておく。
    // 各画像シンボルよりも確実に後ろに表示させるため。
    if (paramWindowBackImage) {
        ImageManager.loadPicture(paramWindowBackImage);
    }
    if (paramActorBackImage) {
        ImageManager.loadPicture(paramActorBackImage);
    }
    if (paramEnemyBackImage) {
        ImageManager.loadPicture(paramEnemyBackImage);
    }
    
    // NrpVisualTurnから呼び出せるようにCTBウインドウをセット。
    NrpVisualTurn.setCtbWindow(this._ctbWindow);
};

/**
 * CTB行動順序ウィンドウ作成処理
 */
Scene_Battle.prototype.createCtbWindow = function(){
    this._ctbWindow = new Window_BattleCtb();
    // 参照用にステータスウィンドウを持たせる。（強引かも……）
    this._ctbWindow._statusWindow = this._statusWindow;
    this._ctbWindow.hide(); // 非表示しておく
    this._ctbWindow.close(); // 閉じておく
    
    this.addWindow(this._ctbWindow);
};

/**
 * ● 行動順序リストの表示
 */
NrpVisualTurn.visualTurnList = function(actionBattlers) {
    var win = this._ctbWindow;
    
    /*
     * ウィンドウの位置とサイズを設定
     */
    var xSize = 0;
    var ySize = 0;
    var padding = win.padding * 2; // ウィンドウの余白サイズ

    // 縦
    if (paramHorizon == 0) {
        xSize = paramWidth + padding;
        ySize = actionBattlers.length * paramHeight + padding;
        
        // 【CTTB用】境界線用の間隔を加算
        if (cttbCount > 0 && cttbCount < actionBattlers.length) {
            ySize += 32;
        }

    // 横
    } else if (paramHorizon == 1) {
        xSize = actionBattlers.length * paramWidth + padding;
        // 【CTTB用】境界線用の間隔を加算
        if (cttbCount > 0 && cttbCount < actionBattlers.length) {
            xSize += 32;
        }
            
        ySize = paramHeight + padding;
    }

    // ウィンドウの位置・サイズ変更を実行
    win.width = xSize;
    win.height = ySize;
    win.setPositionBySize();
    
    // 暗くするかどうか。
    win.setBackgroundType(paramWindowDark);
    
    win.contents.clear(); // 表示クリア
    win.opacity = paramWindowOpacity; // 不透明度の設定
    
    // 背景画像の設定
    win.drawWindowBackImage();

    /*
     * バトラー名を表示
     */
    var x = 0;
    var y = 0;
    
    for(var i = 0; i < actionBattlers.length; i++) {
        var battler = actionBattlers[i];

        // 【CTTB用】ターン外のキャラとは隙間を空ける
        if (cttbCount == i) {
            // 縦表示
            if (paramHorizon == 0) {
                y += 16;
                this.drawCttbBorder(battler, x, y);
                y += 16;
            // 横表示
            } else {
                x += 16;
                this.drawCttbBorder(battler, x, y);
                x += 16;
            }
        }

        // キャラ描画
        this.drawCtbBattler(battler, x, y, actionBattlers.length, i);
        
        // 縦表示
        if (paramHorizon == 0) {
            y += paramHeight;
        // 横表示
        } else {
            x += paramWidth;
        }
    }
}

/**
 * ● 行動順序用、バトラーの描画
 */
NrpVisualTurn.drawCtbBattler = function(battler, x, y, battlersLength, i) {
    var win = this._ctbWindow;
    var opacity = 255;
    
    // 【CTTB用】ターン外だと半透明
    if (i >= cttbCount) {
        opacity = 150;
    } else {
        opacity = 255; // 通常
    }
    
    // 背景描画
    if (win.drawPersonalBackImage(battler, x, y)) {
        // 背景描画に成功したら。シンボル画像表示
        win.drawInterval(battler, x, y, paramWidth, paramHeight, opacity);
        return;
    }
    
    // 失敗なら、背景描画の成功を待ってから、シンボル画像表示を行う。
    // この調整をしておかないと、稀に表示が前後する。
    var interval = setInterval(function(){
        if (win.drawPersonalBackImage(battler, x, y)) {
            win.drawInterval(battler, x, y, paramWidth, paramHeight, opacity);
            clearInterval(interval);
        }
    }, 10); //0.01秒間隔
}

/**
 * ●表示モードを取得する。
 */
NrpVisualTurn.getGraphicMode = function(battler) {
    var graphicMode = paramGraphicMode;
    // 敵のグラフィックモードに指定があれば取得
    if (!battler.isActor() && paramEnemyGraphicMode != "") {
        graphicMode = paramEnemyGraphicMode;
    }
    return graphicMode;
}

/**
 * ●CTB用の名前表示
 * ※ウィンドウ縦表示専用。横表示だとバグります。
 */
Window_BattleCtb.prototype.drawName = function(battler, x, y, width, height, opacity) {
    var name = battler.name();
    if (battler.isActor()) {
        this.changeTextColor(this.textColor(0)); // 文字色設定
    } else {
        this.changeTextColor(this.textColor(2)); // 文字色設定
    }
    this.contents.paintOpacity = opacity;
    
    var dy = y;
    
    var ph = 28; // 文字の縦幅
    
    // 中央に来るように描画位置を調整。※中央線を求め、そこから文字縦幅/2 ほど上にずらす。
    dy = y + height / 2 - ph / 2;
    dy -= 2; // 元が下寄せっぽいので微調整
    
    this.drawText(name, x, dy, this.contentsWidth(), "left");
    
    // 対象選択時の白枠表示
    if (battler._selected) {
        this.drawSelected(x, dy + 2, width, ph + 4);
    }
}

/**
 * ●clearIntervalによって、準備完了を待って描画を行う。
 */
Window_BattleCtb.prototype.drawInterval = function(battler, x, y, width, height, opacity) {
    var win = this;
    
    // 表示モードによって判断し、bitmapを読み込む。
    var bitmap = this.loadBitmap(battler);
    
    var graphicMode = this._graphicMode;
    // loadBitmapで取得した顔グラ、キャラグラ用のインデックス
    var imageIndex = this._imageIndex;

    // キャラグラ用のビッグ判定
    var isBigCharacter = this._isBigCharacter;
    
    // 名前表示なら制御せずそのまま描画
    if (graphicMode == 0) {
        win.drawName(battler, x, y, paramWidth, paramHeight, opacity);
        return;
    }
    
    // 描画成功なら終了
    if (ImageManager.isReady()) {
        win.drawSymbol(
            bitmap, imageIndex, isBigCharacter, battler, x, y, width, height, opacity, graphicMode);
        return;
    }
    
    // 準備完了を待って描画を行う。
    var interval = setInterval(function(){
        if (ImageManager.isReady()) {
            win.drawSymbol(
                bitmap, imageIndex, isBigCharacter, battler, x, y, width, height, opacity, graphicMode);
            
            clearInterval(interval);
        }
    }, 10); //0.01秒間隔
};

/**
 * ●表示モードによって判断し、bitmapを読み込む。
 */
Window_BattleCtb.prototype.loadBitmap = function(battler) {
    var imageName;
    var imageIndex;
    var bitmap;
    var data;
    
    this._graphicMode = null;     // 現在対象とする画像表示モード
    this._imageIndex = null;      // 画像インデックス
    this._isBigCharacter = false; // キャラグラ用のビッグキャラクター判定用
    
    // メタタグの存在チェック（最優先）
    if (battler.isActor()) {
        data = $dataActors[battler.actorId()];
    } else {
        data = $dataEnemies[battler.enemyId()];
    }
    
    //---------------------------------
    // 各画像をメタタグから取得できるか？
    // 取得できればそちらを優先。
    //---------------------------------
    // 顔グラ
    imageName = NrpVisualTurn.getMetaImageName(this, data, "CtbFace");
    if (imageName) {
        this._graphicMode = 1;
        return ImageManager.loadFace(imageName);
    }
    // キャラグラ
    imageName = NrpVisualTurn.getMetaImageName(this, data, "CtbCharacter");
    if (imageName) {
        this._graphicMode = 2;
        bitmap = ImageManager.loadCharacter(imageName);
        this._isBigCharacter = ImageManager.isBigCharacter(imageName);
        return bitmap;
    }
    // SV戦闘キャラ
    imageName = NrpVisualTurn.getMetaImageName(this, data, "CtbSvActor");
    if (imageName) {
        this._graphicMode = 3;
        return ImageManager.loadSvActor(imageName);
    }
    // ピクチャー
    imageName = NrpVisualTurn.getMetaImageName(this, data, "CtbPicture");
    if (imageName) {
        this._graphicMode = 4;
        return ImageManager.loadPicture(imageName);
    }
    
    var graphicMode = NrpVisualTurn.getGraphicMode(battler);
    
    // 0:名前表示
    if (graphicMode == 0) {
        bitmap = null;
        
    // 1:顔グラ表示
    } else if (graphicMode == 1) {
        if (battler.isActor()) {
            imageName = battler._faceName;
            imageIndex = battler._faceIndex;
        } else {
            imageName = paramEnemyFileName;
            imageIndex = paramEnemyFileIndex;
        }
        bitmap = ImageManager.loadFace(imageName);
        
    // 2:キャラグラ表示
    } else if (graphicMode == 2) {
        if (battler.isActor()) {
            imageName = battler._characterName;
            imageIndex = battler._characterIndex;
        } else {
            imageName = paramEnemyFileName;
            imageIndex = paramEnemyFileIndex;
        }
        bitmap = ImageManager.loadCharacter(imageName);
        this._isBigCharacter = ImageManager.isBigCharacter(imageName);
        
    // 3:SV表示
    } else if (graphicMode == 3) {
        if (battler.isActor()) {
            imageName = battler.battlerName();
        } else {
            imageName = paramEnemyFileName;
        }
        bitmap = ImageManager.loadSvActor(imageName);
        
    // 4:ピクチャー表示
    } else if (graphicMode == 4) {
        if (!battler.isActor()) {
            imageName = paramEnemyFileName;
        }
        bitmap = ImageManager.loadPicture(imageName);
    }
    
    this._graphicMode = graphicMode;
    this._imageIndex = imageIndex;
    return bitmap;
};

/**
 * ●メタタグ名を元に画像ファイル名を取得する。
 */
NrpVisualTurn.getMetaImageName = function(win, data, metaTagName) {
    var imageName = null;
    var metaValue = data.meta[metaTagName];

    // 画像の指定があれば、そちらを取得する。
    if (metaValue) {
        imageName = this.getMetaImageNameSwitch(win, metaValue, metaTagName, imageName);

        // 連番が取得できた場合、そちらを優先
        for (var i = 1; data.meta.hasOwnProperty(metaTagName + i); i++) {
            metaValue = data.meta[metaTagName + i];
            imageName = this.getMetaImageNameSwitch(win, metaValue, metaTagName, imageName);
        }
    }
    return imageName;
}

/**
 * ●スイッチを考慮して画像ファイル名を取得する。
 */
NrpVisualTurn.getMetaImageNameSwitch = function(
        win, metaValue, metaTagName, defaultImageName) {
    var imageName = defaultImageName;
    var switchNo;
    
    // キャラグラ、顔グラの場合、
    // <CtbFace:Monster,6,10>というようにファイル名、インデックス、ゲーム内スイッチ番号の順番を想定。
    // ゲーム内スイッチ番号は省略可能。
    if (metaTagName == "CtbCharacter" || metaTagName == "CtbFace") {
        // スイッチ番号を取得
        switchNo = metaValue.split(",")[2];
        // スイッチ指定があり、かつ満たしている場合
        if (switchNo && $gameSwitches.value(switchNo)) {
            imageName = metaValue.split(",")[0];
            win._imageIndex = metaValue.split(",")[1]; // インデックス
            
        // スイッチ指定がない場合は普通に取得
        } else if (!switchNo) {
            imageName = metaValue.split(",")[0];
            win._imageIndex = metaValue.split(",")[1]; // インデックス
        }
        
    // それ以外の場合、
    // <CtbPicture:Monster,10>というようにファイル名、ゲーム内スイッチ番号の順番を想定
    // ゲーム内スイッチは省略可能。
    } else {
        // スイッチ番号を取得
        switchNo = metaValue.split(",")[1];
        // スイッチ指定があり、かつ満たしている場合
        if (switchNo && $gameSwitches.value(switchNo)) {
            imageName = metaValue.split(",")[0];
            
        // スイッチ指定がない場合は普通に取得
        } else if (!switchNo) {
            imageName = metaValue;
        }
    }

    return imageName;
}

/**
 * ●CTB用のシンボル表示
 */
Window_BattleCtb.prototype.drawSymbol = function(
        bitmap, imageIndex, isBigCharacter, battler, x, y, width, height, opacity, graphicMode) {
    // 1:顔グラ表示
    if (graphicMode == 1) {
        this.drawFace(bitmap, imageIndex, battler, x, y, width, height, opacity);
        
    // 2:キャラグラ表示
    } else if (graphicMode == 2) {
        this.drawCharacter(bitmap, imageIndex, isBigCharacter, battler, x, y, width, height, opacity);
        
    // 3:SV表示
    } else if (graphicMode == 3) {
        this.drawSvActor(bitmap, battler, x, y, width, height, opacity);
        
    // 4:ピクチャー表示
    } else if (graphicMode == 4) {
        this.drawPicture(bitmap, battler, x, y, width, height, opacity);
    }
};

/**
 * ●CTB用の顔グラ表示
 */
Window_BattleCtb.prototype.drawFace = function(
        bitmap, imageIndex, battler, x, y, width, height, opacity) {
    // 規格上の顔グラサイズ
    var imageWidth = Window_Base._faceWidth;
    var imageHeight = Window_Base._faceHeight;
    
    // 最終的に描画するサイズ
    // 収まるなら画像のサイズ、収まらないなら範囲いっぱいまで
    var pw = Math.min(width, imageWidth * paramZoom);
    var ph = Math.min(height, imageHeight * paramZoom);
    
    // 切り取る画像サイズ
    var sw = Math.floor(pw / paramZoom);
    var sh = Math.floor(ph / paramZoom);
    
    // 切り取る画像サイズが規格の範囲を超えている。
    // 元のサイズ比率を保ったまま調整する。
    if (sw > imageWidth || sh > imageHeight) {
        if (sw >= sh) {
            sh = Math.floor(sh * imageWidth / sw);
            sw = imageWidth;

        } else {
            sw = Math.floor(sw * imageHeight / sh);
            sh = imageHeight;
        }
    }
    
    // 画像描画位置
    var dx = Math.floor(x + Math.max(width - imageWidth, 0) / 2);
    var dy = Math.floor(y + Math.max(height - imageHeight, 0) / 2);
    
    // 切り取り開始位置
    var sx = imageIndex % 4 * imageWidth;
    // 全体を描画できない場合、画像中央を取得するように調整
    if (sw < imageWidth) {
        sx += (imageWidth - sw) / 2;
    }
    
    var sy = Math.floor(imageIndex / 4) * imageHeight;
    // 全体を描画できない場合、画像中央を取得するように調整
    if (sh < imageHeight) {
        sy += (imageHeight - sh) / 2;
    }
    
    // 中央に来るように描画位置を調整。※中央線を求め、そこから描画幅/2 ほど左or上にずらす。
    dx = x + width / 2 - pw / 2;
    dy = y + height / 2 - ph / 2;
        
    this.contents.paintOpacity = opacity;
    // 描画実行
    this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy, pw, ph);
    
    // 境界線（未使用）
    // this.drawBorderCtb(x, y, width, height, battlersLength, i);
    
    // 対象選択時の白枠表示
    if (battler._selected) {
        // 小さいほうに合わせる
        if (pw > width) {
            pw = width;
        }
        if (ph > height) {
            ph = height;
        }
        this.drawSelected(dx, dy, pw, ph);
    }
};

/**
 * ●CTB用のキャラグラ表示
 */
Window_BattleCtb.prototype.drawCharacter = function(
        bitmap, imageIndex, isBig, battler, x, y, width, height, opacity) {
    // 規格上１キャラの横幅、縦幅
    var imageWidth = bitmap.width / (isBig ? 3 : 12);
    var imageHeight = bitmap.height / (isBig ? 4 : 8);
    
    // 最終的に描画するサイズ
    // 収まるなら画像のサイズ、収まらないなら範囲いっぱいまで
    var pw = Math.min(width, imageWidth * paramZoom);
    var ph = Math.min(height, imageHeight * paramZoom);
    
    // 切り取る画像サイズ
    var sw = Math.floor(pw / paramZoom);
    var sh = Math.floor(ph / paramZoom);
    
    // 切り取る画像サイズが規格の範囲を超えている。
    // 元のサイズ比率を保ったまま調整する。
    if (sw > imageWidth || sh > imageHeight) {
        if (sw >= sh) {
            sh = Math.floor(sh * imageWidth / sw);
            sw = imageWidth;

        } else {
            sw = Math.floor(sw * imageHeight / sh);
            sh = imageHeight;
        }
    }
    
    // 切り取り開始位置（ファイルからキャラ位置を指定）
    var sx = (imageIndex % 4 * 3 + 1) * imageWidth;
    // 全体を描画できない場合、画像中央を取得するように調整
    if (sw < imageWidth) {
        sx += (imageWidth - sw) / 2;
    }
    
    var sy = (Math.floor(imageIndex / 4) * 4) * imageHeight;
    
    // 向き調整。
    // ※キャラグラは下、左、右、上の順で格納されているので、その分の高さを加算する。
    if (paramCharacterDirection == "left") {
        sy += imageHeight;
    } else if (paramCharacterDirection == "right") {
        sy += imageHeight * 2;
    } else if (paramCharacterDirection == "up") {
        sy += imageHeight * 3;
    }
    
    // 中央に来るように描画位置を調整。※中央線を求め、そこから描画幅/2 ほど左or上にずらす。
    var dx = x + width / 2 - pw / 2;
    var dy = y + height / 2 - ph / 2;
    
    this.contents.paintOpacity = opacity;
    // 描画実行
    this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy, pw, ph);
    
    // 対象選択時の白枠表示
    if (battler._selected) {
        // 小さいほうに合わせる
        if (pw > width) {
            pw = width;
        }
        if (ph > height) {
            ph = height;
        }
        this.drawSelected(dx, dy, pw, ph);
    }
};

/**
 * ●CTB用のSV戦闘キャラ表示
 */
Window_BattleCtb.prototype.drawSvActor = function(bitmap, battler, x, y, width, height, opacity) {
    // 待機モーションの中央を取得
    var motionIndex = 0;
    var pattern = 1;
    
    // 規格上１キャラの横幅、縦幅
    var imageWidth = bitmap.width / 9;
    var imageHeight = bitmap.height / 6;
    
    // 最終的に描画するサイズ
    // 収まるなら画像のサイズ、収まらないなら範囲いっぱいまで
    var pw = Math.min(width, imageWidth * paramZoom);
    var ph = Math.min(height, imageHeight * paramZoom);
    
    // 切り取る画像サイズ
    var sw = Math.floor(pw / paramZoom);
    var sh = Math.floor(ph / paramZoom);
    
    // 切り取る画像サイズが規格の範囲を超えている。
    // 元のサイズ比率を保ったまま調整する。
    if (sw > imageWidth || sh > imageHeight) {
        if (sw >= sh) {
            sh = Math.floor(sh * imageWidth / sw);
            sw = imageWidth;

        } else {
            sw = Math.floor(sw * imageHeight / sh);
            sh = imageHeight;
        }
    }
    
    // 画像描画位置
    var dx = Math.floor(x + Math.max(width - imageWidth, 0) / 2);
    var dy = Math.floor(y + Math.max(height - imageHeight, 0) / 2);
    
    // 切り取り開始位置
    var cx = Math.floor(motionIndex / 6) * 3 + pattern;
    var cy = motionIndex % 6;
    var sx = cx * imageWidth;
    var sy = cy * imageHeight;
    
    // 全体を描画できない場合、画像中央を取得するように調整
    if (sw < imageWidth) {
        sx += (imageWidth - sw) / 2;
    }
// 上から取ったほうが自然なため縦側は行わない。
//    // 全体を描画できない場合、画像中央を取得するように調整
//    if (sh < imageHeight) {
//        sy += (imageHeight - sh) / 2;
//    }
    
    // 中央に来るように描画位置を調整。※中央線を求め、そこから描画幅/2 ほど左or上にずらす。
    dx = x + width / 2 - pw / 2;
    dy = y + height / 2 - ph / 2;
    
    this.contents.paintOpacity = opacity;
    // 描画実行
    this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy, pw, ph);
    
    // 境界線（未使用）
    // this.drawBorderCtb(x, y, width, height, battlersLength, i);
    
    // 対象選択時の白枠表示
    if (battler._selected) {
        // 小さいほうに合わせる
        if (pw > width) {
            pw = width;
        }
        if (ph > height) {
            ph = height;
        }
        this.drawSelected(dx, dy, pw, ph);
    }
};

/**
 * ●CTB用のピクチャー表示
 */
Window_BattleCtb.prototype.drawPicture = function(bitmap, battler, x, y, width, height, opacity) {
    // 画像の縦幅、横幅
    var imageWidth = bitmap.width;
    var imageHeight = bitmap.height;
    
    // 最終的に描画するサイズ
    // 収まるなら画像のサイズ、収まらないなら範囲いっぱいまで
    var pw = Math.min(width, imageWidth * paramZoom);
    var ph = Math.min(height, imageHeight * paramZoom);
    
    // 切り取る画像サイズ
    var sw = Math.floor(pw / paramZoom);
    var sh = Math.floor(ph / paramZoom);
    
    // 切り取る画像サイズが画像の範囲を超えている。
    // 元のサイズ比率を保ったまま調整する。
    if (sw > imageWidth || sh > imageHeight) {
        if (sw >= sh) {
            sh = Math.floor(sh * imageWidth / sw);
            sw = imageWidth;

        } else {
            sw = Math.floor(sw * imageHeight / sh);
            sh = imageHeight;
        }
    }
    
    // 画像描画位置
    var dx = Math.floor(x + Math.max(width - imageWidth, 0) / 2);
    var dy = Math.floor(y + Math.max(height - imageHeight, 0) / 2);
    
    // 切り取り開始位置
    var sx = 0;
    var sy = 0;
    
    // 全体を描画できない場合、画像中央を取得するように調整
    if (sw < imageWidth) {
        sx += (imageWidth - sw) / 2;
    }
    // 全体を描画できない場合、画像中央を取得するように調整
    if (sh < imageHeight) {
        sy += (imageHeight - sh) / 2;
    }
    
    // 中央に来るように描画位置を調整。※中央線を求め、そこから描画幅/2 ほど左or上にずらす。
    dx = x + width / 2 - pw / 2;
    dy = y + height / 2 - ph / 2;
        
    this.contents.paintOpacity = opacity;
    // 描画実行
    this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy, pw, ph);
    
    // 境界線（未使用）
    // this.drawBorderCtb(x, y, width, height, battlersLength, i);
    
    // 対象選択時の白枠表示
    if (battler._selected) {
        // 小さいほうに合わせる
        if (pw > width) {
            pw = width;
        }
        if (ph > height) {
            ph = height;
        }
        this.drawSelected(dx, dy, pw, ph);
    }
};

/**
 * ●CTB用の境界線表示（未使用）
 */
Window_BattleCtb.prototype.drawBorderCtb = function(x, y, width, height, battlersLength, i) {
    // キャラクター同士の境界線を引く
    if (i < battlersLength - 1) {
        var colorNormal = "rgba(255, 255, 255, 1)";  // 不透明の色
        var colorAlpha = "rgba(255, 255, 255, 0.1)"; // 透明寄りの色
        
        // ウィンドウ縦表示
        if (paramHorizon == 0) {
            var lineY = y + height - 1;
            // 境界線にグラデーションをかけてみる。
            // 左から中央までの線
            this.contents.gradientFillRect(x, lineY, width / 2, 1, colorAlpha, colorNormal, false);
            // 中央から右までの線
            this.contents.gradientFillRect(x + width / 2, lineY, width / 2, 1, colorNormal, colorAlpha, false);

        // ウィンドウ横表示
        } else if (paramHorizon == 1) {
            var lineX = x + width - 1;
            // 境界線にグラデーションをかけてみる。
            // 上から中央までの線
            this.contents.gradientFillRect(lineX, y, 1, height / 2, colorAlpha, colorNormal, true);
            // 中央から下までの線
            this.contents.gradientFillRect(lineX, y + height / 2, 1, height / 2, colorNormal, colorAlpha, true);
        }
    }
}

/**
 * ●選択中のキャラは色変え
 */
Window_BattleCtb.prototype.drawSelected = function(x, y, width, height) {
    // 白の半透明
    var color = "rgba(255, 255, 255, 0.5)";
    this.contents.fillRect(x, y, width, height, color);
}

/**
 * ●ウィンドウ全体に表示するピクチャー描画
 */
Window_BattleCtb.prototype.drawWindowBackImage = function() {
    if (!paramWindowBackImage) {
        return;
    }

    var win = this;
    var bitmap = ImageManager.loadPicture(paramWindowBackImage);
    
    // 描画成功なら終了
    if (ImageManager.isReady()) {
        win.contents.paintOpacity = 255;
        win.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0);
        return;
    }
    
    // 準備完了を待って描画を行う。
    var interval = setInterval(function(){
        if (ImageManager.isReady()) {
            win.contents.paintOpacity = 255;
            win.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0);
            clearInterval(interval);
        }
    }, 10); //0.01秒間隔
};

/**
 * ●アクター・バトラーの背景に表示するピクチャー描画
 */
Window_BattleCtb.prototype.drawPersonalBackImage = function(battler, x, y) {
    var win = this;
    var bitmap = null;
    
    // 味方／敵に対応する背景画像があれば読み込む
    if (battler.isActor() && paramActorBackImage) {
        bitmap = ImageManager.loadPicture(paramActorBackImage);
    } else if (!battler.isActor() && paramEnemyBackImage) {
        bitmap = ImageManager.loadPicture(paramEnemyBackImage);
    // どちらもなければ処理しない。
    } else {
        return true;
    }

    // 描画成功なら終了
    if (ImageManager.isReady()) {
        win.contents.paintOpacity = 255;
        win.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, x, y);
        return true;
    }
    
    return false;
};

/**
 * ● 【CTTB用】ターン外境界線の描画
 */
NrpVisualTurn.drawCttbBorder = function(battler, x, y) {
    var win = this._ctbWindow;
    var borderName = "";

    // 縦表示
    if (paramHorizon == 0) {
        // 境界線表示
        // 線の描画（とりあえず注釈化）
        //win.contents.fillRect(x, y, win.contentsWidth(), 3, borderColor);
        
        borderName = "-NEXT-";
        win.changeTextColor(win.textColor(6)); // 文字色設定
        win.drawText(borderName, x, y - 16, win.contentsWidth(), "center");
        
    // 横表示
    } else if (paramHorizon == 1) {
        borderName = "◀";
        win.changeTextColor(win.textColor(6)); // 文字色設定
        win.drawText(
            borderName,
            x - 8,
            y - (win.padding * 2) + paramHeight / 2,
            win.contentsWidth(), "left");
    }
}

/**
 * ●味方の選択時
 */
var _Window_BattleActor_prototype_select = Window_BattleActor.prototype.select;
Window_BattleActor.prototype.select = function(index) {
    _Window_BattleActor_prototype_select.apply(this, arguments);
    
    // 対象の選択が有効なら再描画して選択対象を色替え
    if (index >= 0) {
        NrpVisualTurn.visualTurnList(BattleManager._actionBattlers);
    }
};

/**
 * ●敵の選択時
 */
var _Window_BattleEnemy_prototype_select = Window_BattleEnemy.prototype.select;
Window_BattleEnemy.prototype.select = function(index) {
    _Window_BattleEnemy_prototype_select.apply(this, arguments);
    
    // 対象の選択が有効なら再描画して選択対象を色替え
    if (index >= 0) {
        NrpVisualTurn.visualTurnList(BattleManager._actionBattlers);
    }
};

/**-------------------------------------------------------------
 * ●以下、状況によってCTBウィンドウの表示・非表示を切り替える。
 *--------------------------------------------------------------/
/**
 * ●パーティコマンド選択開始
 */
var _Scene_Battle_prototype_startPartyCommandSelection = Scene_Battle.prototype.startPartyCommandSelection;
Scene_Battle.prototype.startPartyCommandSelection = function() {
    _Scene_Battle_prototype_startPartyCommandSelection.call(this); // 元処理呼び出し

    // 行動順序表示
    if (BattleManager._actionBattlers.length > 0) {
        this._ctbWindow.show();
        this._ctbWindow.open();
    }
};

/**
 * ●コマンド入力開始
 */
var _BattleManager_startInput = BattleManager.startInput;
BattleManager.startInput = function() {
    _BattleManager_startInput.apply(this);
    
    // 行動順序表示
    // パーティコマンドとの重複処理になるけれど、その場合は無視されるので問題ない。
    if (this._actionBattlers.length > 0) {
        NrpVisualTurn._ctbWindow.show();
        NrpVisualTurn._ctbWindow.open();
    }
};

/**
 * ●スキル選択画面の表示
 */
var _Scene_Battle_prototype_commandSkill = Scene_Battle.prototype.commandSkill;
Scene_Battle.prototype.commandSkill = function() {
    _Scene_Battle_prototype_commandSkill.call(this); // 元処理呼び出し
    
    // CTBウィンドウを非表示
    this._ctbWindow.hide();
};

/**
 * ●味方選択決定
 */
var _Scene_Battle_prototype_onActorOk = Scene_Battle.prototype.onActorOk;
Scene_Battle.prototype.onActorOk = function() {
    _Scene_Battle_prototype_onActorOk.call(this);
    
    // 対象がクリアされたので再描画
    NrpVisualTurn.visualTurnList(BattleManager._actionBattlers);
};

/**
 * ●味方選択キャンセル
 */
var _Scene_Battle_prototype_onActorCancel = Scene_Battle.prototype.onActorCancel;
Scene_Battle.prototype.onActorCancel = function() {
    _Scene_Battle_prototype_onActorCancel.call(this);
    
    switch (this._actorCommandWindow.currentSymbol()) {
    case 'skill':
        // CTBウィンドウを非表示
        this._ctbWindow.hide();
        break;
    case 'item':
        // CTBウィンドウを非表示
        this._ctbWindow.hide();
        break;
    }
};

/**
 * ●敵選択決定
 */
var _Scene_Battle_prototype_onEnemyOk = Scene_Battle.prototype.onEnemyOk;
Scene_Battle.prototype.onEnemyOk = function() {
    _Scene_Battle_prototype_onEnemyOk.call(this);
    
    // 対象がクリアされたので再描画
    NrpVisualTurn.visualTurnList(BattleManager._actionBattlers);
};

/**
 * ●敵選択キャンセル
 */
var _Scene_Battle_prototype_onEnemyCancel = Scene_Battle.prototype.onEnemyCancel;
Scene_Battle.prototype.onEnemyCancel = function() {
    _Scene_Battle_prototype_onEnemyCancel.call(this);
    
    switch (this._actorCommandWindow.currentSymbol()) {
    case 'attack':
        // 対象が消失したので再描画
        NrpVisualTurn.visualTurnList(BattleManager._actionBattlers);
        break;
    case 'skill':
        // CTBウィンドウを非表示
        this._ctbWindow.hide();
        break;
    case 'item':
        // CTBウィンドウを非表示
        this._ctbWindow.hide();
        break;
    }
};

/**
 * ●スキル選択キャンセル
 */
var _Scene_Battle_prototype_onSkillCancel = Scene_Battle.prototype.onSkillCancel;
Scene_Battle.prototype.onSkillCancel = function() {
    _Scene_Battle_prototype_onSkillCancel.call(this); // 元処理呼び出し
    
    // CTBウィンドウを再描画して表示
    NrpVisualTurn.visualTurnList(BattleManager._actionBattlers);
    this._ctbWindow.show();
};

/**
 * ●アイテム選択画面の表示
 */
var _Scene_Battle_prototype_commandItem = Scene_Battle.prototype.commandItem;
Scene_Battle.prototype.commandItem = function() {
    _Scene_Battle_prototype_commandItem.call(this); // 元処理呼び出し
    
    // CTBウィンドウを非表示
    this._ctbWindow.hide();
};

/**
 * ●アイテム選択キャンセル
 */
var _Scene_Battle_prototype_onItemCancel = Scene_Battle.prototype.onItemCancel;
Scene_Battle.prototype.onItemCancel = function() {
    _Scene_Battle_prototype_onItemCancel.call(this); // 元処理呼び出し

    // CTBウィンドウを再描画して表示
    NrpVisualTurn.visualTurnList(BattleManager._actionBattlers);
    this._ctbWindow.show();
};

/**
 * ●スキル・アイテム選択後、対象の選択へ
 */
var _Scene_Battle_prototype_onSelectAction = Scene_Battle.prototype.onSelectAction;
Scene_Battle.prototype.onSelectAction = function() {
    _Scene_Battle_prototype_onSelectAction.call(this); // 元処理呼び出し
    
    // CTBウィンドウを表示
    this._ctbWindow.show();
};

/**
 * ●ターン開始処理
 */
var _BattleManager_startTurn = BattleManager.startTurn;
BattleManager.startTurn = function() {
    _BattleManager_startTurn.call(this);
    
    // 行動順序関連表示を閉じる
    if (paramAutoHidden == 1) {
        NrpVisualTurn._ctbWindow.close();
    }
};

/**
 * ●戦闘終了
 */
var _BattleManager_endBattle = BattleManager.endBattle;
BattleManager.endBattle = function(result) {
    // 行動順序関連表示削除
    NrpVisualTurn._ctbWindow.close();
    
    _BattleManager_endBattle.apply(this, arguments);
};

/**
 * ●コマンドを隠さない場合
 * ※パラメータがtrueでなければ、関数再定義を行わない。
 */
if (paramKeepCommandWindow) {
    /**
     * ●ステータスウィンドウの位置更新
     */
    Scene_Battle.prototype.updateWindowPositions = function() {
        // 初期位置から変更しない。
    };
    
    /**
    * ●コマンド入力完了
    */
    Scene_Battle.prototype.endCommandSelection = function() {
        this._partyCommandWindow.close();
        // アクターコマンドウィンドウを隠さない。
//        this._actorCommandWindow.close();
        // 選択解除する。
        this._actorCommandWindow.deselect();
        this._statusWindow.deselect();
    };
}

})();
