import PageManager from './defaultSite/PageManager';
import 'touchjs';
import 'jstween';
import 'ds/net/QuickAjax';
import 'ds/net/ADTrack';
import 'ds/net/QueueLoad';
import 'ds/ui/PopAlert';
import 'ds/utils/Animate';
import 'ds/net/CagoeWechatShareModel';


class DefaultMain extends ds.core.EventDispatcher {

    constructor() {
        super();
    }

    init() {

        // console.log('SPA init()');

        let _config = SiteModel.config;
        if (!_config.otherjs) _config.otherjs = [];
        let _otherjs = _config.otherjs;
        if (_config.hasThreeJs || _config.hasThreeJsModel) {
            if (_otherjs.indexOf('./js/edslibs/extend_threejs.js') < 0) _otherjs.push('./js/edslibs/extend_threejs.js');
        }
        if (_config.hasPixiJs || _config.hasPixiJsModel) {
            if (_otherjs.indexOf('./js/edslibs/extend_pixijs.js') < 0) _otherjs.push('./js/edslibs/extend_pixijs.js');
        }
        //是否需要添加插件
        if (SiteConfig.plugins && SiteConfig.plugins.length > 0) {

            let _plugins = SiteConfig.plugins;
            let _jsUrl;
            for (let i = 0; i < _plugins.length; i++) {

                let _url = _plugins[i];
                if (_url.indexOf('.js') < 0) _jsUrl = './js/edslibs/plugins_' + _url + '.js';
                else _jsUrl = _url;
                _otherjs.push(_jsUrl);

            }

        }

        //设置分享
        SiteModel.shareModel.defaultWeiShare();
        //在加载模块需要的资源前需要siteModel创建需要的模块吗？
        SiteModel.beforeSinglePageApplicationLoadAssets(() => {
            this._loadMainAssets();
        });

    }

    _loadMainAssets() {

        // console.log('load SPA Assets');

        let _self = this;



        let _loadAssets = SiteConfig.loadAssets;

        if (!_loadAssets || _loadAssets.length <= 0) console.warn('你确定不配置加载资源吗！如果有createjs必须有相关资源');

        this._loadLazyImages();

        let _loadList = [];

        let _progressStart = SiteConfig.loadAssetsStartProgress || 20;
        SiteModel.showProgress(_progressStart);

        let _all = 100 - _progressStart;
        let _spacing = _all / _loadAssets.length;

        let i, obj, _loadObj, _index = -1;
        for (i = 0; i < _loadAssets.length; i++) {

            obj = _loadAssets[i];
            _loadObj = {
                loadType: true,
                crossOrigin: true,
                progress: progress,
                complete: loadStart,
            };
            if (obj instanceof Array) {
                let _tp = obj;
                obj = {type: 'images'};
                obj.basePath = '';
                obj.list = _tp;
            }

            if (typeof obj === 'string') {

                _loadObj.jsUrl = obj;
                if (obj.indexOf('./') < 0) _loadObj.jsUrl = './assets/' + _loadObj.jsUrl;
                _loadObj.jsNS = _loadObj.jsUrl.slice(_loadObj.jsUrl.lastIndexOf('/') + 1, _loadObj.jsUrl.lastIndexOf('.'));
                _loadObj.imgNS = _loadObj.jsNS + 'images';

            }
            else if (obj.type && obj.type === 'images') {
                _loadObj.type = obj.type;
                let _ls = _loadObj.list;
            }
            else {

                _loadObj.jsUrl = obj.url;
                if (_loadObj.jsUrl.indexOf('./') < 0) _loadObj.jsUrl = './assets/' + _loadObj.jsUrl;
                if (obj.jsNS !== undefined) _loadObj.jsNS = obj.jsNS;
                else _loadObj.jsNS = _loadObj.jsUrl.slice(_loadObj.jsUrl.lastIndexOf('/') + 1, _loadObj.jsUrl.lastIndexOf('.'));
                _loadObj.imgNS = _loadObj.jsNS + 'images';
                if (obj.loadType !== undefined) _loadObj.loadType = obj.loadType;

            }

            _loadObj.start = (_progressStart + _spacing * i) >> 0;
            _loadObj.end = (_progressStart + _spacing * i + _spacing) >> 0;

            _loadList.push(_loadObj);

            // console.log('_loadObj:',_loadObj);

        }

        let _nowLoadData;

        function loadStart() {

            if (_nowLoadData) SiteModel.showProgress(_nowLoadData.end);

            _index += 1;
            if (_index >= _loadList.length) {
                loadEnd();
                SiteModel.resize();
                return;
            }
            // if(_index===0)SiteModel.resize();


            _nowLoadData = _loadList[_index];

            if (_nowLoadData.type && _nowLoadData.type === 'images') {
                ds.net.queueLoad(_nowLoadData.list, _nowLoadData.complete, _nowLoadData.progress, {
                    basePath: _nowLoadData.basePath
                });
            } else {
                ds.createjs.loadAssets(_nowLoadData);
            }


        }

        function progress(e) {
            let _progress = e.target.progress;
            SiteModel.showProgress(_nowLoadData.start + (_spacing * _progress >> 0));
        }

        function loadEnd() {
            _self._loadLazyImagesEnd();
            _self._initPageManager();
        }

        loadStart();

    }

