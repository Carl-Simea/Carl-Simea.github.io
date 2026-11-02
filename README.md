# Simea Tech: Carl Wendy Simea's Engineering Portfolio

**Live site:** https://carl-simea.github.io

I'm a Computer Engineering Technology student at New York City College of Technology (City Tech, CUNY), graduating in December 2027. I build embedded systems, robotics and medical AI tools, from wiring and soldering circuits to writing the C/C++ and Python that runs them. I'm looking for embedded systems, robotics and hardware internships.

## What's on the site

| Page | What you'll find |
|---|---|
| **Home** | Who I am and links to everything else |
| **About Me & Resume** | Bio, October 2026 resume (PDF download and print view), skills and contact links |
| **Project 01: Claw-Style Vending Machine** | Arduino Mega 2560 3-axis gantry built with a teammate: video reels with keyframes, pin mapping, a debugging post-mortem, a power-rail schematic, an 11-part bill of materials and the code |
| **Project 02: MedPeek** | Gemma 4 X-ray reader from Hack Day Brooklyn: how my offline Flask + Ollama version reads hand X-rays, plus real code from the [MedPeek repo](https://github.com/Carl-Simea/MedPeek) |

## How it's built

A static site hosted on GitHub Pages, with no framework and no build server.

- **HTML, CSS and vanilla JavaScript**, split into `index.html`, `style.css` and `app.js`
- **Tailwind CSS v3.4**, pre-built into `style.css` (no CDN script at runtime)
- **Font Awesome** icons and **Google Fonts** (Cormorant Garamond, Inter, JetBrains Mono)
- Light and dark mode, saved in the browser
- One page with four views, switched by the URL hash: `#home`, `#about`, `#claw`, `#medpeek`
- Print stylesheet that turns the About page into a one-page resume

## Repository layout

```text
├── index.html                 # Page structure and content
├── style.css                  # Tailwind utilities + custom theme
├── app.js                     # Navigation, search, theme toggle, video player, code viewers
├── README.md
└── content/
    ├── profile.jpeg                         # Profile photo
    ├── Carl_Wendy_Simea_Resume_Oct_2026.pdf # Resume
    ├── Clawmachine1.mp4                     # Reel 1: full gantry run (480p)
    ├── clawMachine2.mp4                     # Reel 2: Snickers grab close-up (480p)
    ├── clawmachine1-poster.jpg              # Poster frame for reel 1
    └── clawmachine2-poster.jpg              # Poster frame for reel 2
```

Optional: save a screenshot as `content/medpeek-screenshot.png` and it appears on the MedPeek page automatically.

## Run it locally

```bash
git clone https://github.com/Carl-Simea/carl-simea.github.io.git
cd carl-simea.github.io
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Editing notes

- **New Tailwind classes need a rebuild.** `style.css` only contains the Tailwind classes the site uses today. If you add a new one to `index.html` or `app.js`, rebuild Part 1 of `style.css`:

  ```bash
  npm install -D tailwindcss@3
  npx tailwindcss -i input.css -o tailwind.css --minify --content "./index.html,./app.js"
  ```

  `input.css` holds the three lines `@tailwind base;`, `@tailwind components;` and `@tailwind utilities;`. Paste the output over Part 1 of `style.css` and leave Part 2 (the custom theme) as it is.
- **Changing the photo:** replace `content/profile.jpeg` and keep the same name. The crop is set in `.portrait-media` in `style.css`.
- **Videos:** keep them H.264 MP4 with `-movflags +faststart` so they start quickly on GitHub Pages.

## Contact

- Email: simeacarlwendy@gmail.com
- GitHub: [Carl-Simea](https://github.com/Carl-Simea)
- LinkedIn: [Carl Wendy Simea](https://www.linkedin.com/in/carl-wendy-simea/)

© 2026 Carl Wendy Simea