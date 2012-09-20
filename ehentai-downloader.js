// ehentai downloader.js
// 下载 ehentai 上面的漫画。
// 用户需要在配置文件中设置全局变量ehentai_save_path;
(function(){
    let self = liberator.plugins.ehentai = (function(){
        //注册命令 
        
        var savePath = liberator.globalVariables.ehentai_save_path;
        var dirPath;
        var fileName;
        //返回操作对象
        var ehentaiManager = {
            //下载当前标签页的ehentai资源
            currTabDownload:function(){
                //当前tab的document 对象
                var doc = content.document.wrappedJSObject;
                var window = content.window.wrappedJSObject;
                var title;
                //默认间隔时间5秒
                var intervalTime = 1500 * 20;
                
                var amplification = 1500;

                var baseURL = window.location.href;

                //窗口的详情页面判断
                if(/^http:\/\/g\.e-hentai\.org\/g\/([\w-]+)\/([\w-]+)\/.*$/.exec(baseURL)){
                    //如果有副标题使用副标题，作为保存文件夹
                    title = doc.querySelector('#gd2 h1:last-child').textContent;
                    if(!title)
                        title = doc.querySelector('#gd2 h1:first-child').textContent;
                    dirPath = savePath+ '/' +"'"+title+"'";
                    var saveDir = new File(dirPath);
                    if(!saveDir.exists()){
                        io.system("mkdir "+dirPath);
                    }
                   
                    //分页信息
                    //
                    var pageinfo = doc.querySelector('p.ip').textContent;
                    //page info matcher
                    pageinfo = /^Showing (\d+) - (\d+) of (\d+) images$/.exec(pageinfo);
                    var pagesize = 20; //default 20;
                    var totalpage = 1; // default 1;
                    var pagenow = 1;
                    if(pageinfo){
                        totalpage = (pageinfo[3] % pagesize) ? (parseInt(pageinfo[3] / pagesize) + 1) : parseInt(pageinfo[3] / pagesize);
                    }

                    baseURL = baseURL.substring(0,baseURL.lastIndexOf("/")+1);
                    var downPicture = function(doc){
                        var lateTime = 500;
                        var as = doc.querySelectorAll('#gdt a');
                       
                        function goDetailPage(auchor) {
                            var xhr = new XMLHttpRequest();
                            xhr.open('GET', auchor.getAttribute('href'), true);
                            xhr.responseType = 'document';
                            xhr.onload = function(e){
                                if(this.status == 200){
                                    var img = this.response.body.querySelector('.sni > a > img');
                                    var ext = '.jpg';
                                    var tempext = img.getAttribute("src").split(".");
                                    if(tempext.length)
                                        ext = '.'+tempext[tempext.length-1];
                                    
                                    fileName = auchor.textContent+ext;
                                    io.system('wget "'+img.getAttribute('src')+'" -O '+dirPath+"/"+fileName+' &');
                                }
                            };

                            xhr.send();

                        }

                        for(var i=0;i<as.length;i++){
                            const a = as[i];
                            (function(auchor){ 
                                setTimeout(function(){
                                    goDetailPage(auchor); 
                                },lateTime);
                                lateTime += amplification;     
                            })(a);
                        }

                    };
                   if(pagenow<totalpage){
                       var xhr = new XMLHttpRequest();
                       xhr.open('GET',baseURL+'?p='+(pagenow-1),true);
                       xhr.responseType = 'document';
                       xhr.onload = function(){
                           downPicture(this.response);
                           pagenow += 1;

                           var timer = setInterval(
                                   function(){
                                       if(pagenow<=totalpage){
                                           var xhrx = new XMLHttpRequest();
                                           xhrx.open('GET',baseURL+'?p='+(pagenow-1),true);
                                           xhrx.responseType = 'document';
                                           xhrx.onload = function(){
                                               downPicture(this.response);
                                               pagenow += 1;
                                           };

                                           xhrx.send();
                                       }
                                       else{
                                           clearInterval(timer);
                                       }

                                   },intervalTime);
                       };
                       xhr.send();
                   }


                }

            }

        };

        return ehentaiManager;
    })();
})()
