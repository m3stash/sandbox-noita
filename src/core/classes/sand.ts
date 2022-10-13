import { ElementType } from "../enums/elementType";
import { PixelColor } from "../enums/pixelColor";
import { Solid } from "./solid";
import { ElementWeight } from '../enums/elementWeight';

export class Sand extends Solid {

    public getColor(): string {
        return PixelColor.SAND;
    }

    public getType(): number {
        return ElementType.SAND;
    }

    public isStatic(): boolean {
        return false;
    }

    public getWeight(): number {
        return ElementWeight.SAND;
    }

    constructor(velocity: number, isUpdate: boolean, lifetime: number) {
        super(velocity, isUpdate, lifetime);
        this.pixelMovePerSecond = 50;
    }

}