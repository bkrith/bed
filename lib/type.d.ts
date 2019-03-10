/// <reference types="node" />
import { Data } from './data';
import { ReadState } from './readState';
export declare class Type {
    private TYPE;
    private fields;
    private type;
    private subType;
    constructor(type: any);
    encode(value: any): Buffer;
    decode(buffer: Buffer): any;
    write(value: any, data: Data, path: string): any;
    private writeArray;
    read(state: ReadState): any;
    getHash(): Buffer;
    private hashType;
    private compileRead;
    private readArray;
}
