import type { ElementMaterialState } from '../enums/elementMaterialState';
import { ElementWeight } from '../enums/elementWeight';

export abstract class Element {
    public x: number;
    public y: number;
    public pixelMovePerSecond: number;
    // public isFalling = false;

    private gravity = 20;
    private elementHasMove: boolean;
    private lifetime: number;
    private elementMaterialState: ElementMaterialState;
    private toDestroy = false;
    private velocity: number;

    constructor(velocity: number, elementHasMove: boolean = false, lifetime: number) {
        this.velocity = velocity;
        this.elementHasMove = elementHasMove;
        this.lifetime = lifetime;
    }

    abstract getColor(): string;

    abstract getType(): number;

    abstract isStatic(): boolean;

    abstract canMove(element: Element): boolean;

    abstract move(x: number, y: number, elements: Element[][], arraySize: number, elementToDraw: number[][], deltaTime: number): void;

    abstract getWeight(): number;

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

    public getElementMaterialState(): ElementMaterialState {
        return this.elementMaterialState;
    }

    public setElementMaterialState(elt: ElementMaterialState): void {
        this.elementMaterialState = elt;
    }

    public getVelocity(): number {
        return this.velocity;
    }

    public getGravity(): number {
        return this.gravity;
    }

    public setVelocity(value: number): void {
        this.velocity = value;
    }

    /*public switchElement(currentX: number, currentY: number, nextX: number, nextY: number, elements: Element[][]): void {
        const currentElt = elements[currentX][currentY];
        const nextElt = elements[nextX][nextY];
        elements[currentX][currentY] = nextElt;
        elements[nextX][nextY] = currentElt;
    }*/

    public checkBottom(deltaTime: number, x: number, y: number, elements: Element[][], arraySize: number): number {
        // const pixelPerframes = elements[x][y].pixelMovePerSecond / (1000 / deltaTime);
        const pixelPerframes = this.gravity / elements[x][y].getWeight();
        this.y += pixelPerframes;
        const newCalcY = Math.trunc(this.y);
        if (newCalcY == y) {
            return y;
        }
        if (newCalcY > y) {
            if (newCalcY < arraySize && this.canMove(elements[x][newCalcY])) {
                return newCalcY;
            }
        }
        this.y = y;
        return y;
    }

    public setNewElementPosition(currentX: number, currentY: number, nextX: number, nextY: number, elements: Element[][], elementToDraw: number[][]): void {
        if (!elements[nextX][nextY]) {
            const elt = elements[currentX][currentY];
            elements[nextX][nextY] = elt;
            elements[currentX][currentY] = null;
            elementToDraw[currentX][currentY] = 0;
            elementToDraw[nextX][nextY] = elt.getType();
            elt.setElementHasMove(true);
        }
    }
}