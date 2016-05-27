///<reference path="StringTools.ts" />
///<reference path="libs/jquery.d.ts" />
///<reference path="EventHandler.ts" />
///<reference path="Interfaces.ts" />
///<reference path="FileTools.ts" />

module SS {

    export function SetTemplate(targetNode: any, uri: string, datacontextvalue:any=null) {
        SS.BindingTools.SetTemplate(targetNode, uri, datacontextvalue);
    }

    export function Navigate(contextNode: any, uriExpression: string) {
        BindingTools.Navigate(contextNode, uriExpression);
    }

    export function GetDataContext(contextNode: any): any {
        var parentNode = SS.BindingTools.GetParentContext(contextNode);
        return parentNode["data-context-value"];
    }


    export function GetSourceParent(childNode: HTMLElement): Node {
        return SS.BindingTools.GetItemsSourceContext(childNode);
    }

    export function PushDataContext(contextNode: any, uriExpression: string, context: any, callback: delegate) {
        var datacontext = GetDataContext(contextNode);
        FileTools.PostJsonFile(uriExpression, datacontext, context, callback);
    }

    export function ApplyBindings(nodeContext: any) {
        var node: HTMLElement;
        node = (typeof nodeContext) == "string" ? document.getElementById(nodeContext) : nodeContext;

        SS.BindingTools.SetBindingsRecursively(node);
    }

    //static var PropagationId = 0;

    export function PropagateDataContext(sourceNode: HTMLElement, destinationNodeId: string) {
        BindingTools.EvaluateDataContext(sourceNode, (ctxt, dataContextObject) => {
            var destinationNode = document.getElementById(destinationNodeId);
            SS.BindingTools.SetDataContext(destinationNode, dataContextObject);

            var context = SS.BindingTools.GetParentContext(SS.BindingTools.GetItemsSourceContext(sourceNode));
            var onDataContextChanged = <EventHandler>context["DataContextChanged"];
            if (onDataContextChanged == undefined) {
                onDataContextChanged = new EventHandler();
                context["DataContextChanged"] = onDataContextChanged;
            }
            if (sourceNode["IsPropagationAttached"] == undefined) {
                onDataContextChanged.Attach((ctx, args) => {
                    SS.BindingTools.SetDataContext(ctx, "{x:Null}");
                }, destinationNode);
                sourceNode["IsPropagationAttached"] = true;
            }
        });
    }

    export function SetDataContext(element: any, value: any) {
        SS.BindingTools.SetDataContext(element, value);
    }

    export function SetDataContextProperty(element: any, path: string, value:any) {
        BindingTools.EvaluateDataContext(element, (ctxt, dataContextObject) => {
            eval('dataContextObject' + path + '= value;');

            BindingTools.FireDataContextChanged(dataContextObject, path);
            BindingTools.SetBindingsRecursively(ctxt);
        });
    }

    export function RaiseDataContextChanged(element: HTMLElement, propertyName:string) {
        BindingTools.EvaluateDataContext(element, (ctxt, dataContextObject) => {
            BindingTools.FireDataContextChanged(dataContextObject, propertyName);
            BindingTools.SetBindingsRecursively(ctxt);
        });
    }

    export class BindingTools {
        public static Bindings: BindingGlobalContext = new BindingGlobalContext();

        public static ResetDataContextObject(targetNode: any): void {
            var node: HTMLElement;
            node = (typeof targetNode) == "string" ? document.getElementById(targetNode) : targetNode;

            if (node["data-template-value"] == undefined) {
                node["data-template-value"] = new Object();
            }
        }

        public static SetTemplate(targetNode: any, uri: string, datacontextvalue: any = null): void {
            var node: HTMLElement;
            node = (typeof targetNode) == "string" ? document.getElementById(targetNode) : targetNode;

            // BindingTools.DisposeBindings(node, true);
            BindingTools.Bindings.GarbageCollectBindings();
            if (datacontextvalue != null) {
                node["data-template-value"] = datacontextvalue;
            }
            $(node).attr("data-template", uri);
            SS.BindingTools.EvaluateTemplate(uri, node);
        }

        public static FireDataContextChanged(context: any, args: any) {
            var eventHandler = <EventHandler>context["DataContextChanged"];
            
            if (eventHandler != undefined) {
                eventHandler.FireEvent(args);
            }
            else {
                context["DataContextChanged"] = new EventHandler();
            }
        }

        public static Navigate(contextNode: any, uriExpression: string) {
            var node: HTMLElement;
            node = (typeof contextNode) == "string" ? document.getElementById(contextNode) : contextNode;

            // BindingTools.DisposeBindings(node, true);
            BindingTools.Bindings.GarbageCollectBindings();

            BindingTools.EvaluateDataContext(node, (ctxt, dataContextObject) => {
                BindingTools.EvaluateExpression(uriExpression, dataContextObject, node, (ctxt2, result) => {
                    window.location.href = result;
                }, false);
            });
        }


