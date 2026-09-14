# ENGO — presentation deck

`ENGO-Smart-Waste-Management.pptx` — 12 slides, 16:9, built from the real prototype.

Everything here is generated. To rebuild after the app changes:

```bash
npm run dev                      # the capture step needs the app running
node deck/capture-screens.mjs docs/screens
python deck/build-assets.py
node deck/build-icons.mjs
node deck/build-deck.mjs
```

| Step | What it does |
| --- | --- |
| `capture-screens.mjs` | Drives the running app with Playwright and saves 17 screens at 3x into `docs/screens/` |
| `build-assets.py` | Duotones the photography, wraps each screenshot in a device bezel with a baked shadow, and writes `assets/mockups.json` |
| `build-icons.mjs` | Rasterises the Lucide icons the app uses into transparent PNGs, in the deck's palette |
| `build-deck.mjs` | Lays out the 12 slides with pptxgenjs |

To preview the result as images (needs PowerPoint installed):

```bash
powershell -File deck/render.ps1 -Deck "<abs path>\deck\ENGO-Smart-Waste-Management.pptx" -Out "<abs path>\deck\render"
```

## Slides

1. Cover · 2. The problem · 3. The idea · 4. How ENGO works · 5. The mobile application ·
6. User experience · 7. AI waste detection · 8. Rewards & accountability ·
9. Proposed system architecture · 10. Hardware + software integration ·
11. Development roadmap · 12. Closing

Slides 7, 9, 10 and 11 are explicit that the backend, the ESP32 hardware and the
production AI are proposed rather than built. Only the mobile application exists today.

## Assets

Screenshots are of the running prototype. Icons are [Lucide](https://lucide.dev).
Photography is from [Unsplash](https://unsplash.com) under the Unsplash License and is
stored locally in `assets/`.
