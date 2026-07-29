# Dhruv Patel — Robotics & AI Portfolio

A static GitHub Pages portfolio for Dhruv Patel's robotics research and applied AI work.

## What is included

- Minimal editorial homepage centered on Dhruv's current research and engineering background
- Long-form technical project pages written in direct, first-person language and generated from `project-data.js`
- Project-specific image rails using the supplied lab photographs and repository visuals
- Eight locally hosted, compressed MP4 demo clips selected from the uploaded recordings
- Apple-like page transitions, reading progress, image lightbox, responsive navigation, and reduced-motion support
- Updated résumé in HTML and PDF formats

## Verified media mapping

| Project | Media used |
| --- | --- |
| Unitree Go2 semantic navigation | 18-second navigation clip and 20-second motion-skills clip with their original audio, plus relevant lab photographs. |
| xArm teleoperation and demonstration learning | Real xArm teleoperation, Isaac Sim teleoperation, RGB-D/segmentation dashboard, and VR multiview perception clips. |
| Sparse 3D memory and digital-twin reconstruction | FVDB scene-regeneration clip, point-cloud reconstruction/inspection clip, COLMAP screenshots, and relevant lab photography. |
| Avian Journeys | Four supplied Power BI dashboard pages covering summary metrics, geography/species, environmental factors, and seasonal/success analysis. |
| Data-science evaluation, Big Photos, The Last Degree, Pinecone search | Repository-backed technical writing. The Last Degree also uses the supplied ROI and layoff-monitor product screenshots. |

## Project content

`project-data.js` is the source of truth for:

- Project titles and summaries
- Technical stack and role
- Long-form chapters
- Architecture and engineering decisions
- Key engineering choice and completed results
- Image galleries
- Local video clips
- GitHub links

Every project opens through `project.html?id=<project-id>` as an editorial engineering article.

## Deploy to GitHub Pages

1. Create or use the repository `pateldhruv1672.github.io`.
2. Copy this folder's contents to the repository root.
3. Commit and push to `main`.
4. Open **Settings → Pages**.
5. Choose **Deploy from a branch**, then select `main` and `/ (root)`.

No build step or framework is required.

## Media notes

- Videos are in `assets/media/` and use H.264 MP4 with `faststart` for browser playback.
- Posters and project images are in `assets/images/`.
- Videos preserve the original frame; portrait footage is placed on a 16:9 canvas rather than destructively cropped.
- Each project page includes a GitHub action, video demos when available, a sticky media rail on desktop, and a swipeable image gallery on smaller screens.
- Both Go2 MP4 files contain AAC audio. The player opens unmuted after the user clicks Play.
