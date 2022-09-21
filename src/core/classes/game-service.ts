import { EventBus } from './event-bus';
import { ElementColor } from "../enums/elementColor";
import { ElementType } from '../enums/elementType';
import Particule from "./particule";
import Vector2 from './vector2';

class GameSvc {

    private eventBus = new EventBus('noita-sandox');
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private lastFrameTimeStamp = performance.now();
    private canvasWidth: number;
    private canvasHeight: number;
    private fpsMax: number = 60;
    private static _instance: GameSvc;
    private particules: Particule[][] = [];
    private mouseClick = false;
    private currentElementType: ElementType = ElementType.SAND;
    private waterParicules: Particule[] = [];

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
        if (!this.particules[mouseX + 1][mouseY]) {
            this.particules[mouseX + 1][mouseY] = new Particule(1, ElementType[this.currentElementType], ElementColor[this.currentElementType], 1, false, 0);
        }
        if (!this.particules[mouseX][mouseY + 1]) {
            this.particules[mouseX][mouseY + 1] = new Particule(1, ElementType[this.currentElementType], ElementColor[this.currentElementType], 1, false, 0);
        }
        if (!this.particules[mouseX][mouseY]) {
            this.particules[mouseX][mouseY] = new Particule(1, ElementType[this.currentElementType], ElementColor[this.currentElementType], 1, false, 0);
        }
        if (!this.particules[mouseX + 1][mouseY + 1]) {
            this.particules[mouseX + 1][mouseY + 1] = new Particule(1, ElementType[this.currentElementType], ElementColor[this.currentElementType], 1, false, 0);
        }
    }

    private setCanvasCtx(): void {
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
        this.context = this.canvas.getContext("2d");
        this.canvas.addEventListener("mousemove", this.pressEventHandler);
        this.canvas.addEventListener("mousedown", () => this.mouseClick = true);
        this.canvas.addEventListener("mouseup", () => this.mouseClick = false);
    }

    private drawFps(): void {
        /*const now = performance.now();
        const delta = now - this.lastFrameTimeStamp;
        this.lastFrameTimeStamp = now;
        const fps = Math.floor(1 / delta * 1000);

        // Draw number to the screen
        this.context.font = "22px Arial";
        this.context.fillStyle = 'white';
        this.context.fillRect(0, 0, this.canvas.height, this.canvas.width);
        this.context.fillStyle = 'black';
        this.context.fillText(`FPS: ${Math.floor(fps)}`, 10, 30);*/
    }

    private initParticule2DArray(): void {
        for (let i: number = 0; i < this.canvasWidth; i++) {
            this.particules[i] = [];
            for (let j: number = 0; j < this.canvasHeight; j++) {
                this.particules[i][j] = null;
            }
        }
    }

    private removeDirtyParticule(): void {
        for (let x = 0; x < this.canvasWidth; x++) {
            for (let y = 0; y < this.canvasHeight; y++) {
                if (this.particules[x][y]) {
                    this.particules[x][y].setIsUpdate(false);
                };
            }
        }
    }

    private drawElements(x: number, y: number): void {
        let particule = this.particules[x][y];
        if (particule && !particule.getIsUpdate()) {
            if (particule.getElementType() == ElementType.DIRT) {
                this.context.fillStyle = particule.getColor();
                this.context.fillRect(x, y, 1, 1);
            } else {
                const newPos = this.moveElement(particule.getElementType(), x, y);
                if (newPos) {
                    this.context.clearRect(x, y, 1, 1);
                    particule.setIsUpdate(true);
                    this.particules[newPos.x][newPos.y] = particule;
                    this.particules[x][y] = null;
                    this.context.fillStyle = particule.getColor();
                    this.context.fillRect(newPos.x, newPos.y, 1, 1);
                }
            }
        }
    }

    private gameLoop(timeStamp): void {
        const now = performance.now();
        const deltaTime = now - this.lastFrameTimeStamp;
        this.lastFrameTimeStamp = now;
        // rb.velocity += new Vector3(move.x * speed, 0, 0);
        // body.velocity = (transform.forward * vertical) * speed * Time.fixedDeltaTime;
        //const velocity = 1 * deltaTime;
        //console.log(velocity);
        // velocity / gravity

        setTimeout(() => {
            requestAnimationFrame(this.gameLoop.bind(this));
            //this.drawFps();
            this.removeDirtyParticule();
            for (let y = 0; y < this.canvasHeight; y++) {
                if (y % 2 == 0 ? true : false) {
                    for (let x = 0; x < this.canvasWidth; x++) {
                        this.drawElements(x, y);
                    }
                } else {
                    for (let x = this.canvasWidth - 1; x > 0; x--) {
                        let particule = this.particules[x][y];
                        this.drawElements(x, y);
                    }
                }
            }
        }, 1000 / this.fpsMax);
    }

    private moveElement(elt: ElementType, x: number, y: number): Vector2 {
        switch (elt) {
            case ElementType.SAND:
                return this.moveSand(x, y);
            case ElementType.WATER:
                return this.moveWater(x, y);
            default:
                return this.moveSand(x, y);
        }
    }

    private moveWater(x: number, y: number): Vector2 {
        let newPos: number;
        const noboundBottom = y < this.canvasHeight - 1;
        if (noboundBottom && !this.particules[x][y + 1]) {
            // Down
            return new Vector2(x, y + 1);
        } else if (noboundBottom && x > 0 && !this.particules[x - 1][y + 1]) {
            // Left bottom
            return new Vector2(x - 1, y + 1);
        } else if (noboundBottom && x < this.canvasWidth - 1 && !this.particules[x + 1][y + 1]) {
            // Right bottom
            return new Vector2(x + 1, y + 1);
        } else if (x > 0 && !this.particules[x - 1][y]) {
            // Left
            return new Vector2(x - 1, y);
        } else if (x < this.canvasWidth - 1 && !this.particules[x + 1][y]) {
            // Right
            return new Vector2(x + 1, y);
        } else {
            return null;
        }
    }

    public isOutOfBound(x: number, y: number): boolean {
        if (y > this.canvasHeight - 1 || x < 0 || x > this.canvasWidth - 1 || y < 0) {
            return true;
        }
        return false;
    }

    /*public recursiveFindPlace(x: number, y: number, visitedCol: boolean[][]): void {
        if (this.isOutOfBound(x, y) || visitedCol[x][y]) {
            return;
        }
        if (!this.particules[x][y]) {
            // newPos = new Vector2(x, y);
        }
        visitedCol[x][y] = true;
        this.recursiveFindPlace(x + 1, y, visitedCol);
        this.recursiveFindPlace(x, y + 1, visitedCol);
        this.recursiveFindPlace(x - 1, y, visitedCol);
        this.recursiveFindPlace(x, y - 1, visitedCol);
    }*/

    private canMoveOrCreateNewParticule(nextX: number, nextY: number, currentElt: ElementType, currentX: number, currentY: number): boolean {
        const eltToReplace = this.particules[nextX][nextY];
        if (!eltToReplace) return true;
        switch (currentElt) {
            case (ElementType.SAND):
                if (eltToReplace.getElementType() == ElementType.WATER) {
                    // on bouge l'eau dans une autre array ???????
                    // this.waterParicules.push(nextElt);
                    for (let y = nextY; y > 0; y--) {
                        if (!this.particules[nextX][y]) {
                            this.particules[nextX][y] = eltToReplace;
                            eltToReplace.setIsUpdate(false);
                            this.particules[nextX][nextY] = null;
                            break;
                        }
                    }

                    return true;
                }
                return false;
            default:
                return false;
        }
    }

    private moveSand(x: number, y: number): Vector2 {
        let newPos: number;
        const noboundBottom = y < this.canvasHeight - 1;
        if (noboundBottom && this.canMoveOrCreateNewParticule(x, y + 1, this.particules[x][y].getElementType(), x, y)) {
            // Down
            return new Vector2(x, y + 1);
        } else if (noboundBottom && x > 0 && this.canMoveOrCreateNewParticule(x - 1, y + 1, this.particules[x][y].getElementType(), x, y)) {
            // Left bottom
            return new Vector2(x - 1, y + 1);
        } else if (noboundBottom && x < this.canvasWidth - 1 && this.canMoveOrCreateNewParticule(x + 1, y + 1, this.particules[x][y].getElementType(), x, y)) {
            // Right bottom
            return new Vector2(x + 1, y + 1);
        } else {
            return null;
        }
    }

    public init(): void {
        window['eventBus'] = this.eventBus;
        this.eventBus.on('elementType', (event: CustomEvent) => { this.currentElementType = event.detail; });
        this.setCanvasCtx();
        this.initParticule2DArray();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

}

export const GameService = GameSvc.Instance;