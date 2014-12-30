/*
*
* */

Zepto(function($){
    var tmpEndY,tmpStartY,tmpEndX,tmpStartX,
        baseImgUrl = "images/",
        pics = [//预加载图片列表
            baseImgUrl + "index-20141124111113.png",
            baseImgUrl + "page0_bg.jpg",
            baseImgUrl + "page0_circle.png",
            baseImgUrl + "page0_circlebg.png",
            baseImgUrl + "page0_circlebg1.png",
            baseImgUrl + "page0_wd.png",
            baseImgUrl + "page1_bg.jpg"
        ],
        app = {
            page:0,
            pageCall:null,
            isMoveTouch:false,
            isBanSliding:false,

            dragging:false,//是否允许拖动
            dragEl:null,//拖动的对象
            opendrag:function(){//开启
                app.drag = true;
            },

            closedrag:function(){//开启
                app.drag = true;
            },
            init:function(callfun){
                if(callfun) this.pageCall = callfun;
                this.loadImg(
                    pics,
                    $.proxy(function(){
                        this.$contentList = $(".content-list");
                        this.$contentListLi = this.$contentList.children("li");
                        this.$figure = $("#figure");//人物形象
                        this.maxlength = this.$contentList.children("li").length-1;//最大页数
                        this.updatePage();
                        this.initAni();
                        this.initEvent();
                        $(".loading-wrap").hide();
                        this.$contentList.show();
                }, this));


            },
            initAni:function(){//动画
                app.updateSize();
            },

            initEvent:function(){//初始化事件

                var startTouch = function (event) {
                        if (!event.touches.length) {
                            return;
                        }
                        tmpEndY = 0;
                        tmpEndX = 0;
                        var touch = event.touches[0];
                        tmpStartY = touch.pageY;
                        tmpStartX = touch.pageX;
                    },
                    moveTouch = function (event) {
                        event.preventDefault();
                        if (!event.touches.length) {
                            return;
                        }
                        var touch = event.touches[0];
                        tmpEndY = touch.pageY;
                        tmpEndX = touch.pageX;
                    },

                    // 触摸结束时判断执行上翻或者下翻
                    endTouch = function () {
                        var endY = tmpEndY,
                            endX = tmpEndX,
                            startY = tmpStartY,
                            startX = tmpStartX,
                            _type = "swipeup";
                        if (endY && endY !== startY && endY-startY<=-25) {
                            //向上
                        }else if(endY && endY !== startY && endY-startY>=25){
                           //向下
                           _type = "swipedown";
                        }else if(endX && endX !== startX && endX-startX<=-25){
                            //向左
                            _type = "swipeleft";
                        }else if(endX && endX !== startX && endX-startX>=25){
                            //向右
                            _type = "swiperight";
                        }
                        app.updatePage(_type);
                    },
                    contentList = $("body");
                // 绑定翻页
                contentList.on("touchstart",function(e){
                    startTouch(e);
                });
                contentList.on("touchmove",function(e){
                    moveTouch(e);
                });
                contentList.on("touchend",function(e){
                    if(app.isMoveTouch || app.isBanSliding) return;
                    endTouch(e);
                });

                //人物形象事件
                app.figureEvent();

                $(".nextpic").on("touchend",function(e){
                    app.addPage();
                    app.updatePage("swipeup");
                });

                window.onorientationchange = window.onresize= app.updateSize;


            },
            updateSize:function(){
                // 每一页高度自适应
                app.$contentListLi.each(function () {
                    $(this).css("height", $(window).height());
                });
            },
            addPage:function(){
                app.page++;
                if(app.page >= 6){
                    app.page =6;
                }
            },
            subtractPage:function(){
                app.page--;
                if(app.page <= 0 ) app.page = 0;
            },
            figureEvent:function(){
                app.$figure.on("touchmove",function(e){
                    app.updateFigure();
                });

                app.$figure.on("touchend",function(e){
                    app.updateFigureNum = 0;
                });
            },
            /**
             * 判断浏览器是否支持某一个CSS3属性
             * @param {String} 属性名称
             * @return {Boolean} true/false
             */
            supportCss3:function (style) {
                var prefix = ['webkit', 'Moz', 'ms', 'o'],
                    i,
                    humpString = [],
                    htmlStyle = document.documentElement.style,
                    _toHumb = function (string) {
                        return string.replace(/-(\w)/g, function ($0, $1) {
                            return $1.toUpperCase();
                        });
                    };

                for (i in prefix)
                    humpString.push(_toHumb(prefix[i] + '-' + style));

                humpString.push(_toHumb(style));

                for (i in humpString)
                    if (humpString[i] in htmlStyle) return true;

                return false;
            },
            updateFigureNum:0,
            updateFigureMax:20,
            //更新人物形象
            updateFigure:function(el, url, callFun){
                app.updateFigureNum++;
                console.log(app.updateFigureNum)
                if(app.updateFigureNum > app.updateFigureMax){
                    app.updateFigureNum = 0;
                    console.log("变白");
                    el && el.attr("src", url);
                    callFun && callFun();
                }
            },
            //更新视图
            updatePage:function(_type){
                var _callPage = function(_type){
                        app.pageCall && app.pageCall(_type, app.page+1);
                        if(_type == "swipedown" && app.page == 0){
                            app.onePage();
                        }
                        setTimeout(function(){
                            app.isMoveTouch = false;
                        }, 500);
                    },
                    _no3D = function(_type){
                        app.$contentList.css({
                            "top":"-"+(app.page*100)+"%"
                        });
                        _callPage(_type);
                    },
                    _translate3d = function(_type){
                        app.$contentList.css({
                            " -webkit-transition": "all 0.5s ease-in",
                            " -moz-transition": "all 0.5s ease-in",
                            " -o-transition": "all 0.5s ease-in",
                            "transition":" all 0.5s ease-in",
                            "transform":"translate3d(0px,-"+(app.page*100)+"%,0px)",
                            "-moz-transform":"translate3d(0px,-"+(app.page*100)+"%,0px)",
                            "-o-transform":"translate3d(0px,-"+(app.page*100)+"%,0px)",
                            "-webkit-transform":"translate3d(0px,-"+(app.page*100)+"%,0px)"
                        });
                        _callPage(_type);
                    }
                if(!app.supportCss3('-webkit-transition')){
                    app.updatePage = _no3D;
                    _translate3d = null;
                }else{
                    app.updatePage = _translate3d;
                    _no3D = null;
                }
            },
            onePage:function(){

            },
            twoPage:function(){

            },
            banSliding:function(){
                app.isBanSliding = true;
            },
            delSliding:function(){
                app.isBanSliding = false;
            },
            /**
             * loadImg  图片预加载
             * @param   {Array}     预加载图片的对象数组
             * author   jianminlu
             * update   2014-06-20 9:35:13
             */
            loadImg : function(_pics, callback){
                var index = 0,
                    len = _pics.length,
                    img = new Image(),
                    flag = false,
                    progress = function(w){
                        $('.loading-progress').animate({width:w}, 100, 'linear', function(){
                            $(".loading-num b").html(w);
                            // 测试图片，不使用请注释
                        });
                    },
                    load = function(){
                        img.src = _pics[index];
                        img.onload = function() {
                            // 控制台显示加载图片信息
                            //console.log('第' + index + '个img被预加载', img.src);
                            //progress(Math.floor(((index + 1) / len) * 100) + "%");
                            index ++ ;
                            if (index < len) {
                                load();
                            }else{
                                callback && callback()
                            }
                        }
                        return img;
                    }
                if(len > 0){
                    load();
                }else{
                    progress("100%");
                }
                return {
                    pics: _pics,
                    load: load,
                    progress: progress
                };
            }
    }

    app.init(function(type, page){
        console.log(type+":"+page);
    });

    window.app = app;
});