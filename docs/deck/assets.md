# Deck Assets

Use these canonical assets when building the slide deck. Prefer assets that match the current live Weave UI.

## Logos

| Asset | Path | Use |
|-------|------|-----|
| Primary live wordmark | `apps/web/public/brand-icons/weave-transparent-logo-updated.png` | Title slide, product screenshots, submission deck. |
| Scalable transparent logo | `icons/transparent logo.svg` | Best for slide tools that support SVG. |
| High-res transparent logo | `icons/transparent logo upscale.png` | Large title or closing slide if SVG is awkward. |
| Navy logo artwork | `icons/weave_icon_assets_named/minimalist_woven_logo_on_navy_background.png` | Optional dark closing slide. |
| Small dark icon | `icons/weave dark small icon.png` | Corner mark or appendix slide. |

Avoid older or ambiguous variants unless deliberately comparing brand exploration:

- `apps/web/public/brand-icons/weave-transparent-logo.png`
- `apps/web/public/brand-icons/weave-logo.png`
- `weave logo.png`
- `updated weave logos.png`

## App Icons

Use these from `apps/web/public/brand-icons/`:

| Icon | Concept |
|------|---------|
| `profile.png` | Candidate profile and proof. |
| `finder.png` | People Finder. |
| `network.png` | Useful connections and weak ties. |
| `chat.png` | Coaching. |
| `draft.png` | Outreach drafting. |
| `followups.png` | Follow-up pipeline. |
| `pin.png` | One company/search workspace. |
| `brand.png` | Only use if visually confirmed; it is not necessary for the core deck. |

## Alternate Icon Exploration

The folder `icons/weave_icon_assets_named/` contains exploratory art. Use only if a slide needs larger illustrated icons and the art matches the app screenshots.

Useful candidates:

- `user_connection_icon_with_magnifying_glass.png`
- `connected_people_network_icon.png`
- `modern_chat_bubble_with_woven_knot.png`
- `stylized_pushpin_with_ribbon_loop.png`
- `document_with_ribbon_link_icon.png`
- `minimal_calendar_with_check_mark_icon.png`
- `weave_brand_icon_system_overview.png`

## Fonts

Loaded in `apps/web/index.html`:

- Bricolage Grotesque: titles.
- Figtree: body, captions, labels.
- Newsreader: quotes, outreach examples, emotional copy.

Use the same fonts in Figma, Canva, Keynote, or Google Slides when possible.

## Palette

Use these slide swatches:

```text
Canvas:        #fafbff
Soft shell:    #eef2ff
Card:          #ffffff
Ink:           #0f172a
Muted text:    #5b6474
Primary blue:  #2563eb
Bright blue:   #3b82f6
Pink:          #ec4899
Yellow:        #eab308
Green:         #22c55e
Purple:        #a855f7
Cyan:          #06b6d4
Border:        #e2e8f0
```

## Screenshot Destination

When screenshots are captured later, save them under:

```text
docs/deck/screenshots/
```

Recommended filenames are listed in [screenshot-shotlist.md](./screenshot-shotlist.md).

## Naming Rules

- Deck title: Weave.
- Repository name: OMNI, only in technical appendix or repo link.
- Internal codename/package prefix: Hermes, avoid in user-facing slides unless explaining repo internals.