        public static DisposeBindings(rootNode: any, skiprootNode: boolean = false): void {
            var node: HTMLElement;
            node = (typeof rootNode) == "string" ? document.getElementById(rootNode) : rootNode;

            BindingTools.DisposeBindingsRecursively(node, skiprootNode);
            BindingTools.Bindings.GarbageCollectBindings();
        }

        public static DisposeBindingsRecursively(rootNode: HTMLElement, skiprootNode: boolean = false): void {
            if (rootNode == null)
                return;
            if (!skiprootNode)
                BindingTools.Bindings.DisposeNodeBindings(rootNode);
            else {
                var rootNodeChildren = rootNode.children;
                for (var key in rootNodeChildren) {
                    if (!rootNodeChildren.hasOwnProperty(key)) continue;

                    BindingTools.DisposeBindingsRecursively(<HTMLElement>rootNodeChildren[key]);
                }
            }
        }

        public static SetDataContext(nodeForContext: any, value: any) {
            var node: HTMLElement;
            node = (typeof nodeForContext) == "string" ? document.getElementById(nodeForContext) : nodeForContext;

            node["data-context-value"] = value;

            BindingTools.SetBindingsRecursively(node);

            var eventHandler = <EventHandler>node["DataContextChanged"];
            if (eventHandler != undefined) {
                eventHandler.FireEvent(value);
            }
            else {
                node["DataContextChanged"] = new EventHandler();
            }
        }

        public static SetBindingsRecursively(rootNode: HTMLElement, skipCurrentNode: boolean = false): void {
            if (rootNode == null)
                return;

            if (!skipCurrentNode && rootNode.attributes != undefined) {
                var databinding = rootNode.attributes["data-binding"];
                if (databinding != undefined) {
                    SS.BindingTools.EvaluateBinding(databinding.value, rootNode,
                        (ctxt, args) => {
                            BindingTools.SetBindingsOnChildrenNodes(ctxt);
                        });
                    return;
                } else if (rootNode.attributes["data-template"] != undefined) {
                    //special case when there is only a template to apply                     
                    SS.BindingTools.EvaluateTemplate(rootNode.attributes["data-template"].value, rootNode);
                    return;
                }
            }
            BindingTools.SetBindingsOnChildrenNodes(rootNode);
        }

        private static SetBindingsOnChildrenNodes(rootNode: HTMLElement) {
            var rootNodeChildren = rootNode.children;
            for (var key in rootNodeChildren) {
                if (!rootNodeChildren.hasOwnProperty(key)) continue;

                BindingTools.SetBindingsRecursively(<HTMLElement>rootNodeChildren[key]);
            }
        }

        public static GetParentContext(node: any): Node {
            var parentNode: Node;
            parentNode = (typeof node) == "string" ? document.getElementById(node) : node;

            while (parentNode!=null && parentNode.attributes != null && parentNode.attributes["data-context"] == undefined && parentNode["data-context-value"] == undefined) {
                parentNode = parentNode.parentNode;
            }
            if (parentNode==null || parentNode.attributes == null)
                return null;

            return parentNode;
        }

        public static GetItemsSourceContext(node: Node): Node {
            var parentNode = node;
            while (parentNode != null && parentNode.attributes != null && parentNode.attributes["data-source"] == undefined && parentNode["data-source-value"] == undefined) {
                parentNode = parentNode.parentNode;
            }
            if (parentNode == null || parentNode.attributes == null)
                return null;

            return parentNode;
        }

        // private static knownTemplates = new Array();

        private static EvaluateTemplate(bindingExpression: string, node: Node): void {

            var dataTemplateAttribute = node.attributes["data-template"];
            if (dataTemplateAttribute == undefined)
                return;
            var dataTemplateAttributreValue = dataTemplateAttribute.value == undefined ? dataTemplateAttribute : dataTemplateAttribute.value;
            BindingTools.EvaluateDataContext(node, (ctxt, dataContextObject) => {
                BindingTools.EvaluateExpression(dataTemplateAttributreValue, dataContextObject, node, (ctxt2, templateExpression) => {
                    FileTools.ReadHtmlFile(templateExpression, BindingTools.EvaluateTemplatePart2, [node, dataContextObject]);
                }, false);
            });
        }

