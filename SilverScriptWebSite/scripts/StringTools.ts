

interface String {
    StartWith: (stringToTest: string) => boolean;
    EndWith: (stringToTest: string) => boolean;
    TrimStart: (toTrim: string) => string;
    TrimEnd: (toTrim: string) => string;
    TrimStartOnce: (toTrim: string) => string;
    TrimEndOnce: (toTrim: string) => string;
}

$.extend(String.prototype, {
    StartWith: function (stringToTest: string): boolean {
        return SS.StringTools.StartWith(this, stringToTest);
    }
});

$.extend(String.prototype, {
    EndWith: function (stringToTest: string): boolean {
        return SS.StringTools.EndWith(this, stringToTest);
    }
});

$.extend(String.prototype, {
    TrimStart: function (toTrim: string): string {
        return SS.StringTools.TrimStart(this, toTrim);
    }
});

$.extend(String.prototype, {
    TrimEnd: function (toTrim: string): string {
        return SS.StringTools.TrimEnd(this, toTrim);
    }
});

$.extend(String.prototype, {
    TrimEndOnce: function (toTrim: string): string {
        return SS.StringTools.TrimEndOnce(this, toTrim);
    }
});

$.extend(String.prototype, {
    TrimStartOnce: function (toTrim: string): string {
        return SS.StringTools.TrimStartOnce(this, toTrim);
    }
});


module SS {
    export class StringTools {


        public static StartWith(toTest: string, toSearch: string): boolean {
            for (var i = 0; i < toSearch.length; i++) {
                if (toSearch.charAt(i) != toTest.charAt(i)) {
                    return false;
                }
            }
            return true;
        }

        public static EndWith(toTest: string, toSearch: string): boolean {
            var toTestIndex = toTest.length - 1;
            for (var i = toSearch.length - 1; i >= 0; i--) {
                if (toSearch.charAt(i) != toTest.charAt(toTestIndex)) {
                    return false;
                }
                toTestIndex--;
            }
            return true;
        }

        public static TrimStart(original: string, toTrim: string): string {
            var result = original;
            while (this.StartWith(result, toTrim)) {
                result = StringTools.TrimStartOnce(result, toTrim);
            }
            return result;
        }

        public static TrimStartOnce(original: string, toTrim: string): string {
            return original.substring(toTrim.length, original.length);
        }

        public static TrimEnd(original: string, toTrim: string): string {
            var result = original;
            while (this.EndWith(result, toTrim)) {
                result = StringTools.TrimEndOnce(result, toTrim);
            }
            return result;
        }

        public static TrimEndOnce(original: string, toTrim: string): string {
            return original.substring(0, original.length - toTrim.length);
        }


        public static Json(json: any):string {

            if (typeof json != 'string') {
                json = JSON.stringify(json, undefined, 2);
            }
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                var cls = 'number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key';
                    } else {
                        cls = 'string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'boolean';
                } else if (/null/.test(match)) {
                    cls = 'null';
                }
                return '<span class="' + cls + '">' + match + '</span><br/>';
            });
        }
    }
}