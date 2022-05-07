//=============================================================================
// NRP_CountTimeBattle.js
//=============================================================================

/*:
 * @plugindesc v1.05 戦闘システムをＣＴＢへ変更します。
 * @author 砂川赳（http://newrpg.seesaa.net/）
 *
 * @help このプラグインにはプラグインコマンドはありません。
 *
 * いわゆるカウントタイムバトルです。
 * 敏捷性に比例して、一人ずつ行動が回ってくるようになります。
 * この戦闘システムを適用すると、各バトラーは個別にターンを保有するようになります。
 *
 * 細かい仕様については、以下をご覧ください。
 * http://newrpg.seesaa.net/article/472859369.html
 *
 * このプラグイン単体では順序の表示を行いません。
 * NRP_VisualTurn.jsと組み合わせて使用してください。
 *
 * このプラグインは以下の関数を上書きしています。競合にご注意ください。
 * なるべく上側に配置したほうが安定すると思います。
 * ・BattleManager.startInput()
 * ・BattleManager.selectNextCommand
 * ・BattleManager.selectPreviousCommand
 * ・BattleManager.makeActionOrders
 * ・BattleManager.startTurn
 * ・BattleManager.processTurn
 * ・BattleManager.endTurn
 * ・BattleManager.getNextSubject
 * ・BattleManager.processEscape
 * ・Game_Battler.prototype.onAllActionsEnd
 * ・Game_Battler.prototype.performActionEnd()
 * ・Game_Enemy.prototype.meetsTurnCondition
 * ・Game_Action.prototype.speed
 * ・Scene_Battle.prototype.commandFight
 *
 * @param ＜基本設定＞
 * @desc 見出しです。
 *
 * @param number
 * @text 計算人数（表示人数）
 * @parent ＜基本設定＞
 * @type number
 * @default 9
 * @desc ターン順序の計算を行う人数。これが表示される人数になります。
 * 指定なしなら9。
 *
 * @param ＜戦闘開始関連＞
 * @desc 見出しです。
 *
 * @param actorStartRandomWt
 * @text 味方の始動時間バラツキ
 * @parent ＜戦闘開始関連＞
 * @type number
 * @default 0
 * @desc 味方の初期待ち時間を数値％分だけ分散させます。
 * 例：20ならば、90～110%に分散。指定なしは0。
 *
 * @param enemyStartRandomWt
 * @text 敵の始動時間バラツキ
 * @parent ＜戦闘開始関連＞
 * @type number
 * @default 20
 * @desc 敵の初期待ち時間を数値％分だけ分散させます。
 * 例：20ならば、90～110%に分散。指定なしは20。
 *
 * @param preemptiveAdvantage
 * @text 先制時の始動時間ボーナス
 * @parent ＜戦闘開始関連＞
 * @type number
 * @default 50
 * @desc 先制攻撃時の特典。
 * 指定した数値の％分だけ仲間のターンを早めます。
 *
 * @param surpriseAdvantage
 * @text 奇襲時の始動時間ボーナス
 * @parent ＜戦闘開始関連＞
 * @type number
 * @default 50
 * @desc 奇襲時の敵特典。
 * 指定した数値の％分だけ敵のターンを早めます。
 *
 * @param startTurn
 * @text 開始ターン数
 * @parent ＜戦闘開始関連＞
 * @type select
 * @option 0
 * @option 1
 * @default 1
 * @desc 戦闘開始時のターン数（敵の行動判定用）を設定します。
 * 初期値は1。MVのデフォルトの仕様だと0です。
 *
 * @param ＜逃走関連＞
 * @desc 見出しです。
 *
 * @param escapePenalty
 * @text 逃走時のペナルティ時間
 * @parent ＜逃走関連＞
 * @type number
 * @desc 逃走失敗時のペナルティ。
 * @default 25
 * 指定した数値の％分だけ味方のターンを遅らせます。
 *
 * 【利用規約】
 * 特に制約はありません。
 * 改変、再配布自由、商用可、権利表示も任意です。
 * 作者は責任を負いませんが、不具合については可能な範囲で対応します。
 */

