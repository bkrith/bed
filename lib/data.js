'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class Data {
    constructor(capacity = 128) {
        this._buffer = Buffer.alloc(capacity);
        this._length = 0;
    }
    appendBuffer(data) {
        this.alloc(data.length);
        data.copy(this._buffer, this._length);
        this._length += data.length;
    }
    writeUInt8(value) {
        this.alloc(1);
        this._buffer.writeUInt8(value, this._length);
        this._length++;
    }
    writeUInt16(value) {
        this.alloc(2);
        this._buffer.writeUInt16BE(value, this._length);
        this._length += 2;
    }
    writeUInt32(value) {
        this.alloc(4);
        this._buffer.writeUInt32BE(value, this._length);
        this._length += 4;
    }
    writeDouble(value) {
        this.alloc(8);
        this._buffer.writeDoubleBE(value, this._length);
        this._length += 8;
    }
    toBuffer() {
        return this._buffer.slice(0, this._length);
    }
    alloc(bytes) {
        let buffLen = this._buffer.length;
        let newBuffer;
        if (this._length + bytes > buffLen) {
            do {
                buffLen *= 2;
            } while (this._length + bytes > buffLen);
            newBuffer = Buffer.alloc(buffLen);
            this._buffer.copy(newBuffer, 0, 0, this._length);
            this._buffer = newBuffer;
        }
    }
}
exports.Data = Data;
