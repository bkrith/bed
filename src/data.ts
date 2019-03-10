'use strict';

export class Data {

    private _buffer: Buffer;
    private _length: number;

    constructor(capacity = 128) {
        this._buffer = Buffer.alloc(capacity);
        this._length = 0;
    }

    appendBuffer(data: Buffer) {
        this.alloc(data.length);
        data.copy(this._buffer, this._length);
        this._length += data.length;
    }

    writeUInt8(value: number) {
        this.alloc(1);
        this._buffer.writeUInt8(value, this._length);
        this._length++;
    }

    writeUInt16(value: number) {
        this.alloc(2);
        this._buffer.writeUInt16BE(value, this._length);
        this._length += 2;
    }

    writeUInt32(value: number) {
        this.alloc(4);
        this._buffer.writeUInt32BE(value, this._length);
        this._length += 4;
    }

    writeDouble(value: number) {
        this.alloc(8);
        this._buffer.writeDoubleBE(value, this._length);
        this._length += 8;
    }

    toBuffer(): Buffer {
        return this._buffer.slice(0, this._length);
    }

    private alloc(bytes: number) {
        let buffLen = this._buffer.length;
        let newBuffer: Buffer;

        if (this._length + bytes > buffLen) {
            do {
                buffLen *= 2;
            }
            while (this._length + bytes > buffLen);

            newBuffer = Buffer.alloc(buffLen);
            this._buffer.copy(newBuffer, 0, 0, this._length);
            this._buffer = newBuffer;
        }
    }

}