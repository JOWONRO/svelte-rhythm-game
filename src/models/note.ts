export class Note {
  private _y: number;
  private _color: string;
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  constructor(y: number, canvas: HTMLCanvasElement, color?: string) {
    this._y = y;
    this._color = color ?? "rgb(160, 179, 255)";
    this._canvas = canvas;
    this._ctx = canvas.getContext("2d");
  }

  get y() {
    return this._y;
  }
  get color() {
    return this._color;
  }
  get canvas() {
    return this._canvas;
  }
  get ctx() {
    return this._ctx;
  }

  update(y?: number, color?: string) {
    if (y) this._y = y;
    if (color) this._color = color;
  }

  draw() {
    this._ctx.fillStyle = this._color;
    this._ctx.beginPath();
    this._ctx.rect(0, this._y, this._canvas.width, 5);
    this._ctx.fill();
  }
}

export class LongNote extends Note {
  private _range: number;
  private _isPressing = false;
  constructor(
    y: number,
    canvas: HTMLCanvasElement,
    range: number,
    color?: string
  ) {
    super(y, canvas, color);
    this._range = range;
  }

  get isPressing() {
    return this._isPressing;
  }

  updateIsPressing(value: boolean) {
    this._isPressing = value;
  }
  update(y?: number, color?: string, range?: number) {
    super.update(y, color);
    if (range) this._range = range;
  }
  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.rect(0, this.y, this.canvas.width, 5 + this._range);
    this.ctx.fill();
  }
}
