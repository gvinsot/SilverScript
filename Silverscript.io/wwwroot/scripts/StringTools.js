$.extend(String.prototype, {
    StartWith: function (stringToTest) {
        return SS.StringTools.StartWith(this, stringToTest);
    }
});
$.extend(String.prototype, {
    EndWith: function (stringToTest) {
        return SS.StringTools.EndWith(this, stringToTest);
    }
});
$.extend(String.prototype, {
    TrimStart: function (toTrim) {
        return SS.StringTools.TrimStart(this, toTrim);
    }
});
$.extend(String.prototype, {
    TrimEnd: function (toTrim) {
        return SS.StringTools.TrimEnd(this, toTrim);
    }
});
$.extend(String.prototype, {
    TrimEndOnce: function (toTrim) {
        return SS.StringTools.TrimEndOnce(this, toTrim);
    }
});
$.extend(String.prototype, {
    TrimStartOnce: function (toTrim) {
        return SS.StringTools.TrimStartOnce(this, toTrim);
    }
});
var SS;
(function (SS) {
    var StringTools = (function () {
        function StringTools() {
        }
        StringTools.StartWith = function (toTest, toSearch) {
            for (var i = 0; i < toSearch.length; i++) {
                if (toSearch.charAt(i) != toTest.charAt(i)) {
                    return false;
                }
            }
            return true;
        };
        StringTools.EndWith = function (toTest, toSearch) {
            var toTestIndex = toTest.length - 1;
            for (var i = toSearch.length - 1; i >= 0; i--) {
                if (toSearch.charAt(i) != toTest.charAt(toTestIndex)) {
                    return false;
                }
                toTestIndex--;
            }
            return true;
        };
        StringTools.TrimStart = function (original, toTrim) {
            var result = original;
            while (this.StartWith(result, toTrim)) {
                result = StringTools.TrimStartOnce(result, toTrim);
            }
            return result;
        };
        StringTools.TrimStartOnce = function (original, toTrim) {
            return original.substring(toTrim.length, original.length);
        };
        StringTools.TrimEnd = function (original, toTrim) {
            var result = original;
            while (this.EndWith(result, toTrim)) {
                result = StringTools.TrimEndOnce(result, toTrim);
            }
            return result;
        };
        StringTools.TrimEndOnce = function (original, toTrim) {
            return original.substring(0, original.length - toTrim.length);
        };
        StringTools.Json = function (json) {
            if (typeof json != 'string') {
                json = JSON.stringify(json, undefined, 2);
            }
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                var cls = 'number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key';
                    }
                    else {
                        cls = 'string';
                    }
                }
                else if (/true|false/.test(match)) {
                    cls = 'boolean';
                }
                else if (/null/.test(match)) {
                    cls = 'null';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            });
        };
        return StringTools;
    }());
    SS.StringTools = StringTools;
})(SS || (SS = {}));
//# sourceMappingURL=StringTools.js.map