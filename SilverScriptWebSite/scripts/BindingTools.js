///<reference path="StringTools.ts" />
///<reference path="libs/jquery.d.ts" />
///<reference path="EventHandler.ts" />
///<reference path="Interfaces.ts" />
///<reference path="FileTools.ts" />
var SS;
(function (SS) {
    function SetTemplate(targetNode, uri) {
        SS.BindingTools.SetTemplate(targetNode, uri);
    }
    SS.SetTemplate = SetTemplate;
    var BindingTools = (function () {
        function BindingTools() {
        }
        BindingTools.ApplyBinding = function (rootNode) {
            if (rootNode.attributes["data-binding"] != undefined) {
                SS.BindingTools.EvaluateBinding(rootNode.attributes["data-binding"]["nodeValue"], rootNode);
            }
            if (rootNode.attributes["data-onload"] != undefined) {
                eval(rootNode.attributes["data-onload"].nodeValue);
            }
        };
        BindingTools.ApplyTemplate = function (rootNode) {
            if (rootNode.attributes["data-template"] != undefined) {
                SS.BindingTools.EvaluateTemplate(rootNode.attributes["data-template"]["nodeValue"], rootNode);
            }
        };
        BindingTools.NewDataContextObject = function (rootNode) {
            if (rootNode.attributes["data-template-value"] == undefined) {
                rootNode.attributes["data-template-value"] = new Object();
            }
        };
        BindingTools.SetTemplate = function (targetNode, uri) {
            var node = document.getElementById(targetNode);
            BindingTools.DisposeBindingsRecursively(node, true);
            node.attributes["data-template"] = uri;
            SS.BindingTools.ApplyTemplate(node);
        };
        BindingTools.DisposeBindingsRecursively = function (rootNode, skiprootNode) {
            if (skiprootNode === void 0) { skiprootNode = false; }
            if (rootNode == null)
                return;
            if (!skiprootNode)
                BindingTools.Bindings.DisposeNode(rootNode);
            else {
                var childrenNodes = rootNode.children;
                var nbChildren = childrenNodes.length;
                for (var i = 0; i < nbChildren; i++) {
                    var node = childrenNodes[i];
                    BindingTools.DisposeBindingsRecursively(node);
                }
            }
        };
        BindingTools.SetBindingsRecursively = function (rootNode, skipCurrentNode) {
            if (skipCurrentNode === void 0) { skipCurrentNode = false; }
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
                var node = childrenNodes[i];
                BindingTools.SetBindingsRecursively(node);
            }
        };
        BindingTools.GetParentContext = function (node) {
            var parentNode = node;
            while (parentNode.attributes != null && parentNode.attributes["data-context"] == undefined && parentNode.attributes["data-context-value"] == undefined) {
                parentNode = parentNode.parentNode;
            }
            if (parentNode.attributes == null)
                return null;
            return parentNode;
        };
        // private static knownTemplates = new Array();
        BindingTools.EvaluateTemplate = function (bindingExpression, node) {
            var dataTemplateAttribute = node.attributes["data-template"];
            if (dataTemplateAttribute == undefined)
                return;
            var dataTemplateAttributreValue = dataTemplateAttribute.nodeValue == undefined ? dataTemplateAttribute : dataTemplateAttribute.nodeValue;
            var dataContextObject = BindingTools.EvaluateDataContext(node);
            var templateExpression = BindingTools.EvaluateExpression(dataTemplateAttributreValue, dataContextObject, node, false);
            SS.FileTools.ReadHtmlFile(templateExpression, BindingTools.EvaluateTemplatePart2, [node, dataContextObject]);
        };
        BindingTools.EvaluateTemplatePart2 = function (templateString, args) {
            var node = args[0];
            var dataContextObject = args[1];
            node["data-template-value"] = templateString;
            var dataSourceAttribute = node.attributes["data-source"];
            if (dataSourceAttribute != undefined) {
                var items = BindingTools.EvaluateExpression(dataSourceAttribute.nodeValue, dataContextObject, node);
                node["data-source-value"] = items;
                var itemsLength = items.length;
                //lets loop through context items
                for (var i = 0; i < itemsLength; i++) {
                    var copyString = (new String(templateString)).toString();
                    var wrapper;
                    if (copyString.StartWith("<tr") || copyString.StartWith("<tr"))
                        wrapper = document.createElement('table');
                    else
                        wrapper = document.createElement('div');
                    wrapper.innerHTML = copyString;
                    var result = wrapper.firstChild;
                    if (result.attributes != undefined) {
                        result.attributes["data-context-value"] = items[i];
                    }
                    else {
                        console.log("SS Exception: your element type is currently not supported for an item template");
                    }
                    node.appendChild(result);
                }
                BindingTools.SetBindingsRecursively(node, true);
            }
            else {
                node.textContent = "";
                node.innerHTML = templateString;
                BindingTools.SetBindingsRecursively(node, true);
            }
        };
        BindingTools.EvaluateDataContext = function (node) {
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
        };
        BindingTools.EvaluateBinding = function (bindingExpression, node) {
            var dataContextObject = BindingTools.EvaluateDataContext(node);
            return BindingTools.EvaluateExpression(bindingExpression, dataContextObject, node);
        };
        BindingTools.EvaluateExpression = function (expression, datacontext, contextNode, expectObjectResult) {
            if (expectObjectResult === void 0) { expectObjectResult = true; }
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
                for (var i = 0; i < nbElements; i++) {
                    var bindingString = elements[i];
                    var transformed = BindingTools.EvaluateBindingExpression(bindingString, datacontext, parent);
                    expression = expression.replace(bindingString, transformed);
                }
                if (!expectObjectResult)
                    return expression;
                else {
                    if (contextNode.attributes["data-context-post"] != undefined) {
                        var postExpression = contextNode.attributes["data-context-post"].nodeValue;
                        var postData = BindingTools.EvaluateExpression(postExpression, datacontext, parent, false);
                        return SS.FileTools.PostJsonFile(expression, postData);
                    }
                    else {
                        return SS.FileTools.ReadJsonFile(expression);
                    }
                }
            }
            else if (nbElements > 0) {
                var result = [];
                for (var i = 0; i < nbElements; i++) {
                    result[i] = BindingTools.EvaluateBindingExpression(elements[i], datacontext, contextNode);
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
        };
        BindingTools.EvaluateBindingExpression = function (bindingExpression, dataContextObject, node, allowSideEffects) {
            if (allowSideEffects === void 0) { allowSideEffects = true; }
            var parametersString = bindingExpression.TrimStartOnce("{Binding").TrimStartOnce(" ");
            parametersString = parametersString.TrimEndOnce("}");
            var parameters = parametersString.split(",");
            var elementName = null;
            var path = undefined;
            var source = dataContextObject;
            var converter = undefined;
            var converterParameter = undefined;
            var stringFormat = undefined;
            var mode = "OneTime";
            var destination = "Content";
            var hasSideEffects = false;
            var pathDefined = false;
            for (var i = 0; i < parameters.length; i++) {
                var param = parameters[i].split('=');
                if (param.length == 1) {
                    path = param[0];
                }
                else
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
            var value;
            var sourceIsArray = Object.prototype.toString.call(source) === '[object Array]';
            if (source != undefined && pathDefined) {
                var sourceString = sourceIsArray ? 'source' : 'source.';
                value = eval(sourceString + path);
            }
            else {
                value = source;
            }
            //todo : apply converter and stringformat
            if (converter != undefined) {
                value = eval(converter + "(value)");
            }
            if (mode == "OneWay") {
                BindingTools.Bindings.CreateBinding(dataContextObject, path, node);
            }
            else if (mode == "TwoWay") {
                var binding = BindingTools.Bindings.CreateBinding(dataContextObject, path, node);
                //TODO
                //if node is input and mode == twoway then attach events
                var element = node;
                if (element != null) {
                    element.onchange = function () {
                        if (!sourceIsArray) {
                            eval("dataContextObject." + path + "=element.value; if (dataContextObject.PropertyChanged != undefined) dataContextObject.PropertyChanged.FireEvent(path);");
                        }
                    };
                }
            }
            if (hasSideEffects && allowSideEffects) {
                if (destination == "Content") {
                    node.innerHTML = value;
                }
                else {
                    node.attributes[destination].value = value;
                }
            }
            return value;
        };
        BindingTools.Bindings = new SS.BindingGlobalContext();
        return BindingTools;
    })();
    SS.BindingTools = BindingTools;
})(SS || (SS = {}));
$(function () {
    SS.BindingTools.SetBindingsRecursively(document.body);
});
//# sourceMappingURL=BindingTools.js.map