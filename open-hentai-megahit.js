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

        //return one
        var PUBLICS={
            open:function(arg){
                if(jQuery.core('table b:contains("成年コミック　発売予定表")',content.document.body).length){
                    var searchpage="http://sukebei.nyaa.eu/?page=torrents&page=search&cats=0_0&filter=0&term={keyword}";
                    var $container=jQuery.core('table',content.document.body).eq(1);
                    var maxTdNum=$container.find('tr:first td').length;
                    $container.find('tr')
                        .each(function(idx){
                            var $tr = jQuery.core(this);
                            var text;
                            if($tr.find('td').length<maxTdNum)
                                text=$tr.find('td:nth(1)').text().replace('　',' ');
                            else
                                text=$tr.find('td:nth(2)').text().replace('　',' ');
                            var url=searchpage.replace('\{keyword\}',text);
                            window.openNewTabWith(url);
                        });
                }

            }
        };

        return PUBLICS;
    })();
})();
