$.extend(String.prototype, {
    StartWith: function (stringToTest) {
        return SS.StringTools.StartWith(this, stringToTest);
    }
});
$.extend(String.prototype, {
    EndWith: function (stringToTest) {
        return SS.StringTools.EndWith(this, stringToTest);
    }
});
$.extend(String.prototype, {
    TrimStart: function (toTrim) {
        return SS.StringTools.TrimStart(this, toTrim);
    }
});
$.extend(String.prototype, {
    TrimEnd: function (toTrim) {
        return SS.StringTools.TrimEnd(this, toTrim);
    }
});
$.extend(String.prototype, {
    TrimEndOnce: function (toTrim) {
        return SS.StringTools.TrimEndOnce(this, toTrim);
    }
});
$.extend(String.prototype, {
    TrimStartOnce: function (toTrim) {
        return SS.StringTools.TrimStartOnce(this, toTrim);
    }
});
var SS;
(function (SS) {
    var StringTools = (function () {
        function StringTools() {
        }
        StringTools.StartWith = function (toTest, toSearch) {
            for (var i = 0; i < toSearch.length; i++) {
                if (toSearch.charAt(i) != toTest.charAt(i)) {
                    return false;
                }
            }
            return true;
        };
        StringTools.EndWith = function (toTest, toSearch) {
            var toTestIndex = toTest.length - 1;
            for (var i = toSearch.length - 1; i >= 0; i--) {
                if (toSearch.charAt(i) != toTest.charAt(toTestIndex)) {
                    return false;
                }
                toTestIndex--;
            }
            return true;
        };
        StringTools.TrimStart = function (original, toTrim) {
            var result = original;
            while (this.StartWith(result, toTrim)) {
                result = StringTools.TrimStartOnce(result, toTrim);
            }
            return result;
        };
        StringTools.TrimStartOnce = function (original, toTrim) {
            return original.substring(toTrim.length, original.length);
        };
        StringTools.TrimEnd = function (original, toTrim) {
            var result = original;
            while (this.EndWith(result, toTrim)) {
                result = StringTools.TrimEndOnce(result, toTrim);
            }
            return result;
        };
        StringTools.TrimEndOnce = function (original, toTrim) {
            return original.substring(0, original.length - toTrim.length);
        };
        StringTools.Json = function (json) {
            if (typeof json != 'string') {
                json = JSON.stringify(json, undefined, 2);
            }
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                var cls = 'number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key';
                    }
                    else {
                        cls = 'string';
                    }
                }
                else if (/true|false/.test(match)) {
                    cls = 'boolean';
                }
                else if (/null/.test(match)) {
                    cls = 'null';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            });
        };
        return StringTools;
    })();
    SS.StringTools = StringTools;
})(SS || (SS = {}));
var SS;
(function (SS) {
    var EventHandler = (function () {
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
var SS;
(function (SS) {
    var FileTools = (function () {
        function FileTools() {
        }
        FileTools.FileExist = function (path) {
            var result = false;
            jQuery.ajax({
                type: "GET",
                beforeSend: function (request) {
                    request.setRequestHeader("Range", "bytes=0-16");
                },
                url: path,
                cache: false,
                async: false,
                success: function (value) {
                    result = true;
                },
                error: function (msg) {
                    result = false;
                }
            });
            return result;
        };
        FileTools.PathCombine = function (path1, path2) {
            return path1 + path2;
        };
        FileTools.UrlCombine = function (absolteUrl, relativeUrl) {
            return absolteUrl + relativeUrl;
        };
        FileTools.ReadJsonFile = function (path, callbackctxt, callback) {
            var queryResult;
            jQuery.ajax({
                type: "GET",
                url: path,
                cache: false,
                async: true,
                dataType: 'json',
                success: function (result) {
                    callback(callbackctxt, result);
                },
                error: function (msg) {
                    console.log("SS Exception on load " + path + "   MESSAGE : " + msg.statusText);
                    callback(callbackctxt, null);
                }
            });
        };
        FileTools.PostJsonFile = function (path, postdata, callbackctxt, callback, errorCallback) {
            if (errorCallback === void 0) { errorCallback = null; }
            var queryResult;
            jQuery.ajax({
                type: "POST",
                url: path,
                data: "=" + postdata,
                cache: false,
                async: true,
                dataType: 'json',
                success: function (result) {
                    callback(callbackctxt, result);
                },
                error: function (msg) {
                    console.log("SS Exception on load " + path + "   MESSAGE : " + msg.statusText);
                    callback(callbackctxt, null);
                }
            });
        };
        FileTools.ReadHtmlFile = function (path, delegate, delegateParameters) {
            if (delegate === void 0) { delegate = null; }
            if (delegateParameters === void 0) { delegateParameters = null; }
            var queryResult;
            jQuery.ajax({
                type: "GET",
                url: path,
                async: delegate != null,
                dataType: 'html',
                success: function (result) {
                    if (delegate != null) {
                        delegate(result, delegateParameters);
                    }
                    else {
                        queryResult = result;
                    }
                },
                error: function (msg) {
                    console.log("SS Exception on load " + path + "   MESSAGE : " + msg.statusText);
                }
            });
            return queryResult;
        };
        return FileTools;
    })();
    SS.FileTools = FileTools;
})(SS || (SS = {}));
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
            if (context.Path.indexOf(path) >= 0) {
                var databinding = context.Node.attributes["data-binding"];
                if (databinding != undefined) {
                    SS.BindingTools.EvaluateBinding(databinding.value, context.Node, function (a, b) { });
                }
            }
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
var SS;
(function (SS) {
    var BindingGlobalContext = (function () {
        function BindingGlobalContext() {
            this.BindingDictionary = new Object();
            this.CurrentBindingId = 0;
        }
        BindingGlobalContext.prototype.CreateBinding = function (bindedObject, path, node) {
            if (node["data-binding-ids"] == undefined) {
                node["data-binding-ids"] = [];
            }
            this.CurrentBindingId++;
            var bindingsIds = node["data-binding-ids"];
            var length = bindingsIds.length;
            var bindingId = this.CurrentBindingId;
            bindingsIds[length] = bindingId;
            var binding = new SS.Binding(path, node, bindedObject);
            this.BindingDictionary[bindingId] = binding;
            return binding;
        };
        BindingGlobalContext.prototype.DisposeNodeBindings = function (node) {
            if (node.attributes != undefined && node.attributes != null) {
                delete node["data-context-value"];
                delete node["data-template-value"];
                delete node["data-source-value"];
                if (node["data-binding-ids"] != undefined) {
                    var bindingsIds = node["data-binding-ids"];
                    for (var bindingId in bindingsIds) {
                        var binding = this.BindingDictionary[bindingId];
                        if (binding.Node != null) {
                            binding.Dispose();
                            delete this.BindingDictionary[bindingId];
                            binding = null;
                        }
                    }
                    delete node["data-binding-ids"];
                }
            }
        };
        BindingGlobalContext.prototype.GarbageCollectBindings = function () {
            for (var key in this.BindingDictionary) {
                if (!this.BindingDictionary.hasOwnProperty(key))
                    continue;
                var binding = this.BindingDictionary[key];
                if (binding.Node != null && !this.IsAttachedToDOM(binding.Node)) {
                    binding.Dispose();
                    delete this.BindingDictionary[key];
                }
                binding = null;
            }
        };
        BindingGlobalContext.prototype.IsAttachedToDOM = function (ref) {
            return ref.parentElement == undefined;
        };
        return BindingGlobalContext;
    })();
    SS.BindingGlobalContext = BindingGlobalContext;
})(SS || (SS = {}));
var SS;
(function (SS) {
    function SetTemplate(targetNode, uri) {
        SS.BindingTools.SetTemplate(targetNode, uri);
    }
    SS.SetTemplate = SetTemplate;
    function Navigate(contextNode, uriExpression) {
        BindingTools.Navigate(contextNode, uriExpression);
    }
    SS.Navigate = Navigate;
    function GetDataContext(contextNodeName) {
        var node = document.getElementById(contextNodeName);
        var contextNode = SS.BindingTools.GetParentContext(node);
        return contextNode["data-context-value"];
    }
    SS.GetDataContext = GetDataContext;
    function PushDataContext(contextNodeName, uriExpression, context, callback) {
        var datacontext = GetDataContext(contextNodeName);
        SS.FileTools.PostJsonFile(uriExpression, datacontext, context, callback);
    }
    SS.PushDataContext = PushDataContext;
    function ApplyBindings(nodeName) {
        var node = document.getElementById(nodeName);
        SS.BindingTools.SetBindingsRecursively(node);
    }
    SS.ApplyBindings = ApplyBindings;
    function PropagateDataContext(sourceNode, destinationNodeId) {
        BindingTools.EvaluateDataContext(sourceNode, function (ctxt, dataContextObject) {
            var destinationNode = document.getElementById(destinationNodeId);
            SS.BindingTools.SetDataContext(destinationNode, dataContextObject);
            var context = SS.BindingTools.GetParentContext(SS.BindingTools.GetItemsSourceContext(sourceNode));
            var onDataContextChanged = context["DataContextChanged"];
            if (onDataContextChanged == undefined) {
                onDataContextChanged = new SS.EventHandler();
                context["DataContextChanged"] = onDataContextChanged;
            }
            if (context["IsPropagationAttached"] == undefined) {
                onDataContextChanged.Attach(function (ctx, args) {
                    SS.BindingTools.SetDataContext(ctx, "{x:Null}");
                }, destinationNode);
                context["IsPropagationAttached"] = true;
            }
        });
    }
    SS.PropagateDataContext = PropagateDataContext;
    function SetDataContext(element, value) {
        SS.BindingTools.SetDataContext(element, value);
    }
    SS.SetDataContext = SetDataContext;
    var BindingTools = (function () {
        function BindingTools() {
        }
        BindingTools.NewDataContextObject = function (rootNode) {
            if (rootNode["data-template-value"] == undefined) {
                rootNode["data-template-value"] = new Object();
            }
        };
        BindingTools.SetTemplate = function (targetNode, uri) {
            var node = document.getElementById(targetNode);
            BindingTools.Bindings.GarbageCollectBindings();
            $(node).attr("data-template", uri);
            SS.BindingTools.EvaluateTemplate(uri, node);
        };
        BindingTools.Navigate = function (contextNode, uriExpression) {
            var node = document.getElementById(contextNode);
            BindingTools.Bindings.GarbageCollectBindings();
            BindingTools.EvaluateDataContext(node, function (ctxt, dataContextObject) {
                BindingTools.EvaluateExpression(uriExpression, dataContextObject, node, function (ctxt2, result) {
                    window.location.href = result;
                }, false);
            });
        };
        BindingTools.DisposeBindings = function (rootNode, skiprootNode) {
            if (skiprootNode === void 0) { skiprootNode = false; }
            BindingTools.DisposeBindingsRecursively(rootNode, skiprootNode);
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
        BindingTools.SetDataContext = function (node, value) {
            node["data-context-value"] = value;
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
            var parentNode = node;
            while (parentNode != null && parentNode.attributes != null && parentNode.attributes["data-context"] == undefined && parentNode["data-context-value"] == undefined) {
                parentNode = parentNode.parentNode;
            }
            if (parentNode == null || parentNode.attributes == null)
                return null;
            return parentNode;
        };
        BindingTools.GetItemsSourceContext = function (node) {
            var parentNode = node;
            while (parentNode != null && parentNode.attributes != null && parentNode.attributes["data-source"] == undefined && parentNode["data-source-value"] == undefined) {
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
                    SS.FileTools.ReadHtmlFile(templateExpression, BindingTools.EvaluateTemplatePart2, [node, dataContextObject]);
                }, false);
            });
        };
        BindingTools.EvaluateTemplatePart2 = function (templateString, args) {
            var node = args[0];
            templateString = templateString.TrimStart("\r\n");
            templateString = templateString.TrimStart(" ");
            templateString = templateString.TrimEnd(" ");
            templateString = templateString.TrimEnd("\r\n");
            node["data-template-value"] = templateString;
            var dataSourceAttribute = node.attributes["data-source"];
            var htmlnode = node;
            if (dataSourceAttribute != undefined) {
                var dataContextObject = args[1];
                var startTime = (new Date()).getTime();
                BindingTools.EvaluateExpression(dataSourceAttribute.value, dataContextObject, node, function (ctxt, items) {
                    node["data-source-value"] = items;
                    if (items == null || items.length == undefined) {
                        var jhtmlnode = $(htmlnode);
                        jhtmlnode.empty();
                        console.log("Bad data-source type:" + items);
                        return;
                    }
                    var itemsLength = items.length;
                    var resultString = "";
                    for (var i = 0; i < itemsLength; i++) {
                        resultString = resultString.concat(templateString);
                    }
                    var result = $(resultString);
                    for (var i = 0; i < itemsLength; i++) {
                        var subnode = result[i];
                        BindingTools.SetDataContext(subnode, items[i]);
                    }
                    for (var i = 0; i < htmlnode.children.length; i++) {
                        var subhnode = htmlnode.children[i];
                        subhnode["data-context-value"] = null;
                        var dataContextChangedEvent = subhnode["DataContextChanged"];
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
                    BindingTools.SetDataContext(ctxt, datacontextvalue);
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
            var isHttpLink = !expression.StartWith("{") && (expression.StartWith("/") || expression.StartWith("http://") || expression.StartWith("https://") || expression.indexOf("/") > 0);
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
                var transformed;
                for (var bindingString in elements) {
                    transformed = BindingTools.EvaluateBindingExpression(bindingString, datacontext, parent);
                    expression = expression.replace(bindingString, transformed);
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
            var parametersString = bindingExpression.TrimStartOnce("{Binding").TrimStartOnce(" ");
            parametersString = parametersString.TrimEndOnce("}");
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
                        case "Mode":
                            mode = param[1];
                            break;
                        case "Value":
                            value = param[1];
                            break;
                        default:
                            break;
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
            if (converter != undefined) {
                if (converterParameter != undefined)
                    value = eval(converter + "(value,converterParameter)");
                else
                    value = eval(converter + "(value)");
            }
            if (mode == "OneWay" && dataContextObject != null) {
                BindingTools.Bindings.CreateBinding(dataContextObject, path, htmlElement);
            }
            else if (mode == "TwoWay" && dataContextObject != null) {
                var binding = BindingTools.Bindings.CreateBinding(dataContextObject, path, htmlElement);
                htmlElement.onchange = function () {
                    if (!sourceIsArray) {
                        var evalString = "dataContextObject." + path + "=htmlElement.value; if (dataContextObject.PropertyChanged != undefined) dataContextObject.PropertyChanged.FireEvent(path);";
                        eval(evalString);
                    }
                };
            }
            else if (mode == "Eval") {
                value = eval(value);
            }
            if (hasSideEffects && allowSideEffects) {
                if (destination == "Content") {
                    htmlElement.innerHTML = value == null ? "" : value;
                }
                else {
                    $(htmlElement).attr(destination, value);
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
var SS;
(function (SS) {
    var ObjectTools = (function () {
        function ObjectTools() {
        }
        ObjectTools.CheckFileAPI = function () {
            if (window["File"] && window["FileReader"] && window["FileList"] && window["Blob"]
                && ObjectTools.supportsH264Video()) {
                return true;
            }
            else {
                alert('The File APIs are not fully supported in this browser.');
                return false;
            }
        };
        ObjectTools.supportsH264Video = function () {
            var v = document.createElement("video");
            var result = v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
            return result.length != 0;
        };
        ObjectTools.ConvertJsonToDate = function (sourceString) {
            var trimed = SS.StringTools.TrimStart(sourceString, "/Date(");
            trimed = SS.StringTools.TrimEnd(trimed, ")/");
            trimed = SS.StringTools.TrimEnd(trimed, "+0000");
            return new Date(parseInt(trimed));
        };
        ObjectTools.ConvertJsonTimeSpanToDate = function (sourceString) {
            var trimed = SS.StringTools.TrimStart(sourceString, "PT");
            var hours = 0;
            var minutes = 0;
            var seconds = 0;
            var splitted = trimed.split("H");
            if (splitted.length > 1) {
                hours = parseInt(splitted[0]);
                trimed = splitted[1];
            }
            splitted = trimed.split("M");
            if (splitted.length > 1) {
                minutes = parseInt(splitted[0]);
                trimed = splitted[1];
            }
            trimed = SS.StringTools.TrimEnd(trimed, "S");
            seconds = parseInt(trimed);
            return new Date(hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000);
        };
        ObjectTools.Any = function (list, condition) {
            var currentIndex = 0;
            var currentItem;
            do {
                currentItem = list[currentIndex];
                if (condition(currentItem) == true) {
                    return true;
                }
                currentIndex++;
            } while (currentItem != null);
            return false;
        };
        ObjectTools.Count = function (list, condition) {
            var currentIndex = 0;
            var result = 0;
            var currentItem;
            do {
                currentItem = list[currentIndex];
                if (condition(currentItem) == true) {
                    result++;
                }
                currentIndex++;
            } while (currentItem != null);
            return result;
        };
        ObjectTools.DeleteNode = function (node) {
            if (node) {
                ObjectTools.DeleteChildren(node);
                if (node.parentNode) {
                    node.parentNode.removeChild(node);
                }
            }
        };
        ObjectTools.DeleteChildren = function (node) {
            if (node) {
                for (var x = node.childNodes.length - 1; x >= 0; x--) {
                    var childNode = node.childNodes[x];
                    if (childNode.hasChildNodes()) {
                        ObjectTools.DeleteChildren(childNode);
                    }
                    node.removeChild(childNode);
                }
            }
        };
        return ObjectTools;
    })();
    SS.ObjectTools = ObjectTools;
})(SS || (SS = {}));
//# sourceMappingURL=silverscript.js.map