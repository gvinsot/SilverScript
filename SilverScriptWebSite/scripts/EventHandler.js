///
// Module
var SilverScriptTools;
(function (SilverScriptTools) {
    // Class
    var EventHandler = (function () {
        // Constructor
        function EventHandler() {
            this._invocationList = [];
        }
        EventHandler.prototype.Attach = function (delegateMethod) {
            this._invocationList[this._invocationList.length] = delegateMethod;
        };
        EventHandler.prototype.Dettach = function (delegateMethod) {
            for (var key in this._invocationList) {
                if (this._invocationList[key] == delegateMethod) {
                    this._invocationList[key] = null;
                }
            }
        };
        EventHandler.prototype.FireEvent = function () {
            for (var invocationKey in this._invocationList) {
                var invocation = this._invocationList[invocationKey];
                if (invocation != null) {
                    try {
                        invocation();
                    }
                    catch (ex) {
                        console.error(ex);
                    }
                }
                invocation = null;
            }
        };
        EventHandler.prototype.Dispose = function () {
            this._invocationList = null;
            this._invocationList = [];
        };
        return EventHandler;
    })();
    SilverScriptTools.EventHandler = EventHandler;
})(SilverScriptTools || (SilverScriptTools = {}));
//# sourceMappingURL=EventHandler.js.map