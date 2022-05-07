//=============================================================================
// TMPlugin - エネミー行動予測
// バージョン: 1.0.3
// 最終更新日: 2016/12/13
// 配布元    : http://hikimoki.sakura.ne.jp/
//-----------------------------------------------------------------------------
// Copyright (c) 2016 tomoaky
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 敵キャラの次の行動のヒントなどをテキストで表示します。
 * より戦略的なターンバトルが実現できるかもしれません。
 *
 * @author tomoaky (http://hikimoki.sakura.ne.jp/)
 *
 * @param width
 * @desc 行動予測表示の横幅。
 * 初期値: 240
 * @default 240
 *
 * @param maxLines
 * @desc 行動予測表示の最大行数。
 * 初期値: 3
 * @default 3
 *
 * @param lineHeight
 * @desc 行動予測表示の 1 行の高さ。
 * 初期値: 36
 * @default 36
 *
 * @param fontSize
 * @desc 行動予測表示のフォントサイズ。
 * 初期値: 28
 * @default 28
 *
 * @param color
 * @desc 行動予測表示の文字色。
 * 初期値: white
 * @default white
 *
 * @param backColor
 * @desc 行動予測表示の背景の色。
 * 初期値: black
 * @default black
 *
 * @param backOpacity
 * @desc 行動予測表示の背景の不透明度。
 * 初期値: 128 ( 0 ～ 255 )
 * @default 128
 *
 * @param textAlign
 * @desc 行動予測表示の行揃え。
 * 初期値: center (left / center / right)
 * @default center 
 * 
 * @param headerText
 * @desc 行動予測表示のヘッダーテキスト。
 * 初期値: Next
 * @default Next
 *
 * @param headerHeight
 * @desc 行動予測表示のヘッダーの高さ。
 * 初期値: 20
 * @default 20
 *
 * @param headerFontSize
 * @desc 行動予測表示のヘッダーのフォントサイズ。
 * 初期値: 16
 * @default 16
 *
 * @param headerColor
 * @desc 行動予測表示のヘッダーの文字色。
 * 初期値: red
 * @default red
 *
 * @param cornerRadius
 * @desc TMBitmapEx.js導入時の、角丸矩形の丸部分の半径。
 * 初期値: 6
 * @default 6
 *
 * @help
 * 使い方:
 *
 *   スキルのメモ欄に <fsText:予測テキスト> のようなタグで行動予測の設定を
 *   してください。
 *   戦闘シーンでパーティのコマンドを入力している間、敵グラフィックに
 *   重なるように予測テキストが表示されるようになります。
 *
 *   このプラグインは RPGツクールMV Version 1.3.4 で動作確認をしています。
 *
 *
 * メモ欄タグ（スキル）:
 *
 *   <fsText:予測テキスト>
 *     敵がこのスキルを使用するターンのコマンド入力中に、予測テキストが
 *     敵グラフィックに重なるように表示されます。
 *     このタグがない場合はスキル名を代わりに表示します。
 *
 *     予測テキストを途中で改行することで、行動予測の表示も複数行になります。
 *     ただしプラグインパラメータ maxLines で設定した行数を超えることは
 *     できません。
 *
 *
 * メモ欄タグ（敵キャラ）:
 *
 *   <fsOffsetX:50>
 *     この敵の行動予測の表示位置を右に 50 ドットずらします。左にずらす場合は
 *     負の値を設定してください。
 *
 *   <fsOffsetY:80>
 *     この敵の行動予測の表示位置を下に 80 ドットずらします。上にずらす場合は
 *     負の値を設定してください。
 *
 *
 * プラグインコマンド:
 *
 *   fsStop
 *     行動予測機能を無効にします。ゲーム開始時は行動予測機能が有効に
 *     なっています。行動予測機能の状態はセーブデータに保存されます。
 *
 *   fsStart
 *     無効にした行動予測機能を有効にします。
 *
 *
 * プラグインパラメータ補足:
 *
 *   maxLines
 *     行動予測表示の最大行数を設定します。行数が多いほど大きなビットマップが
 *     生成されるため、必要以上に大きな値は設定しないでください。
 * 
 *     1ターンに複数回の行動がある場合、行動回数分の行数が必要になります。
 *     行動予測表示に改行を利用する場合はさらに必要な行数が増えます。
 *
 *   color / backColor / headerColor
 *     このパラメータには、black や blue といったカラーネームと、
 *     #000000 や #0000ff のようなカラーコードを設定することができます。
 *
 *   headerText
 *     行動予測の左上に表示するヘッダーテキストです。何も入力しなければ
 *     ヘッダーテキストは非表示になります。
 *
 *   cornerRadius
 *     TMBitmapEx.js をこのプラグインよりも上の位置に導入しつつ、
 *     このパラメータの値を 1 以上にすることで、行動予測の背景を
 *     角丸の矩形にすることができます。
 */

var Imported = Imported || {};
Imported.TMFutureSight = true;

var TMPlugin = TMPlugin || {};
TMPlugin.FutureSight = {};
TMPlugin.FutureSight.Parameters = PluginManager.parameters('TMFutureSight');
TMPlugin.FutureSight.Width          = +(TMPlugin.FutureSight.Parameters['width'] || 240);
TMPlugin.FutureSight.MaxLines       = +(TMPlugin.FutureSight.Parameters['maxLines'] || 3);
TMPlugin.FutureSight.LineHeight     = +(TMPlugin.FutureSight.Parameters['lineHeight'] || 36);
TMPlugin.FutureSight.FontSize       = +(TMPlugin.FutureSight.Parameters['fontSize'] || 28);
TMPlugin.FutureSight.Color          =   TMPlugin.FutureSight.Parameters['color'] || 'white';
TMPlugin.FutureSight.BackColor      =   TMPlugin.FutureSight.Parameters['backOpacity'] || 'black';
TMPlugin.FutureSight.BackOpacity    = +(TMPlugin.FutureSight.Parameters['backOpacity'] || 128);
TMPlugin.FutureSight.CornerRadius   = +(TMPlugin.FutureSight.Parameters['cornerRadius'] || 6);
TMPlugin.FutureSight.TextAlign      =   TMPlugin.FutureSight.Parameters['textAlign'] || 'center';
TMPlugin.FutureSight.HeaderText     =   TMPlugin.FutureSight.Parameters['headerText'];
TMPlugin.FutureSight.HeaderHeight   = +(TMPlugin.FutureSight.Parameters['headerHeight'] || 20);
TMPlugin.FutureSight.HeaderFontSize = +(TMPlugin.FutureSight.Parameters['headerFontSize'] || 16);
TMPlugin.FutureSight.HeaderColor    =   TMPlugin.FutureSight.Parameters['headerColor'] || 'red';

(function() {

  //-----------------------------------------------------------------------------
  // Game_System
  //

  Game_System.prototype.isFutureSightEnabled = function() {
    if (this._futureSightEnabled == null) this._futureSightEnabled = true;
    return this._futureSightEnabled;
  };

  Game_System.prototype.disableFutureSight = function() {
    this._futureSightEnabled = false;
  };

  Game_System.prototype.enableFutureSight = function() {
    this._futureSightEnabled = true;
  };

  //-----------------------------------------------------------------------------
  // Game_Enemy
  //

  Game_Enemy.prototype.setFutureSightTexts = function() {
    this._futureSightTexts = [];
    for (var i = 0; i < this._actions.length; i++) {
      if (this._actions[i]) {
        var skill = this._actions[i].item();
        if (skill) this._futureSightTexts.push(skill.meta.fsText || skill.name);
      }
    }
  };

  Game_Enemy.prototype.resetFutureSightTexts = function() {
    this._futureSightTexts = [];
  };

  Game_Enemy.prototype.futureSightTexts = function() {
    return this._futureSightTexts || [];
  };
  
  //-----------------------------------------------------------------------------
  // Game_Troop
  //

  var _Game_Troop_makeActions = Game_Troop.prototype.makeActions;
  Game_Troop.prototype.makeActions = function() {
    _Game_Troop_makeActions.call(this);
    if ($gameSystem.isFutureSightEnabled() && !BattleManager._preemptive) {
      this.members().forEach(function(member) {
        member.setFutureSightTexts();
      });
    }
  };

  var _Game_Troop_increaseTurn = Game_Troop.prototype.increaseTurn;
  Game_Troop.prototype.increaseTurn = function() {
    _Game_Troop_increaseTurn.call(this);
    this.members().forEach(function(member) {
      member.resetFutureSightTexts();
    });
  };

  //-----------------------------------------------------------------------------
  // Game_Interpreter
  //

  var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'fsStart') {
      $gameSystem.enableFutureSight();
    } else if (command === 'fsStop') {
      $gameSystem.disableFutureSight();
    }
  };
  
  //-----------------------------------------------------------------------------
  // Sprite_Enemy
  //

  var _Sprite_Enemy_update = Sprite_Enemy.prototype.update;
  Sprite_Enemy.prototype.update = function() {
    _Sprite_Enemy_update.call(this);
    if (this._enemy) this.updateFutureSight();
  };

  Sprite_Enemy.prototype.updateFutureSight = function() {
    if (!this._futureSightSprite && this.parent) {
      this._futureSightSprite = new Sprite_FutureSight(this);
      this.parent.addChild(this._futureSightSprite);
    }
  };

  //-----------------------------------------------------------------------------
  // Sprite_FutureSight
  //

  function Sprite_FutureSight() {
    this.initialize.apply(this, arguments);
  }

  Sprite_FutureSight.prototype = Object.create(Sprite.prototype);
  Sprite_FutureSight.prototype.constructor = Sprite_FutureSight;

  Sprite_FutureSight.prototype.initialize = function(enemySprite) {
    Sprite.prototype.initialize.call(this);
    this._enemySprite = enemySprite;
    var width = TMPlugin.FutureSight.Width;
    var height = TMPlugin.FutureSight.LineHeight * TMPlugin.FutureSight.MaxLines +
                 TMPlugin.FutureSight.HeaderHeight;
    this.bitmap = new Bitmap(width, height);
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this.z = 10;
    this._texts = [];
  };

  Sprite_FutureSight.prototype.refresh = function() {
    this.bitmap.clear();
    if (this._texts.length > 0) {
      var lines = this._texts.reduce(function(r, text) {
        return r + text.split('\n').length;
      }, 0);
      var y = TMPlugin.FutureSight.HeaderHeight;
      var width = this.bitmap.width;
      var height = TMPlugin.FutureSight.LineHeight * lines;
      this.bitmap.paintOpacity = TMPlugin.FutureSight.BackOpacity;
      if (Imported.TMBitmapEx && TMPlugin.FutureSight.CornerRadius) {
        this.bitmap.fillRoundRect(0, y, width, height, TMPlugin.FutureSight.CornerRadius,
                                  TMPlugin.FutureSight.BackColor);
      } else {
        this.bitmap.fillRect(0, y, width, height, TMPlugin.FutureSight.BackColor);
      }
      this.bitmap.paintOpacity = 255;
      if (TMPlugin.FutureSight.HeaderText) {
        this.bitmap.fontSize = TMPlugin.FutureSight.HeaderFontSize;
        this.bitmap.textColor = TMPlugin.FutureSight.HeaderColor;
        this.bitmap.drawText(TMPlugin.FutureSight.HeaderText, 0, 0, width,
                            TMPlugin.FutureSight.HeaderHeight);
      }
      this.bitmap.fontSize = TMPlugin.FutureSight.FontSize;
      this.bitmap.textColor = TMPlugin.FutureSight.Color;
      for (var i = 0; i < this._texts.length; i++) {
        var text = this._texts[i];
        var arr = text.split('\n');
        for (var j = 0; j < arr.length; j++) {
          this.bitmap.drawText(arr[j], 4, y, width - 8, TMPlugin.FutureSight.LineHeight,
                               TMPlugin.FutureSight.TextAlign);
          y += TMPlugin.FutureSight.LineHeight;
        }
      }
    }
  };

  Sprite_FutureSight.prototype.update = function() {
    Sprite.prototype.update.call(this);
    var futureSightTexts = this._enemySprite._enemy.futureSightTexts().concat();
    if (this._texts.toString() !== futureSightTexts.toString()) {
      this._texts = futureSightTexts;
      this.refresh();
    }
    var enemy = this._enemySprite._enemy.enemy();
    this.x = this._enemySprite.x + (+enemy.meta.fsOffsetX || 0);
    this.y = this._enemySprite.y + (+enemy.meta.fsOffsetY || 0);
  };

})();
