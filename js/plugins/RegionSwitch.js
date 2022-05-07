//=============================================================================
// RegionSwitch.js
//=============================================================================
// Copyright (c) 2018 Thirop
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//============================================================================= 
// Version
// 1.0.0 2018/05/29 初版

//=============================================================================
/*:
 * @plugindesc リージョン通過時にスイッチを操作
 * @author Thirop
 * @help プラグインパラメータ「リージョンIDの設定」からリージョンIDと対応するスイッチ番号を設定してください。
 *
 * @param list
 * @text リージョンIDの設定
 * @desc リストをダブルクリックでリージョンID/スイッチ番号の追加/修正
 * @type struct<list>[]
 */
//============================================================================= 

/*~struct~list:
 * @param regionId
 * @text リージョンID
 * @desc リージョンID
 * @type number
 * @decimals 0
 *
 * @param switchId
 * @text スイッチID
 * @desc スイッチID
 * @type number
 * @decimals 0
 *
 * @param value
 * @text スイッチのON/OFF
 * @desc リージョン通過時にスイッチをON/OFFどちらにするか。trueでON、falseでOFF
 * @type boolean
 * @default true
 */

(function(){
var parameters = PluginManager.parameters('RegionSwitch');
parameters.table = {};
parameters.list = JSON.parse(parameters.list);
parameters.list.forEach(function(data){
	data = JSON.parse(data);
	parameters.table[Number(data.regionId)] = {
		switchId : Number(data.switchId),
		value : data.value==='true'
	};
});


var _Game_Player_moveStraight = Game_Player.prototype.moveStraight;
Game_Player.prototype.moveStraight = function(d){
	_Game_Player_moveStraight.call(this,d);
    if(this.isMovementSucceeded()){
    	var regionId = this.regionId();
    	var switchData = parameters.table[regionId];
    	if(switchData){
    		$gameSwitches.setValue(switchData.switchId,switchData.value);
    	}
	}
};


})();