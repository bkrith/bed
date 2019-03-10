
'use strict';

import { Type } from './type';

export class Field {

    public optional: boolean;
    public name: string;
    public array: boolean;
    public type: Type;

    constructor(name: string, type: string | object | string[] | object[]) {
        this.optional = false;

        if (name[name.length - 1] === '?') {
            this.optional = true;
            name = name.substr(0, name.length - 1);
        }

        this.name = name;
        this.array = Array.isArray(type);

        if (Array.isArray(type) && type.length !== 1) {
            throw new TypeError('Invalid array type, it must have exactly one element');
        }

        if (Array.isArray(type)) type = type[0];

        this.type = new Type(type);
    }

}