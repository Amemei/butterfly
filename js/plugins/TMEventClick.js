//=============================================================================
// TMVplugin - イベントクリック
// 作者: tomoaky (http://hikimoki.sakura.ne.jp/)
// Version: 0.22b
// 最終更新日: 2016/05/07
//=============================================================================

/*:
 * @plugindesc イベントをクリックして起動、ドラッグで移動させる機能を
 * 追加します。
 *
 * @author tomoaky (http://hikimoki.sakura.ne.jp/)
 *
 * @param dropStart
 * @desc ドラッグ＆ドロップ時にイベントを起動する（ 1 で有効）
 * 初期値: 0
 * @default 0
 *
 * @param noDropRegions
 * @desc ドラッグ＆ドロップによる移動を禁止するリージョン
 * （カンマで区切って複数指定可能）
 * @default 
 *
 * @param canMultipleDrop
 * @desc ドラッグ＆ドロップでイベントを重ねられるかどうか
 * 初期値: 0（ 0 で重ねられない / 1 で重ねられる）
 * @default 0
 *
 * @param lockTurnEnabled
 * @desc クリック（ドロップ）モード時のイベント起動による振り向き利用
 * 初期値: 0（ 0 利用しない / 1 で利用する）
 * @default 0
 *
 * @help
 * プラグインコマンド:
 *   stopEventClick       # 通常の操作方法に戻します。
 *   startEventClick      # イベントクリックモードを開始します。
 *   startEventDrag       # イベントドラッグモードを開始します。
 *   startEventClickDrag  # イベントクリック＆ドラッグモードを開始。
 *
 * イベントクリックモード:
 *   プレイヤーの移動ができなくなり、クリックしたイベントを即時実行します。
 *
 * イベントドラッグモード:
 *   プレイヤーの移動ができなくなり、イベントをドラッグ＆ドロップで動かせます。
 *
 * イベントクリック＆ドラッグモード:
 *   イベントクリックモードとイベントドラッグモードの両方の機能をもっています。
 *
 * メモ欄タグ（イベント）:
 *   <noClick>            # クリックによるイベントの即時実行を無効にします。
 *   <noDrag>             # ドラッグ＆ドロップによるイベント移動を無効にします。
 *
 * リージョン設定:
 *   プラグインパラメータ noDropRegions の値を 1,2,3 にすると、１～３番の
 *   リージョンにはドラッグ＆ドロップによる移動ができなくなります。
 */

var Imported = Imported || {};
Imported.TMEventClick = true;

