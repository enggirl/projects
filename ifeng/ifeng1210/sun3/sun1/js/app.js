/*
*
* */

Zepto(function($){
    var tmpEndY,tmpStartY,tmpEndX,tmpStartX
        mtime = {
        page:0,
        pageCall:null,
        init:function(callfun){
            if(callfun) this.pageCall = callfun;
            this.initAni();
            this.initEvent();
        },
        initAni:function(){

        },
        initEvent:function(){

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
                    mtime.updatePage(_type);
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
                endTouch(e);
            });

            $(".nextpic").on("touchend",function(e){
                mtime.addPage();
                mtime.updatePage("swipeup");
            });

        },
        addPage:function(){
            mtime.page++;
            if(mtime.page >= 6){
                mtime.page =6;
            }
        },
        subtractPage:function(){
            mtime.page--;
            if(mtime.page <= 0 ) mtime.page = 0;
        },
        //更新视图
        updatePage:function(_type){
            //$(".curr").css({"transform":"translate3d(0px,-"+(mtime.page*100)+"%,0px)","-webkit-transform":"translate3d(0px,-"+(mtime.page*100)+"%,0px)"})
            mtime.pageCall && mtime.pageCall(_type, mtime.page+1);
        },
        onePage:function(){

        },
        twoPage:function(){

        }


    }
    mtime.init(function(type, page){
        console.log(type+":"+page);
    });
});