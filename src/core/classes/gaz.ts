import Vector2 from './vector2';

export class Solid extends Element {

    public move(x: number, y: number): Vector2 {
        return new Vector2(0, 0);
    }
}