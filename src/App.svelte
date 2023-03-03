<script lang="ts">
  import { onMount } from "svelte";
  import { JudgeEffect } from "./models/effect";
  import { LongNote, Note } from "./models/note";
  import { JudgeType } from "./static/judge";

  let start: boolean;
  let keydown: boolean;

  let isJudging: boolean;
  let isJudgingLong: boolean;
  let currentJudge: JudgeType;

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
  let great = 0;
  let good = 0;
  let bad = 0;
  let miss = 0;

  const notes: Array<Note | LongNote> = [];

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
      if (distanceOfCurrentNote < -64) {
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

  let effectParticles: JudgeEffect[] = [];

  const animateEffect = () => {
    effectCtx.clearRect(0, 0, effectCanvasRef.width, effectCanvasRef.height);
    if (effectParticles.length > 0) {
      effectParticles.forEach((particle) => {
        particle.draw();
        particle.update();
      });
      effectParticles = effectParticles.filter((particle) => !particle.isEnded);
    }
    requestAnimationFrame(animateEffect);
  };

  const judge = () => {
    const lastNote = notes.at(-1);

    if (lastNote instanceof Note) {
      judgeNote();
    }
    if (lastNote instanceof LongNote) {
      judgeNote();
    }
  };

  const judgeNote = () => {
    if (isJudging) return;
    if (distanceOfCurrentNote < -64 || distanceOfCurrentNote > 64) return;
    if (distanceOfCurrentNote >= -16 && distanceOfCurrentNote <= 16) {
      perfect += 1;
      effectParticles.push(new JudgeEffect(JudgeType.PERFECT, effectCanvasRef));
    }
    if (
      (distanceOfCurrentNote >= -32 && distanceOfCurrentNote < -16) ||
      (distanceOfCurrentNote <= 32 && distanceOfCurrentNote > 16)
    ) {
      great += 1;
      effectParticles.push(new JudgeEffect(JudgeType.GREAT, effectCanvasRef));
    }
    if (
      (distanceOfCurrentNote >= -48 && distanceOfCurrentNote < -32) ||
      (distanceOfCurrentNote <= 48 && distanceOfCurrentNote > 32)
    ) {
      good += 1;
      effectParticles.push(new JudgeEffect(JudgeType.GOOD, effectCanvasRef));
    }
    if (
      (distanceOfCurrentNote >= -64 && distanceOfCurrentNote < -48) ||
      (distanceOfCurrentNote <= 64 && distanceOfCurrentNote > 48)
    ) {
      bad += 1;
    }
    deleteLastNote();
  };

  const judgeLongNote = () => {
    if (isJudging && !isJudgingLong) return;
    if (distanceOfCurrentNote < -64 || distanceOfCurrentNote > 64) return;
    if (distanceOfCurrentNote >= -16 && distanceOfCurrentNote <= 16) {
      perfect += 1;
      effectParticles.push(new JudgeEffect(JudgeType.PERFECT, effectCanvasRef));
      isJudgingLong = true;
      currentJudge = JudgeType.PERFECT;
    }
    if (
      (distanceOfCurrentNote >= -32 && distanceOfCurrentNote < -16) ||
      (distanceOfCurrentNote <= 32 && distanceOfCurrentNote > 16)
    ) {
      great += 1;
      effectParticles.push(new JudgeEffect(JudgeType.GREAT, effectCanvasRef));
      isJudgingLong = true;
      currentJudge = JudgeType.GREAT;
    }
    if (
      (distanceOfCurrentNote >= -48 && distanceOfCurrentNote < -32) ||
      (distanceOfCurrentNote <= 48 && distanceOfCurrentNote > 32)
    ) {
      good += 1;
      isJudgingLong = true;
      currentJudge = JudgeType.GOOD;
    }
    if (
      (distanceOfCurrentNote >= -64 && distanceOfCurrentNote < -48) ||
      (distanceOfCurrentNote <= 64 && distanceOfCurrentNote > 48)
    ) {
      bad += 1;
      deleteLastNote();
    }
  };

  onMount(() => {
    canvasRef.width = 40;
    canvasRef.height = 15360;
    ctx = canvasRef.getContext("2d");

    for (let i = 0; i < 120; i++) {
      if (i === 0) continue;
      if (i === 117 || i === 112 || i === 109) continue;
      if (i === 110 || i === 113 || i === 118) {
        notes.push(new LongNote(i * 128, canvasRef, 128));
      }
      notes.push(new Note(i * 128, canvasRef));
    }
    notes.forEach((note) => note.draw());

    effectCanvasRef.width = 100;
    effectCanvasRef.height = 100;
    effectCtx = effectCanvasRef.getContext("2d");

    window.addEventListener("keydown", (e) => {
      if (e.key === "a") {
        keydown = true;
        if (!start) return;
        const lastNote = notes.at(-1);
        if (lastNote instanceof Note) {
          judgeNote();
        }
        if (lastNote instanceof LongNote) {
          judgeLongNote();
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
        isJudging = false;
      }
    });
  });
</script>

<main>
  <div style="color: white; position: absolute">
    <div>{count}</div>
    <div>perfect: {perfect}</div>
    <div>great: {great}</div>
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
</style>
