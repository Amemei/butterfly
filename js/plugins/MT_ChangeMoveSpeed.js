//=============================================================================
// MT_ChangeMoveSpeed.js
// 移動速度を補正するプラグイン
// ----------------------------------------------------------------------------
// (C) 2019 Moooty
//=============================================================================

/*:
 * @plugindesc Change Move Speed.
 * @author Moooty
 * 
 * @param playerWalkSpeedRate
 * @desc Player(and Follower)'s move speed rate(default：1)
 * @type number
 * @decimals 2
 * @default 1.00
 * 
 * @param vehicle1MoveSpeedRate
 * @desc Vehicle1(Boat)'s move speed rate.(default: 1)
 * @type number
 * @decimals 2
 * @default 1.00
 *
 * @param vehicle2MoveSpeedRate
 * @desc Vehicle2(Ship)'s move speed rate.(default: 1)
 * @type number
 * @decimals 2
 * @default 1.00
 * 
 * @param vehicle3MoveSpeedRate
 * @desc Vehicle3(Airship)'s move speed rate.(default: 1)
 * @type number
 * @decimals 2
 * @default 1.00
 *
 * @param eventSpeedRate
 * @desc Map Event's move speed rate.(default: 1)
 * @type number
 * @decimals 2
 * @default 1.00
 *
 * @help
 * === Description ===
 * Multiply move speed by plagin paramter.
 * 
 * Nothing plugin commnad this plugin.
 * 
 * 
 * === Change Log ===
 * Apr 18, 2019 ver1.00 Initial release.
 * Nov 24, 2019 ver1.10 Rename plugin file.（ChangeMoveSpeed → MT_ChangeMoveSpeed.js）
 * 
 * === Manual & License(Japanese) ===
 * https://www.5ing-myway.com/rpgmaker-plugin-change-move-speed/
 *
 */

/*:ja
 * @plugindesc 移動速度を補正
 * @author むーてぃ
 * 
 * @param playerWalkSpeedRate
 * @text プレイヤーの移動速度補正
 * @desc プレイヤーとフォロワー(仲間)の移動速度補正(デフォルト：1倍)
 * @type number
 * @decimals 2
 * @default 1.00
 * 
 * @param vehicle1MoveSpeedRate
 * @text 乗り物1の移動速度補正
 * @desc 乗り物1の移動速度補正(デフォルト: 1倍)
 * @type number
 * @decimals 2
 * @default 1.00
 *
 * @param vehicle2MoveSpeedRate
 * @text 乗り物2の移動速度補正
 * @desc 乗り物2の移動速度補正(デフォルト: 1倍)
 * @type number
 * @decimals 2
 * @default 1.00
 * 
 * @param vehicle3MoveSpeedRate
 * @text 乗り物3の移動速度補正
 * @desc 乗り物3の移動速度補正(デフォルト: 1倍)
 * @type number
 * @decimals 2
 * @default 1.00
 *
 * @param eventSpeedRate
 * @text マップイベントの移動速度補正
 * @desc マップイベントの移動速度補正(デフォルト:1倍)
 * @type number
 * @decimals 2
 * @default 1.00
 *
 * @help
 * === 説明 ===
 * 移動速度を変更できるプラグインです。
 * 
 * このプラグインにはプラグインコマンドはありません。
 * 
 * === 更新履歴 ===
 * 2019/04/18 ver1.00 初版
 * 2019/11/24 ver1.10 ファイル名変更（ChangeMoveSpeed → MT_ChangeMoveSpeed.js）
 *
 * === マニュアル＆ライセンス ===
 * https://www.5ing-myway.com/rpgmaker-plugin-change-move-speed/
 * 
 */

var Imported = Imported || {};
Imported.MT_ChangeMoveSpeed = true;

(function(){
    'use strict';
	
    const PLUGIN_NAME       = "MT_ChangeMoveSpeed";    
    var parameters          = PluginManager.parameters(PLUGIN_NAME);

    var playerMoveSpeedRate = getParameterValue(parameters['playerWalkSpeedRate'], 1);
    var vehiclesSpeedRate   = [];
    vehiclesSpeedRate.push(getParameterValue(parameters['vehicle1MoveSpeedRate'], 1));
    vehiclesSpeedRate.push(getParameterValue(parameters['vehicle2MoveSpeedRate'], 1));
    vehiclesSpeedRate.push(getParameterValue(parameters['vehicle3MoveSpeedRate'], 1));

    var eventSpeedRate = getParameterValue(parameters['eventSpeedRate'], 1);

    // ---------- rpg_object.js の変更ここから ----------
    // Game_CharacterBase
    // 元の式に移動速度補正をかける
    var _Game_CharacterBase_distancePerFrame = Game_CharacterBase.prototype.distancePerFrame;
    Game_CharacterBase.prototype.distancePerFrame = function() {	
		return _Game_CharacterBase_distancePerFrame.call(this) * this.moveSpeedRate();
    };

    // メソッド追加(速度補正取得)
    Game_CharacterBase.prototype.moveSpeedRate = function(){
		return this._moveSpeedRate;	
    };

    // Game_Player
    var _Game_Player_initialize = Game_Player.prototype.initialize;
    Game_Player.prototype.initialize = function() {
		_Game_Player_initialize.call(this);
		this._moveSpeedRate = playerMoveSpeedRate;
    };

    // メソッド追加(速度補正取得)
    Game_Player.prototype.moveSpeedRate = function(){
		if($gamePlayer.vehicle() != null){
			if($gamePlayer.vehicle()._driving){
				return $gamePlayer.vehicle()._moveSpeedRate;
			}
		}
		
		return this._moveSpeedRate;	
    };

    // Game_Follower
    var _Game_Follower_initialize = Game_Follower.prototype.initialize;
    Game_Follower.prototype.initialize = function(memberIndex) {
		_Game_Follower_initialize.call(this, memberIndex);
		this._moveSpeedRate = playerMoveSpeedRate;
    };

    // Game_Vehicle
    var _Game_Vehicle_initialze = Game_Vehicle.prototype.initialize;
    Game_Vehicle.prototype.initialize = function(type) {
		_Game_Vehicle_initialze.call(this, type);
		
		if (this.isBoat()) {
				this._moveSpeedRate = vehiclesSpeedRate[0];
		} else if (this.isShip()) {
				this._moveSpeedRate = vehiclesSpeedRate[1];
		} else if (this.isAirship()) {
				this._moveSpeedRate = vehiclesSpeedRate[2];
		}
    };

    // Game_Event
    var _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
		this._moveSpeedRate = eventSpeedRate;
		_Game_Event_initialize.call(this, mapId, eventId);
    };    
    // ---------- rpg_object.js の変更ここまで ----------

    
    // ---------- パラメータ取得用関数ここから ----------
    // @type numberのパラメータでも文字列を入れることができてしまう対策
    function getParameterValue(param, defaultValue){
	    var result = Number(param || defaultValue);
	
	    if(Number.isNaN(result)){
	        result = defaultValue;
	    }

	    return result;
    };    
    // ---------- パラメータ取得用関数ここまで ----------    
})();
