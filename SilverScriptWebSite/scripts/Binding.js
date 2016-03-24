///<reference path="StringTools.ts" />
///<reference path="libs/jquery.d.ts" />
///<reference path="EventHandler.ts" />
///<reference path="Interfaces.ts" />
///<reference path="FileTools.ts" />
var SS;
(function (SS) {
    var Binding = (function () {
        function Binding(path, node, bindedObject) {
            this.Path = path;
            this.Node = node;
            this.SetBindedObject(bindedObject);
        }
        Binding.prototype.GetBindedObject = function () {
            return this._bindedObject;
        };
        Binding.prototype.SetBindedObject = function (value) {
            this._bindedObject = value;
            if (value.PropertyChanged == undefined) {
                value.PropertyChanged = new SS.EventHandler();
            }
            value.PropertyChanged.Attach(this.UpdateNodeOnContextChange, this);
        };
        Binding.prototype.UpdateNodeOnContextChange = function (context, args) {
            var path = args;
            if (context.Path.indexOf(path) >= 0)
                SS.BindingTools.ApplyBinding(context.Node);
        };
        Binding.prototype.Dispose = function () {
            if (this._bindedObject.PropertyChanged != undefined) {
                this._bindedObject.PropertyChanged.Dettach(this.UpdateNodeOnContextChange);
            }
            this.Path = null;
            this.Node = null;
            this._bindedObject = null;
        };
        return Binding;
    })();
    SS.Binding = Binding;
})(SS || (SS = {}));
//# sourceMappingURL=Binding.js.map