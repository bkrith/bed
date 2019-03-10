import { Type } from './type';
export declare class Field {
    optional: boolean;
    name: string;
    array: boolean;
    type: Type;
    constructor(name: string, type: string | object | string[] | object[]);
}
