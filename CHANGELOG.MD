# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] – 2026-04-23

### Added

- Support for RTL and CJK
- New ligatures and ruby annotations settings
- Settings are automatically filtered out depending on the script and writing mode of the publication
- RTL and CJK font collections in default preferences

### Changed

- Availability and usage of settings is now checked before submitting preferences to the Navigator on instantiation
- Table of Contents’ tree is now displayed in the direction of the publication
- Scroll Affordances are now displayed in the direction of the publication

### Fixed

- The paginated arrows will now be disabled correctly at the start and end of publications with a RTL progression-direction
- Audio Progression bar is now direction LTR in all languages, like playback controls

## [1.3.0] – 2026-04-16

### Added

- Support for audiobooks – through Thorium Web `1.3.0`
- WebPublications are now exposed
- Two new containers are available, `compactPopover` (audio specific) and `Modal`
- Two new variants for settings are available: `SliderWithPresets` and `PresetsGroup`

### Changed

- Actions are now using profile-based keys, per Thorium Web `1.3.1` change
- Updated spacing presets
- The docking system will not check if the key/component is available and clean up the panels if it is not
- Numberfield now listens for input change to enable/disable buttons when the value change

### Fixed

- Resolves a bug where `useWebkitPatch` fires continuously in scroll
- Fixes bottom sheet snapping and fallback scrim
- Corrects application of `onHover` theme color for `hover` state
- Slider now gets the formatted value for output

## [1.2.0] – 2026-03-20

### Changed

- Updated Thorium Web to `1.2.0`
- Updated Thorium Web imports to `reader` scope instead of `epub`
- Updated routes’ `pages` to handle Publication and processed errors
- Switched `CustomReader` component to ReaderWrapper

### Fixed

- Reuse of i18n when already instantiated
- Jump to Position now protect against empty position in positions list

## [1.1.5] – 2026-03-03

### Changed

- Updated Thorium Web to `1.1.5`, which adds the restriction settings for content protection through preferences

## [1.1.4] – 2026-10-14

### Changed

- Updated Thorium Web to `1.1.4` (quick fix to WebPub that does not apply to the current version of the playground)

## [1.1.3] – 2026-02-10

### Added

- Support for custom fonts through preferences in font family setting

### Changed

- Migrated to NextJS 16

## [1.1.2] – 2026-01-29

### Added

- Enabled Italian locale

### Fixed

- Fixed a memory leak in Timeline hook

## [1.1.1] – 2026-01-23

### Changed

- Updated Thorium Web to `1.1.1`, updated i18n 

## [1.1.0] – 2026-01-19

### Changed

- Updated Thorium Web to `1.1.0`, updated import paths and styling
- Switched sepia and paper themes

## [1.0.8] – 2025-12-03

### Fixed

- Fixed `font-size`/`zoom` where an image, video, or audio element in a global div could disable the user setting entirely

## [1.0.7] - 2025-11-10

### Added

- Some Reader Preferences such as running head, progression, navigation arrows and scroll affordances can now be set through a new Reader Settings Panel

### Changed

- Default order of spacing settings in their subpanel has been updated

### Fixed

- Styling of the pagination component in scroll has been fixed and is no longer shifted when missing a previous link
- Remaining positions in resource has been fixed to account for resources with a single position available

## [1.0.6] - 2025-10-14

### Fixed

- When on layout presets, pressing escape will now close the sheet properly
- Resolves an edge case where radio group would not be tabbable if its value could not be found in the items list
- Fixes the Safari glitch on tab-focus of the bottom sheet

## [1.0.5] - 2025-10-08

### Added

- Spacing presets in settings
- automatic support for visual keyboard arrow navigation in radio group settings

### Changed

- Spacing presets are used as default instead of publisher styles toggle
- Spacing settings are now resettable
- Simplified font-weight setting
- Default line lengths are now 40, 55, and 70 characters
- Validation of allowed domains is now done through an API route, and not client-side
- All environment variables are now private

### Fixed

- Expand button will no longer shrink if the table of contents entry is particularly long and wraps several lines
- Resource and total progressions are now updated correctly on location change

## [1.0.4] - 2025-09-19

### Added

- preference for progression in the bottom bar
- preference for running head in the top bar
- preference for document title in the browser’s tab
- support for theme-color (browser’s address bar)
- environment variable for asset prefix

### Changed

- updated layout presets values
- gap and padding of radio items
- preferences are now settable @ runtime

### Fixed

- logic for finding the first focusable element in sheets
- layout shift of the draggable bottom sheet when focusing elements within its scroller

## [1.0.3] - 2025-09-03

### Changed

- paragraph spacing + indent settings have now a default variant of numberfield
- new grid styling for radio items
- Slider label is clipped when overflowing instead of wrapping
- the Docked Sheet now scrolls into view instead of focusing so that it does not steal focus when open
- the bottom sheet now snaps to its larger point if keyboard navigation is detected within the modal – this gets around a Safari bug where it would scroll the container in addition to the scroller on focus
- ReadiumCSS has been updated to beta version 19

### Fixed

- the bottom sheet now autofocuses properly on opening
- the bottom sheet’s artifact of focus on opening has been resolved in Safari for Jump to Position Action
- layout shift of the selected ToC entry has been resolved
- The line-length inconsistency between auto and 1 column, and 2 columns when there is just enough space for 1, has been fixed

## [1.0.1] - 2025-08-21

### Added

- Lithuanian, Portuguese Brazilian, and Tamil locales for Thorium Web core components.

### Changed

- Focuses the selected entry in the ToC when displayed in a docked sheet.
- Middleware was removed and replaced with redirect in `next.config.js`. `.env` file was moved to the root directory, allowed domains are now handled through `usePublication` hook.

### Fixed

- Fixes a regression with the pagination component layout in Scroll UI.

## [1.0.0] - 2025-08-01

### Fixed

- Support for Fixed-Layout EPUB following `@readium/shared` v2.0.0.

## [1.0.0-beta.8] - 2025-07-31

### Added

- Support for internationalisation.
- Back link to homepage/library.

### Changed

- Redesigned homepage with a grid of Publications.
- Redesigned scroll UI.
- Migrated from `book` parameter to route with a book identifier (e.g. /read/[identifier]).
- Layout Strategies are now presets. ([#2](https://github.com/readium/playground/issues/2))
- Column component has been improved to take into account the actual count applied through the `EpubNavigator` Preferences API.
- Increased the range for font-size, with a max of `400%` instead of `250%`.

### Fixed

- Corrected initialization of the `lineLength` state.
- Fixed bottom sheet glitch in Safari on animation enter.

## [1.0.0-beta.2] - 2025-06-20

### Changed

- The `theme` state was separated for reflowable and fixed layout EPUB, since preferences allow a different set of themes for each.

### Fixed

- Fix light theme which was not applied properly.
- Fix regression in theme component where using arrow keys to navigate between themes.