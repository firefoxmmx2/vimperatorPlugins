// ehentai downloader.js
// 下载 ehentai 上面的漫画。

(function(){
    let self = liberator.plugins.ehentai = (function(){
        //注册命令 

        //返回操作对象
        var ehentaiManager = {
            //下载当前标签页的ehentai资源
            currTabDownload:function(){
                //当前tab的document 对象
                var doc = content.document.wrappedJSObject;
                var window = content.window.wrappedJSObject;
                var title;
                //默认间隔时间5秒
                var intervalTime = 1000;
                var lateTime = 500;
                var amplification = 200;
                //窗口的详情页面判断
                if(/^http:\/\/g\.e-hentai\.org\/g\/([\w-]+)\/([\w-]+)\/$/.exec(window.location.href)){
                    //如果有副标题使用副标题，作为保存文件夹
                    title = doc.querySelector('#gd2 h1:last-child').innerText;
                    
                    var downPicture = function(){
                        var as = doc.querySelectorAll('#gdt a');
                       
                        function goDetailPage(a) {
                            var xhr = new XMLHttpRequest();
                            xhr.open('GET', a.getAttribute('href'), true);
                            xhr.responseType = 'document';
                            xhr.onload = function(e){
                                if(this.status == 200){
                                    var img = this.response.body.querySelector('.sin > a > img');
                                    alert(img.getAttribute('src'));
                                    //timer.clearInterval();
                                }
                            };

                            xhr.send();

                        }

                        for(var i=0;i<as.length;i++){
                            var a = as[i];

                            setTimeout(function(){goDetailPage(a);},lateTime);
                            lateTime += amplification;

                        }

                    };

                    setTimeout(downPicture,lateTime);
                   /* var timer = setInterval(*/
                            //function(){
                                //setTimeout(downPicture,lateTime);
                            /*},intervalTime);*/
                }

            }

        };

        return ehentaiManager;
    })();
})()
