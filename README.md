# osu! Stream Companion overlays

This is a reimplementation of [2ky's osu!mania overlays](https://github.com/2222zz/gosumemory-theme) using [Stream Companion](https://github.com/Piotrekol/StreamCompanion) and [Svelte](https://github.com/sveltejs/svelte).

## Reimplemented overlays

- ✔️ `mania_simple_overlay`
  - Simple mode not implemented yet
- ✔️ `mania_simple_leaderboard`
  - Supported server type: `osu-v1`, `osu-v2`, `akatsuki-v1`
  - WIP: In-game leaderboard provider
  - Will not be implemented: Score prediction (the formula doesn't make sense, and the resulting value doesn't mean anything)
- ❌ `mania_simple_hitcount`
- ❌ `mania_simple_hiterror`
- ❌ `mania_nowplaying`
- ❌ `nps_chart`
- ❌ `mania_normal`
  - No plan to do this, use SC's Text Overlay instead
- ❌ `mania_ingame`
  - No plan to do this, use SC's Text Overlay + `mania_simple_hiterror`

## Why Stream Companion?

[gosumemory](https://github.com/l3lackShark/gosumemory) hasn't been updated for a while, aside from the occasional bug fixes. There are multiple issues with it, from failures reading judgment data, to incorrect pp formulas, to SR calculation failures, etc.

Stream Companion is actively maintained, and directly uses code from upstream [osu!lazer](https://github.com/ppy/osu), so keeping up with changes will be easier.

## Why Svelte?

The original overlays are written in vanilla JS, which even though works fine, is a major pain for others wanting to modify the overlays. There are also other problems with the original overlays, including code readability issues and the use of old school, fragile CSS.

All of the mentioned issues prompted me to rewrite the overlays in Svelte, due to its high performance, low output size and ease of use. I also rewrote the CSS to take advantage of modern features (3D transforms, flexbox, etc.) and reduce the number of "magic offsets".

## Instructions

### 1. Build

```shell
pnpm install
pnpm build:all
```

This repo uses Nx for parallel building, and the output will be in the `dist` folder.

### 2. Develop

```shell
pnpm install
cd <path to overlay>
pnpm run dev
```
