import { is_svg } from "svelte/types/shared/utils/names";
import { ElementMaterialState } from "../enums/elementMaterialState";
import { ElementType } from "../enums/elementType";
import type { Element } from "./element";
import { Solid } from "./solid";

export class MovableSolid extends Solid {

    constructor(elementType: ElementType, color: string, velocity: number, isUpdate: boolean, lifetime: number) {
        super(elementType, color, velocity, isUpdate, lifetime);
    }

    public move(x: number, y: number, elements: Element[][], arraySize: number, elementToDraw: number[][], deltaTime: number): void {
        const noboundBottom = y < arraySize - 1;
        if (noboundBottom && (!elements[x][y + 1] || elements[x][y + 1].getElementMaterialState() == ElementMaterialState.LIQUID)) {
            // bottom
            const elt = elements[x][y];
            if (elt) {
                const speed = 0.5;
                // const vx = elements[x][y].posX += 0.5;
                // const vy = elements[x][y].posY += 0.5;
                const move = 1 * deltaTime * speed;
                //console.log(move);
                // console.log(move);
            }
            this.getNewPosition(x, y, x, y + 1, elements, elementToDraw);
        } else if (noboundBottom && x > 0 && (!elements[x - 1][y + 1] || elements[x - 1][y + 1].getElementMaterialState() == ElementMaterialState.LIQUID)) {
            // Left bottom
            this.getNewPosition(x, y, x - 1, y + 1, elements, elementToDraw);
        } else if (noboundBottom && x < arraySize - 1 && (!elements[x + 1][y + 1] || elements[x + 1][y + 1].getElementMaterialState() == ElementMaterialState.LIQUID)) {
            // Right bottom
            this.getNewPosition(x, y, x + 1, y + 1, elements, elementToDraw);
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
            elt.posX = nextX;
            elt.posY = nextY;
            elt.setElementHasMove(true);
            return;
        }
        if (nextElement.getElementMaterialState() == ElementMaterialState.LIQUID) {
            const elt = elements[currentX][currentY];
            elements[nextX][nextY] = elt;
            elements[currentX][currentY] = nextElement;
            elementToDraw[currentX][currentY] = Number(ElementType[nextElement.getElementType()]);
            elementToDraw[nextX][nextY] = Number(ElementType[elt.getElementType()]);
            // elementToDraw[nextX][nextY] = 30; // sand To Water
            elt.setElementHasMove(true);
            nextElement.setElementHasMove(true);
            return;
        }
    }

}