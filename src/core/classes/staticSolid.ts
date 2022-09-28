import { ElementMaterialState } from "../enums/elementMaterialState";
import type { ElementType } from "../enums/elementType";
import type { Element } from "./element";
import { Solid } from "./solid";

export class StaticSolid extends Solid {

    constructor(elementType: ElementType, color: string, velocity: number, isUpdate: boolean, lifetime: number) {
        super(elementType, color, velocity, isUpdate, lifetime);
    }

    public move(x: number, y: number, elements: Element[][], arraySize: number, elementToDraw: number[][]): void {
        return;
    }

    public canMove(element: Element): boolean {
        return false;
    }

}