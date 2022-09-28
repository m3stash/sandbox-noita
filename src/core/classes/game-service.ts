import { EventBus } from './event-bus';
import { ElementColor } from "../enums/elementColor";
import { ElementType } from '../enums/elementType';
import { Sand } from './sand';
import type { Element } from './element';
import { Water } from './water';
import { Dirt } from './dirt';

class GameSvc {

    private eventBus = new EventBus('noita-sandox');
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private lastFrameTimeStamp = performance.now();
    private canvasWidth: number;
    private canvasHeight: number;
    private fpsMax: number = 60;
    private static _instance: GameSvc;
    private elements: Element[][] = [];
    private elementsToDraw: number[][] = [];
    private mouseClick = false;
    private currentElementType: ElementType = ElementType.SAND;
    private toUpdate = {};

    private interval;

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    private pressEventHandler = (e: MouseEvent | TouchEvent) => {
        if (!this.mouseClick) return;
        let mouseX = (e as TouchEvent).changedTouches ?
            (e as TouchEvent).changedTouches[0].pageX :
            (e as MouseEvent).pageX;
        let mouseY = (e as TouchEvent).changedTouches ?
            (e as TouchEvent).changedTouches[0].pageY :
            (e as MouseEvent).pageY;
        mouseX -= this.canvas.offsetLeft;
        mouseY -= this.canvas.offsetTop;
        if (mouseX < 0 || mouseX > this.canvasWidth - 1 || mouseY < 0 || mouseY > this.canvasHeight - 1) return;

        if (!this.elements[mouseX][mouseY]) {
            switch (this.currentElementType) {
                case 1:
                    this.elements[mouseX][mouseY] = new Sand(ElementType.SAND, ElementColor[this.currentElementType], 1, false, 0);
                    break;
                case 2:
                    this.elements[mouseX][mouseY] = new Water(ElementType.WATER, ElementColor[this.currentElementType], 1, false, 0);
                    break;
                case 3:
                    this.elements[mouseX][mouseY] = new Dirt(ElementType.DIRT, ElementColor[this.currentElementType], 1, false, 0);
                    break;
            }
            this.elements[mouseX][mouseY].x = mouseX;
            this.elements[mouseX][mouseY].y = mouseY;
            this.elements[mouseX][mouseY].setElementHasMove(true);
            this.elementsToDraw[mouseX][mouseY] = this.currentElementType;
        }
    }

    private setCanvasCtx(): void {
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
        this.context = this.canvas.getContext("2d");
        //this.canvas.addEventListener("click", this.pressEventHandler);
        this.canvas.addEventListener("mousemove", this.pressEventHandler);
        this.canvas.addEventListener("mousedown", () => this.mouseClick = true);
        this.canvas.addEventListener("mouseup", () => this.mouseClick = false);
    }

    // to rewrite..
    /*private drawFps(): void {
        const now = performance.now();
        const delta = now - this.lastFrameTimeStamp;
        this.lastFrameTimeStamp = now;
        const fps = Math.floor(1 / delta * 1000);
        // Draw number to the screen
        this.context.font = "22px Arial";
        this.context.fillStyle = 'white';
        this.context.fillRect(0, 0, this.canvas.height, this.canvas.width);
        this.context.fillStyle = 'black';
        this.context.fillText(`FPS: ${Math.floor(fps)}`, 10, 30);
    }*/

    private init2DArray<T>(array: T[][], size: number): void {
        for (let i: number = 0; i < size; i++) {
            array[i] = [];
            for (let j: number = 0; j < size; j++) {
                array[i][j] = null;
            }
        }
    }

    private removeDirtyParticule(): void {
        for (let x = 0; x < this.canvasWidth; x++) {
            for (let y = 0; y < this.canvasHeight; y++) {
                if (this.elements[x][y]) {
                    this.elements[x][y].setElementHasMove(false);
                };
            }
        }
    }

    private gameLoop(timeStamp): void {
        // setTimeout(() => {
        const now = performance.now();
        const deltaTime = now - this.lastFrameTimeStamp;
        this.lastFrameTimeStamp = now;
        // this.drawFps();
        this.removeDirtyParticule();
        for (let y = 0; y < this.canvasHeight; y++) {
            for (let x = this.canvasWidth - 1; x > 0; x--) {
                this.draw(x, y);
                this.move(x, y, deltaTime);
            }
        }
        requestAnimationFrame(this.gameLoop.bind(this));
        // }, 1000 / this.fpsMax);
    }

    private draw(x: number, y: number): void {
        const eltToDraw = this.elementsToDraw[x][y];
        if (eltToDraw != null && eltToDraw >= 0) {
            switch (eltToDraw) {
                case 0:
                    this.context.clearRect(x, y, 1, 1);
                    break;
                case 1:
                    this.context.fillStyle = '#C2B280';
                    this.context.fillRect(x, y, 1, 1);
                    break;
                case 2:
                    this.context.fillStyle = 'aqua';
                    this.context.fillRect(x, y, 1, 1);
                    break;
                case 3:
                    this.context.fillStyle = 'grey';
                    this.context.fillRect(x, y, 1, 1);
                    break;
                case 30:
                    this.context.fillStyle = 'blueviolet';
                    this.context.fillRect(x, y, 1, 1);
                    break;
            }
            this.elementsToDraw[x][y] = null;
        }
    }

    private move(x: number, y: number, deltaTime: number): void {
        const elt = this.elements[x][y];
        if (elt && !elt.getElementHasMove()) {
            this.elements[x][y].move(x, y, this.elements, this.canvasWidth, this.elementsToDraw, deltaTime);
        }
    }

    public isOutOfBound(x: number, y: number): boolean {
        if (y > this.canvasHeight - 1 || x < 0 || x > this.canvasWidth - 1 || y < 0) {
            return true;
        }
        return false;
    }

    public init(): void {
        window['eventBus'] = this.eventBus;
        this.eventBus.on('elementType', (event: CustomEvent) => { this.currentElementType = event.detail; });
        this.setCanvasCtx();
        this.init2DArray(this.elements, this.canvasWidth);
        this.init2DArray(this.elementsToDraw, this.canvasWidth);
        requestAnimationFrame((t) => this.gameLoop(t));
    }

}

export const GameService = GameSvc.Instance;