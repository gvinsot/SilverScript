///<reference path="StringTools.ts" />
///<reference path="libs/jquery.d.ts" />
///<reference path="EventHandler.ts" />
///<reference path="Interfaces.ts" />
///<reference path="FileTools.ts" />

module SS {

    export class Binding implements IDisposable {
        public Path: string;
        public Node: HTMLElement;
        private _bindedObject: any;

        GetBindedObject(): any {
            return this._bindedObject;
        }

        SetBindedObject(value: any) {
            this._bindedObject = value;

            if (value.PropertyChanged == undefined) {
                value.PropertyChanged = new EventHandler();
            }

            (<EventHandler>value.PropertyChanged).Attach(this.UpdateNodeOnContextChange, this);
        }

        UpdateNodeOnContextChange(context: Binding, args: any): void {
            var path = <string>args;
            if (context.Path.indexOf(path) >= 0) {
                var databinding = context.Node.attributes["data-binding"];
                if (databinding != undefined) {
                    SS.BindingTools.EvaluateBinding(databinding.value, context.Node, (a, b) => { });
                }
            }                
        }

        constructor(path: string, node: HTMLElement, bindedObject: any) {
            this.Path = path;
            this.Node = node;
            this.SetBindedObject(bindedObject);
        }

        public Dispose(): void {
            if (this._bindedObject.PropertyChanged != undefined) {
                (<EventHandler>this._bindedObject.PropertyChanged).Dettach(this.UpdateNodeOnContextChange);
            }
            this.Path = null;
            this.Node = null;
            this._bindedObject = null;
        }
    }
}