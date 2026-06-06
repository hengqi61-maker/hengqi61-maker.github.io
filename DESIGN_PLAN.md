# Personal Academic Site Apple-Style Redesign Plan

## 1. Positioning and Goals

The redesigned site should read like an academic application homepage with the polish and pacing of an Apple product page or Keynote story. The primary audience is prospective supervisors and academic reviewers, so the design must foreground research fit, evidence of capability, and communication clarity before visual novelty.

Core goals:

- Keep the current public content largely intact while changing the layout, hierarchy, and visual packaging.
- Make the first screen feel more immersive and deliberate, without making it feel like a portfolio template or a visual effects demo.
- Help a supervisor quickly understand Qi Heng's direction: computational physics simulation, physics visualization, numerical modeling, and AI-assisted research tools.
- Preserve the existing application-oriented evidence: research interests, graduate matching plan, mentor matrix, project proof, interactive demos, education, honors, resume, statement, GitHub, and contact routes.

## 2. Worktree and File Boundaries

All implementation work must happen outside the original `main` worktree.

Required Git isolation:

- Original stable site: `/Users/qi-heng/Documents/personal-academic-site`
- Redesign worktree: `/Users/qi-heng/Documents/personal-academic-site-apple-ui`
- Redesign branch: `ui/apple-style`

Before any code or plan edit, verify:

```bash
pwd
git branch --show-current
git worktree list
git status
```

Stop immediately if:

- `pwd` is not `/Users/qi-heng/Documents/personal-academic-site-apple-ui`
- current branch is not `ui/apple-style`
- the worktree has unexpected uncommitted changes

Plan phase file boundary:

- Allowed: create or update `DESIGN_PLAN.md`
- Not allowed: `src/main.tsx`, `src/styles.css`, `src/data.ts`, `public/`, PDF files, bundled demo assets

Implementation phase file boundary:

- Primary editable files: `src/main.tsx`, `src/styles.css`
- Limited editable file: `src/data.ts`, only for small display grouping or metadata needed by the new layout
- Do not edit: `public/em-polarization/`, `public/hydrogen-orbital-demo/`, `public/hydrogen-orbital/`, generated demo assets
- The public personal statement PDF may be regenerated from `content/personal_statement.json`.
- Do not add a large UI framework. Keep React, Vite, and `lucide-react`.

## 3. Required Content Preservation

The redesign must preserve these content elements and entry points:

- Identity: `齐恒`, `Qi Heng`, `Computational Physics Simulation`
- Hero actions: resume download, GitHub link
- Metrics: GPA `3.91 / 5.00`, rank `5 / 65`, CET-6 `551`
- School and major: Donghua University physics background and applied physics track
- Research interests: computational physics simulation, quantum/condensed-matter modeling, physics visualization, AI-assisted research tools
- Graduate plan: statement, direction preferences, matching criteria, summary paragraphs, update date
- Target matrix: school/platform, mentors, internal order, priority, difficulty, rationale, note
- Project evidence: two embedded interactive demos and all existing GitHub projects
- Demo routes: `./hydrogen-orbital-demo/index.html` and `./em-polarization/index.html` iframe sections plus independent open links. Use explicit `index.html` paths because Vite dev server falls directory URLs back to the main app.
- Education, coursework, honors
- Contact: email and GitHub
- Documents: `Qi_Heng_CV.pdf` and `Qi_Heng_Statement.pdf` open in a new browser tab so visitors can read before choosing whether to download.
- Personal interests entry: a Hero action links to the independent `album/index.html` page.

Content that can be rewritten lightly:

- Section titles, eyebrow labels, and short transition copy
- Button labels if the destination remains clear
- Project presentation wording when it still preserves `Problem / Method / Evidence`
- Order and grouping of sections

Content that should not be materially changed without confirmation:

- Project facts, mentor names, priority/difficulty values, GPA/rank/CET-6 values, PDF paths, GitHub URLs, email address

## 4. Page Structure

The final page should use this narrative order:

1. **Sticky Navigation**
   - Minimal translucent header.
   - Brand signal remains `QH` / `齐恒`.
   - Navigation keeps anchor access but looks lighter and less resume-like.
   - Desktop: horizontal links.
   - Mobile: horizontal scroll or compact wrap with no overlap.

2. **Immersive Hero**
   - Centered or near-centered large type.
   - Preserve `齐恒`, `Qi Heng`, `Computational Physics Simulation`.
   - Use a calm low-interference background treatment based on tone, depth, and layout rather than decorative image assets.
   - Replace the current right-side profile card with a lighter institutional line and metric strip.
   - Primary actions: resume download, personal statement, GitHub, and personal album.

3. **Metric Strip**
   - Present GPA, rank, and CET-6 as quiet horizontal metrics below or near the hero.
   - Avoid dense bordered cards.
   - Desktop: one row.
   - Mobile: stacked or horizontally balanced with no text overflow.

4. **Research Direction**
   - Show the research interests immediately after the identity section.
   - Use spacious editorial blocks or a restrained grid.
   - Emphasize the shared theme: translating physics concepts into computable, testable, explainable systems.

5. **Project Evidence Wall**
   - Lead with the two interactive demos as featured proof of physics visualization and computational expression.
   - Show ordinary GitHub projects in a cleaner evidence format: `Problem / Method / Evidence`.
   - Reduce the current dense card feeling with fewer borders, more rhythm, and stronger typographic hierarchy.

6. **Interactive Demo Sections**
   - Keep both iframe embeds.
   - Wrap each demo in a dark immersive section that feels like a product feature reveal.
   - Keep independent open links unchanged.
   - Ensure iframe sizing remains usable on desktop and mobile.

7. **Education and Contact**
   - Keep education, coursework, honors, email, and GitHub.
   - Use a restrained closing section with clear contact actions.

