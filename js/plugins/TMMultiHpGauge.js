//=============================================================================
// TMPlugin - マルチＨＰゲージ
// バージョン: 0.1.0b
// 最終更新日: 2018/05/09
// 配布元    : http://hikimoki.sakura.ne.jp/
//-----------------------------------------------------------------------------
// Copyright (c) 2018 tomoaky
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc マップシーンに複数のＨＰゲージウィンドウを表示します。
 *
 * @author tomoaky (http://hikimoki.sakura.ne.jp/)
 *
 * @param gaugeWindowX
 * @type number
 * @min -1000
 * @desc ＨＰゲージウィンドウのＸ座標
 * 初期値: 0
 * @default 0
 *
 * @param gaugeWindowY
 * @type number
 * @min -1000
 * @desc ＨＰゲージウィンドウのＹ座標
 * 初期値: 0
 * @default 0
 *
 * @param gaugeWindowWidth
 * @type number
 * @desc ＨＰゲージウィンドウの幅
 * 初期値: 288
 * @default 288
 *
 * @param gaugeWindowHeight
 * @type number
 * @desc ＨＰゲージウィンドウの高さ
 * 初期値: 64
 * @default 64
 * 
 * @param gaugeWindowSpaceX
 * @type number
 * @min -1000
 * @desc ＨＰゲージを並べる際にずらす左右方向のドット数
 * 初期値: 0
 * @default 0
 * 
 * @param gaugeWindowSpaceY
 * @type number
 * @min -1000
 * @desc ＨＰゲージを並べる際にずらす上下方向のドット数
 * 初期値: 64
 * @default 64
 * 
 * @param gaugeA
 * @type struct<Gauge>
 * @desc ゲージＡのパラメータ
 * @default {"type":"HP","x":"12","y":"12","width":"144","height":"36","fontSize":"28","param":"0","max":"0","name":"AP","color":"#ff60c0 #ffa0e0"}
 *
 * @param gaugeB
 * @type struct<Gauge>
 * @desc ゲージＢのパラメータ
 * @default {"type":"","x":"12","y":"12","width":"144","height":"36","fontSize":"28","param":"0","max":"0","name":"AP","color":"#ff60c0 #ffa0e0"}
 *
 * @param gaugeC
 * @type struct<Gauge>
 * @desc ゲージＣのパラメータ
 * @default {"type":"","x":"12","y":"12","width":"144","height":"36","fontSize":"28","param":"0","max":"0","name":"AP","color":"#ff60c0 #ffa0e0"}
 *
 * @param gaugeD
 * @type struct<Gauge>
 * @desc ゲージＤのパラメータ
 * @default {"type":"","x":"12","y":"12","width":"144","height":"36","fontSize":"28","param":"0","max":"0","name":"AP","color":"#ff60c0 #ffa0e0"}
 *
 * @param faceOffsetX
 * @type number
 * @min -1000
 * @desc 顔グラフィックのＸ座標補正値
 * 初期値: -4 ( -1000 で顔グラフィックを使用しない)
 * @default -4
 *
 * @param faceOffsetY
 * @type number
 * @min -1000
 * @desc 顔グラフィックのＹ座標補正値
 * 初期値: -4
 * @default -4
 *
 * @param stateIconMax
 * @type number
 * @desc ステートアイコンを表示する個数
 * 初期値: 4
 * @default 4
 *
 * @param stateIconX
 * @type number
 * @min -1000
 * @desc ステートアイコンのＸ座標
 * 初期値: 156
 * @default 156
 *
 * @param stateIconY
 * @type number
 * @min -1000
 * @desc ステートアイコンのＹ座標
 * 初期値: 24
 * @default 24
 *
 * @param namePosition
 * @type struct<Position>
 * @desc 名前の表示設定
 * @default {"x":"0","y":"0","width":"0","fontSize":"28"}

 * @param goldPosition
 * @type struct<Position>
 * @desc 所持金の表示設定
 * @default {"x":"0","y":"0","width":"0","fontSize":"28"}

 * @param vnMax
 * @type boolean
 * @desc ゲージタイプ VN の最大値を表示するかどうか
 * 初期値: OFF ( false = OFF 隠さない / true = ON 隠す )
 * @default false
 *
 * @param shakeTime
 * @type number
 * @desc ダメージを受けたときにウィンドウを揺らす時間（フレーム）
 * 初期値: 20 ( 0 で揺らさない )
 * @default 20
 *
 * @param startVisible
 * @type boolean
 * @desc ゲーム開始時の表示状態
 * 初期値: ON（ false = OFF 非表示 / true = ON 表示 ）
 * @default true
 *
 * @param windowOpacity
 * @type number
 * @desc ＨＰゲージウィンドウの不透明度
 * 初期値: 255
 * @default 255
 *
 * @param collideOpacity
 * @type number
 * @max 255
 * @desc プレイヤーと重なったときの不透明度
 * 初期値: 128（ 0 ～ 255 ）
 * @default 128
 *
 * @param messageBusyHide
 * @type boolean
 * @desc メッセージウィンドウ表示中はＨＰゲージウィンドウを隠す
 * 初期値: ON ( false = OFF 隠さない / true = ON 隠す )
 * @default true
 *
 * @param eventBusyHide
 * @type boolean
 * @desc イベント起動中はＨＰゲージウィンドウを隠す
 * 初期値: ON（ false = OFF 隠さない / true = ON 隠す )
 * @default true
 *
 * @param useBattleScene
 * @type boolean
 * @desc 戦闘シーンでもＨＰゲージウィンドウを表示する。
 * 初期値: OFF（ false = OFF 表示しない / true = ON 表示する )
 * @default false
 *
 * @param gaugeWindowBattleX
 * @type number
 * @min -1000
 * @desc 戦闘シーンのＨＰゲージウィンドウのＸ座標
 * 初期値: 0
 * @default 0
 *
 * @param gaugeWindowBattleY
 * @type number
 * @min -1000
 * @desc 戦闘シーンのＨＰゲージウィンドウのＹ座標
 * 初期値: 0
 * @default 0
 *
 * @help
 * TMPlugin - マルチＨＰゲージ ver0.1.0b
 * 
 * 使い方:
 *
 *   プラグインパラメータをいじってお好みのＨＰゲージを表示してください。
 *
 *   このプラグインは RPGツクールMV Version 1.5.1 で動作確認をしています。
 *
 *   このプラグインはMITライセンスのもとに配布しています、商用利用、
 *   改造、再配布など、自由にお使いいただけます。
 *
 * 
 * プラグインコマンド:
 *
 *   showHpGauge
 *     ＨＰゲージウィンドウを表示します。
 *     プラグインパラメータ startVisible が 0 の場合、
 *     このコマンドが実行されるまでＨＰゲージは表示されません。
 *
 *   hideHpGauge
 *     ＨＰゲージウィンドウを隠します。showHpGauge コマンドが実行されるまで
 *     表示されないままです。
 * 
 *   showHpGauge A
 *     ゲージＡを表示します。プラグインパラメータでタイプが設定されている場合、
 *     ゲーム開始時に自動的に表示状態になります。
 * 
 *   hideHpGauge B
 *     ゲージＢを隠します。showHpGauge B コマンドが実行されるまで
 *     表示されないままです。
 * 
 *   moveHpGaugeWindow 100 200
 *     ＨＰゲージウィンドウの位置を X座標 = 100 / Y座標 = 200 の位置へ
 *     移動します。
 *
 *
 * プラグインパラメータ補足:
 *
 *   gaugeA ～ gaugeD
 * 
 *     param
 *       ゲージのタイプが VN の場合に、ゲージの現在値として扱う
 *       ゲーム変数番号を設定してください。
 *       設定した番号から連続する 4 つ(パーティ人数分)の変数を使用します。
 *       5 を設定した場合は 5 ～ 8 番の変数を使用します。
 *
 *     max
 *       ゲージのタイプが VN の場合に、ゲージの最大値として扱う
 *       ゲーム変数番号を指定してください。
 *       このパラメータに設定した番号のゲーム変数に値を代入することで、
 *       初めて最大値として機能します。
 *       この設定はゲージの長さにのみ影響します、変数の値が最大値を
 *       超えなくなるような機能はありません。
 *       param と同じように、設定した番号から連続する 4 つの変数を使用します。
 *       他で使う変数とかぶらないように注意してください。
 * 
 *   windowOpacity / collideOpacity
 *     windowOpacity はウィンドウフレーム及び背景に影響し、collideOpacity
 *     はゲージや顔グラフィックにも影響します。
 *     windowOpacity の値が collideOpacity よりも低い場合、プレイヤーと
 *     重なった際の不透明度として windowOpacity の値が適用されます。
 *     ただし、ゲージと顔グラフィックに関しては通常どおり collideOpacity の
 *     値が適用されます。
 * 
 *   faceOffsetX
 *     この値を -1000 に設定すると顔グラフィックが非表示となります。
 */
