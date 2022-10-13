import { ElementMaterialState } from '../enums/elementMaterialState';
import { Element } from './element';

export abstract class Liquid extends Element {

    constructor(velocity: number, isUpdate: boolean, lifetime: number) {
        super(velocity, isUpdate, lifetime);
        this.setElementMaterialState(ElementMaterialState.LIQUID);
    }

    public move(x: number, y: number, elements: Element[][], arraySize: number, elementToDraw: number[][], deltaTime: number): void {
        if (this.isStatic()) return;

        const noboundBottom = y < arraySize - 1;

        if (y + 1 < arraySize && (!elements[x][y + 1])) { // Down
            const yPosByGravity = this.checkBottom(deltaTime, x, y, elements, arraySize);
            this.setNewPosition(x, y, x, yPosByGravity, elements, elementToDraw);
        } else if (noboundBottom && x > 0 && !elements[x - 1][y + 1]) { // Left bottom
            this.setNewPosition(x, y, x - 1, y + 1, elements, elementToDraw);
        } else if (noboundBottom && x < arraySize - 1 && !elements[x + 1][y + 1]) { // Right bottom
            this.setNewPosition(x, y, x + 1, y + 1, elements, elementToDraw);
        } else if (x > 0 && !elements[x - 1][y]) { // Left
            this.setNewPosition(x, y, x - 1, y, elements, elementToDraw);
        } else if (x < arraySize - 1 && !elements[x + 1][y]) { // Right
            this.setNewPosition(x, y, x + 1, y, elements, elementToDraw);
        }
    }

    public canMove(element: Element): boolean {
        if (!element && !this.isStatic() || element.getElementMaterialState() == ElementMaterialState.LIQUID) return true;
        return false;
    }

    public setNewPosition(currentX: number, currentY: number, nextX: number, nextY: number, elements: Element[][], elementToDraw: number[][]): void {
        // check if next position is void
        this.setNewElementPosition(currentX, currentY, nextX, nextY, elements, elementToDraw);
        // else check if current element can replace the next element
        if (elements[currentX][currentY] && elements[nextX][nextY].getElementMaterialState() == ElementMaterialState.LIQUID) {
            const nextElement = elements[nextX][nextY];
            const elt = elements[currentX][currentY];
            elements[nextX][nextY] = elt;
            elements[currentX][currentY] = nextElement;
            elementToDraw[currentX][currentY] = nextElement.getType();
            elementToDraw[nextX][nextY] = elt.getType();
            // elementToDraw[nextX][nextY] = 30; // sand To Water
            elt.setElementHasMove(true);
            nextElement.setElementHasMove(true);
        }
    }

}