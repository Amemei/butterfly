//=============================================================================
// EquipmentAcrobat.js
// ----------------------------------------------------------------------------
// Copyright (c) 2020 mattuup
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:ja
 * @plugindesc ver1.03 ステータスで装備アイテムを描画しなくなるなど。
 * @author mattuup
 * 
 * @param weapon
 * @desc このパラメータが0以外の時は
 * 武器のアイテムカテゴリを表示します。
 * @default 1
 * 
 * @param armor
 * @desc このパラメータが0以外の時は
 * 防具のアイテムカテゴリを表示します。
 * @default 0
 * 
 * @param key
 * @desc このパラメータが0以外の時は
 * 大事なもののアイテムカテゴリを表示します。
 * @default 1
 * 
 * @param showEquip
 * @desc このパラメータが0以外の時は
 * ステータス画面で装備を表示します。
 * @default 0
 * 
 * @param disenablesw
 * @desc このIDのスイッチがオンの時は
 * 上記の機能によって非表示にしません。
 * @type switch
 * @default 10
 *
 * @help
 * 
 * RPGで笑顔を・・・
 * 
 * このヘルプとパラメータの説明をよくお読みになってからお使いください。
 * 
 * 利用規約はMITライセンスの通り。
 * 
 * パラメータで装備などの非表示項目を変えることができます。
 * 
 * 
 * ver1.01 アイテムカテゴリから武器や防具の項目を非表示に。
 * ver1.02 プラグインパラメータの増加
 * ver1.03 規約の変更と機能追加、追加分のパラメータのみタイプ指定追加
 * 
 */

(function() {
    
const parameters = PluginManager.parameters('EquipmentAcrobat');
const EAweapon = Number(parameters['weapon'] || 0);
const EAarmor = Number(parameters['armor'] || 0);
const EAkey = Number(parameters['key'] || 0);
const EAshowEquip = Number(parameters['showEquip'] || 0);
const EAdisenablesw = Number(parameters['disenablesw'] || 0);


DataManager.EAhidearray = function() {
    const array = [EAweapon, EAarmor, EAkey];
    return array.filter(function(el) {
        return el === 0;
    });
};

DataManager.EAdisenablesw = function() {
    return EAdisenablesw && $gameSwitches.value(EAdisenablesw);
};

const _Window_ItemCategory_maxCols = Window_ItemCategory.prototype.maxCols;
Window_ItemCategory.prototype.maxCols = function() {
    const def = _Window_ItemCategory_maxCols.call(this);
    if(DataManager.EAdisenablesw()) return def;
    return def - DataManager.EAhidearray().length;
};

Window_ItemCategory.prototype.makeCommandList = function() {
    const sw = DataManager.EAdisenablesw();
    this.addCommand(TextManager.item, 'item');
    if(sw || EAweapon) this.addCommand(TextManager.weapon, 'weapon');
    if(sw || EAarmor) this.addCommand(TextManager.armor, 'armor');
    if(sw || EAkey) this.addCommand(TextManager.keyItem, 'keyItem');
};

const _Window_Status_drawEquipments = Window_Status.prototype.drawEquipments;
Window_Status.prototype.drawEquipments = function(x, y) {
    const sw = DataManager.EAdisenablesw();
    if(sw || EAshowEquip) _Window_Status_drawEquipments.call(this, x, y);
};

})();
