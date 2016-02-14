
// Module
module SilverScriptTools {
    
    //function Querystring(qs)
    //{ // optionally pass a querystring to parse
    //    this.params = {};

    //    if (qs == null) qs = location.search.substring(1, location.search.length);
    //    if (qs.length == 0) return;

    //    // Turn <plus> back to <space>
    //    // See: http://www.w3.org/TR/REC-html40/interact/forms.html#h-17.13.4.1
    //    qs = qs.replace(/\+/g, ' ');
    //    var args = qs.split('&'); // parse out name/value pairs separated via &

    //    // split out each name=value pair
    //    for (var i = 0; i < args.length; i++)
    //    {
    //        var pair = args[i].split('=');
    //        var name = decodeURIComponent(pair[0]);

    //        var value = (pair.length == 2)
    //			? decodeURIComponent(pair[1])
    //			: name;

    //        this.params[name] = value;
    //    }
    //}

    //Querystring.prototype.get = function (key, default_)
    //{
    //    var value = this.params[key];
    //    return (value != null) ? value : default_;
    //};

    //Querystring.prototype.contains = function (key)
    //{
    //    var value = this.params[key];
    //    return (value != null);
    //};

    

    //function setCookie(c_name, value, expiredays)
    //{
    //    var exdate = new Date();
    //    exdate.setDate(exdate.getDate() + expiredays);
    //    document.cookie = c_name + "=" + escape(value) +
    //((expiredays == null) ? "" : ";expires=" + exdate.toUTCString());
    //}

    //function getCookie(c_name)
    //{
    //    if (document.cookie.length > 0)
    //    {
    //        c_start = document.cookie.indexOf(c_name + "=");
    //        if (c_start != -1)
    //        {
    //            c_start = c_start + c_name.length + 1;
    //            c_end = document.cookie.indexOf(";", c_start);
    //            if (c_end == -1) c_end = document.cookie.length;
    //            return unescape(document.cookie.substring(c_start, c_end));
    //        }
    //    }
    //    return "";
    //}
}
