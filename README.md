# World War II — Tall Tale 3D Documentary

A 16:9 educational history documentary project using the Tall Tale visual language:
**flat 2D cartoon people inside fully 3D environments**. The project is based on the
Tall Tale engine supplied in `faceless-shorts-skill.zip`.

## What it builds

- A narrated English-language World War II documentary (target: about 10 minutes)
- 2D cut-out cartoon characters with expressive poses
- 3D historical environments, streets, aircraft, ships, tanks, maps and reconstruction scenes
- Word-timed captions, a generated music bed and soft transition effects
- 1920×1080 landscape MP4, 24 FPS for the full render

The script is an educational overview. It avoids graphic depictions and includes a source list
inside `script.json`. Please fact-check and edit the narration before publication.

## Create the GitHub repository from an Android phone

1. Download and extract `WW2-Tall-Tale-GitHub-Project.zip` on your phone.
2. Open [github.com/new](https://github.com/new) in Chrome and sign in.
3. Repository name: `ww2-tall-tale-documentary`.
4. Choose **Public** or **Private**. Public repositories generally have more generous Actions allowances; check GitHub's current limits before a long render.
5. Select **Add a README file: OFF** and create the repository.
6. On the new repository page, choose **Add file → Upload files**.
7. Upload the contents of this extracted project folder (not the ZIP file itself), including the hidden `.github` folder. If mobile upload hides `.github`, use GitHub's web editor to create `.github/workflows/render.yml` from the included file.
8. Commit the files to the `main` branch.

## Run from GitHub Actions

1. Open the repository on GitHub.
2. Tap **Actions**.
3. Choose **Build WW2 Documentary**.
4. Tap **Run workflow**.
5. First choose `test`. This generates narration, captions and a 20-second preview.
6. Open the completed run and download the `WW2-preview` artifact to check the look and sound.
7. When satisfied, run the workflow again and choose `full`.
8. The full run renders the video in one-minute chunks, joins them, and uploads `WW2-Documentary-1080p`.

## Important rendering notes

- The first run downloads the Kokoro voice model and the Whisper small English model. This is several hundred MB and can take time.
- The full render is computationally expensive. It uses software WebGL rendering on GitHub-hosted runners, not a GPU.
- Full rendering may take a long time and consume GitHub Actions minutes. Start with the preview. Do not repeatedly launch full runs until the preview is correct.
- If a job fails, open its log and identify the first failed step. Do not assume the MP4 exists unless the final artifact was uploaded.
- The script's spoken duration depends on the TTS model version. The workflow calculates the actual duration and creates the needed number of render segments; the title is a target, not a guarantee of exactly 10:00.

## Main project files

- `script.json` — documentary narration, voice and source notes
- `src/shots.js` — 10 historical 3D scenes and 2D cartoon character animation
- `src/core/toon.js` — original Tall Tale 2D cut-out character engine
- `src/core/world.js` — original 3D world-building tools
- `src/core/engine.js` — Three.js renderer
- `src/core/captions.js` — word-timed captions adapted for landscape
- `tools/capture.mjs` — headless Chrome frame capture and MP4 encoder
- `scripts/voice.py` — local Kokoro narration generator
- `scripts/words.py` — Whisper word timing
- `scripts/make_cues.py` — chapter transition sound cue timing\n- `scripts/mix.py` — generated soundtrack and sound effects
- `.github/workflows/render.yml` — GitHub Actions pipeline

## Attribution

The included Tall Tale example and Three.js vendor code were taken from the supplied
`faceless-shorts-skill.zip`. Review the included `vendor/LICENSE-three.txt` and the upstream
project's licence terms before redistribution.


## Android upload tip

If your file picker hides the `.github` folder, create a new file in GitHub named
`.github/workflows/render.yml` and paste the contents of `render-workflow-copy.yml`.
The workflow must be on the repository's default branch before it appears under Actions.
