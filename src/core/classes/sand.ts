import type { ElementType } from "../enums/elementType";
import { MovableSolid } from "./movableSolid";

export class Sand extends MovableSolid {

    constructor(elementType: ElementType, color: string, velocity: number, isUpdate: boolean, lifetime: number) {
        super(elementType, color, velocity, isUpdate, lifetime);
        this.setGravity(0.3);
        // this.setVelocity(0.3);
        this.pixelMovePerSecond = 50;
    }

}