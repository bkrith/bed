/// <reference types="node" />
export declare class Data {
    private _buffer;
    private _length;
    constructor(capacity?: number);
    appendBuffer(data: Buffer): void;
    writeUInt8(value: number): void;
    writeUInt16(value: number): void;
    writeUInt32(value: number): void;
    writeDouble(value: number): void;
    toBuffer(): Buffer;
    private alloc;
}
