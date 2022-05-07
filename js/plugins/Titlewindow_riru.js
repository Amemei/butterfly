//=============================================================================
// Titlewindow_riru.js
//=============================================================================
/*:
 * @plugindesc タイトルのコマンドウィンドウのの選択画面を変更します。
 * @author riru
 *
 * @param Window X
 * @desc コマンドウィンドウのX座標
 * @default 288
 *
 * @param Window Y
 * @desc コマンドウィンドウのY座標
 * @default 384
 *
 * @param Background
 * @desc コマンドウィンドウの背景。0:通常 1:暗くする 2:透明
 * @default 0
 *
 * @param Width
 * @desc コマンドウィンドウの幅
 * @default 240
 *
 * @param Maxcols
 * @desc コマンドウィンドウの列数。コマンド数記入で横長に
 * @default 1
 *
 * @param Align
 * @desc コマンドウィンドウ内容の整列。0:左揃え 1:中央揃え 2:右揃え
 * @default 0
 *
 * @param Font Size
 * @desc フォントサイズ(36以上だと元の文字が見切れます
 * @default 28
 *
 * @param SPFont Color
 * @desc 重ねるフォントの色
 * @default #ffffff
 *
 * @param SPColorTone_r
 * @desc 重ねるフォントの色調(赤)
 * @default 0
  *
 * @param SPColorTone_g
 * @desc 重ねるフォントの色調(緑)
 * @default 0
 *
 * @param SPColorTone_b
 * @desc 重ねるフォントの色調(青)
 * @default 0
 *
 * @param SPColorTone_gr
 * @desc 重ねるフォントの色調(彩度)
 * @default 0
 *
 * @param SPFont Y
 * @desc 重ねるフォントのY座標補正（別プラグインのプラグイン字下げ対策）
 * @default 0
 *
 * @param Opacity
 * @desc コマンドウィンドウの元の文字の透明度
 * @default 255
 *
 * @help 
 *
 * タイトルコマンドカスタマイズプラグイン ver 1.01
 *
 *＜使い方＞
 *各パラメータを記入してお好みの仕様にしてください
 *
 * ＜規約＞
 * 有償無償問わず使用できます。改変もご自由にどうぞ。使用報告もいりません。２次配布は作成者を偽らなければOKです（ただし素材単品を有償でやりとりするのはNG）。
 *著作権は放棄していません。使用する場合は以下の作者とURLをreadmeなどどこかに記載してください
 *
 * ＜作者情報＞
 *作者：riru 
 *HP：ガラス細工の夢幻
 *URL：http://garasuzaikunomugen.web.fc2.com/index.html
 *
 *＜更新履歴＞
 * *2016年4月15日9時　Ver1.02。直接的な問題はないものの他のプラグイン等に影響を及ぼす可能性があった箇所を微修正。
 *2016年4月15日　Ver1.01。フォントサイズを大きくした際の文字きれ対策と別プラグインのルビ振り対応として重ね文字のY座標補正を追加。
 */

