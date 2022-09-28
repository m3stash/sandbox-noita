import { debug } from 'svelte/internal';
import type { ElementMaterialState } from '../enums/elementMaterialState';
import type { ElementType } from '../enums/elementType';

export abstract class Element {
    public x: number;
    public y: number;
    public pixelMovePerSecond: number;
    // public isFalling = false;

    private color: string;
    private elementHasMove: boolean;
    private lifetime: number;
    private elementType: ElementType;
    private elementMaterialState: ElementMaterialState;
    private toDestroy = false;
    private velocity: number;
    private gravity: number;

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

    public setGravity(value: number): void {
        this.gravity = value;
    }

    public switchElement(currentX: number, currentY: number, nextX: number, nextY: number, elements: Element[][]): void {
        const currentElt = elements[currentX][currentY];
        const nextElt = elements[nextX][nextY];
        elements[currentX][currentY] = nextElt;
        elements[nextX][nextY] = currentElt;
    }

    public checkBottom(deltaTime: number, x: number, y: number, elements: Element[][], arraySize: number): number {
        const pixelPerframes = elements[x][y].pixelMovePerSecond / (1000 / deltaTime);
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
            elementToDraw[nextX][nextY] = elt.getElementType();
            elt.setElementHasMove(true);
        }
    }

    abstract canMove(element: Element): boolean;

    abstract move(x: number, y: number, elements: Element[][], arraySize: number, elementToDraw: number[][], deltaTime: number): void;
}