    _loadLazyImagesEnd(){
       let _lazysList= this._lazysList;
        for (let i = 0; i < _lazysList.length; i++) {
            let _img = _lazysList[i];
            _img.src=_img.getAttribute('lazypath');
        }
    }

    _loadLazyImages(){

        let _img;
        let _imgs=$('img');
        let _dc={};
        let _lazys=[];
        this._lazysList=[];
        for (let i = 0; i < _imgs.length; i++) {
            _img = _imgs[i];
            let _url=_img.getAttribute('lazypath');
            if(_url)this._lazysList.push(_img);
            if(_url&&!_dc[_url]){
                _dc[_url]=_url;
                _lazys.push(_url);
            }
        }

        if(_lazys.length>0){
            if(SiteConfig.loadAssets)SiteConfig.loadAssets=[];
            SiteConfig.loadAssets.push(_lazys);
        }


    }

    _initPageManager() {

        // console.log('_initPageManager');

        let _pages = SiteConfig.pages;
        if (!_pages || _pages.length <= 0) {
            console.error('请配置页面');
            return;
        }

        let _pager = SiteModel.pager;
        _pager.initPageConfig(_pages);


        let _extend = SiteConfig.extend;
        if (!_extend || _extend.length <= 0) {
            this._startSitePage();
        } else {
            console.log('load extend js');

            SiteModel.getScriptList(_extend, () => {
                this._startSitePage();
            })
        }


    }

    _startSitePage() {
        //如果有配置开始进入网站首页方法，会使用配置方法。默认startSitePage不执行
        if (SiteConfig.startSitePage) {
            var _startSitePage = SiteConfig.startSitePage.bind(this);
            _startSitePage();
            return;
        }

        // console.log('startSitePage');

        this.isWorkBack = false;

        let _firstPage;
        if (window.location.href.indexOf(SiteConfig.shareWorkUrl) !== -1) {
            let _workPage = SiteConfig.workPage;
            if (!_workPage) {
                alert('请在配置内设置回流页面');
                return;
            }
            let _urlParamDc = ds.net.getUrlParameterDictionary();
            if (!_urlParamDc || !_urlParamDc['WorkID']) {
                ds.alert('作品id获取失败');
                return;
            }
            else {

                let _workid = _urlParamDc['WorkID'];
                _firstPage = _workPage.name;
                this.isWorkBack = true;
                this.workID = _workid;

                let _event = {
                    type: 'backWorkPage',
                    id: _workid,
                };

                this.ds(_event);
                SiteModel.ds(_event);

                if (_workPage.getWorkData) _workPage.getWorkData(_workid);
                else {
                    SiteModel.hitLoadPanel();
                    SiteModel.gotoPage(_firstPage);
                }
            }
        }
        else {

            let _pager = SiteModel.pager;
            _firstPage = SiteConfig.firstPage;
            if (SiteModel.debug && SiteConfig.debugFirstPage) _firstPage = SiteConfig.debugFirstPage;
            if (!_pager.pageDc[_firstPage]) _firstPage = _pager.pageList[0].name;
            _firstPage = _pager.pageDc[_firstPage].name;
            SiteModel.gotoPage(_firstPage);
            SiteModel.hitLoadPanel();
        }


    }

}

let _shareData = SiteConfig.shareData || {};
let _shareTitle = _shareData.shareTitle || '速速提供分享标题';
let _shareInfo = _shareData.shareInfo || '速速提供分享内容';
let _shareUrl = _shareData.shareUrl || '/index.html';
let _shareWorkUrl = _shareData.shareWorkUrl || '/index.html?WorkID=';
let _shareImageUrl = _shareData.shareImageUrl || 'images/ShareImg.jpg';
SiteModel.shareModel = new ds.net.CagoeWechatShareModel(
    _shareTitle,
    _shareInfo,
    _shareUrl,
    _shareWorkUrl
);

SiteModel.pager = new PageManager();
//单页面实例创建
SiteModel.appMain = new DefaultMain();
SiteModel.appMain.init();

export default SiteModel.appMain;