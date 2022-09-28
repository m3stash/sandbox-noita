import { ElementMaterialState } from "../enums/elementMaterialState";
import type { ElementType } from "../enums/elementType";
import type { Element } from "./element";
import { Solid } from "./solid";

export class MovableSolid extends Solid {

    constructor(elementType: ElementType, color: string, velocity: number, isUpdate: boolean, lifetime: number) {
        super(elementType, color, velocity, isUpdate, lifetime);
    }

    public move(x: number, y: number, elements: Element[][], arraySize: number, elementToDraw: number[][], deltaTime: number): void {

        const noboundBottom = y < arraySize - 1;

        if (y + 1 < arraySize && (!elements[x][y + 1] || elements[x][y + 1].getElementMaterialState() == ElementMaterialState.LIQUID)) { // bottom
            const yPosByGravity = this.checkBottom(deltaTime, x, y, elements, arraySize);
            this.setNewPosition(x, y, x, yPosByGravity, elements, elementToDraw);
        } else if (noboundBottom && x > 0 && (!elements[x - 1][y + 1] || elements[x - 1][y + 1].getElementMaterialState() == ElementMaterialState.LIQUID)) { // Left bottom
            debugger
            this.setNewPosition(x, y, x - 1, y + 1, elements, elementToDraw);
        } else if (noboundBottom && x < arraySize - 1 && (!elements[x + 1][y + 1] || elements[x + 1][y + 1].getElementMaterialState() == ElementMaterialState.LIQUID)) { // Right bottom
            this.setNewPosition(x, y, x + 1, y + 1, elements, elementToDraw);
        }
    }

    public canMove(element: Element): boolean {
        if (!element || element.getElementMaterialState() == ElementMaterialState.LIQUID) {
            return true;
        }
        return false;
    }

    public setNewPosition(currentX: number, currentY: number, nextX: number, nextY: number, elements: Element[][], elementToDraw: number[][]): void {
        const nextElement = elements[nextX][nextY];
        // check if next position is void
        this.setNewElementPosition(currentX, currentY, nextX, nextY, elements, elementToDraw);
        // else check if current element can replace the next element
        if (elements[nextX][nextY].getElementMaterialState() == ElementMaterialState.LIQUID) {
            const elt = elements[currentX][currentY];
            elements[nextX][nextY] = elt;
            elements[currentX][currentY] = nextElement;
            elementToDraw[currentX][currentY] = nextElement.getElementType();
            elementToDraw[nextX][nextY] = elt.getElementType();
            // elementToDraw[nextX][nextY] = 30; // sand To Water
            elt.setElementHasMove(true);
            nextElement.setElementHasMove(true);
        }
    }

}