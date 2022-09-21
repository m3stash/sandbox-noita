import type { ElementType } from "../enums/elementType";
import { Liquid } from './liquid';

export class Water extends Liquid {

    constructor(elementType: ElementType, color: string, velocity: number, isUpdate: boolean, lifetime: number) {
        super(elementType, color, velocity, isUpdate, lifetime);
    }

}