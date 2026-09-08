# Reusable Prompt for Preparing a Professional Technical Project Presentation

A general-purpose prompt you can use with any project you need to present to a technical team that wants to verify you understand the code and the engineering decisions — not just the polished final UI.

## How to Use

Replace the values between brackets before sending the prompt:

- `[Project Name]`
- `[Project Path]`
- `[Presentation Language]`
- `[Duration]`
- `[Audience Type]`
- `[Output Folder]`

## The Prompt

````text
You are a Senior Software Engineer, a technical presentation designer, and a meticulous documentation reviewer.

I want you to put together a professional and creative presentation package for the following project:

- Project Name: [Project Name]
- Project Path: [Project Path]
- Presentation Language: [Presentation Language]
- Duration: [Duration]
- Audience: [Audience Type]
- Output Folder: [Output Folder, default presentation/]

The goal is not just to market the project, but to prove that the project owner genuinely understands what was written: how data moves, why each technology was chosen, what the limits of each decision are, and how the system can be tested and improved.

## Mandatory Working Rules

1. First read the project's instruction files such as AGENTS.md, CLAUDE.md, and README.md, plus any existing style guide.
2. Check the current Git state before modifying anything. Create a separate branch with a descriptive name starting with docs/ or presentation/, and do not delete or revert changes you did not make.
3. Explore the project from the actual source; do not rely on guesses based on the framework name or a common structure.
4. Before writing, identify the task type: is it a limited presentation package or does it need a larger architectural design? Ask one question at a time only if a bracketed field is left unfilled or there is genuine ambiguity in the requirements; do not ask about what is already given.
5. Limit approval waits: present two or three approaches with trade-offs and a recommendation, and wait for the user's approval only when choosing the visual identity of slides.html or when there are fundamentally divergent package structures; otherwise execute directly according to this prompt.
6. Do not claim a function, endpoint, config key, test, or feature you cannot find in the source. Verify every name, path, number, and line before documenting it.
7. Do not modify application code or add dependencies unless the user explicitly asks. The required package is documentation and presentation oriented and should be as self-contained as possible.
8. Do not use generic marketing language such as "extremely fast" or "fully secure" without a benchmark or evidence from the project. State limitations and trade-offs clearly; knowing what is not solved is strong evidence of understanding.
9. Make the text targeted at the specified audience, and use [Presentation Language] for the prose. Keep tool names and programming concepts in English where that increases precision, such as SSG, PWA, Hydration, and Route Handler.

## Project Understanding Phase

Build an organized internal summary before creating the files, including:

- The product type and the problem it solves.
- The stack and its versions from package.json or project files.
- A folder map and the application entry points.
- The routing, public pages, and dynamic pages.
- Server/Client boundaries if the project uses SSR, SSG, or RSC.
- State management and the sources of local and cloud state.
- The data model and the data flow from source to UI.
- API endpoints, the authentication or identity model, and the database.
- The build pipeline, scripts, and PWA or caching if present.
- The testing strategy and the actual test count from the test runner output.
- The biggest performance, security, and scalability decisions.
- Known limitations, risks, and missing features.
- If there are no actual tests or performance numbers, record that as an explicit limitation in all materials, and do not invent numbers or test coverage.

Use precise references in the form `path/to/file.ts:line-range` in the materials, and open the source to verify the numbers before adopting them.

## The Package to Create

Create the following files inside `[Output Folder]`, unless the user asks otherwise:

### 1. `slides.html`

Create a self-contained HTML deck that runs directly in the browser with no extra build or new dependency.

Requirements:

- RTL if the presentation language is Arabic, with correct `lang` and `dir`.
- A distinctive visual identity rooted in the project's domain, not a generic card template or random colors.
- Use a small color system, a clear display font, a readable body font, and a technical font for code where needed.
- Make the file fully offline: no CDN links for fonts, libraries, or icons; use a system font stack or fonts embedded as base64. The live presentation must not depend on the internet.
- Pick one signature visual element that repeats in moderation, such as a data path, an editorial margin, or a time grid.
- Do not pack dense text without hierarchy. Make every slide answer a single question.
- Add keyboard navigation with unified shortcuts: arrows and Space to navigate, Home/End to jump to either end, F for fullscreen, N for speaker notes, O for the index, Esc to close. Document the same shortcuts in the README. Add buttons with `aria-label`, a slide index, speaker notes, and touch support where appropriate.
- Honor `prefers-reduced-motion`, add responsive styles for mobile, and print styles if useful.
- Make slide numbering dynamic or automatically verify it matches the real count.
- Use code snippets that match the project with full HTML-escaping when embedding them in slides.html. If a snippet is incomplete, label it explicitly as a "snippet" and do not present fake code as if it were runnable.

Split the deck into a clear story that fits `[Duration]`, using an indicative pacing formula: one to two slides per two minutes of speaking time, after subtracting the demo and Q&A time:

- Opening: what is the product, and what is the problem?
- Thesis: what is the governing engineering idea?
- Decisions journey: why did the architecture change or the technologies get chosen?
- Mental model: one inline SVG diagram showing the data flow, not external images.
- Product experience: what does the user see?
- Technical deep dive: routing, rendering, state, data, performance, security, testing.
- Live demo: a divider slide pointing to the script file.
- Trade-offs: what did we gain and what did we pay for it?
- Roadmap: priorities based on risk, not a wish list.
- Closing: one sentence, then open questions.

