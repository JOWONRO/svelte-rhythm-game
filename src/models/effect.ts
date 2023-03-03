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

// useEffect(() => {
//   if (!canvasRef.current) return
//   canvasRef.current.width = 200
//   canvasRef.current.height = 200
//   const ctx = canvasRef.current.getContext('2d') as CanvasRenderingContext2D

//   ctx.globalCompositeOperation = 'lighter'
//   ctx.filter = 'blur(5px)'
//   ctx.fillStyle = '#ffffff'
//   ctx.shadowColor = 'rgba(255, 0, 0, 1)'
//   ctx.shadowBlur = 10
//   ctx.shadowOffsetX = 10
//   ctx.shadowOffsetY = 10
//   ctx.beginPath()
//   ctx.rect(
//     canvasRef.current.width / 2 - 20,
//     canvasRef.current.height / 2 - 2.5,
//     40,
//     5,
//   )
//   ctx.fill()

//   ctx.filter = 'blur(5px)'
//   ctx.shadowColor = '#0015ff'
//   ctx.shadowBlur = 10
//   ctx.shadowOffsetX = -10
//   ctx.shadowOffsetY = -10
//   ctx.beginPath()
//   ctx.rect(
//     canvasRef.current.width / 2 - 20,
//     canvasRef.current.height / 2 - 2.5,
//     40,
//     5,
//   )
//   ctx.fill()

//   ctx.filter = 'blur(10px)'
//   ctx.shadowOffsetX = 0
//   ctx.shadowOffsetY = 0
//   ctx.beginPath()
//   ctx.moveTo(canvasRef.current.width / 2, 93)
//   ctx.lineTo(canvasRef.current.width - 20, canvasRef.current.height / 2)
//   ctx.lineTo(canvasRef.current.width / 2, canvasRef.current.height - 93)
//   ctx.lineTo(20, canvasRef.current.height / 2)
//   ctx.closePath()
//   ctx.fill()

//   ctx.filter = 'blur(5px)'
//   ctx.strokeStyle = '#FFFFFF'
//   ctx.beginPath()
//   ctx.arc(
//     canvasRef.current.width / 2,
//     canvasRef.current.height / 2,
//     30,
//     0,
//     2 * Math.PI,
//   )
//   ctx.stroke()
// }, [])
