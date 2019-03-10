/// <reference types="node" />
export declare class ReadState {
    private _buffer;
    offset: number;
    constructor(buffer: Buffer);
    peekUInt8(): number;
    readUInt8(): number;
    readUInt16(): number;
    readUInt32(): number;
    readDouble(): number;
    readBuffer(length: number): Buffer;
    hasEnded(): boolean;
}
