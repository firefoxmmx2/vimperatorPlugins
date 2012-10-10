// ehentai downloader.js
// 下载 ehentai 上面的漫画。
// 用户需要在配置文件中设置全局变量eh_save_path;和eh_page_interval_time和eh_img_download_interval_time
// @var eh_save_path 全局的下载保存地址;
// @var eh_page_interval_time 每页访问间隔时间 (单位毫秒);
// @var eh_img_download_interval_time 每个图片的下载间隔 (单位毫秒)
// 注意：这里没有使用代理或者动态网页代理，所以过快的访问可能会造成网站的IP屏蔽。
(function(){
    let self = liberator.plugins.ehentai = (function(){
        //注册命令 
        commands.addUserCommand(
            ['ehentai','eh'],
            'ehentai 漫画下载服务',
            function(arg){
                liberator.echoerr("错误,必须输入子命令!");
            },
            {
                options:[],
        subCommands:[
            new Command(
                ['downloadCurrentTab','dct'],
                '从当前页面下载',
                function(arg){
                    self.currTabDownload();
                })
        ],
        completer: function(context, args){

        }
            });
        var savePath = liberator.globalVariables.eh_save_path;
        if(!savePath){
            throw "请在.vimperatorrc设置全局保存地址eh_save_path";
            return;
        }
        //默认每页间隔时间30秒
        var intervalTime = liberator.globalVariables.eh_page_interval_time || 1500 * 20;
        //默认的每个图片访问下载间隔 1.5秒，如果过快访问会造成IP屏蔽
        var amplification = liberator.globalVariables.eh_img_download_interval_time || 1500;

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

                    //去掉分页信息
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

                        Array.prototype.forEach.call(as,function(a){
                            (function(auchor){ 
                                setTimeout(function(){
                                    goDetailPage(auchor); 
                                },lateTime);
                                lateTime += amplification;     
                            })(a);
                        });

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
