/*:ja
 * @target MZ MV
 * @url https://raw.githubusercontent.com/munokura/HIME-MV-plugins-jp/master/HIME_MenuCommandManager.js
 * @title Menu Command Manager
 * @author Hime --> HimeWorks (http://himeworks.com)
 * @version 1.0
 * @date Mar 16, 2016
 * @filename HIME_MenuCommandManager.js
 *
 * @plugindesc v1.0 パーティメニューの表示名変更や非表示・無効化などゲーム中に制御できます
 * @help
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 *
 * 元プラグイン:
 * http://himeworks.com/2016/03/menu-command-manager-mv
 *
 * == 説明 ==
 *
 * Video: https://www.youtube.com/watch?v=ncfMXeMOz84
 *
 * RPGメーカーでは、メニューからいくつかのコマンドを利用することができます。
 * また、セーブコマンドや並べ替えコマンドなどのイベントを使用して、
 * それらの一部を無効にすることもできます。
 * システムデータベースから、
 * メニューに表示・非表示にするコマンドを選択することができます。
 * しかし、プロジェクトでは、これらのコマンドだけでは不十分かもしれません。
 * このプラグインを使えば、
 * メニューコマンドを完全にコントロールすることができます。
 * いつでもコマンドを非表示・表示にできます。
 * コマンドを無効・有効にできます。
 * いつでもコマンドの名前を変更することができます。
 * 複数のパーティがある場合、
 * それぞれのパーティが独自のコマンドを持つことができます。
 * コマンドにいくつかのより多くのコントロールが必要ですか?
 * このプラグインを試してみてください
 *
 * == 使用方法 ==
 *
 * 始める前に、いくつかの用語を説明します。
 * コマンドは3つの基本的な要素で構成されています。
 *
 * 1. コマンドの ID であるシンボル
 * 2. プレイヤーに表示されるテキストである名前
 * 3. コマンドに付属する情報であるエクストラデータ
 *
 * 例えば、'Item'コマンドを例にすると、次のようになります。
 *
 * 1. シンボル = item
 * 2. 名前 = アイテム
 * 3. エクストラデータ = なし
 *
 * デフォルトのコマンド名を想定したデフォルトのシンボルの一覧です。
 *
 *   シンボル - 名前
 *   ==============
 *   item - アイテム
 *   skill - スキル
 *   equip - 装備
 *   status - ステータス
 *   formation - 並べ替え
 *   options - オプション
 *   save - セーブ
 *   gameEnd - ゲーム終了
 *
 * -- パーティーメニューコマンド --
 *
 * メニューにアクセスすると、
 * 現在のパーティのメニューにアクセスしていることになります。
 * したがって、利用可能なコマンドは全てそのパーティに割り当てられています。
 *
 * 以下のスクリプトで現在のパーティのコマンドリストにアクセスします。
 *
 *   $gameParty.menuCommands()
 *
 * -- パーティーメニューコマンドを無効にする --
 *
 * 以下のスクリプトでコマンドを無効化・有効化します。
 *
 *   $gameParty.disableMenuCommand(SYMBOL)
 *   $gameParty.enableMenuCommand(SYMBOL)
 *
 * 例えば、'item' が 'アイテム' コマンドのシンボルであると仮定して、
 * それを無効にしたり有効にしたりするには、次のようにします。
 *
 *   $gameParty.disableMenuCommand("item")
 *   $gameParty.enableMenuCommand("item")
 *
 * -- パーティーメニューのコマンドを非表示にする --
 *
 * 以下のスクリプトでコマンドを非表示・表示にします。
 *
 *   $gameParty.hideMenuCommand(SYMBOL)
 *   $gameParty.showMenuCommand(SYMBOL)
 *
 * 例えば、'item'が'Item'コマンドのシンボルであると仮定して、
 * それを非表示・表示するには
 *
 *   $gameParty.hideMenuCommand("item")
 *   $gameParty.showMenuCommand("item")
 *
 * -- Renaming Commands --
 *
 * コマンドの名前はいつでも変更できます。
 * 以下のスクリプトでコマンドの名前を変更します。
 *
 *   $gameParty.renameMenuCommand(SYMBOL, NAME)
 *
 * 例えば、アイテムコマンドを有効にするまで不明にしたい場合、
 * 以下のように無効にしてから、'???'に名前を変更します。
 *
 *   $gameParty.disableMenuCommand("item");
 *   $gameParty.renameMenuCommand("item", "???");
 *
 * == 利用規約 ==
 *
 * - クレジットを表示する非営利プロジェクトでの使用は無料
 * - 商用プロジェクトでの使用は無料ですが、連絡してください
 * - クレジット表示をHimeWorksにしてください
 *
 * == Change Log ==
 *
 * 1.0 - Mar 16, 2016
 *  - initial release
 */