### Hydration Explanation Inside `slides.html` (Mandatory When SSR, SSG, or Client Components Are Present)

Add a clear slide, or a clear section within a slide, that explains the process in detail rather than with a shallow definition:

1. **Server render:** what does the server compute, and what can it not access, such as `window` and `localStorage`?
2. **HTML response:** how does the HTML reach the browser and render before the JavaScript completes?
3. **First Client Render:** why must the client produce the same initial tree that the server produced?
4. **Hydration:** clarify that it is the process of attaching React to the existing tree and adding event handlers, not a CSR that starts from an empty DOM.
5. **Effects after commit:** explain that `useEffect` runs after the tree is committed and can read browser-only APIs and update state in a later valid render.
6. **Mismatch:** show a wrong example that reads a preference from `localStorage` during the initial render, and show how the server can produce `dark` while the first client render produces `light`.
7. **The result:** explain that differing markup before hydration completes can lead to a warning, an error, tree reprocessing, or unexpected DOM, depending on the framework and the case.
8. **The correct pattern:** show the actual pattern in the project: a fixed default, a read after mount, and a `hydrated` save-guard that prevents overwriting the saved value.
9. **An important distinction:** separate a mismatch during the first render from a state update after `useEffect`; the latter is expected if the former matches.
10. **Practical application:** tie the explanation to an existing ThemeContext or storage hook. If a test proving the default before mount, restoration after mount, and no data clobbering exists, point to it; otherwise state its absence.

### 2. `demo-script.md`

Write a numbered live demo script in `[Presentation Language]`, suited to `[Duration]`, including:

- A time allocation for each segment.
- Correct preflight commands from package.json.
- What the speaker opens in the browser and what they say at each step.
- Evidence of behavior from the outside, then a link to a file and line from the inside.
- A routing or URL state exercise if present.
- A local state and reload exercise.
- A search or core processing exercise.
- An API or sync exercise, noting the environment conditions required.
- A PWA or offline exercise from a production build if the service worker is disabled in dev.
- The detailed Hydration explanation above, with a mismatch example and a safe-pattern example.
- A fallback plan if the database, environment variables, or a request fails.
- Statements to say and statements to avoid so the presentation does not overclaim.

Do not write commands that do not exist in the project's scripts. If a command depends on Linux or an external tool, state it clearly and provide an alternative path.

### 3. `qa-guide.md`

Create a team Q&A guide in `[Presentation Language]`, with between 25 and 35 questions depending on project size. Group the questions into categories such as:

- Architecture and system design.
- Rendering and SSR/SSG/CSR and Hydration.
- Routing and state management.
- Data pipeline and text processing.
- API, database, and identity.
- Performance, caching, and PWA.
- Security and threat model.
- Testing and observability.
- Trade-offs and roadmap.

For every question write:

- A short answer speakable within 30–60 seconds.
- A precise file and line reference.
- The trade-off or the known limit.
- A follow-up improvement when appropriate.

Add explicit questions about:

- The difference between SSR, CSR, and Hydration.
- Why mismatches happen and how to prevent them.
- What happens before and after `useEffect`.
- Why you cannot read browser APIs during render in an SSR app.
- What was actually tested and what was not.
- Which claims the presenter should not make.

### 4. `README.md`

Document how to run the package, the slide shortcuts, the order of use, and the pre-presentation checks. Mention any real environmental requirement or build warning, and do not add unverifiable claims.

## Quality Review and Verification

After creating the files:

1. Review every claim, path, and number against the actual source.
2. Verify that every Markdown code block is balanced and that all links and paths exist.
3. Check the embedded HTML and JavaScript, the slide count, the numbering, the index, and the keyboard shortcuts.
4. Run a smoke test of the deck when possible: parse it via JSDOM or an HTML parser already available in the project (do not add a new dependency), then test next/previous, overview, and notes.
5. Run the actual verification commands from the scripts in package.json with the correct package manager for the project — read it from the existing lockfile (pnpm-lock.yaml, package-lock.json, yarn.lock, or bun.lockb). Example for a pnpm project:

   ```bash
   pnpm test
   pnpm run lint
   pnpm run build
   ```

6. Do not run build and typecheck in parallel if typecheck reads generated `.next` files; run them sequentially.
7. Run `git diff --check`, and review newly added files and any changes unrelated to the task.
8. Do not claim test, lint, or build success without showing a fresh result with numbers and status.
9. Do not create a commit or PR unless the user explicitly asks.

## Final Report Format

Return a concise report including:

- The files created and the responsibility of each.
- The key visual and organizational decisions.
- How Hydration and SSR/CSR mismatch were explained.
- The verification commands and their actual results.
- Any warning or limitation that remains.
- The current branch name.
- A clear confirmation if no commit or PR was created.
````

## Practical Note

If the team is going to test your understanding of the code, do not memorize the slides verbatim. Use them as a map, open the source when asked, then answer in this order: **entry point → data flow → reason for the decision → trade-off → test**.
