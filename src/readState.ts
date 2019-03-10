
'use strict';

export class ReadState {

    private _buffer: Buffer;
    public offset: number;

    constructor(buffer: Buffer) {
        this._buffer = buffer;
        this.offset = 0;
    }

    peekUInt8(): number {
        return this._buffer.readUInt8(this.offset);
    }

    readUInt8(): number {
        return this._buffer.readUInt8(this.offset++);
    }

    readUInt16(): number {
        const r = this._buffer.readUInt16BE(this.offset);
        this.offset += 2;
        return r;
    }

    readUInt32(): number {
        const r = this._buffer.readUInt32BE(this.offset);
        this.offset += 4;
        return r;
    }

    readDouble(): number {
        const r = this._buffer.readDoubleBE(this.offset);
        this.offset += 8;
        return r;
    }

    readBuffer(length: number): Buffer {
        if (this.offset + length > this._buffer.length) {
            throw new RangeError('Trying to access beyond buffer length');
        }
        const r = this._buffer.slice(this.offset, this.offset + length);
        this.offset += length;
        return r;
    }

    hasEnded(): boolean {
        return this.offset === this._buffer.length;
    }

}