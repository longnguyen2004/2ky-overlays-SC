export default class NPS {
    private _interval: number;
    private _timestamp: number[] = [];
    private _curTime: number = 0;

    constructor(interval = 1000) {
        this._interval = interval;
    }
    reset(time = 0) {
        this._timestamp = [];
        this._curTime = time;
    }
    update(time: number) {
        if (time < this._curTime)
            this._timestamp = []
        else
            this._timestamp = this._timestamp.filter(ts => ts >= time - this._interval);
        this._curTime = time;
    }
    add(count: number) {
        for (let i = 0; i < count; ++i)
            this._timestamp.push(this._curTime);
    }
    get() {
        return this._timestamp.length / this._interval;
    }
}