# EEC Design & Typography Styleguide

## 1) Font Families and CSS Properties
- Inter: global sans for body/headings; sizes 16/18/20/24/30/38/46; weights 400/500/600
- Roboto: form selects/controls; size 14; weight 300; color #142642
- Body: font-family Inter; 16px; weight 400; line-height ~1.5
- Headings: weights 500–600; H1/H2 strongly emphasized; H3/H4 medium weight

## 2) Visual Hierarchy & Typography Scale
- Base 16px with scale: 18/20/24/30/38/46
- Weights: 600 for top-level titles; 500 for subsections; 400 for body
- Small text: 12–14px for metadata/captions
- Clear spacing above/below headings; readable line-lengths

## 3) Patterns: Headers, Body, Interactions
- Headers: large sizes and heavier weights; consistent spacing and dividers
- Body: Inter 16px 400; comfortable line-height; restrained tracking
- Buttons: primary/gold/border variants; transitions ~0.2–0.3s
- Inputs: focus border-color primary; visible focus/hover; clear icons
- Tabs/Cards/Lists: token-driven borders, hover emphasis, subtle elevation

## 4) Color Palette (Hex) & Usage
- Primary: #162741 text/headings/icons
- Gold: #B58E46 accents/highlights/badges
- White: #FCFCFC base surface
- Gray: #737D8D secondary text
- BG Blue: #EDF0F9 soft panels
- BG Gray: #F6F6F6 neutral panels
- Line: #DDDDDD borders/dividers
- Success: #46B564; Alert: #CC193D
- Guideline: maintain AA contrast for text and interactive states

## 5) Spacing & Layout Grid
- Spacing increments: 4/8/12/16/20/24/32/48px
- Grid: CSS Grid with 2–5 columns responsive; fractional editorial layouts
- Breakpoints: ~430/767/1023/1279/1280/1480
- Containers: mix of percentages and fixed widths (e.g., 920px, 648px)

## 6) Emotional Impact & Brand
- Mood: formal, trustworthy, authoritative; blue-centric palette
- Personality: serious, modern clarity; Inter supports readability
- Accessibility: strong contrast defaults; ensure gold/gray variants meet AA

## Design Tokens (CSS)
```css
:root.eec-theme{
  --primary:#162741;
  --gold:#B58E46;
  --white:#FCFCFC;
  --gray:#737D8D;
  --bg-blue:#EDF0F9;
  --bg-gray:#F6F6F6;
  --line:#DDDDDD;
}
```

## Tailwind-Compatible Variables
```css
.eec-theme{
  --background:0 0% 100%;
  --foreground:234 50% 17%;
  --primary:234 50% 17%;
  --primary-foreground:0 0% 99%;
  --secondary:217 10% 50%;
  --accent:39 44% 49%;
  --destructive:353 74% 50%;
  --border:0 0% 87%;
  --input:0 0% 87%;
  --ring:234 50% 17%;
}
```

## Implementation Snippets
```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap");
.eec-theme body{font-family:Inter,sans-serif}
h1{font-weight:600;font-size:46px}
h2{font-weight:600;font-size:38px}
h3{font-weight:500;font-size:30px}
body{font-weight:400;font-size:16px}
.small{font-size:14px}
.btn-primary{background:#162741;color:#FCFCFC;padding:12px 20px}
```

## Usage
- Add class "eec-theme" on a top-level container or <body> to activate
- Use Tailwind color utilities (text-primary, bg-primary) backed by variables
- Map components to the spacing scale and use semantic colors for states
