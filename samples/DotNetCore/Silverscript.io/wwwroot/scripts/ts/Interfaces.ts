///<reference path="EventHandler.ts" />

module SS {
    // Interface
    export interface IDisposable {
        Dispose(): void;
    }

    export interface INotifyPropertyChanged {
        PropertyChanged: EventHandler;
    }

}
