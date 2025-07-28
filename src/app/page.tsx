"use client";

import { MANIFEST_CONFIG } from "@/config/manifest";

import { PublicationGrid } from "@edrlab/thorium-web/epub";
import Image from "next/image";

import "./base.css";
import "./home.css";

const books = [
  {
    title: "Moby Dick",
    author: "Herman Melville",
    cover: "/images/MobyDick.jpg",
    url: "/read/moby-dick",
    rendition: "Reflowable"
  },
  {
    title: "The House of the Seven Gables",
    author: "Nathaniel Hawthorne",
    cover: "/images/TheHouseOfTheSevenGables.jpg",
    url: "/read/the-house-of-seven-gables",
    rendition: "Reflowable"
  },
  {
    title: "Les Diaboliques",
    author: "Jules Barbey d'Aurevilly",
    cover: "/images/LesDiaboliques.png",
    url: "/read/les-diaboliques",
    rendition: "Reflowable"
  },
  {
    title: "Bella the Dragon",
    author: "Barbara Nick, Elaine Steckler",
    cover: "/images/Bella.jpg",
    url: "/read/bella-the-dragon",
    rendition: "Fixed Layout"
  }
];

const onlineBooks = [
  {
    title: "Accessible EPUB3",
    author: "Matt Garrish",
    cover: "/images/accessibleEpub3.jpg",
    url: "/read/manifest/https%3A%2F%2Fpublication-server.readium.org%2FaHR0cHM6Ly9naXRodWIuY29tL0lEUEYvZXB1YjMtc2FtcGxlcy9yZWxlYXNlcy9kb3dubG9hZC8yMDIzMDcwNC9hY2Nlc3NpYmxlX2VwdWJfMy5lcHVi%2Fmanifest.json",
    rendition: "Reflowable"
  },
  {
    title: "Children Literature",
    author: "Charles Madison Curry, Erle Elsworth Clippinger",
    cover: "/images/ChildrensLiterature.png",
    url: "/read/manifest/https%3A%2F%2Fpublication-server.readium.org%2FaHR0cHM6Ly9naXRodWIuY29tL0lEUEYvZXB1YjMtc2FtcGxlcy9yZWxlYXNlcy9kb3dubG9hZC8yMDIzMDcwNC9jaGlsZHJlbnMtbGl0ZXJhdHVyZS5lcHVi%2Fmanifest.json",
    rendition: "Reflowable"
  }
];

export default function Home() {
  return (
    <main id="home">
      <header className="header">
        <figure className="logo-container">
          <Image 
            src="/images/ReadiumLogo.png" 
            alt="Readium Logo" 
            width={ 60 }
            height={ 60 }
            priority
          />
        </figure>
        <h1>Welcome to Readium Playground</h1>
        <p className="subtitle">Reference implementation of <a href="https://github.com/edrlab/thorium-web">Thorium Web</a>, <a href="https://github.com/readium/web">Readium Web</a> and <a href="https://github.com/readium/css">Readium CSS</a>.</p>
      </header>

      <PublicationGrid
        publications={ books }
        renderCover={ (publication) => (
          <Image
            src={ publication.cover }
            alt=""
            loading="lazy"
            width={ 120 }
            height={ 180 }
          />
        ) }
      />

      { MANIFEST_CONFIG.enabled && (
        <>
        <div className="dev-books">
          <p>In dev you can also use the <code>/manifest/</code> route to load any publication. For instance:</p>
          
          <PublicationGrid
            publications={ onlineBooks }
            renderCover={ (publication) => (
              <Image
                src={ publication.cover }
                alt=""
                loading="lazy"
                width={ 120 }
                height={ 180 }
              />
            ) }
          />
        </div>
        </>
      ) }
    </main>
  );
}
