import { ElementMaterialState } from '../enums/elementMaterialState';
import type { ElementType } from '../enums/elementType';
import { Element } from './element';
// import type Vector2 from './vector2';

export abstract class Solid extends Element {

    constructor(elementType: ElementType, color: string, velocity: number, isUpdate: boolean, lifetime: number) {
        super(elementType, color, velocity, isUpdate, lifetime);
        this.setElementMaterialState(ElementMaterialState.SOLID);
    }

    //abstract move(x: number, y: number, eltAtCell: Element): Vector2;

}