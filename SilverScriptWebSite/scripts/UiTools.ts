
//define regxps

//var regexp_email = "[A-Za-z0-9_-]+(.[A-Za-z0-9_-])*@([A-Za-z0-9-]+\\.)+[A-Za-z]{2,5}$";
//var regexp_notempty = "^.+$";
//var regexp_titleformat = "^[^/\";\\[\\]{}()_#~µ*¤@<>^\\\\§]{4,}$";
//var regexp_pseudo = "^[^/\";\\[\\]{}()_#~µ*¤@<>^\\\\§]{2,}$";
//var regexp_password = "^[^/\";\\[\\]{}()_#~µ*¤@<>^\\\\§]{6,}$";
//var regexp_chaine = "^([/w]+)$";
//var regexp_number = "^[0-9]+$";
//var regexp_zipCode = "^[0-9]{4,}$";
//var regexp_creditcardNumber = "^[0-9]{16}$";
//var regexp_creditcardExpiration = "^[0-9]{2}/[0-9]{2}$";
//var regexp_creditcardSecurityCode = "^[0-9]{3,4}$";
//var regexp_uri = "^((http://|https://)(([A-Za-z0-9-]+\\.)+[A-Za-z]{2,6}|localhost)){0,1}/[^ ]*$";



//function SetInputValidation(inputId, regExpString, originalText)
//{
//    var input = $(inputId);
//    input.set('value', originalText);
//    input.setStyle('color', 'gray');
//    input.setStyle('font-style', 'italic');
//    input.addEvent('click', function ()
//    {
//        if (this.getStyle('color') == 'gray')
//        {
//            this.setStyle('color', 'black');
//            this.setStyle('font-style', 'normal');
//            this.set('value', '');
//        }
//    });
//    input.addEvent('keydown', function ()
//    {
//        if (this.getStyle('color') == 'gray')
//        {
//            this.setStyle('color', 'black');
//            this.setStyle('font-style', 'normal');
//            this.set('value', '');
//        }
//        window.setTimeout(function ()
//        {
//            if (!input.get('value').test(regExpString))
//                input.setStyle('background-color', '#FFDDDD');
//            else
//                input.setStyle('background-color', '#DDFFDD');
//        }, 1);
//    });
//}

//function ShowHide(NodeID)
//{
//    var node = $(NodeID);
//    var actualDisplay = node.getStyle("display");
//    if (actualDisplay == "none")
//        node.setStyle("display", "block");
//    else
//        node.setStyle("display", "none");
//}


