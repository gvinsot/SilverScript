///<reference path="StringTools.ts" />
///<reference path="libs/jquery.d.ts" />
///<reference path="EventHandler.ts" />
///<reference path="Interfaces.ts" />
///<reference path="FileTools.ts" />

module SS {
    export function SetTemplate(targetNode: string, uri: string) {
        SS.BindingTools.SetTemplate(targetNode,uri);
    }

    export class BindingTools {
        public static Bindings: BindingGlobalContext = new BindingGlobalContext();

        public static NewDataContextObject(rootNode: Node): void {
            if (rootNode["data-template-value"] == undefined) {
                rootNode["data-template-value"] = new Object();
            }
        }

        public static SetTemplate(targetNode: string, uri: string):void {
            var node = document.getElementById(targetNode);

           // BindingTools.DisposeBindings(node, true);
            BindingTools.Bindings.GarbageCollectBindings();
            node.attributes["data-template"] = uri;
            SS.BindingTools.EvaluateTemplate(uri, node);
        }

        public static DisposeBindings(rootNode: HTMLElement, skiprootNode: boolean = false): void {
            BindingTools.DisposeBindingsRecursively(rootNode, skiprootNode);
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

                    BindingTools.DisposeBindingsRecursively(<HTMLElement> rootNodeChildren[key]);
                }
            }
        }
        

        public static SetBindingsRecursively(rootNode: HTMLElement, skipCurrentNode:boolean =false): void {
            if (rootNode == null)
                return;

            if (!skipCurrentNode) {
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

        private static SetBindingsOnChildrenNodes(rootNode: HTMLElement)
        {
            var rootNodeChildren = rootNode.children;
            for (var key in rootNodeChildren) {
                if (!rootNodeChildren.hasOwnProperty(key)) continue;

                BindingTools.SetBindingsRecursively(<HTMLElement>rootNodeChildren[key]);
            }
        }

        private static GetParentContext(node: Node): Node {
            var parentNode = node;
            while (parentNode.attributes != null && parentNode.attributes["data-context"] == undefined && parentNode["data-context-value"] == undefined) {
                parentNode = parentNode.parentNode;
            }
            if (parentNode.attributes == null)
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

        private static EvaluateTemplatePart2(templateString: string, args: any[]):void {
            var node: Node = args[0];
            node["data-template-value"] = templateString;
            var dataSourceAttribute = node.attributes["data-source"];
            var htmlnode = <HTMLElement>node;
                
            if (dataSourceAttribute != undefined) {

                var dataContextObject: Object = args[1];
                var startTime = (new Date()).getTime();            
                BindingTools.EvaluateExpression(dataSourceAttribute.value, dataContextObject, node, (ctxt, items) => {
                    node["data-source-value"] = items;
                    var itemsLength = items.length;
                    var resultString = "";
                
                    //lets loop through context items
                    for (var i = 0; i < itemsLength; i++) {
                        resultString = resultString.concat(templateString);
                    }

                    var result = $(resultString);

                    for (var i = 0; i < itemsLength; i++) {
                        var subnode = result[i];
                        subnode["data-context-value"] = items[i];
                        BindingTools.SetBindingsRecursively(subnode);
                    }

                    $(htmlnode).append(result);

                    var nbMilliseconds = (new Date()).getTime() - startTime;
                    console.log("Apply templates: " + nbMilliseconds + "ms");
                });
            }
            else {
                htmlnode.innerHTML = templateString;
                BindingTools.SetBindingsRecursively(htmlnode, true);
            }
            
        }
        
        private static EvaluateDataContext(node, callback:delegate): void {
            var contextNode = BindingTools.GetParentContext(node);

            if (contextNode == undefined) {
                callback(node, null);
                return;
            }

            var datacontextvalue = contextNode["data-context-value"];
            if (datacontextvalue != undefined) {
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

                    ctxt["data-context-value"] = datacontextvalue;

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
       
        private static EvaluateExpression(expression: string, datacontext: any, contextNode: Node, callback:delegate, expectObjectResult: boolean = true): void {

            var isHttpLink = expression.StartWith("/") || expression.StartWith("http://") || expression.StartWith("https://");
            var elements = [];
            var matches;
            var regex = /({Binding[^}]*})/g;
            var i = 0;
           
            while ((matches = regex.exec(expression)) != null) {
                elements[i] = matches[1];
                i++;
            }
            var parent = contextNode.parentNode;
            var nbElements = elements.length;

            if (isHttpLink == true) {
                var transformed: any;
                for (var bindingString in elements)
                {
                    transformed = BindingTools.EvaluateBindingExpression(bindingString,datacontext, parent);
                    expression = expression.replace(bindingString, transformed);
                }
                
                if (!expectObjectResult)
                {
                    callback(contextNode, expression);
                    return;
                }
                else {
                    var datacontextPost = contextNode.attributes["data-context-post"];
                    if (datacontextPost!= undefined) {
                        var postExpression = datacontextPost.value;
                        BindingTools.EvaluateExpression(postExpression, datacontext, parent, (ctxt, postData) =>
                        {
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
            else if (nbElements>0) {
                let result = [];
                for (var i = 0; i < nbElements; i++) {
                    result[i]=  BindingTools.EvaluateBindingExpression(elements[i], datacontext, contextNode);
                }
                callback(contextNode, result.length == 1 ? result[0] : result);
                return; 
            }
            else {
                callback(contextNode, eval(expression));
                return;
            }
        }


        private static EvaluateBindingExpression(bindingExpression: string, dataContextObject: any, node: Node, allowSideEffects: boolean=true): any {

            var parametersString = bindingExpression.TrimStartOnce("{Binding").TrimStartOnce(" ");
            parametersString = parametersString.TrimEndOnce("}");

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
                        case "ElementName":
                            source = document.getElementsByName(param[1]);
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
                        //case "TargetNullValue":
                        //    break;
                        default:
                            break;
                    }
                }
            }
            var value;
            var sourceIsArray = Object.prototype.toString.call(source) === '[object Array]';
            if (source != undefined && pathDefined) {
                value = eval((sourceIsArray ? 'source' : 'source.') + path);
            }
            else {
                value = source;
            }
            //apply converter and stringformat
            if (converter != undefined) {
                value = eval(converter + "(value)");
            }

            if (mode == "OneWay") {
                BindingTools.Bindings.CreateBinding(dataContextObject, path, htmlElement);
            } else if (mode == "TwoWay") {
                var binding = BindingTools.Bindings.CreateBinding(dataContextObject, path, htmlElement);
                htmlElement.onchange = () => {
                    if (!sourceIsArray) {
                        var evalString = "dataContextObject." + path + "=htmlElement.value; if (dataContextObject.PropertyChanged != undefined) dataContextObject.PropertyChanged.FireEvent(path);";
                        eval(evalString);
                    }
                };

            }
            if (hasSideEffects && allowSideEffects) {
                if (destination == "Content") {
                    //$(htmlElement).html(value);
                    htmlElement.innerHTML = value;
                }
                else {
                    htmlElement.attributes[destination].value = value;
                }
            }
        }
    }
}

$(() => {
    SS.BindingTools.SetBindingsRecursively(document.body);
});