/*~struct~Gauge:
 *
 * @param type
 * @type select
 * @option なし
 * @value 
 * @option HP
 * @option MP
 * @option TP
 * @option LV
 * @option VN
 * @desc ゲージのタイプ（HP / MP / TP / LV / VN）
 * 初期値: HP
 * @default HP
 *
 * @param x
 * @type number
 * @min -1000
 * @desc ゲージのＸ座標（ウィンドウ内の左端が 0 ）
 * 初期値: 12
 * @default 12
 *
 * @param y
 * @type number
 * @min -1000
 * @desc ゲージのＹ座標（ウィンドウ内の上端が 0 ）
 * 初期値: 12
 * @default 12
 *
 * @param width
 * @type number
 * @desc ゲージの長さ
 * 初期値: 144
 * @default 144
 *
 * @param height
 * @type number
 * @desc ゲージの表示領域（数値とゲージ合わせて）の高さ
 * 初期値: 36
 * @default 36
 *
 * @param fontSize
 * @type number
 * @desc フォントサイズ
 * 初期値: 28
 * @default 28
 *
 * @param param
 * @type variable
 * @desc ゲージのタイプが VN のときに現在値とするゲーム変数番号
 * ( 設定した番号から連続する 4 つの変数を使用します )
 * @default 0
 *
 * @param max
 * @type variable
 * @desc ゲージのタイプが VN のときに最大値とするゲーム変数番号
 * ( 設定した番号から連続する 4 つの変数を使用します )
 * @default 0
 *
 * @param name
 * @type string
 * @desc ゲージのタイプが VN のときに表示するパラメータ名
 * 初期値: AP
 * @default AP
 *
 * @param color
 * @type string
 * @desc ゲージのタイプが LV / VN のときのゲージカラー
 * 初期値: #ff60c0 #ffa0e0
 * @default #ff60c0 #ffa0e0
 */
