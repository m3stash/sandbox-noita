import type { ElementType } from "../enums/elementType";
import { MovableSolid } from "./movableSolid";
import { StaticSolid } from "./staticSolid";

export class Dirt extends StaticSolid {

    constructor(elementType: ElementType, color: string, velocity: number, isUpdate: boolean, lifetime: number) {
        super(elementType, color, velocity, isUpdate, lifetime);
    }

}