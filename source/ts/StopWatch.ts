module SS {

    export class StopWatch {
        public _startTime: number;
        // Constructor
        constructor() {
            this._startTime = Date.now();
        }
        public get StartTime(): number {
            return this._startTime;
        }
        public get Elapsed(): number {
            return Date.now() - this._startTime;
        }
    }
}