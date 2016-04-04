///<reference path="libs/jquery.d.ts"/>
// Module
module SS {

    //Class
    export class FileTools {
        public static FileExist(path: string): boolean {
            var result: boolean = false;
            jQuery.ajax(
                {
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
        }

        public static PathCombine(path1: string, path2: string): string {
            return path1 + path2;
        }

        public static UrlCombine(absolteUrl: string, relativeUrl: string): string {
            return absolteUrl + relativeUrl;
        }

        public static ReadJsonFile(path: string, callbackctxt: any, callback: delegate): void {
            var queryResult: any;

            jQuery.ajax(
                {
                    type: "GET",
                    url: path,
                    cache: false,
                    async: true,                    
                    dataType: 'json',
                    success: function (result) {
                        callback(callbackctxt,result);
                    },
                    error: function (msg) {
                        //queryResult = "ERROR : " + msg;
                        console.log("SS Exception on load " + path + "   MESSAGE : " + msg.statusText);
                        callback(callbackctxt, null);
                    }
                    //complete:function(data,xhr)
                    //{
                    //}
                });
            
        }

        public static PostJsonFile(path: string, postdata: any, callbackctxt: any, callback: delegate, errorCallback: delegate = null): void {
            var queryResult: any;

            jQuery.ajax(
                {
                    type: "POST",
                    url: path,
                    data: "="+postdata,
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
        }

        public static ReadHtmlFile(path: string, delegate = null, delegateParameters: any[] =null): any {
            var queryResult: any;

            jQuery.ajax(
                {
                    type: "GET",
                    url: path,
                    async: delegate!=null,
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
        }


    }
}
