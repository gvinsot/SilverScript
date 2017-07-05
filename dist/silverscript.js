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
    }());
    SS.StringTools = StringTools;
})(SS || (SS = {}));
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
    }());
    SS.EventHandler = EventHandler;
})(SS || (SS = {}));
///<reference path="EventHandler.ts" />
///<reference path="libs/jquery.d.ts"/>
// Module
var SS;
(function (SS) {
    //Class
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
            var queryResult = null;
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
                    //queryResult = "ERROR : " + msg;
                    console.log("SS Exception on load " + path + "   MESSAGE : " + msg.statusText);
                    callback(callbackctxt, null);
                }
                //complete:function(data,xhr)
                //{
                //}
            });
        };
        FileTools.PostJsonFile = function (path, postdata, callbackctxt, callback, errorCallback) {
            if (errorCallback === void 0) { errorCallback = null; }
            var queryResult = null;
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
                    //queryResult = "ERROR : " + msg;
                    console.log("SS Exception on load " + path + "   MESSAGE : " + msg.statusText);
                    callback(callbackctxt, null);
                }
            });
        };
        FileTools.ReadHtmlFile = function (path, delegate, delegateParameters) {
            if (delegate === void 0) { delegate = null; }
            if (delegateParameters === void 0) { delegateParameters = null; }
            var queryResult = null;
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
                    //queryResult = "ERROR : " + msg;
                    // throw new Error(msg.statusText);
                    console.log("SS Exception on load " + path + "   MESSAGE : " + msg.statusText);
                }
            });
            return queryResult;
        };
        return FileTools;
    }());
    SS.FileTools = FileTools;
})(SS || (SS = {}));
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
            if (context.Path.indexOf(path) >= 0) {
                var databinding = context.Node.attributes["data-binding"];
                if (databinding != undefined) {
                    SS.BindingTools.EvaluateBinding(databinding.value, context.Node, function (a, b) { });
                }
            }
        };
        Binding.prototype.Dispose = function () {
            //SS.BindingTools.EvaluateBinding( null, this.Node, (a, b) => { });
            if (this._bindedObject.PropertyChanged != undefined) {
                this._bindedObject.PropertyChanged.Dettach(this.UpdateNodeOnContextChange);
            }
            this.Path = null;
            this.Node = null;
            this._bindedObject = null;
        };
        return Binding;
    }());
    SS.Binding = Binding;
})(SS || (SS = {}));
///<reference path="StringTools.ts" />
///<reference path="libs/jquery.d.ts" />
///<reference path="EventHandler.ts" />
///<reference path="Interfaces.ts" />
///<reference path="FileTools.ts" />
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
                delete node["SS-HasBindingCallBack"];
                if (node["data-binding-ids"] != undefined) {
                    var bindingsIds = node["data-binding-ids"];
                    for (var bindingId in bindingsIds) {
                        var binding = this.BindingDictionary[bindingId];
                        if (binding != undefined && binding.Node != null) {
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
                // skip loop if the property is from prototype
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
    }());
    SS.BindingGlobalContext = BindingGlobalContext;
})(SS || (SS = {}));
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
    function RevaluateDataContext(element) {
        var node = (typeof element) == "string" ? document.getElementById(element) : element;
        SS.BindingTools.DisposeBindings(node, false);
        ApplyBindings(node);
    }
    SS.RevaluateDataContext = RevaluateDataContext;
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
                BindingTools.EvaluateExpression(uriExpression, dataContextObject, node, false, function (ctxt2, result) {
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
            var rootNodeChildren = rootNode.children;
            for (var key in rootNodeChildren) {
                if (!rootNodeChildren.hasOwnProperty(key))
                    continue;
                BindingTools.DisposeBindingsRecursively(rootNodeChildren[key]);
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
                BindingTools.EvaluateExpression(dataTemplateAttributreValue, dataContextObject, node, false, function (ctxt2, templateExpression) {
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
                    if (htmlnode.hasAttribute("data-template-loaded")) {
                        var templateLoadedAttribute = htmlnode.getAttribute("data-template-loaded");
                        try {
                            eval(templateLoadedAttribute);
                        }
                        catch (ex) {
                            console.log("Evaluation error on data-template-loaded : " + templateLoadedAttribute + "  " + ex);
                        }
                    }
                };
                BindingTools.EvaluateExpression(dataSourceAttribute.value, dataContextObject, node, false, callback);
                //}
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
                BindingTools.EvaluateExpression(contextExpression, datacontext, contextNode, false, function (ctxt, datacontextvalue) {
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
                BindingTools.EvaluateExpression(bindingExpression, datacontext, ctxt, true, callback);
                var completedAttribute = node.attributes["data-binding-completed"];
                if (completedAttribute != undefined) {
                    var bindingCompletedAttribute = completedAttribute.value;
                    try {
                        eval(bindingCompletedAttribute);
                    }
                    catch (ex) {
                        console.log("Evaluation error on data-template-loaded : " + bindingCompletedAttribute + "  " + ex);
                    }
                }
            });
        };
        BindingTools.EvaluateExpression = function (expression, datacontext, contextNode, allowSideEffect, callback, expectObjectResult) {
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
                    transformed = BindingTools.EvaluateBindingExpression(element, datacontext, parent, false);
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
                        BindingTools.EvaluateExpression(postExpression, datacontext, parent, allowSideEffect, function (ctxt, postData) {
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
                    result[i] = BindingTools.EvaluateBindingExpression(elements[i], datacontext, contextNode, allowSideEffect);
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
                            case "p":
                            case "P":
                            case "Path":
                                path = param[1];
                                pathDefined = true;
                                break;
                            case "sen":
                            case "SEN":
                            case "SourceElementName":
                                source = document.getElementsByName(param[1]);
                                break;
                            case "sei":
                            case "SEI":
                            case "SourceElementId":
                                source = document.getElementById(param[1]);
                                break;
                            case "s":
                            case "S":
                            case "Source":
                                source = eval(param[1]);
                                break;
                            case "d":
                            case "D":
                            case "Destination":
                                destination = param[1];
                                break;
                            case "c":
                            case "C":
                            case "Converter":
                                converter = param[1];
                                break;
                            case "cp":
                            case "CP":
                            case "ConverterParameter":
                                converterParameter = param[1];
                                break;
                            case "sf":
                            case "SF":
                            case "StringFormat":
                                stringFormat = param[1];
                                break;
                            //case "RelativeSource":
                            //    break;
                            //case "FallbackValue":
                            //    break;
                            case "m":
                            case "M":
                            case "Mode":
                                mode = param[1];
                                break;
                            case "v":
                            case "V":
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
                if (path == '.') {
                    value = source;
                }
                else
                    try {
                        value = eval((sourceIsArray ? 'source' : 'source.') + path);
                        if (value == undefined) {
                            var camelised = path;
                            camelised = camelised[0].toLowerCase() + camelised.substr(1);
                            value = eval((sourceIsArray ? 'source' : 'source.') + camelised);
                        }
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
                    BindingTools.Bindings.CreateBinding(dataContextObject, path, htmlElement);
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
            if (allowSideEffects) {
                if (destination == "Content") {
                    //$(htmlElement).html(value);
                    htmlElement.innerHTML = value == null ? "" : value;
                }
                else {
                    if (mode == "TwoWay" && destination == "value")
                        htmlElement.value = value;
                    else
                        $(htmlElement).attr(destination, value);
                }
            }
            return value;
        };
        BindingTools.Bindings = new SS.BindingGlobalContext();
        BindingTools.knownTemplates = new Object();
        return BindingTools;
    }());
    SS.BindingTools = BindingTools;
})(SS || (SS = {}));
$(function () {
    SS.BindingTools.SetBindingsRecursively(document.body);
});
///<reference path="FileTools.ts"/>
// Module
var SS;
(function (SS) {
    //Class
    var ObjectTools = (function () {
        function ObjectTools() {
        }
        ObjectTools.CheckFileAPI = function () {
            // Check for the various File API support.
            if (window["File"] && window["FileReader"] && window["FileList"] && window["Blob"]
                && ObjectTools.supportsH264Video()) {
                // Great success! All the File APIs are supported.
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
                ObjectTools.DeleteChildren(node); //delete node's children
                if (node.parentNode) {
                    node.parentNode.removeChild(node); //remove the node from the DOM tree
                }
                //delete node; //clean up just to be sure
            }
        };
        ObjectTools.DeleteChildren = function (node) {
            if (node) {
                for (var x = node.childNodes.length - 1; x >= 0; x--) {
                    var childNode = node.childNodes[x];
                    if (childNode.hasChildNodes()) {
                        ObjectTools.DeleteChildren(childNode);
                    }
                    node.removeChild(childNode); //remove the child from the DOM tree
                    // delete childNode; //clean up just to be sure
                }
            }
        };
        return ObjectTools;
    }());
    SS.ObjectTools = ObjectTools;
})(SS || (SS = {}));
var SS;
(function (SS) {
    var StopWatch = (function () {
        // Constructor
        function StopWatch() {
            this._startTime = Date.now();
        }
        Object.defineProperty(StopWatch.prototype, "StartTime", {
            get: function () {
                return this._startTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StopWatch.prototype, "Elapsed", {
            get: function () {
                return Date.now() - this._startTime;
            },
            enumerable: true,
            configurable: true
        });
        return StopWatch;
    }());
    SS.StopWatch = StopWatch;
})(SS || (SS = {}));
//define regxps
//var regexp_email = "[A-Za-z0-9_-]+(.[A-Za-z0-9_-])*@([A-Za-z0-9-]+\\.)+[A-Za-z]{2,5}$";
//var regexp_notempty = "^.+$";
//var regexp_titleformat = "^[^/\";\\[\\]{}()_#~µ*¤@<>^\\\\§]{4,}$";
//var regexp_pseudo = "^[^/\";\\[\\]{}()_#~µ*¤@<>^\\\\§]{2,}$";
//var regexp_password = "^[^/\";\\[\\]{}()_#~µ*¤@<>^\\\\§]{6,}$";
//var regexp_chaine = "^([/w]+)$";
//var regexp_number = "^[0-9]+$";
//var regexp_zipCode = "^[0-9]{4,}$";
//var regexp_creditcardNumber = "^[0-9]{16}$";
//var regexp_creditcardExpiration = "^[0-9]{2}/[0-9]{2}$";
//var regexp_creditcardSecurityCode = "^[0-9]{3,4}$";
//var regexp_uri = "^((http://|https://)(([A-Za-z0-9-]+\\.)+[A-Za-z]{2,6}|localhost)){0,1}/[^ ]*$";
//function SetInputValidation(inputId, regExpString, originalText)
//{
//    var input = $(inputId);
//    input.set('value', originalText);
//    input.setStyle('color', 'gray');
//    input.setStyle('font-style', 'italic');
//    input.addEvent('click', function ()
//    {
//        if (this.getStyle('color') == 'gray')
//        {
//            this.setStyle('color', 'black');
//            this.setStyle('font-style', 'normal');
//            this.set('value', '');
//        }
//    });
//    input.addEvent('keydown', function ()
//    {
//        if (this.getStyle('color') == 'gray')
//        {
//            this.setStyle('color', 'black');
//            this.setStyle('font-style', 'normal');
//            this.set('value', '');
//        }
//        window.setTimeout(function ()
//        {
//            if (!input.get('value').test(regExpString))
//                input.setStyle('background-color', '#FFDDDD');
//            else
//                input.setStyle('background-color', '#DDFFDD');
//        }, 1);
//    });
//}
//function ShowHide(NodeID)
//{
//    var node = $(NodeID);
//    var actualDisplay = node.getStyle("display");
//    if (actualDisplay == "none")
//        node.setStyle("display", "block");
//    else
//        node.setStyle("display", "none");
//}
//# sourceMappingURL=silverscript.js.map