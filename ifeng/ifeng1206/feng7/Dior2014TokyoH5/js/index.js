
//document.domain="";
/**
 * loadImg  图片预加载
 * @param   {Array}     预加载图片的对象数组
 * author   jianminlu
 * update   2014-06-20 9:35:13
 */
var loadImg = function(pics, callback){
    var index = 0;
    var len = pics.length;
    var img = new Image();
    var flag = false;
    var progress = function(w){
        $('.loading-progress').animate({width:w}, 100, 'linear', function(){
            $(".loading-num b").html(w);
            // 测试图片，不使用请注释
        });
    }
    var load = function(){
        img.src = pics[index];
        img.onload = function() {
            // 控制台显示加载图片信息
            //console.log('第' + index + '个img被预加载', img.src);
            progress(Math.floor(((index + 1) / len) * 100) + "%");
            index ++ ;
            if (index < len) {
                load();
            }else{
                callback()
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
        pics: pics,
        load: load,
        progress: progress
    };
}
var isbigPicshowslide = false,
    pics = [
        "images/indexBg.jpg",
        "images/titp.jpg",
        "images/page2.jpg",
        "images/page2Tips.png",
        "images/titp2.jpg",
        "images/titp3.jpg",
        "images/wenda3.jpg",
        "images/titp4.jpg",
        "images/xiao_c1.jpg",
        "images/xiao_c2.jpg",
        "images/xiao_c3.jpg",
        "images/xiao_b1.jpg",
        "images/xiao_b2.jpg",
        "images/xiao_b3.jpg",
        "images/xiao_f1.jpg",
        "images/xiao_f2.jpg",
        "images/xiao_f3.jpg",
        "images/titp5.jpg",
        "images/video_bg.jpg",
        "images/dpt1.jpg",
        "images/dpt2.jpg",
        "images/dpt3.jpg",
        "images/sharepic1.jpg"
    ];
// 调用
loadImg(pics, function(){
    setTimeout(function(){
        $(".loadPage").hide();
        //Layout.page(0, $(window).height());
    }, 500);
});


/**
 * author: jasonshan && jianminlu
 * update: 2014-05-26 22:03
 * version: v2.0
 */
/* ua */
var UA = function(){
    var userAgent = navigator.userAgent.toLowerCase();
    return {
        ipad: /ipad/.test(userAgent),
        iphone: /iphone/.test(userAgent),
        android: /android/.test(userAgent),
        qqnews: /qqnews/.test(userAgent),
        weixin: /micromessenger/.test(userAgent)
    };
}
//层叠动画
var pageAni = function(){
    setTimeout(function(){
        $("#pageain").removeClass("z-viewArea").addClass("z-viewArea");
        setTimeout(function(){
            //$("#pageain").children("li").eq(0).addClass("z-current");
        },5000)
    },0);

}
var isPop = false;
/* page */
var Layout = {
    page: function (i, _h, call){
        $(".bigPicshow").hide();
        $(".global").css({ "-webkit-transform": "translate3d(0px, -" + _h * i +"px, 0px)" });
        $(".layout .inner").removeClass("animate");
        $(".layout").eq(i).find(".inner").addClass("animate");
        call && call();
    },
    swipe: function(_h, _len){
        var _this = this;
        $("#sjswdtBd").on("swipeUp",function(){
            $(this).attr("isclick", "1");
        });
        $("#sjswdtBd").on("swipeDown",function(){
            $(this).attr("isclick", "1");
        });
        $(".layout").each(function(index, obj){

            //console.log(index)
            $(obj).on("swipeUp", function(event){
                var isclick = $("#sjswdtBd").attr("isclick");
                if(isclick == "1"){
                    setTimeout(function(){
                        $("#sjswdtBd").attr("isclick", "0");
                    });
                    return;
                }
                if(index == 4){
                    $(".leftSelecter").addClass("leftFly");
                    $(".rightSelecter").addClass("rightFly");
                }else{
                    $(".rightSelecter").removeClass("rightFly");
                    $(".leftSelecter").removeClass("leftFly")
                }
                if (index == 0) {
                    if ($(obj).hasClass("onscrll")) {
                        index = index < (_len - 1) ? index : -1;
                        _this.page(index + 1, _h , pageAni);
                        setTimeout(function(){$("#sjswdtips").animate({"top":"180px"})},1000);
                    }
                }else{
                    index = index < (_len - 1) ? index : -1;
                    _this.page(index + 1, _h);
                    setTimeout(function(){$("#sjswdtips").animate({"top":"-880px"})},350);
                }
            }).on("swipeDown", function(){
                    var isclick = $("#sjswdtBd").attr("isclick");
                    if(isclick == "1"){
                        setTimeout(function(){
                            $("#sjswdtBd").attr("isclick", "0");
                        });
                        return;
                    }
                    if(index == 6){
                        $(".leftSelecter").addClass("leftFly");
                        $(".rightSelecter").addClass("rightFly");
                    }else{
                        $(".rightSelecter").removeClass("rightFly");
                        $(".leftSelecter").removeClass("leftFly")
                    }
                    if (index == 2) {
                        index = index == -1 ? _len - 1 : index;
                        _this.page(index - 1, _h, pageAni);
                        setTimeout(function(){$("#sjswdtips").animate({"top":"180px"})},1000);
                    }else{
                        index = index == -1 ? _len - 1 : index;
                        _this.page(index - 1, _h);
                        setTimeout(function(){$("#sjswdtips").animate({"top":"-880px"})},350);
                    }
                });

        });
    },
    init: function(){
        var _this = this,
            _w = $(window).width(),
            _h = $(window).height(),
            _len = $(".layout").length;
        var ua = UA();
        //console.log(ua);
        if(_h > $(document).height()){
            _h = $(document).height();
        }
        if(ua.iphone && ua.qqnews){
            _h = _h - 44;
        }

        if(_w > $(document).width()){
            _w = $(document).width();
        }

        $(".swipe_tip").addClass("fadeOutUp");
        $(".global").width( _w ).height( _h * _len ).addClass("ease");
        console.log("demo")
        $(".screen").width( _w ).height( _h * _len );
        $(".layout").width( _w ).height( _h );
        $(".sjswdtBd").height( _h - 230 );
        $(".dptips").height( _h - 100 );
        $(".dptips .dptipsBd").height( _h - 140 );
        if (_h < 375) {
            $("body").addClass("smcren");
        }
//$(".sjswdtips").css({"top":});
        _this.swipe(_h, _len);
    }
}
Layout.init();

function reScroll(){
    //var myScroll;
    function loaded() {
        myScroll4 = new iScroll('sjswdtBd');
    }
    document.getElementById('sjswdtBd').addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);
}
reScroll();


$(".closep2").bind("click touchend",function(){
    $(".p2tips").hide();
})
$("#letterBntMail").bind("click touchend",function(){

    $(".clickend").removeClass("clickect").addClass("pages");
    $(".layout_1").addClass("onscrll");
    setTimeout(function(){
        slider && slider.goToSlide(1);
        setTimeout(function(){
            slider && slider.goToSlide(0);
            var pos = $("#nextTwo").offset(),
                _pos = $("#prevTwo").offset();
        },1000)

    },500);

})


$(".xcjsList li").bind("click",function(){
    $(".bigPicshow").show().html('<img src="'+$(this).find('img').attr('data-bigImg')+'">');
})
$(".bigPicshow").bind("click",function(){
    $(".bigPicshow").hide();
})
$(".dptipscls,.bdbg").bind("click",function(){
    $(".bdbg").hide();
    $(".dptips").animate({"top":"-1250px"});
})

$(".dptList li").bind("click",function(){
    $(".bdbg").show();
    switch ($(this).index()){
        case 0:
            $("#intr0").animate({"top":"50px"});
            break;
        case 1:
            $("#intr1").animate({"top":"50px"});
            break;
        case 2:
            $("#intr2").animate({"top":"50px"});
            break;
        default:
            break;
    }
})


var page = 0,
    lis = $("#pageain").children("li"),
    imgs = [],
    max = lis.length-1,
    slider;
lis.each(function(){
    imgs.push($(this).children("img").eq(0).attr("src"));
});
$(document).ready(function(){
    slider = $('.bxslider').bxSlider({
        autoStart:false,
        onSlideAfter:function(el,oldIndex,newIndex){ 
          $(".p2tips").find("img").hide().eq(newIndex).show();
        }
    });



    $("#leftMove").bind("click touchend",function(){
        page--;
        if(page < 0){
            page = max;
        }
        $("#firstMoveImg").addClass("z-hideToLeft");
        setTimeout(function(){
            $("#firstMoveImg").removeClass("z-hideToLeft").children("img").eq(0).attr("src",imgs[page]);
        },300)
    });

    $("#rightMove").bind("click touchend",function(){
        page++;
        if(page > max){
            page = 0;
        }
        $("#firstMoveImg").addClass("z-hideToRight");
        setTimeout(function(){
            $("#firstMoveImg").removeClass("z-hideToRight").children("img").eq(0).attr("src",imgs[page]);
        },300)
    })
});