(function() {
"use strict";

function toNumber(str, def) {
    return isNaN(str) ? def : +(str || def);
}
function toBoolean(str, def) {
    if (str == "") {
        return def;
    }
    return str.toLowerCase() === 'true';
}

var parameters = PluginManager.parameters("NRP_CountTimeBattle");
    
var paramNumber = toNumber(parameters["number"], 9);
var paramActorStartRandomWt = toNumber(parameters["actorStartRandomWt"], 0);
var paramEnemyStartRandomWt = toNumber(parameters["enemyStartRandomWt"], 20);
var paramEscapePenalty = toNumber(parameters["escapePenalty"], 25);
var paramPreemptiveAdvantage = toNumber(parameters["preemptiveAdvantage"], 50);
var paramSurpriseAdvantage = toNumber(parameters["surpriseAdvantage"], 50);
var paramStartTurn = toNumber(parameters["startTurn"], 1);

// 重複処理を排除するための対象index
var keepTargetIndex = -1;

/**
 * ●戦闘開始シーン制御
 */
var _Scene_Battle_start = Scene_Battle.prototype.start;
Scene_Battle.prototype.start = function() {
    _Scene_Battle_start.apply(this);
    
    // 表示更新（これがないとＴＰの初期値が表示されない）
    this.refreshStatus();
};

/**
 * ●戦闘開始
 */
var _BattleManager_startBattle = BattleManager.startBattle;
BattleManager.startBattle = function() {
    _BattleManager_startBattle.apply(this, arguments); // 再定義した旧処理
    
    // 戦闘開始時の初期WTを設定
    this.setStartWt();
};

/**
 * ●戦闘開始時のWT（待ち時間）設定
 * ※先制攻撃、奇襲を考慮
 */
BattleManager.setStartWt = function() {
    // ループ内でthis参照はできないので一旦移す
    var surprise = this._surprise;
    var preemptive = this._preemptive;
    
    // 敵味方全員の初期WTを計算する。
    this.allBattleMembers().forEach(function(battler) {
        // 基本WTを設定する。
        battler.makeBaseWt();

        // WTの初期値として基本WTを設定する。
        var wt = battler._baseWt;
        var startRandomWt = 0;
        
        // 味方
        if (battler.isActor()) {
            startRandomWt = paramActorStartRandomWt;
            
            // 先制攻撃の場合はWT減算
            if (preemptive) {
                // - WT * 先制攻撃特典％ / 100
                wt -= parseInt(wt * paramPreemptiveAdvantage / 100);
            }
            
        // 敵の場合はWT分散
        } else {
            startRandomWt = paramEnemyStartRandomWt;
                
            // 不意打ちの場合はWT半減
            if (surprise) {
                // - WT * 奇襲特典％ / 100
                wt -= parseInt(wt * paramSurpriseAdvantage / 100);
            }
        }
        
        // 初期ＷＴを分散値に従って設定する。
        // 例：分散値が20の場合
        // 100 - (20 / 2) + [0～20未満の乱数] → 90～110未満の乱数を作成
        var r = 100 - (startRandomWt / 2) + Math.random() * startRandomWt;
        wt = parseInt(wt * r / 100);
        
        battler._wt = wt;
    });
};

/**
 * ●コマンド入力開始
 * ※一度だけ呼び出される部分
 */
BattleManager.startInput = function() {
    this._phase = 'input';
    
    // 行動順序計算
    this.makeActionOrders();
    // 時間経過
    this.timeGoesBy();
    // 次の行動者を取得する。
    this._subject = this.getNextSubject();
    
    // 行動設定
    // ※敵なら行動設定、味方なら行動回数などの領域設定
    this._subject.makeActions();
    
    // 敵の場合、または味方が入力不可ならターン開始
    if (!this._subject.isActor() || !this._subject.canInput()) {
        this._actorIndex = -1;
        this.startTurn();
    }
    
    this.startInputActor();
};

/**
 * ●コマンド入力開始（続）
 * ※パーティコマンドから戻ってくる際と共有
 */
BattleManager.startInputActor = function() {
    // 先頭の行動者を入力対象に設定
    this._actorIndex = this._subject.index();
    /*
     * 【参考情報】
     * undecided(未定),inputting(コマンド入力中),waiting(待機中),acting(行動中),done(行動終了)
     */
    this._subject.setActionState("undecided"); // ポーズを未定状態に変更
};

/**
 * ●行動アニメ終了時
 */
Game_Battler.prototype.performActionEnd = function() {
// 元のターン制ではdoneだが、違和感あるので変える。
//    this.setActionState('done');
    this.setActionState('undecided');
};

/**
 * ●パーティコマンドの戦うを選択
 */
Scene_Battle.prototype.commandFight = function() {
    BattleManager.startInputActor();
//    this.selectNextCommand();
};

/**
 * ●次のコマンド入力へ
 */
BattleManager.selectNextCommand = function() {
    do {
        /*
         * 以下のいずれかの場合はターン開始
         * アクターが取得できない。
         * アクターではなく敵である。
         * アクターのコマンドは全て入力済み。（複数行動を考慮）
         */
        if (!this.actor() || !this.actor().isActor() || !this.actor().selectNextCommand()) {
            this.startTurn();
            break;
        }
    } while (!this.actor() || !this.actor().isActor() || !this.actor().canInput());
};

/**
 * ●前のコマンド入力へ
 */
BattleManager.selectPreviousCommand = function() {
    // 入力中のアクターをクリアし、パーティコマンドを呼び出す。
    this._actorIndex = -1;
};

/**
 * ●行動順序の作成
 */
BattleManager.makeActionOrders = function() {
    // WTとバトラーの組のリスト
    var wt_battlers = []
    // 一時バトラーリスト
    var battlers = [];
    
    /*
     * 敵味方全員の生存者リストを作成し、基本WTを計算する。
     */
    this.allBattleMembers().forEach(function(battler) {
        // 生存者のみに絞る
        if (battler.isAlive()) {
            // 現在の敏捷性で基本WTを設定する。
            battler.makeBaseWt();
            // 格納
            battlers.push(battler);
        }
    });
    
    /*
     * CTB用のリストを作成していく。
     */
    battlers.forEach(function(battler) {
        for (var i = 0; i < paramNumber; i++) {
            // 現在のWTに、次の行動までのWTを加算する。
            var tmpWt = battler._wt + (battler._baseWt * i);

            /*
             * 以下の条件を満たす場合は、割り込めない。
             * １．現在の行動順リストが埋まっている。
             * ２．かつ、末尾のバトラーよりもWTが大きい場合。
             */
            if (wt_battlers.length >= paramNumber
                && tmpWt >= wt_battlers[paramNumber - 1][0]) {
                // forループを終了して、次のバトラーへ
                break;
            }
            
            // 行動順リストの末尾にWTとバトラーの組を追加
            wt_battlers.push([tmpWt, battler]);

            // WT順でソート実行
            wt_battlers.sort(function(a, b) {
                return a[0] - b[0];
            });
            
            // 押し出された要素（最後の要素）を削除
            if (wt_battlers.length > paramNumber) {
                wt_battlers.pop();
            }
        }
    });
    
    /*
     * 変更前との互換性を保つため、WTを除いたリストも作成
     */
    battlers = [];
    wt_battlers.forEach(function(wtBattler) {
        battlers.push(wtBattler[1]);
    });

    this._actionBattlers = battlers;
};

/**
 * ●行動者の速度補正を考慮した上で、行動順序を再計算する。（予測用）
 */
BattleManager.reMakeActionOrders = function() {
    var subject = BattleManager._subject;
    // 行動者のWTを一時的に保持
    var tmpWt = subject._wt;
    // 速度補正を元にWTを一時的に書き換える。
    subject.makeSpeed();
    // 速度補正後のWT - 基本WT
    // つまり、WT（待ち時間）の増加分を求める。
    var diffWt = subject.getAddWt() - subject._baseWt;
    // 増加した分の待ち時間を加算する。
    subject._wt = tmpWt + diffWt;

    // 行動順序再計算
    BattleManager.makeActionOrders();

    // ＷＴを元に戻す。
    subject._wt = tmpWt;
}

/**
 * ●時間経過処理
 */
BattleManager.timeGoesBy = function() {
    var topWt = this._actionBattlers[0]._wt;
    if (topWt > 0) {
        // 先頭行動者のWTが0になるように、全バトラーのWTを減算。
        this.allBattleMembers().forEach(function(battler) {
            // 生存者のみに絞る
            if (battler.isAlive()) {
                battler._wt -= topWt;
            }
        });
    }
}

/**
 * ●ターン開始処理
 */
BattleManager.startTurn = function() {
    this._phase = 'turn';
    this.clearActor();
    $gameTroop.increaseTurn();
    
// 不要につき削除
//    this.makeActionOrders();
    
    $gameParty.requestMotionRefresh();
    
// 内部ではウェイトをかけているだけなので削除
// CTBでは全行動がターン開始なのでテンポ悪化を防ぐため。
//    this._logWindow.startTurn();
};

/**
 * ●戦闘行動の処理
 */
BattleManager.processTurn = function() {
    var subject = this._subject;
    var action = subject.currentAction();
    if (action) {
        action.prepare();
        if (action.isValid()) {
            this.startAction();
        }
        subject.removeCurrentAction();
        
    } else {
// BattleManager.endTurnで行うため不要
//        subject.onAllActionsEnd();
//        this.refreshStatus();
//        this._logWindow.displayAutoAffectedStatus(subject);
//        this._logWindow.displayCurrentState(subject);
//        this._logWindow.displayRegeneration(subject);
//        this._subject = this.getNextSubject();
        // CTBなので即ターン終了
        this.endTurn();
    }
};

/**
 * ●行動開始
 */
var _BattleManager_startAction = BattleManager.startAction;
BattleManager.startAction = function() {
    // 元の処理
    _BattleManager_startAction.apply(this);
    
    // 実行した行動の速度を計算する。
    this._subject.makeSpeed();
};

/**
 * ●ターン終了処理
 */
BattleManager.endTurn = function() {
    this._phase = 'turnEnd';
    this._preemptive = false;
    this._surprise = false;
    
    var subject = this._subject;

    // 行動者の現在WTに加算WTを加算する。
    subject._wt += subject.getAddWt();
    // 行動者の個別ターン加算
    subject._turnCount++;
    
    // AddWt == 0 の場合は連続行動なのでターン経過なしとする。
    if (subject.getAddWt() > 0) {
        // 個別のターン終了処理
        subject.onTurnEnd();
        // デフォルトと異なりonAllActionsEndをonTurnEndの下に配置する。
        // 自動解除が『行動終了時』となっているステートを１ターン目から処理するため。
        subject.onAllActionsEnd();

        this.refreshStatus();
        this._logWindow.displayAutoAffectedStatus(subject);
        this._logWindow.displayRegeneration(subject);

        // 他のバトラーについても、自動解除が『ターン終了時』となっているステートを処理
        this.allBattleMembers().forEach(function(battler) {
            // 重複しないように行動者は除く
            if (battler != subject) {
                battler.onEveryTurnEnd();

                this.refreshStatus();
                this._logWindow.displayAutoAffectedStatus(battler);
                this._logWindow.displayRegeneration(battler);
            }
        }, this);
    }
    
    if (this.isForcedTurn()) {
        this._turnForced = false;
    }
    
    // BattleManager.startInputへ戻る。
};

/**
 * ●行動終了時
 */
Game_Battler.prototype.onAllActionsEnd = function() {
// onTurnEndと処理がかぶるので注釈化
// 消しておかないと毒などの数値表示が消える。
//    this.clearResult();
    this.removeStatesAuto(1);
    this.removeBuffsAuto();
};

/**
 * ●自動解除が『ターン終了時』となっているステートを処理するためのターン終了処理
 */
Game_Battler.prototype.onEveryTurnEnd = function() {
    this.clearResult();
    this.updateStateEveryTurns();
    this.removeStatesAuto(2);
};

/**
 * ●自動解除が『ターン終了時』となっているステートの効果ターンを経過させる。
 */
Game_BattlerBase.prototype.updateStateEveryTurns = function() {
    this._states.forEach(function(stateId) {
        // 自動解除が『ターン終了時』のステートを対象とする。
        if ($dataStates[stateId].autoRemovalTiming == 2 && this._stateTurns[stateId] > 0) {
            this._stateTurns[stateId]--;
        }
    }, this);
};

/**
 * ●ステート有効ターン初期設定
 */
var _Game_BattlerBase_prototype_resetStateCounts = Game_BattlerBase.prototype.resetStateCounts;
Game_BattlerBase.prototype.resetStateCounts = function(stateId) {
    // 元処理呼び出し
    _Game_BattlerBase_prototype_resetStateCounts.apply(this, arguments);
    
    // 対象者が行動者自身の場合は有効ターン＋１
    // そうしておかないと、行動終了と同時にターン経過してしまうため。
    if (this == BattleManager._subject) {
        // 自動解除が『行動終了時』のステートを対象とする。
        if ($dataStates[stateId].autoRemovalTiming == 1) {
            this._stateTurns[stateId]++;
        }
    }
};

/**
 * ●次の行動主体の取得
 * 行動順序リストの次に来るバトラーを取得する。
 * 現在パーティにいないアクターを取得した場合（index が nil, バトルイベ
 * ントでの離脱直後などに発生）は、それをスキップする。
 */
BattleManager.getNextSubject = function() {
    for (;;) {
        var battler = this._actionBattlers[0];
        
        if (!battler) {
            return null;
        }
        if (battler.isBattleMember() && battler.isAlive()) {
            return battler;
        }
    }
};

/**
 * ●逃走実行時
 */
BattleManager.processEscape = function() {
    $gameParty.performEscape();
    SoundManager.playEscape();
    var success = this._preemptive ? true : (Math.random() < this._escapeRatio);
    if (success) {
        this.displayEscapeSuccessMessage();
        this._escaped = true;
        this.processAbort();
    } else {
        this.displayEscapeFailureMessage();
        this._escapeRatio += 0.1;
        $gameParty.clearActions();
        
        // 逃走失敗のペナルティを設定
        this.setEscapePenalty();
        
        // 即ターン終了
        this.endTurn();
//        this.startTurn();
    }
    return success;
};

/**
 * ●逃走失敗時のペナルティ
 */
BattleManager.setEscapePenalty = function() {
    // 逃走失敗のペナルティを設定
    $gameParty.aliveMembers().forEach(function(battler) {
        // 失敗した当人以外のWTを加算する。
        if (battler != BattleManager._subject) {
            // 基本ＷＴ * ペナルティ% / 100
            battler._wt += parseInt(battler._baseWt * paramEscapePenalty / 100);
        }
    });
};

/**
 * ●パラメータの追加
 */
Object.defineProperties(Game_BattlerBase.prototype, {
    // WT（待ち時間）
    wt: { get: function() { return this._wt; }, configurable: true },
});

/**
 * ●バトラー変数の初期化
 */
var _Game_BattlerBase_prototype_initMembers = Game_BattlerBase.prototype.initMembers;
Game_BattlerBase.prototype.initMembers = function() {
    // 再定義した旧関数を呼び出す。
    _Game_BattlerBase_prototype_initMembers.apply(this, arguments);
    
    this._wt = 0;
    // 初期ターンの設定
    this._turnCount = paramStartTurn;
};

/**
 * ●個別ターン数の取得
 */
Game_BattlerBase.prototype.turnCount = function() {
    return this._turnCount;
};

/**
 * ●基本WTを計算する。
 */
Game_Battler.prototype.makeBaseWt = function() {
    // 100000 / 敏捷性
    this._baseWt = parseInt(100000 / this.agi);
};

/**
 * ●速度補正つき加算WTを取得する。
 */
Game_Battler.prototype.getAddWt = function() {
    var addWt = 100000;

    // speedが有効ならspeed値を使用する。
    if (this._speed > 0) {
        addWt = parseInt(100000 / this._speed);
        
    // なければagiを参照する。
    } else {
        addWt = parseInt(100000 / this.agi);
    }
    return addWt;
};

/**
 * ●行動速度の計算
 * 速度補正を％化
 */
Game_Action.prototype.speed = function() {
    var agi = this.subject().agi;
    
    // バラつきをなくす
    var speed = agi;
//    var speed = agi + Math.randomInt(Math.floor(5 + agi / 4));
    
    if (this.item()) {
        // 速度補正MAX(2000)の場合は速度無限に（時間経過がなくなる）
        if (this.item().speed >= 2000) {
            return Infinity;
        }
        
        // 速度補正を％化
        speed += parseInt(speed * this.item().speed / 100);
//        speed += this.item().speed;
    }
    if (this.isAttack()) {
        // 速度補正MAX(2000)の場合は速度無限に（時間経過がなくなる）
        if (this.subject().attackSpeed() >= 2000) {
            return Infinity;
        }
        
        // 速度補正を％化
        speed += parseInt(speed * this.subject().attackSpeed() / 100);
//        speed += this.subject().attackSpeed();
    }
    return speed;
};

/**
 * ●敵の行動条件合致判定［ターン数］
 */
Game_Enemy.prototype.meetsTurnCondition = function(param1, param2) {
    // グループのターンではなく、行動者の個別ターンを参照する。
    var n = this.turnCount();
//    var n = $gameTroop.turnCount();
    
    if (param2 === 0) {
        return n === param1;
    } else {
        return n > 0 && n >= param1 && n % param2 === param1 % param2;
    }
};

/**
 * ●ステート追加（ＷＴ変動の実装）
 */
var _Game_BattlerBase_prototype_addNewState = Game_BattlerBase.prototype.addNewState;
Game_BattlerBase.prototype.addNewState = function(stateId) {
    /*
     * WT設定値を元にWTを変化
     */
    // <SetWt:number>があれば、その値(%)を設定
    if ($dataStates[stateId].meta.SetWt) {
        this._wt = this._baseWt * $dataStates[stateId].meta.SetWt / 100;
    
    // <AddWt:number>があれば、その値(%)を加算
    } else if ($dataStates[stateId].meta.AddWt) {
        this._wt += this._baseWt * $dataStates[stateId].meta.AddWt / 100;
    }
    
    // 元の処理
    _Game_BattlerBase_prototype_addNewState.apply(this, arguments);
};

/**
 * ●各種効果
 * 効果前後で敏捷性の変化を監視し、変化があればWTを調整する。
 */
var _Game_Action_prototype_applyItemEffect = Game_Action.prototype.applyItemEffect;
Game_Action.prototype.applyItemEffect = function(target, effect) {
    // 効果前の敏捷性を保持
    var beforeAgi = target.agi;
    
    // 元の処理
    _Game_Action_prototype_applyItemEffect.apply(this, arguments);

    if (target.agi != beforeAgi) {
        // 敏捷性が変化したので、WTも変化させる。
        target._wt = parseInt(target._wt / (target.agi / beforeAgi));
    }
}

/**
 * ●味方の選択時
 */
var _Window_BattleActor_prototype_select = Window_BattleActor.prototype.select;
Window_BattleActor.prototype.select = function(index) {
    _Window_BattleActor_prototype_select.apply(this, arguments);
    
    // 対象の選択が有効なら、行動予測のために行動順序再計算
    // このselect処理はなぜか重複して呼ばれるので、対象が変わった時のみ実行する
    if (index >= 0 && index != keepTargetIndex) {
        keepTargetIndex = index; // 対象を保持
        BattleManager.reMakeActionOrders();
    }
};

/**
 * ●敵の選択時
 */
var _Window_BattleEnemy_prototype_select = Window_BattleEnemy.prototype.select;
Window_BattleEnemy.prototype.select = function(index) {
    _Window_BattleEnemy_prototype_select.apply(this, arguments);
    
    // 対象の選択が有効なら、行動予測のために行動順序再計算
    // このselect処理はなぜか重複して呼ばれるので、対象が変わった時のみ実行する
    if (index >= 0 && index != keepTargetIndex) {
        keepTargetIndex = index; // 対象を保持
        BattleManager.reMakeActionOrders();
    }
};

/**
 * ●味方選択決定
 */
var _Scene_Battle_prototype_onActorOk = Scene_Battle.prototype.onActorOk;
Scene_Battle.prototype.onActorOk = function() {
    _Scene_Battle_prototype_onActorOk.call(this);
    
    // 保持対象クリア
    keepTargetIndex = -1;
};

/**
 * ●敵選択決定
 */
var _Scene_Battle_prototype_onEnemyOk = Scene_Battle.prototype.onEnemyOk;
Scene_Battle.prototype.onEnemyOk = function() {
    _Scene_Battle_prototype_onEnemyOk.call(this);
    
    // 保持対象クリア
    keepTargetIndex = -1;
};

/**
 * ●味方選択キャンセル
 */
var _Scene_Battle_prototype_onActorCancel = Scene_Battle.prototype.onActorCancel;
Scene_Battle.prototype.onActorCancel = function() {
    _Scene_Battle_prototype_onActorCancel.call(this);
    
    // 行動予測を戻すために行動順序再計算
    BattleManager.makeActionOrders();
    // 保持対象クリア
    keepTargetIndex = -1;
};

/**
 * ●敵選択キャンセル
 */
var _Scene_Battle_prototype_onEnemyCancel = Scene_Battle.prototype.onEnemyCancel;
Scene_Battle.prototype.onEnemyCancel = function() {
    _Scene_Battle_prototype_onEnemyCancel.call(this);
    
    // 行動予測を戻すために行動順序再計算
    BattleManager.makeActionOrders();
    // 保持対象クリア
    keepTargetIndex = -1;
};

})();
