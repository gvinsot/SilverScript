///

// Module
module SS {
    export interface delegate {
        (context:any, args:any): void;
    }

    // Class
    export class EventHandler {
        private _invocationList: delegate[] = [];
        private _invocationContexts: any[] = [];
        // Constructor
        constructor() {
        }

        public Attach(delegateMethod: delegate, context: any): void {
            var key = this._invocationList.length;
            this._invocationList[key] = delegateMethod;
            this._invocationContexts[key] = context;
        }

        public Dettach(delegateMethod: delegate): void {
            for (var key in this._invocationList) {
                if (this._invocationList[key] == delegateMethod) {
                    this._invocationList[key] = null;
                }
            }
        }

        public FireEvent(args:any): void {
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
        }

        public Dispose(): void {
            this._invocationList = null;
            this._invocationContexts = null;
            this._invocationList = [];
            this._invocationContexts = [];
        }
    }

}
