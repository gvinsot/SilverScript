///<reference path="StringTools.ts" />
///<reference path="libs/jquery.d.ts" />
///<reference path="EventHandler.ts" />
///<reference path="Interfaces.ts" />
///<reference path="FileTools.ts" />
var SS;
(function (SS) {
    function SetTemplate(targetNode, uri, datacontextvalue) {
        if (datacontextvalue === void 0) { datacontextvalue = null; }
        SS.BindingTools.SetTemplate(targetNode, uri, datacontextvalue);
    }
    SS.SetTemplate = SetTemplate;
    function Navigate(contextNode, uriExpression) {
        BindingTools.Navigate(contextNode, uriExpression);
    }
    SS.Navigate = Navigate;
    function GetDataContext(contextNode) {
        var parentNode = SS.BindingTools.GetParentContext(contextNode);
        return parentNode["data-context-value"];
    }
    SS.GetDataContext = GetDataContext;
    function GetSourceParent(childNode) {
        return SS.BindingTools.GetItemsSourceContext(childNode);
    }
    SS.GetSourceParent = GetSourceParent;
    function PushDataContext(contextNode, uriExpression, context, callback) {
        var datacontext = GetDataContext(contextNode);
        SS.FileTools.PostJsonFile(uriExpression, datacontext, context, callback);
    }
    SS.PushDataContext = PushDataContext;
    function ApplyBindings(nodeContext) {
        var node;
        node = (typeof nodeContext) == "string" ? document.getElementById(nodeContext) : nodeContext;
        SS.BindingTools.SetBindingsRecursively(node);
    }
    SS.ApplyBindings = ApplyBindings;
    //static var PropagationId = 0;
    function PropagateDataContext(sourceNode, destinationNodeId) {
        BindingTools.EvaluateDataContext(sourceNode, function (ctxt, dataContextObject) {
            var destinationNode = document.getElementById(destinationNodeId);
            SS.BindingTools.SetDataContext(destinationNode, dataContextObject);
            var context = SS.BindingTools.GetParentContext(SS.BindingTools.GetItemsSourceContext(sourceNode));
            if (context != null) {
                var onDataContextChanged = context["DataContextChanged"];
                if (onDataContextChanged == undefined) {
                    onDataContextChanged = new SS.EventHandler();
                    context["DataContextChanged"] = onDataContextChanged;
                }
                if (sourceNode["IsPropagationAttached"] == undefined) {
                    onDataContextChanged.Attach(function (ctx, args) {
                        SS.BindingTools.SetDataContext(ctx, "{x:Null}");
                    }, destinationNode);
                    sourceNode["IsPropagationAttached"] = true;
                }
            }
        });
    }
    SS.PropagateDataContext = PropagateDataContext;
    function SetDataContext(element, value) {
        SS.BindingTools.SetDataContext(element, value);
    }
    SS.SetDataContext = SetDataContext;
    function SetDataContextProperty(element, path, value) {
        BindingTools.EvaluateDataContext(element, function (ctxt, dataContextObject) {
            eval('dataContextObject' + path + '= value;');
            BindingTools.FireDataContextChanged(dataContextObject, path);
            BindingTools.SetBindingsRecursively(ctxt);
        });
    }
    SS.SetDataContextProperty = SetDataContextProperty;
    function RaiseDataContextChanged(element, propertyName) {
        BindingTools.EvaluateDataContext(element, function (ctxt, dataContextObject) {
            BindingTools.FireDataContextChanged(dataContextObject, propertyName);
            BindingTools.SetBindingsRecursively(ctxt);
        });
    }
    SS.RaiseDataContextChanged = RaiseDataContextChanged;
    var BindingTools = (function () {
        function BindingTools() {
        }
        BindingTools.ResetDataContextObject = function (targetNode) {
            var node;
            node = (typeof targetNode) == "string" ? document.getElementById(targetNode) : targetNode;
            //if (node["data-template-value"] == undefined) {
            //    node["data-template-value"] = new Object();
            //}
        };
        BindingTools.SetTemplate = function (targetNode, uri, datacontextvalue) {
            if (datacontextvalue === void 0) { datacontextvalue = null; }
            var node;
            node = (typeof targetNode) == "string" ? document.getElementById(targetNode) : targetNode;
            // BindingTools.DisposeBindings(node, true);
            BindingTools.Bindings.GarbageCollectBindings();
            if (datacontextvalue != null) {
                node["data-context-value"] = datacontextvalue;
            }
            $(node).attr("data-template", uri);
            SS.BindingTools.EvaluateTemplate(uri, node);
        };
        BindingTools.FireDataContextChanged = function (context, args) {
            var eventHandler = context["DataContextChanged"];
            if (eventHandler != undefined) {
                eventHandler.FireEvent(args);
            }
            else {
                context["DataContextChanged"] = new SS.EventHandler();
            }
        };
        BindingTools.Navigate = function (contextNode, uriExpression) {
            var node;
            node = (typeof contextNode) == "string" ? document.getElementById(contextNode) : contextNode;
            // BindingTools.DisposeBindings(node, true);
            BindingTools.Bindings.GarbageCollectBindings();
            BindingTools.EvaluateDataContext(node, function (ctxt, dataContextObject) {
                BindingTools.EvaluateExpression(uriExpression, dataContextObject, node, function (ctxt2, result) {
                    window.location.href = result;
                }, false);
            });
        };
        BindingTools.DisposeBindings = function (rootNode, skiprootNode) {
            if (skiprootNode === void 0) { skiprootNode = false; }
            var node;
            node = (typeof rootNode) == "string" ? document.getElementById(rootNode) : rootNode;
            BindingTools.DisposeBindingsRecursively(node, skiprootNode);
            BindingTools.Bindings.GarbageCollectBindings();
        };
        BindingTools.DisposeBindingsRecursively = function (rootNode, skiprootNode) {
            if (skiprootNode === void 0) { skiprootNode = false; }
            if (rootNode == null)
                return;
            if (!skiprootNode)
                BindingTools.Bindings.DisposeNodeBindings(rootNode);
            else {
                var rootNodeChildren = rootNode.children;
                for (var key in rootNodeChildren) {
                    if (!rootNodeChildren.hasOwnProperty(key))
                        continue;
                    BindingTools.DisposeBindingsRecursively(rootNodeChildren[key]);
                }
            }
        };
        BindingTools.SetDataContext = function (nodeForContext, value, applyBindings) {
            if (applyBindings === void 0) { applyBindings = true; }
            var node;
            node = (typeof nodeForContext) == "string" ? document.getElementById(nodeForContext) : nodeForContext;
            node["data-context-value"] = value;
            if (applyBindings)
                BindingTools.SetBindingsRecursively(node);
            var eventHandler = node["DataContextChanged"];
            if (eventHandler != undefined) {
                eventHandler.FireEvent(value);
            }
            else {
                node["DataContextChanged"] = new SS.EventHandler();
            }
        };
        BindingTools.SetBindingsRecursively = function (rootNode, skipCurrentNode) {
            if (skipCurrentNode === void 0) { skipCurrentNode = false; }
            if (rootNode == null)
                return;
            if (!skipCurrentNode && rootNode.attributes != undefined) {
                var databinding = rootNode.attributes["data-binding"];
                if (databinding != undefined) {
                    SS.BindingTools.EvaluateBinding(databinding.value, rootNode, function (ctxt, args) {
                        BindingTools.SetBindingsOnChildrenNodes(ctxt);
                    });
                    return;
                }
                else if (rootNode.attributes["data-template"] != undefined) {
                    //special case when there is only a template to apply                     
                    SS.BindingTools.EvaluateTemplate(rootNode.attributes["data-template"].value, rootNode);
                    return;
                }
            }
            BindingTools.SetBindingsOnChildrenNodes(rootNode);
        };
        BindingTools.SetBindingsOnChildrenNodes = function (rootNode) {
            var rootNodeChildren = rootNode.children;
            for (var key in rootNodeChildren) {
                if (!rootNodeChildren.hasOwnProperty(key))
                    continue;
                BindingTools.SetBindingsRecursively(rootNodeChildren[key]);
            }
        };
        BindingTools.GetParentContext = function (node) {
            var parentNode;
            parentNode = (typeof node) == "string" ? document.getElementById(node) : node;
            while (parentNode != null && parentNode.attributes != null && parentNode.attributes["data-context"] == undefined && parentNode["data-context-value"] == undefined) {
                parentNode = parentNode.parentNode;
            }
            if (parentNode == null || parentNode.attributes == null)
                return null;
            return parentNode;
        };
        BindingTools.GetItemsSourceContext = function (node) {
            var parentNode = node;
            while (parentNode != null && parentNode.attributes != null && parentNode.attributes["data-source"] == undefined) {
                parentNode = parentNode.parentNode;
            }
            if (parentNode == null || parentNode.attributes == null)
                return null;
            return parentNode;
        };
        BindingTools.EvaluateTemplate = function (bindingExpression, node) {
            var dataTemplateAttribute = node.attributes["data-template"];
            if (dataTemplateAttribute == undefined)
                return;
            var dataTemplateAttributreValue = dataTemplateAttribute.value == undefined ? dataTemplateAttribute : dataTemplateAttribute.value;
            BindingTools.EvaluateDataContext(node, function (ctxt, dataContextObject) {
                BindingTools.EvaluateExpression(dataTemplateAttributreValue, dataContextObject, node, function (ctxt2, templateExpression) {
                    // uncomments to deactivate template caching
                    //if (BindingTools.knownTemplates[templateExpression] != undefined) {
                    //    BindingTools.EvaluateTemplatePart2(BindingTools.knownTemplates[templateExpression], [node, dataContextObject, templateExpression]);
                    //    return;
                    //}
                    //
                    SS.FileTools.ReadHtmlFile(templateExpression, BindingTools.EvaluateTemplatePart2, [node, dataContextObject, templateExpression]);
                }, false);
            });
        };
        BindingTools.EvaluateTemplatePart2 = function (templateString, args) {
            var node = args[0];
            templateString = templateString.TrimStart("\r\n");
            templateString = templateString.TrimStart(" ");
            templateString = templateString.TrimEnd(" ");
            templateString = templateString.TrimEnd("\r\n");
            //node["data-template-value"] = templateString;
            // uncomments to deactivate template caching
            //BindingTools.knownTemplates[args[2]] = templateString;
            //
            var dataSourceAttribute = node.attributes["data-source"];
            var htmlnode = node;
            if (dataSourceAttribute != undefined) {
                var dataContextObject = args[1];
                var startTime = (new Date()).getTime();
                var items;
                //if (node["data-source-value"] != undefined && node["data-source-value"] != null) {
                //    items = node["data-source-value"];
                //    callback(node, items);
                //}
                //else {
                var datacontextloading = node["data-source-value-loading"];
                if (datacontextloading != null) {
                    //To solve: we should not get here (evaluating data-source multiple times)
                    return;
                }
                node["data-source-value-loading"] = new SS.EventHandler();
                var callback = function (ctxt, items) {
                    //node["data-source-value"] = items;
                    var contextloading = ctxt["data-source-value-loading"];
                    if (contextloading != undefined) {
                        //contextloading.FireEvent(items);
                        //contextloading.Dispose();
                        delete ctxt["data-source-value-loading"];
                    }
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
                    //for (var i = 0; i < htmlnode.children.length; i++) {
                    //    var subhnode = htmlnode.children[i];
                    //    subhnode["data-context-value"] = null;
                    //    var dataContextChangedEvent = <EventHandler>subhnode["DataContextChanged"];
                    //    if (dataContextChangedEvent != undefined)
                    //        dataContextChangedEvent.FireEvent(null);
                    //}
                    var jhtmlnode = $(htmlnode);
                    jhtmlnode.empty();
                    jhtmlnode.append(result);
                    var nbMilliseconds = (new Date()).getTime() - startTime;
                    console.log("Apply templates: " + nbMilliseconds + "ms");
                };
                BindingTools.EvaluateExpression(dataSourceAttribute.value, dataContextObject, node, callback);
            }
            else {
                htmlnode.innerHTML = templateString;
                // $(htmlnode).html(templateString);
                BindingTools.SetBindingsRecursively(htmlnode, true);
            }
        };
        BindingTools.EvaluateDataContext = function (node, callback) {
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
            var datacontextloading = contextNode["data-context-value-loading"];
            if (datacontextloading != null) {
                datacontextloading.Attach(callback, node);
                return;
            }
            contextNode["data-context-value-loading"] = new SS.EventHandler();
            var contextExpression = contextNode.attributes["data-context"].value;
            BindingTools.EvaluateDataContext(contextNode.parentNode, function (ctxt, datacontext) {
                BindingTools.EvaluateExpression(contextExpression, datacontext, contextNode, function (ctxt, datacontextvalue) {
                    BindingTools.SetDataContext(ctxt, datacontextvalue, false);
                    var contextloading = ctxt["data-context-value-loading"];
                    contextloading.FireEvent(datacontextvalue);
                    contextloading.Dispose();
                    delete ctxt["data-context-value-loading"];
                    callback(node, datacontextvalue);
                });
            });
        };
        BindingTools.EvaluateBinding = function (bindingExpression, node, callback) {
            BindingTools.EvaluateDataContext(node, function (ctxt, datacontext) {
                BindingTools.EvaluateExpression(bindingExpression, datacontext, ctxt, callback);
            });
        };
        BindingTools.EvaluateExpression = function (expression, datacontext, contextNode, callback, expectObjectResult) {
            if (expectObjectResult === void 0) { expectObjectResult = true; }
            if (expression == null || expression == "{x:Null}") {
                callback(contextNode, null);
                return;
            }
            var isHttpLink = !expression.StartWith("{") && (expression.indexOf("/") > 0);
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
                var transformed;
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
                        BindingTools.EvaluateExpression(postExpression, datacontext, parent, function (ctxt, postData) {
                            SS.FileTools.PostJsonFile(expression, postData, ctxt, callback);
                        }, false);
                        return;
                    }
                    else {
                        SS.FileTools.ReadJsonFile(expression, contextNode, callback);
                        return;
                    }
                }
            }
            else if (nbElements > 0) {
                var result = [];
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
        };
        BindingTools.EvaluateBindingExpression = function (bindingExpression, dataContextObject, node, allowSideEffects) {
            if (allowSideEffects === void 0) { allowSideEffects = true; }
            var parametersString = bindingExpression.TrimStartOnce("{");
            parametersString = parametersString.TrimEndOnce("}");
            var pathOnly = parametersString.indexOf("=") < 0;
            var parameters = parametersString.split(",");
            var elementName = null;
            var htmlElement = node;
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
            var value = null;
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
            else if (value == null) {
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
            if (mode == "OneWay" && dataContextObject != null) {
                if (htmlElement["SS-HasBindingCallBack"] == undefined) {
                    BindingTools.Bindings.CreateBinding(dataContextObject, path, htmlElement);
                    htmlElement["SS-HasBindingCallBack"] = true;
                }
            }
            else if (mode == "TwoWay" && dataContextObject != null) {
                if (htmlElement["SS-HasBindingCallBack"] == undefined) {
                    var binding = BindingTools.Bindings.CreateBinding(dataContextObject, path, htmlElement);
                    var callback = function () {
                        if (!sourceIsArray) {
                            var evalString = "dataContextObject." + path + "=htmlElement.value; if (dataContextObject.PropertyChanged != undefined) dataContextObject.PropertyChanged.FireEvent(path);";
                            try {
                                eval(evalString);
                            }
                            catch (ex) {
                                console.log("Exception applying binding : " + evalString);
                            }
                        }
                    };
                    //htmlElement.onchange = callback;
                    htmlElement.onkeyup = callback;
                    htmlElement["SS-HasBindingCallBack"] = true;
                }
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
        };
        return BindingTools;
    }());
    BindingTools.Bindings = new SS.BindingGlobalContext();
    BindingTools.knownTemplates = new Object();
    SS.BindingTools = BindingTools;
})(SS || (SS = {}));
$(function () {
    SS.BindingTools.SetBindingsRecursively(document.body);
});
//# sourceMappingURL=BindingTools.js.map