/*
 * あなたが私の仕事を楽しんでいるなら、
 * パトレオンで私への支援を検討してください！
 *
 * - https://www.patreon.com/himeworks
 *
 * ご質問や懸念がある場合、
 * 次のサイトのいずれかで私に連絡できます。
 *
 * - Main Website: http://himeworks.com
 * - Facebook: https://www.facebook.com/himeworkscom/
 * - Twitter: https://twitter.com/HimeWorks
 * - Youtube: https://www.youtube.com/c/HimeWorks
 * - Tumblr: http://himeworks.tumblr.com/
*/

/*:
@title Menu Command Manager
@author Hime --> HimeWorks (http://himeworks.com)
@version 1.0
@date Mar 16, 2016
@filename HIME_MenuCommandManager.js
@url http://himeworks.com/2016/03/menu-command-manager-mv

If you enjoy my work, consider supporting me on Patreon!

* https://www.patreon.com/himeworks

If you have any questions or concerns, you can contact me at any of
the following sites:

* Main Website: http://himeworks.com
* Facebook: https://www.facebook.com/himeworkscom/
* Twitter: https://twitter.com/HimeWorks
* Youtube: https://www.youtube.com/c/HimeWorks
* Tumblr: http://himeworks.tumblr.com/

@plugindesc v1.0 - Customize your party menu.
@help 
== Description ==

Video: https://www.youtube.com/watch?v=ncfMXeMOz84

In RPG Maker, you have access to a number of commands in the menu.

You can also disable some of them using events, such as the save command, or
the formation command.

From the System database, you can choose which commands you want to hide or
show in the menu.

However, these may not be enough for your project!
With the menu command manager, you have full control over your menu commands!

You can hide or show any commands at anytime.
You can disable or enable any commands at anytime.
You can even rename commands at anytime.

If you have multiple parties, each party can have their own set of commands.
Need some more control over your commands? Try this plugin out!

== Terms of Use ==

- Free for use in non-commercial projects with credits
- Free for use in commercial projects, but it would be nice to let me know
- Please provide credits to HimeWorks

== Change Log ==

1.0 - Mar 16, 2016
 - initial release

== Usage ==

Before we begin, here is some terminology.
Commands are composed of three basic properties:

1. A symbol, which is the ID of the command.
2. A name, which is the text that is displayed to players
3. Extra data, which is information that comes with the command

For example, if you think of the "Item" command, we can describe it as:

1. Symbol = item
2. Name = Item
3. No extra data

Here are a list of default symbols, assuming default command names:

  SYMBOL - NAME
  ==============
  item - Item
  skill - Skill  
  equip - Equip
  status - Status
  formation - Formation
  options - Options
  save - Save
  gameEnd - Game End 

-- Party Menu Commands --

When you access the menu, you are accessing the current party's menu.
All of the commands that are available are therefore assigned to the party.

In order to access the current party's list of commands, you could say

  $gameParty.menuCommands()

-- Disabling Party Menu Commands --

To disable or enable commands, use the following script calls

  $gameParty.disableMenuCommand(SYMBOL)
  $gameParty.enableMenuCommand(SYMBOL)
  
For example, assuming "item" is the symbol for your "Item" command, you
can disable or enable it using
  
  $gameParty.disableMenuCommand("item")
  $gameParty.enableMenuCommand("item")
  
-- Hiding Party Menu Commands --

To hide or show commands, use the following script calls

  $gameParty.hideMenuCommand(SYMBOL)
  $gameParty.showMenuCommand(SYMBOL)
  
For example, assuming "item" is the symbol for your "Item" command, you
can hide or show it using
  
  $gameParty.hideMenuCommand("item")
  $gameParty.showMenuCommand("item")
  
-- Renaming Commands --

Commands can be renamed at anytime. To rename a command, use the script call

  $gameParty.renameMenuCommand(SYMBOL, NAME)
  
For example, if you wanted to make make the Item command unknown until it is
enabled, you can disable it and then rename it to "???" as follows:

  $gameParty.disableMenuCommand("item");
  $gameParty.renameMenuCommand("item", "???");

 */

var Imported = Imported || {};
var TH = TH || {};
Imported.TH_MenuCommandManager = 1;
TH.MenuCommandManager = TH.MenuCommandManager || {};