(function() {

  var parameters = PluginManager.parameters('TMEventClick');
  var dropStart       = parameters['dropStart'] === '1' ? true : false;
  var noDropRegions   = (parameters['noDropRegions'] || '').split(',');
  var canMultipleDrop = parameters['canMultipleDrop'] === '1' ? true : false;
  var lockTurnEnabled = parameters['lockTurnEnabled'] === '1' ? true : false;
  
  //-----------------------------------------------------------------------------
  // Game_Player
  //

  Game_Player.prototype.setEventClickMode = function(mode) {
    this._eventClickMode = mode;
  };

  Game_Player.prototype.eventClickMode = function() {
    if (this._eventClickMode === undefined) {
      this._eventClickMode = 0;
    }
    return this._eventClickMode;
  };

  var _Game_Player_moveByInput = Game_Player.prototype.moveByInput;
  Game_Player.prototype.moveByInput = function() {
    var eventClickMode = this.eventClickMode();
    if (eventClickMode === 1) {
      this.updateEventClick();
    } else if (eventClickMode >= 2){
      this.updateEventDrag();
    } else {
      _Game_Player_moveByInput.call(this);
    }
  };

  var _Game_Player_canMove = Game_Player.prototype.canMove;
  Game_Player.prototype.canMove = function() {
    if (this.eventClickMode() > 0) {
      return false;
    }
    return _Game_Player_canMove.call(this);
  };
  
  Game_Player.prototype.updateEventClick = function() {
    if (!$gameMap.isEventRunning() && TouchInput.isTriggered()){
      var x = $gameMap.canvasToMapX(TouchInput.x);
      var y = $gameMap.canvasToMapY(TouchInput.y);
      var events = $gameMap.eventsXy(x, y);
      for (var i = 0, len = events.length; i < len; i++) {
        if (!events[i].event().meta['noClick']) {
          events[i].start();
          break;
        }
      }
    }
  };

  Game_Player.prototype.updateEventDrag = function() {
    if (this._dragEventId === undefined) {
      this._dragEventId = 0;
    }
    if (this._dragEventId > 0) {
      var dragEvent = $gameMap.event(this._dragEventId);
      var eventRunning = $gameMap.isEventRunning();
      if (!eventRunning && TouchInput.isPressed()){
        if (TouchInput.x > 0 && TouchInput.x < Graphics.width &&
            TouchInput.y > 0 && TouchInput.y < Graphics.height) {
          var x = $gameMap.canvasToMapX(TouchInput.x);
          var y = $gameMap.canvasToMapY(TouchInput.y);
          if (this.canDropLocate(dragEvent, x, y)) {
            dragEvent.locate(x, y);
          }
          if (x !== this._dragEventLastX || y !== this._dragEventLastY) {
            this._drag = true;
          }
        }
      } else {
        if (!eventRunning) {
          if (dropStart && (dragEvent.x !== this._dragEventLastX ||
              dragEvent.y !== this._dragEventLastY)) {
            dragEvent.start();
          } else if (!dragEvent.event().meta['noClick'] &&
                     this.eventClickMode() === 3 && !this._drag) {
            dragEvent.start();
          }
        }
        this._dragEventId = 0;
      }
    } else {
      if (!$gameMap.isEventRunning() && TouchInput.isTriggered()) {
        var x = $gameMap.canvasToMapX(TouchInput.x);
        var y = $gameMap.canvasToMapY(TouchInput.y);
        var events = $gameMap.eventsXy(x, y);
        for (var i = 0, len = events.length; i < len; i++) {
          if (!events[i].event().meta['noDrag']) {
            this._dragEventId = events[i].eventId();
          }
        }
        if (this._dragEventId === 0 && this.eventClickMode() === 3) {
          for (var i = 0, len = events.length; i < len; i++) {
            if (!events[i].event().meta['noClick']) {
              this._dragEventId = events[i].eventId();
            }
          }
        }
        if (this._dragEventId > 0) {
          var dragEvent = $gameMap.event(this._dragEventId);
          this._dragEventLastX = dragEvent.x;
          this._dragEventLastY = dragEvent.y;
          this._drag = false;
        }
      }
    }
  };
  
  Game_Player.prototype.canDropLocate = function(dragEvent, x, y) {
    if (dragEvent.event().meta['noDrag']) return false;
    if (noDropRegions.indexOf('' + $gameMap.regionId(x, y)) >= 0) return false;
    if (!canMultipleDrop && $gameMap.eventsXy(x, y).length > 0) return false;
    return true;
  };
  
  //-----------------------------------------------------------------------------
  // Game_Event
  //

  var _Game_Event_lock = Game_Event.prototype.lock;
  Game_Event.prototype.lock = function() {
    var lastLock = this._locked;
    _Game_Event_lock.call(this);
    if (lastLock !== this._locked && !lockTurnEnabled &&
        $gamePlayer.eventClickMode() > 0) {
      this.setDirection(this._prelockDirection);
    }
  };

  //-----------------------------------------------------------------------------
  // Game_Interpreter
  //

  var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'stopEventClick') {
      $gamePlayer.setEventClickMode(0);
    } else if (command === 'startEventClick') {
      $gamePlayer.setEventClickMode(1);
    } else if (command === 'startEventDrag') {
      $gamePlayer.setEventClickMode(2);
    } else if (command === 'startEventClickDrag') {
      $gamePlayer.setEventClickMode(3);
    }
  };
  
})();
