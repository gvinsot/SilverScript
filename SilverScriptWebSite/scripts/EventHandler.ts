///

// Module
module SilverScriptTools {
    export interface delegate {
        (): void;
    }

    // Class
    export class EventHandler {
        private _invocationList: delegate[] = [];
        // Constructor
        constructor() {
        }

        public Attach(delegateMethod: delegate): void {
            this._invocationList[this._invocationList.length] = delegateMethod;
        }

        public Dettach(delegateMethod: delegate): void {
            for (var key in this._invocationList) {
                if (this._invocationList[key] == delegateMethod) {
                    this._invocationList[key] = null;
                }
            }
        }

        public FireEvent(): void {
            for (var invocationKey in this._invocationList) {
                var invocation = this._invocationList[invocationKey];
                if (invocation != null) {
                    try {
                        invocation();
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
            this._invocationList = [];
        }
    }

}
