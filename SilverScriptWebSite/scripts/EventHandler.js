///
// Module
var SS;
(function (SS) {
    // Class
    var EventHandler = (function () {
        // Constructor
        function EventHandler() {
            this._invocationList = [];
            this._invocationContexts = [];
        }
        EventHandler.prototype.Attach = function (delegateMethod, context) {
            var key = this._invocationList.length;
            this._invocationList[key] = delegateMethod;
            this._invocationContexts[key] = context;
        };
        EventHandler.prototype.Dettach = function (delegateMethod) {
            for (var key in this._invocationList) {
                if (this._invocationList[key] == delegateMethod) {
                    this._invocationList[key] = null;
                }
            }
        };
        EventHandler.prototype.FireEvent = function (args) {
            for (var invocationKey in this._invocationList) {
                var invocation = this._invocationList[invocationKey];
                var context = this._invocationContexts[invocationKey];
                if (invocation != null) {
                    try {
                        invocation(context, args);
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
            this._invocationContexts = null;
            this._invocationList = [];
            this._invocationContexts = [];
        };
        return EventHandler;
    })();
    SS.EventHandler = EventHandler;
})(SS || (SS = {}));
//# sourceMappingURL=EventHandler.js.map