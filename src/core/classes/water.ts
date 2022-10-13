import { ElementType } from "../enums/elementType";
import { PixelColor } from "../enums/pixelColor";
import { Liquid } from './liquid';
import { ElementWeight } from '../enums/elementWeight';

export class Water extends Liquid {

    public getColor(): string {
        return PixelColor.WATER;
    }

    public getType(): number {
        return ElementType.WATER;
    }

    public isStatic(): boolean {
        return false;
    }

    public getWeight(): number {
        return ElementWeight.WATER;
    }

    constructor(velocity: number, isUpdate: boolean, lifetime: number) {
        super(velocity, isUpdate, lifetime);
        this.pixelMovePerSecond = 100;
    }

}