(function() {
    var parameters = PluginManager.parameters('Titlewindow_riru');
    var r_windowX = Number(parameters['Window X'] || 288);
    var r_windowY = Number(parameters['Window Y'] || 384);
    var r_background = Number(parameters['Background'] || 0);
    var r_width = Number(parameters['Width'] || 240);
    var r_maxcols = Number(parameters['Maxcols'] || 1);
    var r_align = Number(parameters['Align'] || 0);
    var r_fontsize = Number(parameters['Font Size'] || 28);
    var r_c_bitmapY = Number(parameters['SPFont Y'] || 0);
    var r_spfontcolor = String(parameters['SPFont Color'] || '#ffffff');
    var r_spcolortone_r = Number(parameters['SPColorTone_r'] || 0);
    var r_spcolortone_g = Number(parameters['SPColorTone_g'] || 0);
    var r_spcolortone_b = Number(parameters['SPColorTone_b'] || 0);
    var r_spcolortone_gr = Number(parameters['SPColorTone_gr'] || 0);
    var r_spcolortone = new Array(r_spcolortone_r,r_spcolortone_g,r_spcolortone_b,r_spcolortone_gr);
    var r_opacity = Number(parameters['Opacity'] || 255);
var _Riru_Titlecreate = Scene_Title.prototype.create;
Scene_Title.prototype.create = function() {
    _Riru_Titlecreate.call(this);
    this.createCommandSprite();
};
Scene_Title.prototype.createCommandSprite = function() {
    this._commandWindow.contentsOpacity = r_opacity;
    this._commandWindow._t_Sprite1 = new Sprite();
    this._commandWindow._t_Sprite2 = new Sprite();
    this._commandWindow._t_Sprite3 = new Sprite();
    this.addChild(this._commandWindow._t_Sprite1);
    this.addChild(this._commandWindow._t_Sprite2);
    this.addChild(this._commandWindow._t_Sprite3);
    this._commandWindow.titleSprite(this._commandWindow._t_Sprite1,0);
    this._commandWindow.titleSprite(this._commandWindow._t_Sprite2,1);
    this._commandWindow.titleSprite(this._commandWindow._t_Sprite3,2);
};
Window_TitleCommand.prototype.titleSprite = function(sprite,index) {
     switch (index) {  
    case 0:  // ニューゲーム
        var text = TextManager.newGame;
        sprite.visible = false;
        break;
    case 1:  // コンティニュー
        var text = TextManager.continue_;
    if (this.isContinueEnabled() != true){
    sprite.opacity = 100;
    }
    sprite.visible = false;
        break;
    case 2:  // オプション
        var text = TextManager.options;
        sprite.visible = false;
        break;
    }
    var align = this.itemTextAlign();
    var rect = this.itemRectForText(index);
    sprite.bitmap = new Bitmap(this.width, this.height);
    sprite.x = this.x;
    sprite.y = this.y;
    sprite.bitmap.textColor = r_spfontcolor;
    sprite.bitmap.fontSize = r_fontsize;
    sprite.bitmap.drawText(text, rect.x+18, rect.y+36+r_c_bitmapY, rect.width, 1,align);
    sprite.setColorTone (r_spcolortone);
        if (index === this._index){
        sprite.visible = true;
        }
};
Window_TitleCommand.prototype.updateCursor = function() {
    if (this._cursorAll) {
        var allRowsHeight = this.maxRows() * this.itemHeight();
        this.setCursorRect(0, 0, this.contents.width, allRowsHeight);
        this.setTopRow(0);
    } else {
     switch (this._index) {  
    case 0:  // ニューゲーム
    if (this._t_Sprite1 != null){
    this._t_Sprite1.visible = true;
    }
    if (this._t_Sprite2 != null){
    this._t_Sprite2.visible = false;
    }
    if (this._t_Sprite3 != null){
    this._t_Sprite3.visible = false;
    }
        break;
    case 1:  // コンティニュー
    if (this._t_Sprite1 != null){
    this._t_Sprite1.visible = false;
    }
    if (this._t_Sprite2 != null){
    this._t_Sprite2.visible = true;
    }
    if (this._t_Sprite3 != null){
    this._t_Sprite3.visible = false;
    }
        break;
    case 2:  // オプション
    if (this._t_Sprite1 != null){
    this._t_Sprite1.visible = false;
    }
    if (this._t_Sprite2 != null){
    this._t_Sprite2.visible = false;
    }
    if (this._t_Sprite3 != null){
    this._t_Sprite3.visible = true;
    }
        break;
    }
        this.setCursorRect(0, 0, 0, 0);
    }
};

//ウィンドウ自体の設定
    var _Riru_TitleCommandupdatePlacement = Window_TitleCommand.prototype.updatePlacement;
    Window_TitleCommand.prototype.updatePlacement = function() {
        _Riru_TitleCommandupdatePlacement.call(this);
        this.x = r_windowX;
        this.y = r_windowY;
        this.setBackgroundType(r_background);
    };
    Window_TitleCommand.prototype.windowWidth = function() {
        return r_width;
    };
    Window_TitleCommand.prototype.maxCols = function() {
        return r_maxcols;
    };
Window_TitleCommand.prototype.standardFontSize = function() {
    return r_fontsize;
};
Window_TitleCommand.prototype.lineHeight = function() {//1.02修正箇所。BaseからTitleCommandに
    return  Math.max(36+(r_fontsize-28)*2,36);
};
Window_TitleCommand.prototype.itemTextAlign = function() {
     switch (r_align) {  
    case 0:  // 左揃え
    return 'left';
       // break;
    case 1:  // 中央揃え
    return 'center';
    case 2:  // 右揃え
    return 'right';
    }
};
})();

