import { JudgeType } from "@/static/judge";

export class JudgeEffect {
  private _color: string;
  private _size: number = 0;
  private _width: number = 10;
  private _isEnded: boolean = false;
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  constructor(judge: JudgeType, canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    this._ctx = canvas.getContext("2d");

    switch (judge) {
      case JudgeType.PERFECT:
        this._color = "rgb(0, 21, 255)";
        break;
      case JudgeType.GREAT:
        this._color = "rgb(34, 255, 0)";
        break;
      case JudgeType.GOOD:
        this._color = "rgb(133, 133, 133)";
        break;
      default:
        this._color = "rgba(0, 0, 0, 0)";
    }
  }

  get isEnded() {
    return this._isEnded;
  }

  update() {
    this._size = this._size + 1.5;
    this._width = this._width - 0.5;
  }
  draw() {
    if (this._width < 0) {
      this._isEnded = true;
      return;
    }
    this._ctx.strokeStyle = "rgb(255,255,255)";
    this._ctx.shadowColor = this._color;
    this._ctx.shadowBlur = 5;
    this._ctx.beginPath();
    this._ctx.arc(
      this._canvas.width / 2,
      this._canvas.height / 2,
      this._size,
      0,
      2 * Math.PI
    );
    this._ctx.lineWidth = this._width;
    this._ctx.stroke();
  }
}
