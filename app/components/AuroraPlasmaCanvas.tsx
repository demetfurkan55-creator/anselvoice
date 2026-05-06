"use client";

import { useEffect, useRef } from "react";

export function AuroraPlasmaCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const coarsePointer =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;
    const glRaw =
      canvas.getContext("webgl", {
        alpha: true,
        antialias: !coarsePointer,
        premultipliedAlpha: true,
      }) ?? canvas.getContext("experimental-webgl");
    const gl = glRaw as WebGLRenderingContext | null;
    if (!gl) return;

    const HISTORY = 12;
    const points = Array.from({ length: HISTORY }, () => ({ x: 0.5, y: 0.5 }));
    const weights = new Float32Array(HISTORY);

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    gl.shaderSource(
      vertexShader,
      `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = (a_position + 1.0) * 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
      `,
    );

    gl.shaderSource(
      fragmentShader,
      `
      precision highp float;
      varying vec2 v_uv;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_activity;
      uniform vec2 u_points[12];
      uniform float u_weights[12];

      mat2 rot(float a) {
        float s = sin(a);
        float c = cos(a);
        return mat2(c, -s, s, c);
      }

      void main() {
        float t = u_time * (0.2 + u_activity * 0.8);
        vec2 uv = v_uv;
        vec2 asp = vec2(u_resolution.x / u_resolution.y, 1.0);
        vec2 p = uv * asp;
        vec2 head = u_points[0] * asp;

        float wake = 0.0;
        float swirl = 0.0;
        for (int i = 0; i < 12; i++) {
          vec2 pi = u_points[i] * asp;
          float w = u_weights[i];
          vec2 d = p - pi;
          float r = length(d) + 0.0001;
          wake += exp(-r * (16.2 + float(i) * 1.25)) * w;
          swirl += sin(r * 35.0 - t * (2.7 + float(i) * 0.14) + float(i) * 0.9) * exp(-r * 20.0) * w;
        }

        vec2 q = p - head;
        float r = length(q) + 0.0001;
        float a = atan(q.y, q.x);

        float tentacles = 0.0;
        for (int k = 0; k < 4; k++) {
          float fk = float(k);
          float arm = sin(a * (2.3 + fk * 0.25) - t * (1.45 + fk * 0.2) + fk * 1.1);
          float band = exp(-abs(arm * 0.08 + r - (0.04 + fk * 0.016)) * (58.0 - fk * 3.0));
          float tailFalloff = exp(-r * (7.4 + fk * 0.42));
          tentacles += band * tailFalloff;
        }

        float bell = exp(-pow(r * 14.0, 2.0)) * (0.92 + 0.08 * sin(t * 3.9));
        float headCore = exp(-r * 19.5) * (1.0 + 0.18 * sin(t * 3.3 + a * 2.2));
        float fluid = wake * 0.38 + tentacles * 0.46 + swirl * 0.1 + headCore * 1.08 + bell * 0.55;
        fluid *= u_activity;

        float phase = wake * 1.7 + swirl * 0.8 + u_time * 0.35;
        vec3 c1 = vec3(0.66, 0.33, 0.97); // #a855f7
        vec3 c2 = vec3(0.23, 0.51, 0.96); // #3b82f6
        vec3 c3 = vec3(0.13, 0.83, 0.93); // #22d3ee
        vec3 c4 = vec3(0.06, 0.73, 0.51); // #10b981
        vec3 c5 = vec3(0.93, 0.28, 0.60); // #ec4899

        vec3 col = mix(c1, c2, 0.5 + 0.5 * sin(phase));
        col = mix(col, c3, 0.5 + 0.5 * sin(phase + 1.2));
        col = mix(col, c4, 0.5 + 0.5 * sin(phase + 2.1));
        col = mix(col, c5, 0.5 + 0.5 * sin(phase + 3.0));

        float alpha = clamp(fluid * 0.42, 0.0, 0.44);
        gl_FragColor = vec4(col * alpha, alpha);
      }
      `,
    );

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);
    if (
      !gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS) ||
      !gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)
    ) {
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const positionLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const resolutionLoc = gl.getUniformLocation(program, "u_resolution");
    const timeLoc = gl.getUniformLocation(program, "u_time");
    const activityLoc = gl.getUniformLocation(program, "u_activity");
    const pointsLoc = gl.getUniformLocation(program, "u_points");
    const weightsLoc = gl.getUniformLocation(program, "u_weights");

    const state = {
      width: 0,
      height: 0,
      dpr: 1,
      raf: 0,
      targetX: 0.5,
      targetY: 0.5,
      lastClientX: -9999,
      lastClientY: -9999,
      smoothX: 0.5,
      smoothY: 0.5,
      hasPointer: false,
      lastMoveTs: 0,
      activity: 0,
      targetActivity: 0,
      start: performance.now(),
    };

    const resize = () => {
      state.dpr = Math.min(window.devicePixelRatio || 1, coarsePointer ? 1.5 : 2);
      state.width = Math.max(1, Math.floor(window.innerWidth * state.dpr));
      state.height = Math.max(1, Math.floor(window.innerHeight * state.dpr));
      canvas.width = state.width;
      canvas.height = state.height;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      gl.viewport(0, 0, state.width, state.height);
    };

    const onMove = (x: number, y: number) => {
      const moveDelta = Math.hypot(x - state.lastClientX, y - state.lastClientY);
      if (moveDelta < (coarsePointer ? 2.4 : 1.5)) return;
      state.lastClientX = x;
      state.lastClientY = y;

      state.targetX = x / Math.max(1, window.innerWidth);
      state.targetY = 1 - y / Math.max(1, window.innerHeight);
      state.targetActivity = 1;
      state.lastMoveTs = performance.now();
      if (!state.hasPointer) {
        state.smoothX = state.targetX;
        state.smoothY = state.targetY;
        for (let i = 0; i < HISTORY; i += 1) {
          points[i].x = state.targetX;
          points[i].y = state.targetY;
        }
      }
      state.hasPointer = true;
    };

    const onPointerMove = (e: PointerEvent) => onMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      onMove(touch.clientX, touch.clientY);
    };
    const onVisibility = () => {
      if (document.hidden) {
        state.targetActivity = 0;
      }
    };

    const frame = (now: number) => {
      const idle = now - state.lastMoveTs;
      if (idle > 70) state.targetActivity = 0;

      const activityEase = state.targetActivity > state.activity ? 0.2 : 0.16;
      state.activity += (state.targetActivity - state.activity) * activityEase;

      state.smoothX = state.targetX;
      state.smoothY = state.targetY;

      points[0].x = state.smoothX;
      points[0].y = state.smoothY;
      for (let i = 1; i < HISTORY; i += 1) {
        points[i].x += (points[i - 1].x - points[i].x) * (0.12 - i * 0.0035);
        points[i].y += (points[i - 1].y - points[i].y) * (0.12 - i * 0.0035);
      }

      for (let i = 0; i < HISTORY; i += 1) {
        const age = i / (HISTORY - 1);
        weights[i] = Math.exp(-age * 6.4) * state.activity;
      }

      const packed = new Float32Array(HISTORY * 2);
      for (let i = 0; i < HISTORY; i += 1) {
        packed[i * 2] = points[i].x;
        packed[i * 2 + 1] = points[i].y;
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(resolutionLoc, state.width, state.height);
      gl.uniform1f(timeLoc, (now - state.start) * 0.001);
      gl.uniform1f(activityLoc, Math.max(0, Math.min(1, state.activity)));
      gl.uniform2fv(pointsLoc, packed);
      gl.uniform1fv(weightsLoc, weights);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      state.raf = requestAnimationFrame(frame);
    };

    resize();
    state.raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(state.raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteBuffer(quad);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-0 h-full w-full ${className}`}
      aria-hidden
    />
  );
}
