import type { ElementMaterialState } from '../enums/elementMaterialState';
import type { ElementType } from '../enums/elementType';
import type Vector2 from './vector2';

export abstract class Element {
    private color: string;
    private velocity: number;
    private elementHasMove: boolean;
    private lifetime: number;
    private elementType: ElementType;
    private elementMaterialState: ElementMaterialState;
    private toDestroy = false;

    constructor(elementType: ElementType, color: string, velocity: number, elementHasMove: boolean = false, lifetime: number) {
        this.color = color;
        this.velocity = velocity;
        this.elementHasMove = elementHasMove;
        this.lifetime = lifetime;
        this.elementType = elementType;
    }

    public setToDestroy(value: boolean): void {
        this.toDestroy = value;
    }

    public getToDestroy(): boolean {
        return this.toDestroy;
    }

    public setElementHasMove(value: boolean): void {
        this.elementHasMove = value;
    }

    public getElementHasMove(): boolean {
        return this.elementHasMove;
    }

    public getColor(): string {
        return this.color;
    }

    public getElementType(): ElementType {
        return this.elementType;
    }

    public getElementMaterialState(): ElementMaterialState {
        return this.elementMaterialState;
    }

    public setElementMaterialState(elt: ElementMaterialState) {
        this.elementMaterialState = elt;
    }

    public switchElement(currentX: number, currentY: number, nextX: number, nextY: number, elements: Element[][]): void {
        const currentElt = elements[currentX][currentY];
        const nextElt = elements[nextX][nextY];
        elements[currentX][currentY] = nextElt;
        elements[nextX][nextY] = currentElt;
    }

    abstract move(x: number, y: number, elements: Element[][], arraySize: number, elementToDraw: number[][]): void;
}