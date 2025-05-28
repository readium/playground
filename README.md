# 🛝 Readium Playground 

Readium Playground is a reference implementation of [Thorium Web](https://github.com/edrlab/thorium-web) with a dual goal:

* to illustrate how implementers can deploy and build on top of Thorium Web
* but also play with Readium technologies such as [Readium Web](https://readium.org/web) and [Readium CSS](https://github.com/readium/css)

At its core, this project is a Web-based reader for EPUB and other digital publication formats, built using [Next.js](https://nextjs.org), the [TypeScript Toolkit](https://github.com/readium/ts-toolkit), and [Thorium Web components](https://github.com/edrlab/thorium-web). 

## Features

In addition to the [Thorium Web feature set](https://github.com/edrlab/thorium-web?tab=readme-ov-file#features), the Playground currently targets the following features:

- [x] Layout policy to play with the TypeScript Toolkit and Readium CSS capabilities for drawing layouts based on an optimal line length
- [ ] Theming to create custom themes and play with how images are processed when applying them
- [ ] Customization to illustrate how various components of Thorium Web can be tweaked (localization, running headers, progression display, component styles and affordances)

All of these features are implemented using UI components and APIs available to implementers, showcasing how anyone can build on top of our projects using built-in extensibility.

## Getting Started

To get started with Readium Playground, follow these steps:

- Fork or clone the repository: `git clone https://github.com/readium/playground.git`
- Install dependencies: `pnpm install`
- Start the development server: `pnpm dev`
- Open the reader in your web browser: [http://localhost:3000](http://localhost:3000)

The development server will automatically reload the page when you make changes to the code.

To test this project with their own books, developers can install the [Readium CLI](https://github.com/readium/cli) and use the [`serve` command](https://github.com/readium/cli#the-serve-command). 
