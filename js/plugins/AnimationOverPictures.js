//=============================================================================
// AnimationOverPictures.js
//=============================================================================

/*:
 * @plugindesc アニメーションを、ピクチャより前に表示します。
 * @author 奏ねこま（おとぶきねこま）
 *
 * @help
 * *このプラグインには、プラグインコマンドはありません。      
 *
 * [ 利用規約 ] .................................................................
 *  本プラグインの利用者は、RPGツクールMV/RPGMakerMVの正規ユーザーに限られます。
 *  商用、非商用、ゲームの内容（年齢制限など）を問わず利用可能です。
 *  ゲームへの利用の際、報告や出典元の記載等は必須ではありません。
 *  二次配布や転載、ソースコードURLやダウンロードURLへの直接リンクは禁止します。
 *  （プラグインを利用したゲームに同梱する形での結果的な配布はOKです）
 *  不具合対応以外のサポートやリクエストは受け付けておりません。
 *  本プラグインにより生じたいかなる問題においても、一切の責任を負いかねます。
 * [ 改訂履歴 ] .................................................................
 *   Version 1.00  2016/08/20  初版
 * -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 *  Web Site: http://i.gmobb.jp/nekoma/rpg_tkool/
 *  Twitter : https://twitter.com/koma_neko
 */

(function(){
    'use strict';

    var _Sprite_Base_startAnimation = Sprite_Base.prototype.startAnimation;
    Sprite_Base.prototype.startAnimation = function(animation, mirror, delay) {
        _Sprite_Base_startAnimation.call(this, animation, mirror, delay);
        var parent = this.parent;
        while (parent) {
            if (parent._pictureContainer) {
                var sprite = this._animationSprites[this._animationSprites.length - 1];
                this.parent.removeChild(sprite);
                parent._pictureContainer.addChild(sprite);
                break;
            }
            parent = parent.parent;
        }
    };
}());
