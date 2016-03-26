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

       
        public static ApplyBinding(rootNode: HTMLElement): void {
            if (rootNode.attributes["data-binding"] != undefined) {
                SS.BindingTools.EvaluateBinding(rootNode.attributes["data-binding"].nodeValue, rootNode);                             
            }
            if (rootNode.attributes["data-onload"] != undefined) {
                eval(rootNode.attributes["data-onload"].nodeValue);
            }
        }

        public static ApplyTemplate(rootNode: Node): void {
            if (rootNode.attributes["data-template"] != undefined) {
                SS.BindingTools.EvaluateTemplate(rootNode.attributes["data-template"].nodeValue, rootNode);
            }
        }

        public static NewDataContextObject(rootNode: Node): void {
            if (rootNode.attributes["data-template-value"] == undefined) {
                rootNode.attributes["data-template-value"] = new Object();
            }
        }

        public static SetTemplate(targetNode: string, uri: string):void {
            var node = document.getElementById(targetNode);

            BindingTools.DisposeBindingsRecursively(node, true);
            node.attributes["data-template"] = uri;
            SS.BindingTools.ApplyTemplate(node);                
        }

        public static DisposeBindingsRecursively(rootNode: HTMLElement, skiprootNode: boolean = false): void {
            if (rootNode == null)
                return;
            if (!skiprootNode)
                BindingTools.Bindings.DisposeNode(rootNode);
            else {
                var childrenNodes = rootNode.children;
                var nbChildren = childrenNodes.length;
                var node: HTMLElement;
                for (var i = 0; i < nbChildren; i++) {
                    node = <HTMLElement>childrenNodes[i];
                    BindingTools.DisposeBindingsRecursively(node);
                }
            }
        }
        
        public static SetBindingsRecursively(rootNode: HTMLElement, skipCurrentNode:boolean =false): void {
            if (rootNode == null)
                return;

            if (!skipCurrentNode) {
                BindingTools.ApplyBinding(rootNode);
                if (rootNode.attributes["data-binding"] == undefined && rootNode.attributes["data-template"] != undefined) {
                    BindingTools.ApplyTemplate(rootNode);
                    return;
                }
            }
            
            var childrenNodes = rootNode.children;
            var nbChildren = childrenNodes.length;
            for (var i = 0; i < nbChildren; i++) {
                BindingTools.SetBindingsRecursively(<HTMLElement>childrenNodes[i]);
            }
        }

        private static GetParentContext(node: Node): Node {
            var parentNode = node;
            while (parentNode.attributes != null && parentNode.attributes["data-context"] == undefined && parentNode.attributes["data-context-value"] == undefined) {
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
            var dataTemplateAttributreValue = dataTemplateAttribute.nodeValue == undefined ? dataTemplateAttribute : dataTemplateAttribute.nodeValue;
            var dataContextObject = BindingTools.EvaluateDataContext(node);
            var templateExpression = BindingTools.EvaluateExpression(dataTemplateAttributreValue, dataContextObject, node, false);
            FileTools.ReadHtmlFile(templateExpression, BindingTools.EvaluateTemplatePart2, [ node, dataContextObject]);            
        }

        private static EvaluateTemplatePart2(templateString: string, args: any[]):void {
            var node: Node = args[0];
            node["data-template-value"] = templateString;
            var dataSourceAttribute = node.attributes["data-source"];
            var htmlnode = <HTMLElement>node;
                
            if (dataSourceAttribute != undefined) {

                var dataContextObject: Object = args[1];
                var startTime = (new Date()).getTime();            
                var items = BindingTools.EvaluateExpression(dataSourceAttribute.nodeValue, dataContextObject, node);
                node["data-source-value"] = items;
                var itemsLength = items.length;
                var resultString = "";
                
                //lets loop through context items
                for (var i = 0; i < itemsLength; i++) {
                    resultString = resultString.concat(templateString);
                }

                // htmlnode.innerHTML = resultString;
                var result = $(resultString);
                //var children = htmlnode.childNodes[0].childNodes;
                for (var i = 0; i < itemsLength; i++) {
                    result[i].attributes["data-context-value"] = items[i];
                    BindingTools.SetBindingsRecursively(result[i], true);
                }
                result.appendTo(htmlnode);                                

                var nbMilliseconds = (new Date()).getTime() - startTime;
                console.log("Apply templates: " + nbMilliseconds + "ms");
            }
            else {
                htmlnode.textContent = "";
                htmlnode.innerHTML = templateString;
                BindingTools.SetBindingsRecursively(htmlnode, true);
            }
            
        }
        
        private static EvaluateDataContext(node): Object {
            var contextNode = BindingTools.GetParentContext(node);

            if (contextNode == undefined)
                return null;

            if (contextNode.attributes["data-context-value"] != undefined) 
                return contextNode.attributes["data-context-value"];
            
            var contextExpression = contextNode.attributes["data-context"].nodeValue;
            var datacontext = BindingTools.EvaluateDataContext(contextNode.parentNode);
            var result = BindingTools.EvaluateExpression(contextExpression, datacontext, contextNode);

            contextNode.attributes["data-context-value"] = result;

            return result;
        }
        


        private static EvaluateBinding(bindingExpression: string, node: Node): any {
            return BindingTools.EvaluateExpression(bindingExpression, BindingTools.EvaluateDataContext(node), node)
        }
       
        private static EvaluateExpression(expression: string, datacontext: any, contextNode: Node, expectObjectResult: boolean = true): any {

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
                var bindingString = "";
                var transformed = "";
                for (var i = 0; i < nbElements; i++) {
                    bindingString = elements[i];
                    transformed = BindingTools.EvaluateBindingExpression(bindingString,datacontext, parent);
                    expression = expression.replace(bindingString, transformed);
                }
                
                if (!expectObjectResult)
                    return expression;       
				else {
                    if (contextNode.attributes["data-context-post"] != undefined) {
                        var postExpression = contextNode.attributes["data-context-post"].nodeValue;
                        var postData = BindingTools.EvaluateExpression(postExpression, datacontext, parent, false);
                        return FileTools.PostJsonFile(expression, postData);
                    }
                    else {
                        return FileTools.ReadJsonFile(expression);
                    }
                }
            }
            else if (nbElements>0) {
                let result = [];
                for (var i = 0; i < nbElements; i++) {
                    result[i]=  BindingTools.EvaluateBindingExpression(elements[i], datacontext, contextNode);
                }
                if (result.length == 1)
                    return result[0];
                else
                    return result; 
            }
            else {
                return eval(expression);
            }
            return null;
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
                            source = BindingTools.EvaluateBinding(param[1], node);
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
            var sourceIsArray= Object.prototype.toString.call(source) === '[object Array]';
            if (source != undefined && pathDefined) {
                value = eval((sourceIsArray ? 'source' : 'source.') + path);    
            }
            else {
                value = source;
            }
            //apply converter and stringformat
  			if (converter != undefined) {
                value = eval(converter+"(value)");
            }

            if (mode == "OneWay") {
                BindingTools.Bindings.CreateBinding(dataContextObject, path, htmlElement);
            } else if (mode == "TwoWay") {
                var binding = BindingTools.Bindings.CreateBinding(dataContextObject, path, htmlElement);
                htmlElement.onchange = () => {
                    if (!sourceIsArray) {
                        var evalString = "dataContextObject." + path + "=htmlElement.value; if (dataContextObject.PropertyChanged != undefined) dataContextObject.PropertyChanged.FireEvent(path);";
                        (new Function(evalString))();                       
                    }                        
                };
                
            }
            if (hasSideEffects && allowSideEffects)
            {
                if (destination == "Content") {
                    htmlElement.innerHTML = value;
                }
                else {
                    node.attributes[destination].value = value;
                }
            }
            return value;
        }
    }
}

$(() => {
    SS.BindingTools.SetBindingsRecursively(document.body);
});