8. **Graduate Matching Plan**
   - Keep the plan, directions, criteria, summary, statement PDF, and mentor matrix.
   - Reduce visual noise and place it near the end so reviewers see capability, demos, education, and contact before detailed matching.
   - Desktop: refined table optimized for scanning.
   - Mobile: always-expanded readable blocks without horizontal overflow.

## 5. Component Structure

The site can remain a single React entry file, but the implementation should organize the UI into small local components to keep the redesign maintainable.

Recommended components:

- `SectionTitle`: keep and refine for Apple-like editorial section headings.
- `HeroActions`: shared action row for resume, GitHub, statement, external demo links.
- `MetricStrip`: horizontal GPA/rank/CET-6 presentation.
- `ResearchInterest`: one research direction item.
- `FeaturedDemoCard`: compact project evidence entry for the two interactive demos.
- `EvidenceProject`: GitHub project card using `Problem / Method / Evidence`.
- `DemoFeatureSection`: dark iframe section with title, copy, action, and embed.
- `GraduatePlanSummary`: statement, directions, criteria, and summary.
- `GraduateMatrix`: responsive desktop table and mobile block presentation.
- `EducationBlock` and `ContactBlock`: final academic background and contact sections.

Implementation constraints:

- Use lucide icons for visible icon buttons and links.
- Do not introduce manually drawn SVG icon systems.
- Keep components simple and local unless the file becomes hard to navigate.
- Prefer data-driven rendering from `src/data.ts`; avoid duplicating content in JSX.

## 6. Visual System

Design direction:

- Apple-like through typography, spacing, restraint, contrast, and pacing.
- Academic credibility first; cinematic polish second.
- No one-note palette. Avoid a page dominated by red, purple, beige, dark blue, brown, or decorative gradients.

Palette:

- Base: white, near-white, black, deep graphite, neutral gray.
- Accent: a restrained cool blue or cyan for interactive/demo emphasis.
- Red should no longer feel like the primary brand color; if kept, use sparingly for small semantic accents only.

Typography:

- Use system UI fonts already present in the project.
- Large first-screen type is allowed.
- Do not scale font size directly with viewport width outside `clamp()`.
- Letter spacing should remain `0` unless a small uppercase eyebrow needs modest spacing.

Surfaces and controls:

- Reduce hard card borders across the page.
- Use white space, tonal contrast, soft shadow, and section bands instead of many boxes.
- Keep card/control inner radius at `8px` or less unless an existing pill control is functionally appropriate.
- Buttons should feel precise and quiet, not heavy or red-call-to-action driven.
- Avoid decorative orbs, bokeh blobs, excessive gradients, and purely ornamental visuals.

Responsive requirements:

- Desktop: strong first screen, clear section rhythm, iframe sections feel immersive.
- Tablet: two-column layouts can collapse into one strong column when content density requires it.
- Mobile: no text overflow, no button crowding, no nav overlap, no iframe unusably narrow, no table horizontal spill.

## 7. Implementation Order After Approval

After the user confirms this plan, implement in controlled passes:

1. **Hero and Navigation**
   - Refactor hero markup.
   - Replace right profile card with institutional line and `MetricStrip`.
   - Restyle sticky nav and actions.

2. **Research and Project Evidence**
   - Rework research interest presentation.
   - Convert project area into an evidence wall.
   - Promote the two demos as featured proof.

3. **Demo Feature Sections**
   - Restyle both iframe sections as immersive dark product-like feature areas.
   - Preserve iframe paths and independent open links.

4. **Graduate Plan and Matrix**
   - Place the graduate plan near the end after evidence, demos, education, and contact.
   - Rebuild matrix presentation for desktop scanning and mobile readability.

5. **Education, Contact, and Polish**
   - Refine closing sections.
   - Audit spacing, colors, button states, responsive behavior, and link affordances.

## 8. Acceptance Criteria

Functional:

- `npm run build` passes.
- Resume download works.
- Statement download works.
- GitHub links work.
- Email link works.
- `./hydrogen-orbital-demo/index.html` iframe and independent link work.
- `./em-polarization/index.html` iframe and independent link work.
- Existing section anchors still navigate correctly.

Visual:

- First screen no longer resembles a resume template.
- GPA, rank, and CET-6 are presented as a light metric strip, not a heavy profile card.
- Projects read as evidence of research and implementation ability.
- Demo sections feel immersive but do not overpower academic credibility.
- Graduate plan is easier to scan and less visually noisy.
- Apple-like quality comes from spacing, typography, rhythm, and restraint.

Responsive:

- Validate around `1280px` desktop width.
- Validate around `390px` mobile width.
- No overlapping navigation, clipped text, over-tight buttons, unusable iframe, or horizontal table overflow.

## 9. Verification Commands

Plan phase:

```bash
git diff -- DESIGN_PLAN.md
git status --short
```

Implementation phase:

```bash
npm run build
npm run dev -- --port 5173
```

Manual browser checks:

- Home and hero.
- Research section.
- Project evidence wall.
- Hydrogen orbital iframe and independent route.
- EM polarization iframe and independent route.
- Graduate plan and target matrix.
- Education and contact.
- Desktop and mobile screenshots.

## 10. Final Decisions

- Graduate plan goes near the end of the page, after the primary capability evidence and contact section.
- Visual accent uses restrained cool blue/cyan.
- `src/main.tsx` remains one file with local components for this pass.
- Matrix mobile presentation uses always-expanded blocks, not collapsible rows.
- The personal album is an independent Vite page rather than an inline homepage section.
- All 12 supplied travel photos are shown without per-image captions; accessible alt text describes only visible content.
- `content/personal_statement.json` is the canonical source for the public personal statement PDF.