        private static EvaluateTemplatePart2(templateString: string, args: any[]): void {
            var node: Node = args[0];
            templateString = templateString.TrimStart("\r\n");
            templateString = templateString.TrimStart(" ");
            templateString = templateString.TrimEnd(" ");
            templateString = templateString.TrimEnd("\r\n");
            node["data-template-value"] = templateString;
            var dataSourceAttribute = node.attributes["data-source"];
            var htmlnode = <HTMLElement>node;

            if (dataSourceAttribute != undefined) {

                var dataContextObject: Object = args[1];
                var startTime = (new Date()).getTime();
                BindingTools.EvaluateExpression(dataSourceAttribute.value, dataContextObject, node, (ctxt, items) => {
                    node["data-source-value"] = items;
                    if (items == null || items.length == undefined) {
                        var jhtmlnode = $(htmlnode);
                        jhtmlnode.empty();
                        console.log("Bad data-source type:" + items);
                        return;
                    }
                    var itemsLength = items.length;
                    var resultString = "";
                
                    //lets loop through context items
                    for (var i = 0; i < itemsLength; i++) {
                        resultString = resultString.concat(templateString);
                    }

                    var result = $(resultString);

                    for (var i = 0; i < itemsLength; i++) {
                        var subnode = result[i];
                        var datacontext = items[i];
                        datacontext["TemplateBindingIndex"] = i;
                        BindingTools.SetDataContext(subnode, items[i]);
                    }

                    for (var i = 0; i < htmlnode.children.length; i++) {
                        var subhnode = htmlnode.children[i];
                        subhnode["data-context-value"] = null;
                        var dataContextChangedEvent = <EventHandler>subhnode["DataContextChanged"];
                        if (dataContextChangedEvent != undefined)
                            dataContextChangedEvent.FireEvent(null);
                    }

                    var jhtmlnode = $(htmlnode);

                    jhtmlnode.empty();
                    
                    jhtmlnode.append(result);

                    var nbMilliseconds = (new Date()).getTime() - startTime;
                    console.log("Apply templates: " + nbMilliseconds + "ms");
                });
            }
            else {
                htmlnode.innerHTML = templateString;
                // $(htmlnode).html(templateString);
                BindingTools.SetBindingsRecursively(htmlnode, true);
            }

        }

        public static EvaluateDataContext(node :any, callback: delegate): void {
            var contextNode = BindingTools.GetParentContext(node);

            if (contextNode == undefined) {
                callback(node, null);
                return;
            }

            var datacontextvalue = contextNode["data-context-value"];
            if (datacontextvalue != undefined && datacontextvalue != null) {
                if (datacontextvalue == "{x:Null}")
                    datacontextvalue = null;
                callback(node, datacontextvalue);
                return;
            }

            var datacontextloading = contextNode["data-context-value-loading"] as EventHandler;
            if (datacontextloading != null) {
                datacontextloading.Attach(callback, node);
                return;
            }

            contextNode["data-context-value-loading"] = new EventHandler();

            var contextExpression = contextNode.attributes["data-context"].value;
            BindingTools.EvaluateDataContext(contextNode.parentNode, (ctxt, datacontext) => {

                BindingTools.EvaluateExpression(contextExpression, datacontext, contextNode, (ctxt, datacontextvalue) => {

                    BindingTools.SetDataContext(ctxt, datacontextvalue);

                    var contextloading = <EventHandler>ctxt["data-context-value-loading"];
                    contextloading.FireEvent(datacontextvalue);
                    contextloading.Dispose();
                    delete ctxt["data-context-value-loading"];


                    callback(node, datacontextvalue);                    
                });

            });

        }



        public static EvaluateBinding(bindingExpression: string, node: Node, callback: delegate): void {
            BindingTools.EvaluateDataContext(node, (ctxt, datacontext) => {
                BindingTools.EvaluateExpression(bindingExpression, datacontext, ctxt, callback)
            });
        }

        private static EvaluateExpression(expression: string, datacontext: any, contextNode: Node, callback: delegate, expectObjectResult: boolean = true): void {

            if (expression == null || expression == "{x:Null}") {
                callback(contextNode, null);
                return;
            }
            var isHttpLink = !expression.StartWith("{") && (expression.indexOf("/")>0);
            var elements = [];
            var matches;
            var regex = /({[^}]*})/g;
            var i = 0;

            while ((matches = regex.exec(expression)) != null) {
                elements[i] = matches[1];
                i++;
            }
            var parent = contextNode.parentNode;
            var nbElements = elements.length;

