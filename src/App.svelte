<script lang="ts">
  import { onMount } from "svelte";

  let start: boolean;
  let keydown: boolean;

  let canvasRef: HTMLCanvasElement;
  let effectCanvasRef: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let effectCtx: CanvasRenderingContext2D;
  let currentProgress = 0;
  let lastTime: number;
  let scoreSpeed = 256;
  let distanceOfCurrentNote: number;

  let count = 0;
  let timer: number;

  let perfect = 0;
  let cool = 0;
  let good = 0;
  let bad = 0;
  let miss = 0;

  class Particle {
    private _y: number;
    private _color: string;
    constructor(y: number) {
      this._y = y;
      this._color = "rgb(160, 179, 255)";
    }

    get y() {
      return this._y;
    }

    update() {}

    draw() {
      ctx.fillStyle = this._color;
      ctx.beginPath();
      ctx.rect(0, this._y, 40, 5);
      ctx.fill();
    }
  }

  const notes: Particle[] = [];
  for (let i = 0; i < 120; i++) {
    if (i === 0) continue;
    notes.push(new Particle(i * 128));
  }

  const deleteLastNote = () => {
    notes.pop();
    ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
    notes.forEach((note) => note.draw());
  };

  const animateScore = () => {
    const currentTime = performance.now();
    const deltaTime = (currentTime - lastTime) / 1000; // 밀리초 단위를 초 단위로 변환
    lastTime = currentTime;
    currentProgress = currentProgress + scoreSpeed * deltaTime;
    canvasRef.setAttribute(
      "style",
      `transform: translateY(${currentProgress}px)`
    );

    if (notes.length > 0) {
      distanceOfCurrentNote = 15360 - notes.at(-1).y - currentProgress;
      if (distanceOfCurrentNote < -128) {
        deleteLastNote();
        miss += 1;
      }
    }

    if (currentProgress < 15360) {
      requestAnimationFrame(animateScore);
    } else {
      start = false;
      clearInterval(timer);
    }
  };

  class EffectParticle {
    private _size: number;
    private _width: number;
    private _color: string;
    constructor(color: string) {
      this._size = 0;
      this._width = 10;
      this._color = color;
    }

    get width() {
      return this._width;
    }

    update() {
      this._size = this._size + 1.5;
      this._width = this._width - 0.5;
    }

    draw() {
      if (this._width < 0) return;
      effectCtx.strokeStyle = "rgb(255,255,255)";
      effectCtx.shadowColor = this._color;
      effectCtx.shadowBlur = 5;
      effectCtx.beginPath();
      effectCtx.arc(
        effectCanvasRef.width / 2,
        effectCanvasRef.height / 2,
        this._size,
        0,
        2 * Math.PI
      );
      effectCtx.lineWidth = this._width;
      effectCtx.stroke();
    }
  }

  let effectParticles: EffectParticle[] = [];

  const animateEffect = () => {
    effectCtx.clearRect(0, 0, effectCanvasRef.width, effectCanvasRef.height);
    if (effectParticles.length > 0) {
      effectParticles.forEach((particle) => {
        particle.draw();
        particle.update();
      });
      effectParticles = effectParticles.filter(
        (particle) => particle.width >= 0
      );
    }
    requestAnimationFrame(animateEffect);
  };

  onMount(() => {
    canvasRef.width = 40;
    canvasRef.height = 15360;
    ctx = canvasRef.getContext("2d");
    notes.forEach((note) => note.draw());

    effectCanvasRef.width = 60;
    effectCanvasRef.height = 60;
    effectCtx = effectCanvasRef.getContext("2d");

    window.addEventListener("keydown", (e) => {
      if (e.key === "a") {
        keydown = true;
        if (!start) return;
        if (
          (distanceOfCurrentNote >= -128 && distanceOfCurrentNote < -64) ||
          (distanceOfCurrentNote <= 128 && distanceOfCurrentNote > 64)
        ) {
          deleteLastNote();
          bad += 1;
        }
        if (
          (distanceOfCurrentNote >= -64 && distanceOfCurrentNote < -32) ||
          (distanceOfCurrentNote <= 64 && distanceOfCurrentNote > 32)
        ) {
          deleteLastNote();
          good += 1;
          effectParticles.push(new EffectParticle("rgb(34, 255, 0)"));
        }
        if (
          (distanceOfCurrentNote >= -32 && distanceOfCurrentNote < -16) ||
          (distanceOfCurrentNote <= 32 && distanceOfCurrentNote > 16)
        ) {
          deleteLastNote();
          cool += 1;
          effectParticles.push(new EffectParticle("rgb(0, 217, 255)"));
        }
        if (distanceOfCurrentNote >= -16 && distanceOfCurrentNote <= 16) {
          deleteLastNote();
          perfect += 1;
          effectParticles.push(new EffectParticle("rgb(0, 21, 255)"));
        }
      }
      if (e.key === "Enter") {
        if (start) return;
        start = true;
        lastTime = performance.now();
        timer = setInterval(() => {
          count += 1;
        }, 1000);
        animateScore();
        animateEffect();
      }
    });
    window.addEventListener("keyup", (e) => {
      if (e.key === "a") {
        keydown = false;
      }
    });
  });
</script>

<main>
  <div style="color: white; position: absolute">
    <div>{count}</div>
    <div>perfect: {perfect}</div>
    <div>cool: {cool}</div>
    <div>good: {good}</div>
    <div>bad: {bad}</div>
    <div>miss: {miss}</div>
  </div>
  <div class="track">
    <div class="line-main" />
    <canvas bind:this={canvasRef} />
    <div class="line-bottom" />
    <canvas
      bind:this={effectCanvasRef}
      style="bottom: 70px;"
      class="effect-canvas"
    />
    <div class={`effect ${keydown && "light"}`} />
  </div>
</main>

<style lang="scss" scoped>
  canvas {
    bottom: 100px;
    position: absolute;
  }
  .effect-canvas {
    left: 50%;
    transform: translateX(-50%);
  }
  main {
    overflow: hidden;
    position: relative;
    width: 100vw;
    height: 100vh;
    background: rgb(14, 18, 34);
    .track {
      position: absolute;
      width: 40px;
      height: 100%;
      border-left: 1px solid rgb(230, 237, 255);
      border-right: 1px solid rgb(230, 237, 255);
      left: 50%;
      transform: translateX(-50%);
      .line-bottom {
        position: absolute;
        bottom: 0;
        height: 3px;
        width: 100%;
        height: 95px;
        background: rgb(230, 237, 255);
      }
      .line-main {
        position: absolute;
        bottom: 95px;
        width: 100%;
        height: 5px;
        background-color: rgba(230, 237, 255, 0.5);
      }
      .effect {
        position: absolute;
        bottom: 100px;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          0deg,
          rgba(200, 215, 255, 0.5) 0%,
          rgba(255, 255, 255, 0) 76%
        );
        opacity: 0;
        transition: opacity 0.05s;
        &.light {
          opacity: 1;
        }
      }
      .score {
        width: 100%;
        height: 5000px;
        position: absolute;
        bottom: 100px;
        transition: all linear 10s;
        &.start {
          transform: translateY(100%);
        }
        div {
          position: absolute;
          top: 0;
          height: 4px;
          width: 100%;
          background: rgb(219, 229, 255);
        }
      }
    }
  }

  @keyframes pop {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(100%);
    }
  }
</style>
