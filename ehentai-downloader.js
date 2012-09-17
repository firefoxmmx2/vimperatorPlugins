// ehentai downloader.js
// 下载 ehentai 上面的漫画。此插件依赖于JQUERY 和 jquery-loader.js插件

(function(){
    //简化函数
    var $ = jQuery.core;
    let self = liberator.plugins.ehentai = (function(){
        //注册命令 
        commands.addUserCommand(
            ['ehmanager','ehm'],
            'ehentai漫画下载宏命令',
            function(arg){ //该命令应该支持子命令。目前还未实现。
                self.currTabDownload();
            },
            null,
            true
            );


        //返回操作对象
        var ehentaiManager = {
            //下载当前标签页的ehentai资源
            currTabDownload:function(){
                //当前tab的document 对象
                var doc = content.document.wrappedJSObject;
                var window = content.window.wrappedJSObject;
                var title;
                //默认间隔时间5秒
                var intervalTime = 4000;

                //窗口的详情页面判断
                if(/^http:\/\/g\.e-hentai.org\/g\/([\w-]+)/([\w-]+)\/$/.exec(window.location.href)){
                    //如果有副标题使用副标题，作为保存文件夹
                    title = $('#gd2 h1:last',doc).text();

                    var downPicture = function(){
                        $('#gdt a').each(function(idx){
                            var a = $(this);
                            $('<div></div>').attr('name',a.attr('href'))
                                .appendTo(doc).hide()
                                .load(a.attr('href'),null,function(data){
                                       console.log($('.sin>a>img').attr('src'));
                                }
                                );
                        });
                    };
                    var timer = setInterval(downPicture,intervalTime);
                }
                
            }
        };

        return ehentaiManager;
    })();
})()
