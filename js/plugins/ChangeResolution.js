//=============================================================================
// ChangeResolution.js
//=============================================================================

/*:
 * @plugindesc 解像度を変更します。
 * @author 弓猫チャンネル
 *
 * @param width
 * @desc 画面の横幅です。デフォルトは816です。
 * @default 816
 *
 * @param height
 * @desc 画面の縦幅です。デフォルトは624です。
 * @default 624
 *
 * @help
 *
 * 解像度変更プラグイン ver 1.00
 *
 * 【規約】
 * 下記URLに準拠します。
 * http://lucky-duet.com/policy
 *
 * 【備考】
 * 起動時のウィンドウサイズの変更に関しては、現在調査中です。
 * 情報提供や不具合報告は、メールフォームにてお気軽にお問い合わせ下さい。
 * http://lucky-duet.com/mail
 */


(function() {

    var parameters = PluginManager.parameters('ChangeResolution');	
	var w = Number(parameters['width'] || 816);
    var h = Number(parameters['height'] || 624);
	var _Scene_Base_create = Scene_Base.prototype.create;
	

	Scene_Base.prototype.create = function() {
		_Scene_Base_create.call(this);
		Graphics.width = w;
		Graphics.height = h;
		Graphics.boxWidth = w;
		Graphics.boxHeight = h;
	};

})();