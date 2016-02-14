///<reference path="FileTools.ts"/>
// Module
var SilverScriptTools;
(function (SilverScriptTools) {
    //Class
    var ObjectTools = (function () {
        function ObjectTools() {
        }
        ObjectTools.CheckFileAPI = function () {
            // Check for the various File API support.
            if (window["File"] && window["FileReader"] && window["FileList"] && window["Blob"]
                && ObjectTools.supportsH264Video()) {
                // Great success! All the File APIs are supported.
                return true;
            }
            else {
                alert('The File APIs are not fully supported in this browser.');
                return false;
            }
        };
        ObjectTools.supportsH264Video = function () {
            var v = document.createElement("video");
            var result = v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
            return result.length != 0;
        };
        ObjectTools.ConvertJsonToDate = function (sourceString) {
            var trimed = SilverScriptTools.StringTools.TrimStart(sourceString, "/Date(");
            trimed = SilverScriptTools.StringTools.TrimEnd(trimed, ")/");
            trimed = SilverScriptTools.StringTools.TrimEnd(trimed, "+0000");
            return new Date(parseInt(trimed));
        };
        ObjectTools.ConvertJsonTimeSpanToDate = function (sourceString) {
            var trimed = SilverScriptTools.StringTools.TrimStart(sourceString, "PT");
            var hours = 0;
            var minutes = 0;
            var seconds = 0;
            var splitted = trimed.split("H");
            if (splitted.length > 1) {
                hours = parseInt(splitted[0]);
                trimed = splitted[1];
            }
            splitted = trimed.split("M");
            if (splitted.length > 1) {
                minutes = parseInt(splitted[0]);
                trimed = splitted[1];
            }
            trimed = SilverScriptTools.StringTools.TrimEnd(trimed, "S");
            seconds = parseInt(trimed);
            return new Date(hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000);
        };
        ObjectTools.Any = function (list, condition) {
            var currentIndex = 0;
            var currentItem;
            do {
                currentItem = list[currentIndex];
                if (condition(currentItem) == true) {
                    return true;
                }
                currentIndex++;
            } while (currentItem != null);
            return false;
        };
        ObjectTools.Count = function (list, condition) {
            var currentIndex = 0;
            var result = 0;
            var currentItem;
            do {
                currentItem = list[currentIndex];
                if (condition(currentItem) == true) {
                    result++;
                }
                currentIndex++;
            } while (currentItem != null);
            return result;
        };
        ObjectTools.DeleteNode = function (node) {
            if (node) {
                ObjectTools.DeleteChildren(node); //delete node's children
                if (node.parentNode) {
                    node.parentNode.removeChild(node); //remove the node from the DOM tree
                }
            }
        };
        ObjectTools.DeleteChildren = function (node) {
            if (node) {
                for (var x = node.childNodes.length - 1; x >= 0; x--) {
                    var childNode = node.childNodes[x];
                    if (childNode.hasChildNodes()) {
                        ObjectTools.DeleteChildren(childNode);
                    }
                    node.removeChild(childNode); //remove the child from the DOM tree
                }
            }
        };
        return ObjectTools;
    })();
    SilverScriptTools.ObjectTools = ObjectTools;
})(SilverScriptTools || (SilverScriptTools = {}));
//# sourceMappingURL=ObjectTools.js.map