function Data_MenuCommand() {
  this.initialize.apply(this, arguments);
}

(function ($) {

  Object.defineProperties(Data_MenuCommand.prototype, {
    symbol: { get: function () { return this._symbol; }, configurable: true },
    name: { get: function () { return this._name; }, configurable: true },
    ext: { get: function () { return this._ext; }, configurable: true },
  });

  Data_MenuCommand.prototype.initialize = function (symbol, name, ext) {
    this._symbol = symbol;
    this._name = name;
    this._ext = ext;
    this._isDisabled = false;
    this._isHidden = false;
  };

  Data_MenuCommand.prototype.setDisabled = function (bool) {
    this._isDisabled = bool;
  };

  Data_MenuCommand.prototype.isEnabled = function () {
    return !this._isDisabled;
  };

  Data_MenuCommand.prototype.setHidden = function (bool) {
    this._isHidden = bool;
  };

  Data_MenuCommand.prototype.isVisible = function () {
    return !this._isHidden;
  };

  Data_MenuCommand.prototype.setName = function (name) {
    this._name = name;
  };

  /***************************************************************************/

  var TH_GameUnit_initialize = Game_Unit.prototype.initialize;
  Game_Unit.prototype.initialize = function () {
    TH_GameUnit_initialize.call(this);
    this.initMenuCommands();
  };

  Game_Unit.prototype.initMenuCommands = function () {
    this._menuCommands = [];
    var cmds = $dataSystem.menuCommands;
    if (cmds[0]) {
      this.addMenuCommand_item()
    }
    if (cmds[1]) {
      this.addMenuCommand_skill()
    }
    if (cmds[2]) {
      this.addMenuCommand_equip()
    }
    if (cmds[3]) {
      this.addMenuCommand_status()
    }
    if (cmds[4]) {
      this.addMenuCommand_formation()
    }
    this.addMenuCommand_options();
    if (cmds[5]) {
      this.addMenuCommand_save()
    }
    this.addMenuCommand_gameEnd();
  };

  Game_Unit.prototype.addMenuCommand_item = function () {
    var command = new Data_MenuCommand("item", TextManager.item);
    this.addMenuCommand(command);
  };

  Game_Unit.prototype.addMenuCommand_skill = function () {
    var command = new Data_MenuCommand("skill", TextManager.skill);
    this.addMenuCommand(command);
  };

  Game_Unit.prototype.addMenuCommand_equip = function () {
    var command = new Data_MenuCommand("equip", TextManager.equip);
    this.addMenuCommand(command);
  };

  Game_Unit.prototype.addMenuCommand_status = function () {
    var command = new Data_MenuCommand("status", TextManager.status);
    this.addMenuCommand(command);
  };

  Game_Unit.prototype.addMenuCommand_formation = function () {
    var command = new Data_MenuCommand("formation", TextManager.formation);
    this.addMenuCommand(command);
  };

  Game_Unit.prototype.addMenuCommand_options = function () {
    var command = new Data_MenuCommand("options", TextManager.options);
    this.addMenuCommand(command);
  };

  Game_Unit.prototype.addMenuCommand_save = function () {
    var command = new Data_MenuCommand("save", TextManager.save);
    this.addMenuCommand(command);
  };

  Game_Unit.prototype.addMenuCommand_gameEnd = function () {
    var command = new Data_MenuCommand("gameEnd", TextManager.gameEnd);
    this.addMenuCommand(command);
  };

  Game_Unit.prototype.addMenuCommand = function (cmd) {
    this._menuCommands.push(cmd);
  }

  Game_Unit.prototype.menuCommands = function () {
    if (this._menuCommands === undefined) {
      this.initMenuCommands();
    }
    return this._menuCommands;
  };

  Game_Unit.prototype.renameMenuCommand = function (symbol, name) {
    var cmds = this.menuCommands();
    for (var i = 0; i < cmds.length; i++) {
      if (cmds[i].symbol === symbol) {
        cmds[i].setName(name);
      }
    }
  };

  Game_Unit.prototype.setMenuCommandHidden = function (symbol, bool) {
    var cmds = this.menuCommands();
    for (var i = 0; i < cmds.length; i++) {
      if (cmds[i].symbol === symbol) {
        cmds[i].setHidden(bool);
      }
    }
  };

  Game_Unit.prototype.setMenuCommandDisabled = function (symbol, bool) {
    var cmds = this.menuCommands();
    for (var i = 0; i < cmds.length; i++) {
      if (cmds[i].symbol === symbol) {
        cmds[i].setDisabled(bool);
      }
    }
  };

  Game_Unit.prototype.hideMenuCommand = function (symbol) {
    this.setMenuCommandHidden(symbol, true);
  };

  Game_Unit.prototype.showMenuCommand = function (symbol) {
    this.setMenuCommandHidden(symbol, false);
  };

  Game_Unit.prototype.disableMenuCommand = function (symbol) {
    this.setMenuCommandDisabled(symbol, true);
  };

  Game_Unit.prototype.enableMenuCommand = function (symbol) {
    this.setMenuCommandDisabled(symbol, false);
  };

  /***************************************************************************/

  Window_MenuCommand.prototype.makeCommandList = function () {
    var cmds = $gameParty.menuCommands();
    for (var i = 0; i < cmds.length; i++) {
      var cmd = cmds[i];
      if (cmd.isVisible()) {
        var symbol = cmd.symbol;
        var method = this["addCommand_" + symbol];
        if (method) {
          method.call(this, cmd);
        }
      }
    }
  };

  Window_MenuCommand.prototype.addCommand_item = function (cmd) {
    var enabled = this.areMainCommandsEnabled();
    this.addCommand(cmd.name, cmd.symbol, cmd.isEnabled() && enabled);
  };

  Window_MenuCommand.prototype.addCommand_skill = function (cmd) {
    var enabled = this.areMainCommandsEnabled();
    this.addCommand(cmd.name, cmd.symbol, cmd.isEnabled() && enabled);
  };

  Window_MenuCommand.prototype.addCommand_equip = function (cmd) {
    var enabled = this.areMainCommandsEnabled();
    this.addCommand(cmd.name, cmd.symbol, cmd.isEnabled() && enabled);
  };

  Window_MenuCommand.prototype.addCommand_status = function (cmd) {
    var enabled = this.areMainCommandsEnabled();
    this.addCommand(cmd.name, cmd.symbol, cmd.isEnabled() && enabled);
  };

  Window_MenuCommand.prototype.addCommand_formation = function (cmd) {
    var enabled = this.isFormationEnabled();
    this.addCommand(cmd.name, cmd.symbol, cmd.isEnabled() && enabled);
  };

  Window_MenuCommand.prototype.addCommand_options = function (cmd) {
    var enabled = this.isOptionsEnabled();
    this.addCommand(cmd.name, cmd.symbol, cmd.isEnabled() && enabled);
  };

  Window_MenuCommand.prototype.addCommand_save = function (cmd) {
    var enabled = this.isSaveEnabled();
    this.addCommand(cmd.name, cmd.symbol, cmd.isEnabled() && enabled);
  };

  Window_MenuCommand.prototype.addCommand_load = function (cmd) {
    this.addCommand(cmd.name, cmd.symbol, cmd.isEnabled());
  };

  Window_MenuCommand.prototype.addCommand_gameEnd = function (cmd) {
    this.addCommand(cmd.name, cmd.symbol, cmd.isEnabled());
  };

  /***************************************************************************/

  var TH_SceneMenu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
  Scene_Menu.prototype.createCommandWindow = function () {
    TH_SceneMenu_createCommandWindow.call(this);
    this._commandWindow.setHandler('load', this.commandLoad.bind(this));
  };

  /***************************************************************************/

  Game_Unit.prototype.addMenuCommand_load = function () {
    var command = new Data_MenuCommand("load", "Load");
    this.addMenuCommand(command);
  };

  Scene_Menu.prototype.commandLoad = function () {
    SceneManager.push(Scene_Load);
  };

  /***************************************************************************/

  var TH_SceneMenu_CommonEvent_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
  Scene_Menu.prototype.createCommandWindow = function () {
    TH_SceneMenu_CommonEvent_createCommandWindow.call(this);
    this._commandWindow.setHandler('commonEvent', this.commandCommonEvent.bind(this));
  };

  Game_Unit.prototype.addMenuCommand_commonEvent = function () {
    var command = new Data_MenuCommand("commonEvent", "Common Event");
    this.addMenuCommand(command);
  };

  Window_MenuCommand.prototype.addCommand_commonEvent = function (cmd) {
    this.addCommand(cmd.name, cmd.symbol, cmd.isEnabled(), cmd.ext);
  };

  Scene_Menu.prototype.commandCommonEvent = function () {
    var ext = this._commandWindow.currentData().ext;
    $gameTemp.reserveCommonEvent(ext);
    this._commandWindow.activate();
  };
})(TH.MenuCommandManager);