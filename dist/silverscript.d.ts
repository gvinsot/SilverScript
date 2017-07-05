/// <reference path="../src/libs/jquery.d.ts" />
interface String {
    StartWith: (stringToTest: string) => boolean;
    EndWith: (stringToTest: string) => boolean;
    TrimStart: (toTrim: string) => string;
    TrimEnd: (toTrim: string) => string;
    TrimStartOnce: (toTrim: string) => string;
    TrimEndOnce: (toTrim: string) => string;
}
declare module SS {
    class StringTools {
        static StartWith(toTest: string, toSearch: string): boolean;
        static EndWith(toTest: string, toSearch: string): boolean;
        static TrimStart(original: string, toTrim: string): string;
        static TrimStartOnce(original: string, toTrim: string): string;
        static TrimEnd(original: string, toTrim: string): string;
        static TrimEndOnce(original: string, toTrim: string): string;
        static Json(json: any): string;
    }
}
declare module SS {
    interface delegate {
        (context: any, args: any): void;
    }
    class EventHandler {
        private _invocationList;
        private _invocationContexts;
        constructor();
        Attach(delegateMethod: delegate, context: any): void;
        Dettach(delegateMethod: delegate): void;
        FireEvent(args: any): void;
        Dispose(): void;
    }
}
declare module SS {
    interface IDisposable {
        Dispose(): void;
    }
    interface INotifyPropertyChanged {
        PropertyChanged: EventHandler;
    }
}
declare module SS {
    class FileTools {
        static FileExist(path: string): boolean;
        static PathCombine(path1: string, path2: string): string;
        static UrlCombine(absolteUrl: string, relativeUrl: string): string;
        static ReadJsonFile(path: string, callbackctxt: any, callback: delegate): void;
        static PostJsonFile(path: string, postdata: any, callbackctxt: any, callback: delegate, errorCallback?: delegate): void;
        static ReadHtmlFile(path: string, delegate?: any, delegateParameters?: any[]): any;
    }
}
declare module SS {
    class Binding implements IDisposable {
        Path: string;
        Node: HTMLElement;
        private _bindedObject;
        GetBindedObject(): any;
        SetBindedObject(value: any): void;
        UpdateNodeOnContextChange(context: Binding, args: any): void;
        constructor(path: string, node: HTMLElement, bindedObject: any);
        Dispose(): void;
    }
}
declare module SS {
    class BindingGlobalContext {
        BindingDictionary: any;
        CurrentBindingId: number;
        CreateBinding(bindedObject: any, path: string, node: HTMLElement): Binding;
        DisposeNodeBindings(node: any): void;
        GarbageCollectBindings(): void;
        IsAttachedToDOM(ref: HTMLElement): boolean;
    }
}
declare module SS {
    function SetTemplate(targetNode: any, uri: string, datacontextvalue?: any): void;
    function Navigate(contextNode: any, uriExpression: string): void;
    function GetDataContext(contextNode: any): any;
    function GetSourceParent(childNode: HTMLElement): Node;
    function PushDataContext(contextNode: any, uriExpression: string, context: any, callback: delegate): void;
    function ApplyBindings(nodeContext: any): void;
    function PropagateDataContext(sourceNode: HTMLElement, destinationNodeId: string): void;
    function SetDataContext(element: any, value: any): void;
    function RevaluateDataContext(element: string | HTMLElement): void;
    function SetDataContextProperty(element: any, path: string, value: any): void;
    function RaiseDataContextChanged(element: HTMLElement, propertyName: string): void;
    class BindingTools {
        static Bindings: BindingGlobalContext;
        static SetTemplate(targetNode: any, uri: string, datacontextvalue?: any): void;
        static FireDataContextChanged(context: any, args: any): void;
        static Navigate(contextNode: any, uriExpression: string): void;
        static DisposeBindings(rootNode: any, skiprootNode?: boolean): void;
        static DisposeBindingsRecursively(rootNode: HTMLElement, skiprootNode?: boolean): void;
        static SetDataContext(nodeForContext: any, value: any, applyBindings?: boolean): void;
        static SetBindingsRecursively(rootNode: HTMLElement, skipCurrentNode?: boolean): void;
        private static SetBindingsOnChildrenNodes(rootNode);
        static GetParentContext(node: any): Node;
        static GetItemsSourceContext(node: Node): Node;
        private static knownTemplates;
        private static EvaluateTemplate(bindingExpression, node);
        private static EvaluateTemplatePart2(templateString, args);
        static EvaluateDataContext(node: any, callback: delegate): void;
        static EvaluateBinding(bindingExpression: string, node: Node, callback: delegate): void;
        private static EvaluateExpression(expression, datacontext, contextNode, allowSideEffect, callback, expectObjectResult?);
        private static EvaluateBindingExpression(bindingExpression, dataContextObject, node, allowSideEffects);
    }
}
declare module SS {
    class ObjectTools {
        static CheckFileAPI(): boolean;
        static supportsH264Video(): boolean;
        static ConvertJsonToDate(sourceString: string): Date;
        static ConvertJsonTimeSpanToDate(sourceString: string): Date;
        static Any(list: Object[], condition: any): boolean;
        static Count(list: Object[], condition: any): number;
        static DeleteNode(node: any): void;
        static DeleteChildren(node: any): void;
    }
}
declare module SS {
}
declare module SS {
    class StopWatch {
        _startTime: number;
        constructor();
        readonly StartTime: number;
        readonly Elapsed: number;
    }
}
