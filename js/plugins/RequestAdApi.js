//=============================================================================
// RequestAdApi.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 KADOKAWA
// ----------------------------------------------------------------------------
// Version
// 0.5.2 2016/11/01 一番上の広告の上半分がクリックできない現象を修正
// 0.5.1 2016/10/29 規定のブラウザでURLを立ち上げる際のコマンド内容を修正
// 0.5.0 2016/09/13 作成途中
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ローカル用広告表示プラグイン
 * @author トリアコンタン
 *
 * @param appId
 * @desc AndAppの広告表示APIにGETパラメータで渡されるゲームごとに一意のIDです。
 * @default
 *
 * @param 広告表示APIのURL
 * @desc AndAppの広告表示APIのURLです。
 * @default http://api.tkool.andapp.jp/api/1.0.0/ads
 *
 * @help AndAppから提供された広告情報をウィンドウの左側に表示します。
 * クリックすると対象のゲームが起動します。
 *
 * このプラグインにはプラグインコマンドはありません。
 */

var Imported = Imported || {};

(function() {
    'use strict';
    var pluginName = 'RequestAdApi';

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value === null ? '' : value;
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramAppId  = getParamString(['appId', 'アプリケーションID']);
    var paramApiUrl = getParamString(['ApiUrl', '広告表示APIのURL']);

    //=============================================================================
    // Graphics
    //  広告表示用のDOMを作成します。
    //=============================================================================
    Graphics._adsInfo   = null;
    Graphics.setAdsInfo = function(value) {
        this._adsInfo = value;
    };

    Graphics.reduceAdsInfo = function(callBack) {
        return this._adsInfo.reduce(callBack, null);
    };

    Graphics.setAdsInfo = function(value) {
        this._adsInfo = value;
    };

    Graphics.setAdsWidth = function(response) {
        this.setAdsInfo(response);
        this._adsWidth = this.reduceAdsInfo(function(prevWidth, adInfo) {
            return Math.max(prevWidth, adInfo.width / 2 + 16);
        });
        return this._adsWidth;
    };

    Graphics.createAdsInfo = function() {
        var frame            = document.createElement('div');
        frame.style.position = 'absolute';
        frame.style.margin   = 0;
        frame.style.zIndex   = 10;
        this._adFrame        = frame;
        this._adsInfo.forEach(function(adInfo) {
            this._createAdsImage(adInfo);
        }, this);
        document.body.appendChild(this._adFrame);
    };

    Graphics._createAdsImage = function(adInfo) {
        var imageDiv          = document.createElement('div');
        imageDiv.style.margin = 'auto';
        imageDiv.style.margin = '0px 0px 5px 0px';
        imageDiv.style.cursor = 'pointer';
        imageDiv.addEventListener('click', function() {
            this._openUrl(adInfo.url);
        }.bind(this));
        switch (adInfo.size) {
            case 'small':
                this._createAdsItemSmall(adInfo, imageDiv);
                break;
            case 'large':
                this._createAdsItemLarge(adInfo, imageDiv);
                break;
        }
        var adImage    = document.createElement('img');
        adImage.src    = adInfo.image_url;
        adImage.width  = adInfo.width / 2;
        adImage.height = adInfo.height / 2;
        imageDiv.appendChild(adImage);
        this._adFrame.appendChild(imageDiv);
        this._updateAllElements();
    };

    Graphics._openUrl = function(url) {
        if (!Utils.isNwjs()) {
            window.open(url);
            return;
        }
        var exec = require('child_process').exec;
        switch (process.platform) {
            case 'win32':
                exec('rundll32.exe url.dll,FileProtocolHandler  "' + url + '"');
                break;
            default:
                exec('open "' + url + '"');
                break;
        }
    };

    Graphics._createAdsItemSmall = function(adInfo, imageDiv) {
        var marginRight      = adInfo.width / 2 + 8;
        var title            = document.createElement('div');
        title.style.margin   = '0px 8px 0px ' + marginRight + 'px';
        title.style.position = 'absolute';
        title.style.color    = 'white';
        title.style.fontSize = '14px';
        title.innerHTML      = adInfo.name;
        imageDiv.appendChild(title);
        var desc            = document.createElement('div');
        desc.style.margin   = '20px 8px 0px ' + marginRight + 'px';
        desc.style.position = 'absolute';
        desc.style.color    = 'gray';
        desc.style.fontSize = '12px';
        desc.innerHTML      = adInfo.description;
        imageDiv.appendChild(desc);
        if (adInfo.tag) {
            var tagImage            = document.createElement('img');
            tagImage.src            = adInfo.tag;
            tagImage.style.position = 'absolute';
            tagImage.style.margin   = '68px 8px 0px ' + marginRight + 'px';
            imageDiv.appendChild(tagImage);
        }
    };

    Graphics._createAdsItemLarge = function(adInfo, imageDiv) {
        if (adInfo.tag) {
            var tagImage            = document.createElement('img');
            tagImage.src            = adInfo.tag;
            tagImage.style.position = 'absolute';
            tagImage.style.margin   = '12px 0px 0px 12px';
            imageDiv.appendChild(tagImage);
        }
    };

    var _Graphics__centerElement = Graphics._centerElement;
    Graphics._centerElement      = function(element) {
        _Graphics__centerElement.apply(this, arguments);
        if (this._adsWidth && this._isFullScreen()) {
            element.style.margin = '0px 0px 0px ' + this._adsWidth + 'px';
        }
    };

    var _Graphics__requestFullScreen = Graphics._requestFullScreen;
    Graphics._requestFullScreen      = function() {
        this._adFrame.style.visibility = 'hidden';
        _Graphics__requestFullScreen.apply(this, arguments);
    };

    var _Graphics__cancelFullScreen = Graphics._cancelFullScreen;
    Graphics._cancelFullScreen      = function() {
        this._adFrame.style.visibility = 'visible';
        _Graphics__cancelFullScreen.apply(this, arguments);
    };

    var _Graphics__updateRealScale = Graphics._updateRealScale;
    Graphics._updateRealScale      = function() {
        if (this._stretchEnabled && this._adsWidth) {
            var h           = (window.innerWidth - this._adsWidth) / this._width;
            var v           = window.innerHeight / this._height;
            this._realScale = Math.min(h, v);

            document.body.style.overflow = 'hidden';
            return;
        } else {
            document.body.style.overflow = 'visible';
        }
        _Graphics__updateRealScale.apply(this, arguments);
    };

    //=============================================================================
    // SceneManager
    //  起動時にWebAPIをリクエストします。
    //=============================================================================
    SceneManager.addApiUrl = paramApiUrl;

    var _SceneManager_initialize = SceneManager.initialize;
    SceneManager.initialize      = function() {
        var params = {appId: paramAppId};
        WebApiManager.requestGet(this.addApiUrl, params, this.getResponse.bind(this), 'json');
        _SceneManager_initialize.apply(this, arguments);
    };

    SceneManager.getResponse = function(response) {
        var width = Graphics.setAdsWidth(response);
        if (window.innerWidth === Graphics.width || this.hasScreenResolution() && Utils.isNwjs()) {
            var gui = require('nw.gui');
            var win = gui.Window.get();
            win.moveBy(-width / 2, 0);
            win.resizeTo(win.width + width, win.height);
        }
        Graphics.createAdsInfo();
    };

    SceneManager.hasScreenResolution = function() {
        return Imported.ScreenResolution || Imported.YEP_CoreEngine;
    };

    //=============================================================================
    // WebApiManager
    //  WebApiのリクエストとレスポンスの受け取りを管理します。
    //=============================================================================
    function WebApiManager() {
        throw new Error('This is a static class');
    }

    WebApiManager.timeOut  = 20000;
    WebApiManager.statusOk = 200;

    WebApiManager.requestGet = function(url, params, callBack, responseType) {
        var request      = new XMLHttpRequest();
        var isFirstParam = true;
        var keys         = Object.keys(params);
        if (keys.length > 0) {
            keys.forEach(function(paramName) {
                url += isFirstParam ? '?' : '&';
                url += paramName + '=' + params[paramName];
                isFirstParam = false;
            });
        }
        if (Utils.isOptionValid('test')) {
            console.log('Request for ' + url);
        }
        request.open('GET', url);
        request.responseType = responseType;
        request.timeout      = this.timeOut;
        request.addEventListener('load', this.processComplete.bind(this, request, callBack));
        request.addEventListener('error', this.processError.bind(this));
        request.send();
    };

    WebApiManager.processComplete = function(request, callBack) {
        if (request.status === this.statusOk) {
            if (Utils.isOptionValid('test')) {
                console.log(request.response);
            }
            if (callBack) callBack(request.response);
        } else {
            console.error(request.statusText);
        }
    };

    WebApiManager.processError = function(error) {
        console.error(error);
    };
})();

