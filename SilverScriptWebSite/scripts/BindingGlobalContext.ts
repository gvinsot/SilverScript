///<reference path="StringTools.ts" />
///<reference path="libs/jquery.d.ts" />
///<reference path="EventHandler.ts" />
///<reference path="Interfaces.ts" />
///<reference path="FileTools.ts" />

module SS {
    export class BindingGlobalContext {
        BindingDictionary: any = new Object();

        CurrentBindingId: number = 0;

        CreateBinding(bindedObject: any, path: string, node: HTMLElement): Binding {
            if (node["data-binding-ids"] == undefined) {
                node["data-binding-ids"] = [];
            }
            this.CurrentBindingId++;
            var bindingsIds = node["data-binding-ids"];
            var length = bindingsIds.length;
            var bindingId = this.CurrentBindingId;
            bindingsIds[length] = bindingId;

            var binding = new Binding(path, node, bindedObject);

            this.BindingDictionary[bindingId] = binding;
            return binding;
        }

        DisposeNode(node) {
            if (node.attributes != undefined && node.attributes != null) {
                if (node.attributes["data-binding-value"] != undefined) {
                    node.attributes["data-binding-value"] = null;
                }
                if (node.attributes["data-context-value"] != undefined) {
                    node.attributes["data-context-value"] = null;
                }
                if (node.attributes["data-template-value"] != undefined) {
                    node.attributes["data-template-value"] = null;
                }
                if (node.attributes["data-source-value"] != undefined) {
                    node.attributes["data-source-value"] = null;
                }
                if (node.attributes["data-binding-ids"] != undefined) {
                    var bindingsIds = null;
                }
                for (var key in this.BindingDictionary) {
                    // skip loop if the property is from prototype
                    if (!this.BindingDictionary.hasOwnProperty(key)) continue;

                    var binding = <Binding>this.BindingDictionary[key];
                    if (binding.Node != null && !this.IsAttachedToDOM(binding.Node)) {
                        binding.Dispose();
                        delete this.BindingDictionary[key];
                    }
                    binding = null;
                }
            }
        }

        IsAttachedToDOM(ref: HTMLElement): boolean {
            return ref.parentElement == undefined;
        }
    }
}