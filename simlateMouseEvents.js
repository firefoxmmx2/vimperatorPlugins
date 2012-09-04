//
// simulate mouse events
// 
//
(function(){
    let self=liberator.plugins.simulateMouseEvents=(function(){

        var fireMouseEvt=function(evtString){
            var doc=content.document.wrappedJSObject;

            if(doc.createEvent){
                var evt=doc.createEvent('MouseEvents');
                evt.initEvent(evtString,true,false);
                doc.activeElement.dispatchEvent(evt);
            }
            else if(doc.createEventObject){
                doc.activeElement.fireEvent('on'+evtString);
            }
        };

        var PUBLICS={
            mouseover:function(){
                fireMouseEvt('mouseover');
                var activeElement=content.document.wrappedJSObject.activeElement;
                activeElement.setAttribute('isMouseover',true);
                    
            },
            mouseout:function(){
                fireMouseEvt('mouseout');
                var activeElement=content.document.wrappedJSObject.activeElement;
                activeElement.setAttribute('isMouseover',false);
            }
        };

        //registe extend hint command like ;m
        
        return PUBLICS;
    })();
})();
