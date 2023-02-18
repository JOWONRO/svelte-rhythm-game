<script lang="ts">
  import { onMount } from "svelte";

  export let start: boolean;
  export let keydown: boolean;

  onMount(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        start = true;
      }
      if (e.key === " ") {
        const line = document.querySelector(".line");
        const a5 = document.querySelector("#a5");
        const a4 = document.querySelector("#a4");

        keydown = true;

        if (
          line.getBoundingClientRect().top - a5.getBoundingClientRect().top >
            -30 &&
          line.getBoundingClientRect().top - a5.getBoundingClientRect().top < 30
        ) {
          console.log("cool a5");
          a5.setAttribute("style", "transform: translateY(10000px)"); // 혹은 display none
        }

        if (
          a5.getBoundingClientRect().top - a4.getBoundingClientRect().top >
            60 &&
          line.getBoundingClientRect().top - a4.getBoundingClientRect().top >
            -30 &&
          line.getBoundingClientRect().top - a4.getBoundingClientRect().top < 30
        ) {
          console.log("cool a4");
          a4.setAttribute("style", "transform: translateY(10000px)");
        }
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.key === " ") {
        keydown = false;
      }
    });
  });
</script>

<main>
  <div class="track">
    <div class="line" />
    <div class={`effect ${keydown && "light"}`} />
    <div
      class={`score ${start && "start"}`}
      on:animationend={() => (start = false)}
    >
      <div id="a1" />
      <div id="a2" />
      <div id="a3" />
      <div id="a4" />
      <div id="a5" />
    </div>
  </div>
</main>

<style lang="scss" scoped>
  main {
    position: relative;
    width: 100vw;
    height: 100vh;
    background: rgb(14, 18, 34);
    .track {
      position: absolute;
      overflow: hidden;
      width: 40px;
      height: 100%;
      border-left: 1px solid rgb(230, 237, 255);
      border-right: 1px solid rgb(230, 237, 255);
      left: 50%;
      transform: translateX(-50%);
      .line {
        position: absolute;
        bottom: 100px;
        height: 3px;
        width: 100%;
        background: rgb(230, 237, 255);
      }
      .effect {
        position: absolute;
        bottom: 100px;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          0deg,
          rgba(200, 215, 255, 1) 0%,
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
        #a1 {
          transform: translateY(calc(5000px * 10 / 100));
        }
        #a2 {
          transform: translateY(calc(5000px * 30 / 100));
        }
        #a3 {
          transform: translateY(calc(5000px * 50 / 100));
        }
        #a4 {
          transform: translateY(calc(5000px * 70 / 100));
        }
        #a5 {
          transform: translateY(calc(5000px * 90 / 100));
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
