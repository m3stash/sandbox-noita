import { ElementMaterialState } from '../enums/elementMaterialState';
import { ElementType } from '../enums/elementType';
import { Element } from './element';

export abstract class Liquid extends Element {

    constructor(elementType: ElementType, color: string, velocity: number, isUpdate: boolean, lifetime: number) {
        super(elementType, color, velocity, isUpdate, lifetime);
        this.setElementMaterialState(ElementMaterialState.LIQUID);
    }

    public move(x: number, y: number, elements: Element[][], arraySize: number, elementToDraw: number[][]): void {
        let newPos: number;
        const noboundBottom = y < arraySize - 1;
        if (noboundBottom && !elements[x][y + 1]) {
            // Down
            // elements[x][y + 1] = elements[x][y];
            this.getNewPosition(x, y, x, y + 1, elements, elementToDraw);
        } else if (noboundBottom && x > 0 && !elements[x - 1][y + 1]) {
            // Left bottom
            // elements[x - 1][y + 1] = elements[x][y];
            this.getNewPosition(x, y, x - 1, y + 1, elements, elementToDraw);
        } else if (noboundBottom && x < arraySize - 1 && !elements[x + 1][y + 1]) {
            // Right bottom
            // elements[x + 1][y + 1] = elements[x][y];
            this.getNewPosition(x, y, x + 1, y + 1, elements, elementToDraw);
        } else if (x > 0 && !elements[x - 1][y]) {
            // Left
            // elements[x - 1][y] = elements[x][y];
            this.getNewPosition(x, y, x - 1, y, elements, elementToDraw);
        } else if (x < arraySize - 1 && !elements[x + 1][y]) {
            // Right
            // elements[x + 1][y] = elements[x][y];
            this.getNewPosition(x, y, x + 1, y, elements, elementToDraw);
        }
    }

    public getNewPosition(currentX: number, currentY: number, nextX: number, nextY: number, elements: Element[][], elementToDraw: number[][]): void {
        const nextElement = elements[nextX][nextY];
        if (!nextElement) {
            const elt = elements[currentX][currentY];
            elements[nextX][nextY] = elt;
            elements[currentX][currentY] = null;
            elementToDraw[currentX][currentY] = 0;
            elementToDraw[nextX][nextY] = Number(ElementType[elt.getElementType()]);
            elt.setElementHasMove(true);
            return;
        }
    }

}