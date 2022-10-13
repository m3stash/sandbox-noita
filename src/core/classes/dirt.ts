import { ElementType } from "../enums/elementType";
import { ElementWeight } from "../enums/elementWeight";
import { PixelColor } from "../enums/pixelColor";
import { Solid } from "./solid";

export class Dirt extends Solid {

    public getColor(): string {
        return PixelColor.DIRT;
    }

    public getType(): number {
        return ElementType.DIRT;
    }

    public isStatic(): boolean {
        return true;
    }

    public getWeight(): number {
        return ElementWeight.DEFAUT;
    }

    constructor(velocity: number, isUpdate: boolean, lifetime: number) {
        super(velocity, isUpdate, lifetime);
    }

}