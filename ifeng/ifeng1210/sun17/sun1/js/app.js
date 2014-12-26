/*
* 作者：席新亮
* 微博：http://weibo.com/xixinliang/
* 微信：xi19871102
* qq群：315238234、366069968
* */

Zepto(function($){
    var tmpEndY,tmpStartY,tmpEndX,tmpStartX,
        baseImgUrl = "images/",
        pics = [//预加载图片列表
            baseImgUrl + "loading.png",
            baseImgUrl + "gonext.png",
            baseImgUrl + "page_smallx.png",
            baseImgUrl + "page0_bg.jpg",
            baseImgUrl + "page0_circlebg.png",
            baseImgUrl + "page0_wd.png",
            baseImgUrl + "page1_bg.jpg",
            baseImgUrl + "page1_layer.png",
            baseImgUrl + "page1_pdt0.png",
            baseImgUrl + "page1_pdt2.png",
            baseImgUrl + "page1_pdt3.png",
            baseImgUrl + "page1_pdt4.png",
            baseImgUrl + "page1_pdt5.png",
            baseImgUrl + "page1_pdt6.png",
            baseImgUrl + "page1_pdt7.png",
            baseImgUrl + "page1_pdt8.png",
            baseImgUrl + "page1_pdt9.png",
            baseImgUrl + "page1_pdt10.png",
            baseImgUrl + "page1_pdt11.png",
            baseImgUrl + "page1_pdt12.png",
            baseImgUrl + "page1_pdt13.png",
            baseImgUrl + "page1_wd.png",
            baseImgUrl + "page1_wt.png",
            baseImgUrl + "page1_X.png",
            baseImgUrl + "page2_answerbg.png",
            baseImgUrl + "page2_arrow.png",
            baseImgUrl + "page2_aswopts.png",
            baseImgUrl + "page2_aswpts.png",
            baseImgUrl + "page2_bg.jpg",
            baseImgUrl + "page2_question.png",
            baseImgUrl + "page2_wrong.png",
            baseImgUrl + "page2_yes.png",
            baseImgUrl + "page3_answerbg.png",
            baseImgUrl + "page3_aswopts.png",
            baseImgUrl + "page3_aswpts.png",
            baseImgUrl + "page3_bg.jpg",
            baseImgUrl + "page3_question.png",
        ],
        app = {
            page:0,
            currPage:-1,
            pageCall:null,
            isMoveTouch:false,
            isBanSliding:true,
            isSwipeRight:false,
            isNextTopic:false,
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
                        this.initEvent();
                        this.onePage();
                        setTimeout($.proxy(function(){
							this.initAni();
                            this.$contentList.show();
                            $("#audio")[0].play();
                        }, this), 1000);
                }, this));


            },
            initAni:function(){//动画
                
                app.updateSize();
                setTimeout(function(){
                    $(".loading-wrap").hide();
                },1000)
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
                        app.movedrag({left:tmpEndX,top:tmpEndY});
                    },

                    // 触摸结束时判断执行上翻或者下翻
                    endTouch = function () {
                        if(app.isNextTopic){
                            app.isNextTopic = false;
                            app.addPage();
                            app.updatePage("swipeleft");
                            return;
                        }
                        var endY = tmpEndY,
                            endX = tmpEndX,
                            startY = tmpStartY,
                            startX = tmpStartX,
                            _type = "swipeup";
                        /*if (endY && endY !== startY && endY-startY<=-25) {
                            //向上
                        }else if(endY && endY !== startY && endY-startY>=25){
                           //向下
                           _type = "swipedown";
                        }else */if(endX && endX !== startX && endX-startX<=-25){
                            if(app.isMoveTouch || app.isBanSliding) return;
                            //向左
                            _type = "swipeleft";
                            app.addPage();
                            if(app.page == 1 && !app.isSwipeRight){
                                app.twoPage();
                            }
                            if(app.page == 2 && !app.isSwipeRight){
                                app.threePage();
                            }
                            app.updatePage("swipeleft");


                        }else if(endX && endX !== startX && endX-startX>=25){
                            if(app.isMoveTouch || app.isBanSliding) return;
                            app.subtractPage();
                            //向右
                            _type = "swiperight";
                            app.isSwipeRight = true;
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
                    if(app.page-2 >= 0){
                        var xb = $(".xbefore").eq(app.page-2);
                        if(app.pointCheck(e,xb)){
                            app.updateFigure(xb, function(){
                                //可以进行下一题
                                setTimeout(function(){
                                    app.isNextTopic = true;
                                    /*app.addPage();
                                    app.updatePage("swipeleft");*/
                                }, 500)

                                //app.isBanSliding = false;//允许拖动
                                //$(".swipeMove").css("opacity", 1);

                            });
                        }else{
                            app.updateFigureNum = 0;
                        }
                    }

                });
                contentList.on("touchend",function(e){
                    $("#audio")[0].play();
                    if(app.isShareBtn) app.closeisShareBtn();
                    app.closedrag();
                    endTouch(e);
                });

                //人物形象事件
                //app.figureEvent();
                //选择题
                $(".aswopt1,.aswopt2,.aswopt3").bind("touchend", function(){
                    var istrue = $(this).attr("data-true"),
                        tips = app.$contentListLi.eq(app.page).find(".tips");
                    if(!istrue){//错误
                        tips.show().children(".wrong").show();
                        setTimeout(function(){
                            tips.hide(500).children(".wrong").hide();
                            tips = null;
                        }, 1500);
                    }else{
                        tips.show().children(".yes").show();
                        setTimeout(function(){
                            tips.hide(500).children(".yes").hide();
                            tips = null;
                            app.isOvertitle = true;
                        }, 1500);
                    }

                });
                
                app.isOvertitle = false;
                $(".dragging").bind("touchstart", function(event){//开启拖动
                    var touch = event.touches[0];
                    tmpEndY = touch.pageY-31.5;
                    tmpEndX = touch.pageX-31.5;
                    if(app.isOvertitle){
                        var pos = $(this).css("position");
                        if(pos != "absolute"){
                            $(this).css({
                                "position":"absolute",
                                "width":"63px",
                                "height":"63px"
                            });
                            app.$contentListLi.eq(app.page).append("<div class='dragings' id='dragings"+app.page+"' style='z-index: 10;left:"+tmpEndX+"px;top:"+tmpEndY+"px'></div>");
                            app.dragEl = $("#dragings"+app.page);
                            $(this).after('<div class="fakeAswpct"></div>');
                            app.dragEl.addClass('page' + app.page)
                            app.dragEl.append($(this));
                        }
                        app.opendrag();
                    }

                });

                //搽粉
           /*     $(".xbefore").on("touchmove",function(e){
                    app.updateFigure($(this));
                });

                $(".xbefore").on("touchend",function(e){
                    app.updateFigureNum = 0;
                });*/

                window.onorientationchange = window.onresize= app.updateSize;
            },
            pointCheck : function(_event,_e, options){//碰撞检测
                var touch = _event.touches[0],
                    _pos = {
                        left:touch.pageX,
                        top:touch.pageY
                    },
                    _w = options && options.width || _e.width(),//获取元素的宽度
                    _h = options && options.height || _e.height(),//获取元素的高度
                    _left = _e.offset().left,
                    _top = _e.offset().top;
                _pos.left += options && options.left || 0;
                //计算鼠标的top与left值，是否落入元素的left与top内即可
                if(_pos.left < (_left+_w) && _left < _pos.left && _pos.top > _top && _pos.top < (_top+_h)){
                    return true;
                }
                return false;
            },
            dragging:false,//是否允许拖动
            dragEl:null,//拖动的对象
            opendrag:function(){//开启
                app.dragging = true;
            },

            closedrag:function(){//关闭
                app.dragging = false;
            },

            movedrag:function(pos){
                if(!app.dragging) return;
                var top = pos.top - 31.5,
                    left = pos.left - 31.5;
                if((left+31.5) > app.$windowWidth){
                    left = app.$windowWidth-63;
                }
                if((top+31.5) > app.$windowHeight){
                    top = app.$windowHeight-63;
                }
                if(left <= 0){
                    left = 0;
                }
                if(top <= 0){
                    top = 0;
                }
                app.dragEl.css({
                    "top":top + "px",
                    "left":left + "px"
                });
            },

            updateSize:function(){
                // 每一页高度自适应
                setTimeout(function(){
                    app.$windowWidth = $(window).width();
                    app.$windowHeight = $(window).height();
                    app.$contentListLi.each(function () {
                        $(this).css({"height": app.$windowHeight, "width": app.$windowWidth});
                    });
                    $(".container").css({"height": app.$windowHeight, "width": app.$windowWidth});
                    app.$contentList.css({"height": app.$windowHeight, "width": (app.$windowWidth*app.maxlength+1)+3000});
                    app.updatePage("onorientationchange");
                },500)
            },
            addPage:function(){
                $(".swipeMove").css("opacity", 0);
                app.lastPage();

                app.page++;
                if(!app.isSwipeRight && (app.page > app.currPage)){//如果没有向右记录向左当前页
                    app.currPage = app.page;
                }

                if(app.currPage >= app.page && app.isSwipeRight){
                    app.isBanSliding = false;//允许拖动
                    app.isOvertitle = true;
                    $(".swipeMove").css("opacity", 1);
                }else{
                    $(".swipeMove").css("opacity", 0);
                    app.isBanSliding = true;//不允许拖动
                    app.isOvertitle = false;
                }
                if(app.currPage == app.page){
                    app.isSwipeRight = false;
                }
                if(app.page >= app.maxlength){
                    app.page = app.maxlength;
                }
            },
            subtractPage:function(){
                $(".swipeMove").css("opacity", 1);
                app.page--;
                if(app.page <= 0 ) app.page = 0;
            },
            updateFigureNum:0,
            updateFigureMax:20,
            //更新人物形象
            updateFigure:function(el, callFun){
                app.updateFigureNum++;
                if(app.updateFigureNum > app.updateFigureMax){
                    app.updateFigureNum = 0;
                    el.next(".xafter").show();
                    el.hide();
                    callFun && callFun();
                }
            },
            //android终端或uc浏览器
            isAndroid:function(){
                var u = navigator.userAgent, app = navigator.appVersion;
                if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1){
                    return true;
                }
                return false;
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
                        var _w = app.$windowWidth * app.page;
                        app.$contentList.css({
                            "left":"-"+_w+"px",
                            "transition": "left 0.5s",
                            "-moz-transition": "left 0.5s", /* Firefox 4 */
                            "-webkit-transition": "left 0.5s", /* Safari 和 Chrome */
                            "-o-transition": "left 0.5s" /* Opera */
                        });
                        _callPage(_type);
                    },
                    _translate3d = function(_type){
                        var _w = app.$windowWidth * app.page;
                        app.$contentList.css({
                            " -webkit-transition": "all 0.5s ease-in",
                            " -moz-transition": "all 0.5s ease-in",
                            " -o-transition": "all 0.5s ease-in",
                            "transition":" all 0.5s ease-in",
                            "transform":"translate3d(-"+_w+"px,0px,0px)",
                            "-moz-transform":"translate3d(-"+_w+"px,0px,0px)",
                            "-o-transform":"translate3d(-"+_w+"px,0px,0px)",
                            "-webkit-transform":"translate3d(-"+_w+"px,0px,0px)"
                        });
                        _callPage(_type);
                    }
                if(app.isAndroid()){
                    app.updatePage = _no3D;
                    _translate3d = null;
                }else{
                    app.updatePage = _translate3d;
                    _no3D = null;
                }
            },
            actAni:function(anis ){
                var
                    l = anis.length,
                    i = 0,
                    timeAct = function(_aniL){
                        setTimeout(function(){
                            $("."+_aniL.name).addClass(_aniL.actClass).css(_aniL.css);
                            _aniL.callback && _aniL.callback();
                            //清除引用
                            _aniL.callback = null;
                            _aniL = null;
                        }, _aniL.time);
                    };
                for(;i<l;i++){
                    timeAct(anis[i]);
                }
            },
            onePage:function(){//第一页
                var anis = [//动画队列
                    {
                        "name":"pageOne_ani_1",
                        "time":1000,
                        "actClass":"graduallyRevealed",
                        "css":{"opacity":1}
                    },
                    {
                        "name":"pageOne_ani_1",
                        "time":3000,
                        "actClass":"aniCenterflyRightUp",
                        "css":{"top": "5%","right": "3%"},
                        "callback":function(){
                            setTimeout(function(){
                                $(".pageOne_ani_1").css("marginRight", "0px");
                            },2000)
                        }
                    },
                    {
                        "name":"pageOne_ani_2",
                        "time":5100,
                        "actClass":"graduallyRevealed1",
                        "css":{"opacity":1}
                    },
                    {
                        "name":"pageOne_ani_3",
                        "time":7000,
                        "actClass":"opacityShow",
                        "css":{"opacity":1}
                    },
                    {
                        "name":"pageOne_ani_4",
                        "time":7200,
                        "actClass":"blinks",
                        "callback":function(){
                            $(".swipeMove").css("opacity", 1);
                            app.isBanSliding = false;
                        }
                    }
                ];
                //下一页
                $(".swipeMove").on("touchend",function(e){
                    app.addPage();
                    if(app.page == 1){
                        app.twoPage();
                    }
                    if(app.page == 2){
                        app.threePage();
                    }
                    app.updatePage("swipeup");
                });
                this.actAni(anis);

            },
            twoPage:function(){
                var anis = [//动画队列
                    {
                        "name":"grayg0",
                        "time":500,
                        "actClass":"accordingSlowly",
                        "css":{"opacity":1}
                    },
                    {
                        "name":"grayg1",
                        "time":1500,
                        "actClass":"accordingSlowly",
                        "css":{"opacity":1}
                    },
                    {
                        "name":"grayg2",
                        "time":2500,
                        "actClass":"accordingSlowly",
                        "css":{"opacity":1}
                    },
                    {
                        "name":"grayg3",
                        "time":3500,
                        "actClass":"accordingSlowly",
                        "css":{"opacity":1}
                    },
                    {
                        "name":"grayg4",
                        "time":4500,
                        "actClass":"accordingSlowly",
                        "css":{"opacity":1}
                    },
                    {
                        "name":"grayg5",
                        "time":5500,
                        "actClass":"accordingSlowly",
                        "css":{"opacity":1},
                        "callback":function(){
                            //$(".swipeMove").css("opacity", 1);
                            app.isBanSliding = false;
                        }
                    }
                ];
                this.actAni(anis);
                $(".swipeMove").css("opacity", 0);
                //开始答题
                $(".startGame").bind("click touchend", function(){
                    if(app.isMoveTouch || app.isBanSliding) return;
                    app.isMoveTouch = true;
                    //跳至第三页
                    app.addPage();
                    app.threePage();
                    app.updatePage("swipeup");
                });
            },
            //第3页
            threePage:function(){
                $(".swipeMove").css("opacity", 0);
            },
            banSliding:function(){
                app.isBanSliding = true;
            },
            delSliding:function(){
                app.isBanSliding = false;
            },
            lastPage:function(){//最后1页
                if(app.page == app.maxlength-1){
                    var anis = [//动画队列
                        {//先出现  出字和下面独家策划那个
                            "name":"lastPage1",
                            "time":500,
                            "actClass":"accordingSlowly",
                            "css":{"opacity":1,"display":"block"}
                        },
                        {//先出现  出字和下面独家策划那个
                            "name":"lastPage2",
                            "time":1500,
                            "actClass":"accordingSlowly",
                            "css":{"opacity":1,"display":"block"}
                        },
                        {//先出现  出字和下面独家策划那个
                            "name":"lastPage3",
                            "time":2500,
                            "actClass":"accordingSlowly",
                            "css":{"opacity":1,"display":"block"},
                            "callback":function(){
                                app.isBanSliding = false;
                            }
                        },
                        {//先出现  出字和下面独家策划那个
                            "name":"lastPage4",
                            "time":3500,
                            "actClass":"accordingSlowly",
                            "css":{"opacity":1,"display":"block"}
                        },
                        {//先出现  出字和下面独家策划那个
                            "name":"lastPage3",
                            "time":5500,
                            "actClass":"bounceimportant",
                            "css":{"opacity":1,"display":"block"}
                        },
                        {//先出现  出字和下面独家策划那个
                            "name":"lastPage4",
                            "time":5500,
                            "actClass":"bounceimportant",
                            "css":{"opacity":1,"display":"block"}
                        },
                        {//先出现  出字和下面独家策划那个
                            "name":"lastPage5",
                            "time":4500,
                            "actClass":"accordingSlowly",
                            "css":{"opacity":1,"display":"block"}
                        },
                        {//先出现  出字和下面独家策划那个
                            "name":"lastPage5",
                            "time":5500,
                            "actClass":"circulationScaleimportant",
                            "css":{"opacity":1,"display":"block"}
                        }
                    ];
                    app.isBanSliding = false;
                    this.actAni(anis);
                    $(".swipeMove").hide();
                    $(".shareBtn").on("touchend",function(e){
                        app.showisShareBtn();
                        e.stopPropagation();
                    });
                }
            },
            closeisShareBtn:function(){
                $(".shareBg").hide();
                app.isShareBtn = false;
            },
            showisShareBtn:function(){
                $(".shareBg").show();
                app.isShareBtn = true;
            },
            isShareBtn:false,
            /**
             * loadImg  图片预加载
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