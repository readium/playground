# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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