/*~struct~Position:
 *
 * @param x
 * @type number
 * @min -1000
 * @desc Ｘ座標
 * @default 0
 *
 * @param y
 * @type number
 * @min -1000
 * @desc Ｙ座標
 * @default 0
 *
 * @param width
 * @type number
 * @desc 表示幅 ( 0 で非表示 )
 * @default 0
 *
 * @param fontSize
 * @type number
 * @desc フォントサイズ
 * 初期値: 28
 * @default 28
 */

var Imported = Imported || {};
Imported.TMMapHpGauge = true;

(function() {

  var parameters = PluginManager.parameters('TMMultiHpGauge');
  var gaugeWindowX = +(parameters['gaugeWindowX'] || 0);
  var gaugeWindowY = +(parameters['gaugeWindowY'] || 0);
  var gaugeWindowWidth = +(parameters['gaugeWindowWidth'] || 288);
  var gaugeWindowHeight = +(parameters['gaugeWindowHeight'] || 64);
  var gaugeWindowSpaceX = +(parameters['gaugeWindowSpaceX'] || 0);
  var gaugeWindowSpaceY = +(parameters['gaugeWindowSpaceY'] || 64);
  var gauges = [];
  ['A', 'B', 'C', 'D'].forEach (function(code, i) {
    gauges[i] = JSON.parse(parameters['gauge' + code]);
    gauges[i].x = +gauges[i].x;
    gauges[i].y = +gauges[i].y;
    gauges[i].width = +gauges[i].width;
    gauges[i].height = +gauges[i].height;
    gauges[i].fontSize = +gauges[i].fontSize;
    gauges[i].param = +gauges[i].param;
    gauges[i].max = +gauges[i].max;
    gauges[i].color = gauges[i].color.split(' ');
  });
  var faceOffsetX = +(parameters['faceOffsetX'] || -4);
  var faceOffsetY = +(parameters['faceOffsetY'] || -4);
  var stateIconMax = +(parameters['stateIconMax'] || 4);
  var stateIconX = +(parameters['stateIconX'] || 156);
  var stateIconY = +(parameters['stateIconY'] || 24);
  var namePosition = JSON.parse(parameters['namePosition'] || '{}');
  var goldPosition = JSON.parse(parameters['goldPosition'] || '{}');
  var vnMax = JSON.parse(parameters['vnMax'] || 'false');
  var shakeTime = +(parameters['shakeTime'] || 20);
  var collideOpacity = +(parameters['collideOpacity'] || 128);
  var startVisible = JSON.parse(parameters['startVisible'] || 'true');
  var windowOpacity = +(parameters['windowOpacity'] || 255);
  var messageBusyHide = JSON.parse(parameters['messageBusyHide'] || 'true');
  var eventBusyHide = JSON.parse(parameters['eventBusyHide'] || 'true' );
  var useBattleScene = JSON.parse(parameters['useBattleScene'] || 'false');
  var gaugeWindowBattleX = +(parameters['gaugeWindowBattleX'] || 0);
  var gaugeWindowBattleY = +(parameters['gaugeWindowBattleY'] || 0);

  //-----------------------------------------------------------------------------
  // Game_System
  //

  Game_System.prototype.isVisibleMapHpGauge = function() {
    if (this._visibleMapHpGauge == null) this._visibleMapHpGauge = startVisible;
    return this._visibleMapHpGauge;
  };
  
  Game_System.prototype.setVisibleMapHpGauge = function(flag) {
    this._visibleMapHpGauge = flag;
  };

  Game_System.prototype.isVisibleMapHpGauges = function(gaugeId) {
    if (this._visibleMapHpGauges == null) {
      this._visibleMapHpGauges = [];
      for (var i = 0; i < gauges.length; i++) {
        this._visibleMapHpGauges[i] = gauges[i].type !== '';
      }
    }
    return this._visibleMapHpGauges[gaugeId];
  };

  Game_System.prototype.setVisibleMapHpGauges = function(gaugeId, flag) {
    this._visibleMapHpGauges[gaugeId] = flag;
  };

  //-----------------------------------------------------------------------------
  // Game_Interpreter
  //

  var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'showHpGauge') {
      if (args[0]) {
        var gaugeId = ['A', 'B', 'C', 'D'].indexOf(args[0]);
        $gameSystem.setVisibleMapHpGauges(gaugeId, true);
      } else {
        $gameSystem.setVisibleMapHpGauge(true);
      }
    } else if (command === 'hideHpGauge') {
      if (args[0]) {
        var gaugeId = ['A', 'B', 'C', 'D'].indexOf(args[0]);
        $gameSystem.setVisibleMapHpGauges(gaugeId, false);
      } else {
        $gameSystem.setVisibleMapHpGauge(false);
      }
    } else if (command === 'moveHpGaugeWindow') {
      $gameSystem._mapHpGaugeWindowX = +args[0];
      $gameSystem._mapHpGaugeWindowY = +args[1];
    }
  };

  //-----------------------------------------------------------------------------
  // Window_MapHpGauge
  //

  function Window_MapHpGauge() {
    this.initialize.apply(this, arguments);
  }

  Window_MapHpGauge.prototype = Object.create(Window_Base.prototype);
  Window_MapHpGauge.prototype.constructor = Window_MapHpGauge;

  Window_MapHpGauge.prototype.initialize = function(gaugeId) {
    Window_Base.prototype.initialize.call(this, 0, 0, gaugeWindowWidth, gaugeWindowHeight);
    this._gaugeId = gaugeId;
    this.refreshPosition();
    this.openness = $gameSystem.isVisibleMapHpGauge() && this.actor() ? 255 : 0;
    this.opacity = windowOpacity;
    this._gaugeParams = [];
    this._gaugeVisible = [];
    for (var i = 0; i < gauges.length; i++) {
      this._gaugeParams.push({param: -1, max: -1});
      this._gaugeVisible[i] = $gameSystem.isVisibleMapHpGauges(i);
    }
    this._icons = [];
    this._gold = 0;
    this._name = '';
    this._actorId = -1;
    this._shakeDuration = 0;
    this._needFaceRefresh = false;
    this._hideCount = 0;
  };

  Window_MapHpGauge.prototype.lineHeight = function() {
    return this._lineHeight || 36;
  };

  Window_MapHpGauge.prototype.standardPadding = function() {
    return 0;
  };

  Window_MapHpGauge.prototype.actor = function() {
    return $gameParty.members()[this._gaugeId];
  };

  Window_MapHpGauge.prototype.refreshPosition  = function() {
    if (SceneManager.isNextScene(Scene_Battle)) {
      this.x = gaugeWindowBattleX;
      this.y = gaugeWindowBattleY;
    } else {
      this.x = $gameSystem._mapHpGaugeWindowX != null ? $gameSystem._mapHpGaugeWindowX : gaugeWindowX;
      this.y = $gameSystem._mapHpGaugeWindowY != null ? $gameSystem._mapHpGaugeWindowY : gaugeWindowY;
    }
    this.x += gaugeWindowSpaceX * this._gaugeId;
    this.y += gaugeWindowSpaceY * this._gaugeId;
    this._baseX = this.x;
  };

  Window_MapHpGauge.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    if (this.updateVisibility()) {
      this.open();
      var needRefresh = this.isNeedRefresh()
      if (this._needFaceRefresh) {
        this.refreshFace();
        if (!this._needFaceRefresh) needRefresh = true;
      }
      if (needRefresh) {
        var actor = this.actor();
        if (needRefresh === 'SHAKE') this._shakeDuration = shakeTime;
        for (var i = 0; i < gauges.length; i++) {
          this._gaugeVisible[i] = $gameSystem.isVisibleMapHpGauges(i);
          var gauge = gauges[i];
          if (gauge.type === 'HP') {
            this._gaugeParams[i].param = actor.hp;
            this._gaugeParams[i].max = actor.mhp;
          } else if (gauge.type === 'MP') {
            this._gaugeParams[i].param = actor.mp;
            this._gaugeParams[i].max = actor.mmp;
          } else if (gauge.type === 'TP') {
            this._gaugeParams[i].param = actor.tp;
            this._gaugeParams[i].max = actor.maxTp();
          } else if (gauge.type === 'LV') {
            this._gaugeParams[i].param = actor.currentExp();
            this._gaugeParams[i].max = actor.nextLevelExp();
            this._gaugeParams[i].subParam = actor.level;
          } else if (gauge.type === 'VN') {
            this._gaugeParams[i].param = $gameVariables.value(gauge.param + this._gaugeId);
            this._gaugeParams[i].max = $gameVariables.value(gauge.max + this._gaugeId);
          }
        }
        this._icons = actor.stateIcons().concat(actor.buffIcons());
        this._gold = $gameParty.gold();
        this._name = actor.name();
        this._actorId = actor.actorId();
        this.refresh();
      }
      this.updateShake();
      this.updateOpacity();
    } else {
      this.close();
    }
  };

  Window_MapHpGauge.prototype.updateVisibility = function() {
    if (!$gameSystem.isVisibleMapHpGauge()) return false;
    if ($gameParty.inBattle()) return true;
    if ((eventBusyHide && $gameMap.isEventRunning()) ||
        (messageBusyHide && $gameMessage.isBusy())) {
      this._hideCount++;
    } else {
      this._hideCount = 0;
    }
    return this._hideCount < 10 && this.actor();
  };

  Window_MapHpGauge.prototype.isNeedRefresh = function() {
    var actor = this.actor();
    if (actor) {
      if (this._actorId !== actor.actorId()) return true;
      for (var i = 0; i < gauges.length; i++) {
        if (this._gaugeVisible[i] !== $gameSystem.isVisibleMapHpGauges(i)) return true;
        var gauge = gauges[i];
        var gaugeParam = this._gaugeParams[i];
        if (gauge.type === 'HP') {
          if (gaugeParam.param !== actor.hp || gaugeParam.max !== actor.mhp) {
            return gaugeParam.param > actor.hp ? 'SHAKE' : true;
          }
        } else if (gauge.type === 'MP') {
          if (gaugeParam.param !== actor.mp || gaugeParam.max !== actor.mmp) return true;
        } else if (gauge.type === 'TP') {
          if (gaugeParam.param !== actor.tp || gaugeParam.max !== actor.maxTp()) return true;
        } else if (gauge.type === 'LV') {
          if (gaugeParam.param !== actor.currentExp() || gaugeParam.max !== actor.nextLevelExp() ||
              gaugeParam.subParam !== actor.level) return true;
        } else if (gauge.type === 'VN') {
          if (gaugeParam.param !== $gameVariables.value(gauge.param + this._gaugeId) ||
              gaugeParam.max !== $gameVariables.value(gauge.max + this._gaugeId)) return true;
        }
      }
      if (stateIconMax > 0) {
        var icons = actor.stateIcons().concat(actor.buffIcons());
        if (this._icons.toString() !== icons.toString()) return true;
      }
      if (+namePosition.width > 0 && this._name !== actor.name()) return true;
      if (+goldPosition.width > 0 && this._gold !== $gameParty.gold()) return true;
    }
    return false;
  };

  Window_MapHpGauge.prototype.updateShake = function() {
    if (this._shakeDuration > 0) {
      this._shakeDuration--;
      this.x = this._baseX;
      if (this._shakeDuration > 0) {
        this.x += Math.floor(Math.sin((this._shakeDuration % 10) * Math.PI / 5) * 8);
      }
    }
  };

  Window_MapHpGauge.prototype.updateOpacity = function() {
    if (this.x < $gamePlayer.screenX() + 24 &&
        this.x + gaugeWindowWidth > $gamePlayer.screenX() - 24 &&
        this.y < $gamePlayer.screenY() &&
        this.y + gaugeWindowHeight > $gamePlayer.screenY() - 48) {
      this.opacity = Math.min(collideOpacity, windowOpacity);
      this.contentsOpacity = collideOpacity;
    } else {
      this.opacity = windowOpacity;
      this.contentsOpacity = 255;
    }
  };

  Window_MapHpGauge.prototype.refresh = function() {
    this.contents.clear();
    var actor = this.actor();
    if (actor) {
      this.refreshFace();
      for (var i = 0; i < gauges.length; i++) {
        if (!$gameSystem.isVisibleMapHpGauges(i)) continue;
        var gauge = gauges[i];
        this._lineHeight = gauge.height;
        this.contents.fontSize = gauge.fontSize;
        if (gauge.type === 'HP') {
          this.drawActorHp(actor, gauge.x, gauge.y, gauge.width);
        } else if (gauge.type === 'MP') {
          this.drawActorMp(actor, gauge.x, gauge.y, gauge.width);
        } else if (gauge.type === 'TP') {
          this.drawActorTp(actor, gauge.x, gauge.y, gauge.width);
        } else if (gauge.type === 'LV') {
          this.drawLvGauge(actor, gauge);
        } else if (gauge.type === 'VN') {
          this.drawVnGauge(this._gaugeParams[i], gauge);
        }
      }
      for (var i = 0; i < stateIconMax; i++) {
        if (!this._icons[i]) break;
        var x = stateIconX + i * Window_Base._iconWidth;
        this.drawIcon(this._icons[i], x, stateIconY);
      }
      if (+namePosition.width > 0) {
        this.contents.fontSize = +namePosition.fontSize;
        this.changeTextColor(this.hpColor(actor));
        this.drawText(this._name, +namePosition.x, +namePosition.y, +namePosition.width);
        this.resetFontSettings();
      }
      if (+goldPosition.width > 0) {
        this.contents.fontSize = +goldPosition.fontSize;
        this.drawCurrencyValue(this._gold, TextManager.currencyUnit,
                               +goldPosition.x, +goldPosition.y, +goldPosition.width);
        this.resetFontSettings();
      }
      this._lineHeight = 36;
    }
  };

  Window_MapHpGauge.prototype.drawLvGauge = function(actor, gauge) {
    if (actor.isMaxLevel()) {
      var value1 = '-------';
      var value2 = '-------';
      var rate = 1;
    } else {
      var n = actor.currentLevelExp();
      var value1 = actor.currentExp() - n;
      var value2 = actor.nextLevelExp() - n;
      var rate = value1 / value2;
    }
    this.drawGauge(gauge.x, gauge.y, gauge.width, rate, gauge.color[0], gauge.color[1]);
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.levelA, gauge.x, gauge.y, 44);
    var color = this.normalColor();
    this.changeTextColor(color);
    var width = this.textWidth(TextManager.levelA) + 4;
    this.drawText(actor.level, gauge.x + width, gauge.y, 44)
    width = gauge.width - width - this.textWidth('' + actor.level);
    this.drawCurrentAndMax(value1, value2, gauge.x + gauge.width - width, gauge.y, width,
                           color, color);
  };
  
  Window_MapHpGauge.prototype.drawVnGauge = function(params, gauge) {
    var rate = params.max === 0 ? 0 : params.param / params.max;
    this.drawGauge(gauge.x, gauge.y, gauge.width, rate, gauge.color[0], gauge.color[1]);
    this.changeTextColor(this.systemColor());
    this.drawText(gauge.name, gauge.x, gauge.y, this.textWidth(gauge.name));
    this.changeTextColor(this.normalColor());
    if (vnMax) {
      this.drawVnCurrentAndMax(gauge.name, params.param, params.max,
                               gauge.x, gauge.y, gauge.width);
    } else {
      this.drawText(params.param, gauge.x + gauge.width - 64, gauge.y, 64, 'right');
    }
  };
  
  Window_MapHpGauge.prototype.drawVnCurrentAndMax = function(name, current, max, x, y, width) {
    var labelWidth = this.textWidth(name);
    var valueWidth = this.textWidth('0' + max);
    var slashWidth = this.textWidth('/');
    var x1 = x + width - valueWidth;
    var x2 = x1 - slashWidth;
    var x3 = x2 - valueWidth;
    this.changeTextColor(this.normalColor());
    if (x3 >= x + labelWidth) {
        this.drawText(current, x3, y, valueWidth, 'right');
        this.drawText('/', x2, y, slashWidth, 'right');
        this.drawText(max, x1, y, valueWidth, 'right');
    } else {
        this.drawText(current, x1, y, valueWidth, 'right');
    }
  };

  Window_MapHpGauge.prototype.refreshFace = function() {
    if (faceOffsetX === -1000) return;
    var actor = this.actor();
    var bitmap = ImageManager.loadFace(actor.faceName());
    this._needFaceRefresh = bitmap.width === 0;
    if (!this._needFaceRefresh) {
      var x = gaugeWindowWidth - 144 + faceOffsetX;
      var y = faceOffsetY;
      var height = Math.min(gaugeWindowHeight, 144);
      this.drawFace(actor.faceName(), actor.faceIndex(), x, y, 144, height);
    }
  };

  //-----------------------------------------------------------------------------
  // Scene_Base
  //

  Scene_Base.prototype.createMapHpGaugeWindow = function() {
    this._mapHpGaugeWindows = [];
    for (var i = 0; i < $gameParty.maxBattleMembers(); i++) {
      var gaugeWindow = new Window_MapHpGauge(i);
      this._mapHpGaugeWindows.push(gaugeWindow);
      this.addChild(gaugeWindow);
    }
  };

  Scene_Base.prototype.hideMapHpGaugeWindows = function() {
    if (this._mapHpGaugeWindows) {
      this._mapHpGaugeWindows.forEach(function(gaugeWindow) {
        gaugeWindow.hide();
      });
    }
  };

  var _Scene_Base_terminate = Scene_Base.prototype.terminate;
  Scene_Base.prototype.terminateHpGaugeWindows = function() {
    _Scene_Base_terminate.call(this);
    if (this._mapHpGaugeWindows) {
      this._mapHpGaugeWindows.forEach(function(gaugeWindow) {
        this.removeChild(gaugeWindow);
      });
    }
  };

  //-----------------------------------------------------------------------------
  // Scene_Map
  //

  var _Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
  Scene_Map.prototype.createDisplayObjects = function() {
    _Scene_Map_createDisplayObjects.call(this);
    this.createMapHpGaugeWindow();
  };

  var _Scene_Map_terminate = Scene_Map.prototype.terminate;
  Scene_Map.prototype.terminate = function() {
    if (!SceneManager.isNextScene(Scene_Battle)) this.hideMapHpGaugeWindows();
    _Scene_Map_terminate.call(this);
  };
  
  var _Scene_Map_launchBattle = Scene_Map.prototype.launchBattle;
  Scene_Map.prototype.launchBattle = function() {
    this.hideMapHpGaugeWindows();
    _Scene_Map_launchBattle.call(this);
  };
  
  var _Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function() {
    _Scene_Map_update.call(this);
    if (($gameSystem._mapHpGaugeWindowX != null && this._mapHpGaugeWindows[0]._baseX !== $gameSystem._mapHpGaugeWindowX) ||
        ($gameSystem._mapHpGaugeWindowY != null && this._mapHpGaugeWindows[0].y !== $gameSystem._mapHpGaugeWindowY)) {
      this._mapHpGaugeWindows.forEach(function(gaugeWindow) {
        gaugeWindow.refreshPosition();
      });
    }
  };

  //-----------------------------------------------------------------------------
  // Scene_Battle
  //

  var _Scene_Battle_createDisplayObjects = Scene_Battle.prototype.createDisplayObjects;
  Scene_Battle.prototype.createDisplayObjects = function() {
    _Scene_Battle_createDisplayObjects.call(this);
    if (useBattleScene) this.createMapHpGaugeWindow();
  };

})();