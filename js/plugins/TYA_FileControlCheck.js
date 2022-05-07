/*:
 * @plugindesc セーブ、ロード時に特定のスイッチをONにします。
 * @author 茶の助
 *
 * @param switchSave
 * @desc セーブ時にONにするスイッチ
 * @default 1
 *
 * @param switchLoad
 * @desc ロード時にONにするスイッチ
 * @default 2
 */
 
 (function() {

    var parameters = PluginManager.parameters('TYA_FileControlCheck');
    var switchSave = Number(parameters['switchSave']);
    var switchLoad = Number(parameters['switchLoad']);
    
    var TYA_Scene_Save_onSaveSuccess = Scene_Save.prototype.onSaveSuccess;
    Scene_Save.prototype.onSaveSuccess = function() {
        TYA_Scene_Save_onSaveSuccess.call(this);
		
        $gameSwitches.setValue(switchSave, true);
    };
	
    var TYA_Scene_Load_onLoadSuccess = Scene_Load.prototype.onLoadSuccess;
    Scene_Load.prototype.onLoadSuccess = function() {
        TYA_Scene_Load_onLoadSuccess.call(this);
		
        $gameSwitches.setValue(switchLoad, true);
    };

})();