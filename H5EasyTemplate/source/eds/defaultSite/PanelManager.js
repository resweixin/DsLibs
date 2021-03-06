import PanelBase from '../base/PanelBase';
// import AlertBase from '../base/AlertBase';
import PanelModel from './PanelModel';

/**
 * 浮层管理器
 */
class PanelManager extends ds.core.EventDispatcher {
    constructor() {
        super();
        this._panelList = [];
        this._panelDc = {};
        // this.AlertBase = AlertBase;
    }

    // /**
    //  * 设置基础弹出框皮肤对象
    //  * @param skin
    //  * @param opts
    //  * @param opts.wrapW
    //  */
    // setAlertDefaultSkin(skin, opts) {
    //     this.AlertBase.setDefaultSkin(skin, opts);
    // }
    //
    // /**
    //  * 在设置过默认弹出框的皮肤后 可以比较好使用这个自定义弹出框
    //  * @param label
    //  * @param opts
    //  */
    // alert(label, opts){
    //     console.log('alert:',label);
    //     this.AlertBase.show(label, opts);
    // }
    //
    // /**
    //  * 设置alert createjs容器层
    //  * @param root
    //  */
    // setAlertDefaultRootByCreatejs(root) {
    //     this.AlertBase.showRootByCreatejs = root;
    // }
    // /**
    //  * 设置alert 默认容器层 基于dom
    //  * @param root
    //  */
    // setAlertDefaultRootByHTML(root) {
    //     this.AlertBase.showRootByHTML = root;
    // }

    /**
     * 设置浮动层默认容器 基于createjs
     * @param root
     */
    setDefaultRootByCreatejs(root) {
        eds.PanelBase.showRootByCreatejs = root;
    }

    /**
     * 设置浮动层默认容器 基于dom
     * @param root
     */
    setDefaultRootByHTML(root) {
        eds.PanelBase.showRootByHTML = root;
    }

    /**
     * 显示浮层
     * @param label
     * @param opts
     */
    show(label, opts) {
        opts = opts || {};
        let _pl = this.getPanel(label);

        if (_pl) _pl.show(opts);
    }

    /**
     * 隐藏浮层
     * @param label
     * @param opts
     */
    hide(label, opts) {
        opts = opts || {};
        let _pl = this.getPanel(label);
        if (_pl) _pl.hide(opts);
    }

    /**
     * 隐藏所有浮层
     * @param {function} cb 执行隐藏后回调
     */
    hideAll(cb) {
        let _panelList = this._panelList;
        for (let i = 0; i < _panelList.length; i++) {
            let _pl = _panelList[i];
            _pl.hide();
        }
        if (cb) cb();
    }

    /**
     * 添加一个浮层
     * @param panel
     */
    add(panel) {

        if (this._panelList.indexOf(panel) !== -1) return;
        let _name = panel.name;
        if (!_name) {
            panel.name = 'DsPanel' + this._panelList.length;
        }
        if (this._panelDc[_name]) {
            console.warn('Already have page.name ：', _name);
            return;
        }
        this._panelDc[_name] = panel;
        this._panelList.push(panel);
    }

    /**
     * 删除一个浮层
     * @param panel
     */
    remove(panel) {
        if (this._panelList.indexOf(panel) <= 0) return;
        let _name = panel.name;
        let _panelList = this._panelList;
        for (let i = 0; i < _panelList.length; i++) {
            let _temp = _panelList[i];
            _panelList.splice(i, 1);
        }
        this._panelDc[_name] = undefined;
    }

    /**
     * 初始化浮层页面
     * @param list
     */
    initConfig(list) {
        let _panel;
        for (let i = 0; i < list.length; i++) {
            let _config = list[i];
            _panel = new PanelModel(_config);
            this.add(_panel);
        }
    }

    /**
     * 是否有显示浮动层
     * @return {boolean}
     */
    hasShowPanel() {
        let _panelList = this._panelList;
        for (let i = 0; i < _panelList.length; i++) {
            let _panel = _panelList[i];
            if (_panel.showBool) return true;
        }
        return false;
    }

    /**
     * 显示浮动层列表
     * @return {Array}
     */
    showPanelList() {
        let _list = [];
        let _panelList = this._panelList;
        for (let i = 0; i < _panelList.length; i++) {
            let _panel = _panelList[i];
            if (_panel.showBool) _list.push(_panel);
        }
        return _list;
    }

    /**
     * 获取浮层
     * @param label
     * @return {*}
     */
    getPanel(label) {
        return this._panelDc[label];
    }

    /**
     * 浮层字典
     * @return {{}|*}
     */
    get panelDc() {
        return this._panelDc;
    }

    /**
     * 浮层列表
     * @return {Array}
     */
    get panelList() {
        return this._panelList;
    }


}

export default PanelManager;