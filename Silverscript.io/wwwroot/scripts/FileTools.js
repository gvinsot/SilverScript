///<reference path="libs/jquery.d.ts"/>
// Module
var SS;
(function (SS) {
    //Class
    var FileTools = (function () {
        function FileTools() {
        }
        FileTools.FileExist = function (path) {
            var result = false;
            jQuery.ajax({
                type: "GET",
                beforeSend: function (request) {
                    request.setRequestHeader("Range", "bytes=0-16");
                },
                url: path,
                cache: false,
                async: false,
                success: function (value) {
                    result = true;
                },
                error: function (msg) {
                    result = false;
                }
            });
            return result;
        };
        FileTools.PathCombine = function (path1, path2) {
            return path1 + path2;
        };
        FileTools.UrlCombine = function (absolteUrl, relativeUrl) {
            return absolteUrl + relativeUrl;
        };
        FileTools.ReadJsonFile = function (path, callbackctxt, callback) {
            var queryResult = null;
            jQuery.ajax({
                type: "GET",
                url: path,
                cache: false,
                async: true,
                dataType: 'json',
                success: function (result) {
                    callback(callbackctxt, result);
                },
                error: function (msg) {
                    //queryResult = "ERROR : " + msg;
                    console.log("SS Exception on load " + path + "   MESSAGE : " + msg.statusText);
                    callback(callbackctxt, null);
                }
            });
        };
        FileTools.PostJsonFile = function (path, postdata, callbackctxt, callback, errorCallback) {
            if (errorCallback === void 0) { errorCallback = null; }
            var queryResult = null;
            jQuery.ajax({
                type: "POST",
                url: path,
                data: "=" + postdata,
                cache: false,
                async: true,
                dataType: 'json',
                success: function (result) {
                    callback(callbackctxt, result);
                },
                error: function (msg) {
                    //queryResult = "ERROR : " + msg;
                    console.log("SS Exception on load " + path + "   MESSAGE : " + msg.statusText);
                    callback(callbackctxt, null);
                }
            });
        };
        FileTools.ReadHtmlFile = function (path, delegate, delegateParameters) {
            if (delegate === void 0) { delegate = null; }
            if (delegateParameters === void 0) { delegateParameters = null; }
            var queryResult = null;
            jQuery.ajax({
                type: "GET",
                url: path,
                async: delegate != null,
                dataType: 'html',
                success: function (result) {
                    if (delegate != null) {
                        delegate(result, delegateParameters);
                    }
                    else {
                        queryResult = result;
                    }
                },
                error: function (msg) {
                    //queryResult = "ERROR : " + msg;
                    // throw new Error(msg.statusText);
                    console.log("SS Exception on load " + path + "   MESSAGE : " + msg.statusText);
                }
            });
            return queryResult;
        };
        return FileTools;
    }());
    SS.FileTools = FileTools;
})(SS || (SS = {}));
//# sourceMappingURL=FileTools.js.map