# Portfolio

The portfolio presents Laxman's identity, work, experience, and writing while preserving his established visual voice.

## Language

**Site shell**:
The shared navigation, content frame, responsive spacing, and footer surrounding every portfolio page.
_Avoid_: Page data, content

**Portfolio dock**:
The fixed bottom, icon-only navigation pill. Its portrait button represents Home, its route controls expose the portfolio's primary sections through accessible labels and tooltips, and its utility area contains the Sound control.
_Avoid_: Sidebar, theme switcher

**Portfolio content**:
The existing personal copy, project records, timeline entries, writings, media, and route structure presented by the site shell.
_Avoid_: Layout, chrome

**Structural transplant**:
Adopting the reference site's site-shell composition and navigation behavior while retaining the portfolio's typography, colors, personality, routes, and portfolio content.
_Avoid_: Visual clone, redesign from scratch

**Doorway card**:
A visual homepage entry point to Projects, Timeline, or Writings. It summarizes a destination without introducing new portfolio content.
_Avoid_: Project record, navigation dock item

**Editorial section**:
A numbered homepage content group that reorganizes existing portfolio content into the reference-inspired composition.
_Avoid_: New content category

**Project row**:
A single-column Projects entry with a compact icon and the project's existing title, description, tags, company, and dates.
_Avoid_: Rotated card, project detail

**Experience row**:
A compact chronological Timeline entry with the existing employer image, title, description, dates, and link to its detail page.
_Avoid_: Alternating timeline card, project row

**Writing group**:
A year-labeled collection of compact article rows built from the existing writing metadata.
_Avoid_: New category, undivided article list

**Portfolio footer**:
The shared three-part footer containing Laxman's colophon and view count, existing contact links, and the portfolio route index.
_Avoid_: Clock, coordinates, braille, preferences

**Analytics admin**:
The private owner-only `/admin` area for viewing portfolio audience analytics.
_Avoid_: Content editor, media manager, AMA operations

**Anonymous visitor**:
A browser identified primarily by the existing first-party session cookie for analytics deduplication. A short-lived daily HMAC of its IP is used only when the cookie is unavailable.
_Avoid_: Raw IP record, browser fingerprint, named user

**View event**:
A visible portfolio route visit submitted with only its pathname. The server derives privacy-limited aggregate dimensions and does not retain a raw event record.
_Avoid_: Proxy hit, asset request, individual visitor history

**Analytics summary**:
An owner-only 7, 30, or 90-day aggregate of views, unique visitors, routes, referring domains, devices, and the all-time total.
_Avoid_: Raw event export, personal visitor profile

**Portfolio owner**:
The single GitHub account authorized to access Analytics admin pages and APIs.
_Avoid_: Registered user, editor, public administrator

**Dither treatment**:
The portfolio-wide print treatment applied selectively to ambient background texture and imagery. Interactive images can reveal their originals, while prose, code, diagrams, and tables remain crisp.
_Avoid_: Full-page readability filter, permanent image degradation

**Content cover**:
A paper-framed, slightly tilted, dithered lead image for a Project, Timeline entry, or Writing that already has meaningful lead media.
_Avoid_: Generated placeholder, technical diagram treatment

**Metadata plate**:
The category-specific facts beneath an MDX title. It presents only available Writing, Project, or Timeline metadata and never renders empty cells.
_Avoid_: Generic card, repeated body content

**MDX content contract**:
The file-based authoring format shared by Writings, Projects, and Timeline. It uses route-aware Cali-style rendering, dimensioned colocated image references, and the portfolio's existing metadata and content without a database.
_Avoid_: Remote CMS, database-backed content, literal Cali data model

**Content rail**:
The generated in-page table of contents for an MDX detail page with at least two headings. It tracks the active section and adapts from a desktop side rail to a compact mobile control.
_Avoid_: Primary navigation, footer index

**Collection navigation**:
The previous, next, and index links at the end of an MDX detail page, scoped to that page's Writing, Project, or Timeline collection.
_Avoid_: Algorithmic recommendations, cross-collection suggestions

**Sound control**:
The dock utility that lets a visitor enable or mute the portfolio's navigation sounds. Sound is enabled on a first visit, and the visitor's later choice persists locally.
_Avoid_: Theme toggle, preferences

**Sound cue**:
A short semantic response to a deliberate route change, dock selection, dither toggle, successful code copy, mobile Content rail toggle, or Sound control change.
_Avoid_: Hover sound, scroll sound, reading-progress sound
