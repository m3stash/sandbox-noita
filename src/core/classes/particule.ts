import { ElementType } from '../enums/elementType';

export default class particule {
    private id: number;
    private color: string;
    private velocity: number;
    private isUpdate: boolean;
    private lifetime: number;
    private elementType: ElementType;

    constructor(id: number, elementType: ElementType, color: string, velocity: number, isUpdate: boolean = false, lifetime: number) {
        this.id = id;
        this.color = color;
        this.velocity = velocity;
        this.isUpdate = isUpdate;
        this.lifetime = lifetime;
        this.elementType = elementType;
    }

    public getId(): number {
        return this.id;
    }

    public setIsUpdate(value: boolean): void {
        this.isUpdate = value;
    }

    public getIsUpdate(): boolean {
        return this.isUpdate;
    }

    public getColor(): string {
        return this.color;
    }

    public getElementType(): ElementType {
        return this.elementType;
    }
}