(function() {
    //open-heitai-megahit
    let self = liberator.plugins.openHentaiMegahit = (function(){

        //register command {{{
        commands.addUserCommand(
            ['megahit','mh'],
            'Open Megahit comic by year-month on Nyaa Torrent',
            function(arg){
                self.open(arg);   
            },
            null,
            true
            );
        //}}}

        // private 
        // megahit month page template 
        // para {date} is target date, format as yyMM
        var megahitMonthPageTemplate = "http://www.megahit.co.jp/comic/comiclist{date}.htm";
        //a format date function
        var formatDate = function(needFormatDate){
            var formatedDate;

            return formatedDate;
        }
        //return one
        var PUBLICS={
            open:function(arg){
                var megahitPage = megahitMonthPageTemplate.replace('\{date\}',arg,'g');
                var xhr = new XMLHttpRequest();
                xhr.open('GET',megahitPage,true);
                xhr.responseType = 'document';
                xhr.onload = function(e){
                    if(this.status == 200){
                        var doc = this.response.body;
                        var result = false;
                        Array.prototype.forEach.call(doc.querySelectorAll('table b'),function(b){
                            if(b.textContent == "成年コミック　発売予定表"){
                                result = true;
                            }
                        });

                        if(result){
                            var searchpage="http://sukebei.nyaa.eu/?page=torrents&page=search&cats=0_0&filter=0&term={keyword}";
                            var $container=doc.querySelectorAll('table')[1];
                            var maxTdNum=$container.querySelectorAll('tr:first-child td').length;

                            Array.prototype.forEach.call($container.querySelectorAll('tr'),function(tr){
                                var text;

                                if(tr.querySelectorAll('td').length < maxTdNum)
                                    text=tr.querySelector('td:nth-child(2)').textContent.replace('　|・',' ');
                                else
                                    text=tr.querySelector('td:nth-child(3)').textContent.replace('　|・',' ');
                                var url=searchpage.replace('\{keyword\}',text);
                                window.openNewTabWith(url);
                            });
                        }


                    }
                };
                xhr.send();
            }
        };

        return PUBLICS;
    })();
})();
