# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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