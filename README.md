# huidrom.com — Phase 04: Editorial Executive Homepage

This package replaces the entire static website source. Keep the existing `update-huidrom-site.bat` workflow.

## What changed
- Reframed the site as a personal, editorial executive homepage inspired by the approved reference: warm ivory, elegant serif headings, restrained gold accents and pale-blue visual details.
- Reduced the hero portrait substantially on desktop and mobile so it feels secondary to the headline. The supplied portrait asset remains unchanged; its existing background-mask limitations may still be visible, but the smaller presentation makes it less dominant.
- Made the primary hero invitation “Talk to Ask Hudi” and added a dedicated Ask Hudi preview section. The bot is explicitly marked as coming soon; no nonfunctional chat is presented as live.
- Expanded experience highlights for ZS Associates / ZAIDYN and FIS / Worldpay, including ZIDM, platform capabilities and the stated scale of up to 50 engineers across five scrum teams.
- Added a “What I love solving” section, AI point of view, building engineering in India, projects and leadership principles.
- Added responsive mobile navigation, keyboard-visible native links, reduced-motion support, metadata and updated cache-busting asset versions.
- Kept this as a static site with no framework or build step.

## What to verify after deployment
1. The hero uses the warm ivory / pale-blue editorial style and shows your portrait on the right on desktop.
2. The portrait is intentionally smaller than in Phase 04’s first deployment. Check that it no longer dominates the hero; note that the existing cutout may still show remnants of the original photo background.
3. The hero headline reads “Building engineering organizations for the AI era.”
4. “Talk to Ask Hudi” takes you to the Ask Hudi preview section, which says the chatbot is coming soon.
5. Navigation links scroll to About, Experience, What I Solve, Projects and Ask Hudi.
6. Experience includes the ZIDM revamp and ZAIDYN platform scope, plus FIS / Worldpay scale (up to 50 engineers and five scrum teams).
7. “What I love solving”, AI, India, projects and leadership sections appear below the hero.
8. On mobile, the menu opens and closes, cards stack cleanly, and there is no horizontal scrolling.
9. Contact opens an email to `hellohudi@gmail.com`; GitHub link opens `j-huidrom`.
10. Ask Hudi is clearly a preview only; no live AI backend has been wired yet.

## Deployment
Extract/replace via the existing `update-huidrom-site.bat`. It should select this package when named `huidrom-phase-4.zip`, validate the phase, commit and push to `master`, then Cloudflare Pages will deploy from GitHub.
