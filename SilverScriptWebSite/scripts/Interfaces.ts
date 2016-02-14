///<reference path="EventHandler.ts" />

module SilverScriptTools {
    // Interface
    export interface IDisposable {
        Dispose(): void;
    }

    export interface INotifyPropertyChanged {
        PropertyChanged: EventHandler;
    }

}
