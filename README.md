ODM WORLD

A creature world that keeps living whether you watch or not, plus the three forges that build its bodies and its ground.
Every tool is one self-contained HTML file. Open the site: https://floptopbop.github.io/-Voxel-/

What it is 

| `index.html` | The front door: what each tool does, how to get started, how things move between tools |
| `game.html` | **EMU MONKEY LIFE**: the game (monkey ally, emus, roamers / lurkers / colossals, glyph language, grapple + rope) |
| `body.html` | **BODY FORGE**: low-poly character builder (body, face, wear, accessories, animation) |
| `terra.html` | **TERRA_FORGE**: any file → game terrain (shape, erode, sculpt, sea level) |
| `depth.html` | **DEPTH_AI**: runs the AI depth model alone and hands the depth on (needs internet the first time) |
| `three.min.js` | Three.js r128, served from the site so the tools work offline |
| `share-tech-mono.woff2` | The game's font, served from the site |
| `sw.js` | Offline cache (only runs on the published https site, never in a local preview) |
| `manifest.json`, `icon.svg` | Add-to-home-screen details |

## Moving things between tools

Same device: use the send buttons.
- DEPTH_AI **SEND** → TERRA_FORGE (SOURCE → AI HANDOFF) or BODY FORGE (Look → Pull AI handoff)
- TERRA_FORGE **SAVE → SEND TO GAME** → game: world forge → terrain → *from terra forge*
- BODY FORGE **Export → Send to game** → game: world forge → models → *monkey ← body forge* / *you ← body forge*