            if (isHttpLink == true) {
                var transformed: any;
                for (var elementKey in elements) {
                    var element = elements[elementKey];
                    transformed = BindingTools.EvaluateBindingExpression(element, datacontext, parent);
                    expression = expression.replace(element, transformed);
                }

                if (!expectObjectResult) {
                    callback(contextNode, expression);
                    return;
                }
                else {
                    var datacontextPost = contextNode.attributes["data-context-post"];
                    if (datacontextPost != undefined) {
                        var postExpression = datacontextPost.value;
                        BindingTools.EvaluateExpression(postExpression, datacontext, parent, (ctxt, postData) => {
                            FileTools.PostJsonFile(expression, postData, ctxt, callback);
                        }, false);
                        return;
                    }
                    else {
                        FileTools.ReadJsonFile(expression, contextNode, callback);
                        return;
                    }
                }
            }
            else if (nbElements > 0) {
                let result = [];
                for (var i = 0; i < nbElements; i++) {
                    result[i] = BindingTools.EvaluateBindingExpression(elements[i], datacontext, contextNode);
                }
                callback(contextNode, result.length == 1 ? result[0] : result);
                return;
            }
            else {
                callback(contextNode, eval(expression));
                return;
            }
        }


        private static EvaluateBindingExpression(bindingExpression: string, dataContextObject: any, node: Node, allowSideEffects: boolean = true): any {

            var parametersString = bindingExpression.TrimStartOnce("{");
            parametersString = parametersString.TrimEndOnce("}");

            var pathOnly = parametersString.indexOf("=") < 0;
            var parameters = parametersString.split(",");
            var elementName = null;
            var htmlElement = node as HTMLElement;
            var path = undefined;
            var source = dataContextObject;
            var converter = undefined;
            var converterParameter = undefined;
            var stringFormat = undefined;
            var mode = "OneTime";
            var destination = "Content";
            var hasSideEffects = false;
            var pathDefined = false;
            var param = [];
            var value=null;

            if (pathOnly) {
                path = parametersString;
                pathDefined = true;
            }
            else {

                for (var i = 0; i < parameters.length; i++) {
                    param = parameters[i].split('=');

                    if (param.length == 1) {
                        path = param[0];
                    }
                    else {
                        switch (param[0]) {
                            case "Path":
                                path = param[1];
                                pathDefined = true;
                                break;
                            //case "ElementName":
                            //    source = document.getElementsByName(param[1]);
                            //    break;
                            case "ElementId":
                                source = document.getElementById(param[1]);
                                break;
                            case "Source":
                                source = eval(param[1]);
                                break;
                            case "Destination":
                                destination = param[1];
                                hasSideEffects = true;
                                break;
                            case "Converter":
                                converter = param[1];
                                break;
                            case "ConverterParameter":
                                converterParameter = param[1];
                                break;
                            case "StringFormat":
                                stringFormat = param[1];
                                break;
                            //case "RelativeSource":
                            //    break;
                            //case "FallbackValue":
                            //    break;
                            case "Mode":
                                mode = param[1];
                                break;
                            case "Value":
                                value = param[1];
                                break;

                            //case "TargetNullValue":
                            //    break;
                            default:
                                break;
                        }
                    }
                }
            }
            var sourceIsArray = Object.prototype.toString.call(source) === '[object Array]';
            if (source != undefined && pathDefined) {
                try {
                    value = eval((sourceIsArray ? 'source' : 'source.') + path);
                }
                catch (ex) {
                    console.log("Binding Error on expression : " + path + " on data context " + dataContextObject);
                    return null;
                }
            }
            else if(value==null) {
                value = source;
            }
            //apply converter and stringformat
            if (converter != undefined) {
                try {
                    if (converterParameter != undefined)
                        value = eval(converter + "(value,converterParameter)");
                    else
                        value = eval(converter + "(value)");
                }
                catch (ex) {
                    console.log("Error on converter " + converter);                    
                }
            }

            if (mode == "OneWay" && dataContextObject!=null) {
                BindingTools.Bindings.CreateBinding(dataContextObject, path, htmlElement);
            } else if (mode == "TwoWay" && dataContextObject != null) {
                var binding = BindingTools.Bindings.CreateBinding(dataContextObject, path, htmlElement);
                htmlElement.onchange = () => {
                    if (!sourceIsArray) {
                        var evalString = "dataContextObject." + path + "=htmlElement.value; if (dataContextObject.PropertyChanged != undefined) dataContextObject.PropertyChanged.FireEvent(path);";
                        try {
                            eval(evalString);
                        }
                        catch (ex)
                        {
                            console.log("Exception applying binding : " + evalString);
                        }
                    }
                };
            }
            else if (mode == "Eval") {
                try {
                    value = eval(value);
                }
                catch (ex) {
                    console.log("Could not evaluate " + value);
                    value = null;
                }
            }

            if (hasSideEffects && allowSideEffects) {

                if (destination == "Content") {
                    //$(htmlElement).html(value);
                    htmlElement.innerHTML = value == null ? "" : value;
                }
                else {
                    $(htmlElement).attr(destination, value);
                }
            }

            return value;
        }
    }
}

$(() => {
    SS.BindingTools.SetBindingsRecursively(document.body);
});

