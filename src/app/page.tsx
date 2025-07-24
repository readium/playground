"use client";

import { Link } from "react-aria-components";
import Image from "next/image";

import "./base.css";
import "./home.css";

const books = [
  {
    title: "Moby Dick",
    author: "Herman Melville",
    cover: "/images/MobyDick.jpg",
    url: "/read?book=https%3A%2F%2Fpublication-server.readium.org%2FZ3M6Ly9yZWFkaXVtLXBsYXlncm91bmQtZmlsZXMvZGVtby9tb2J5LWRpY2suZXB1Yg",
    rendition: "Reflowable"
  },
  {
    title: "The House of the Seven Gables",
    author: "Nathaniel Hawthorne",
    cover: "/images/TheHouseOfTheSevenGables.jpg",
    url: "/read?book=https%3A%2F%2Fpublication-server.readium.org%2FZ3M6Ly9yZWFkaXVtLXBsYXlncm91bmQtZmlsZXMvZGVtby9uYXRoYW5pZWwtaGF3dGhvcm5lX3RoZS1ob3VzZS1vZi10aGUtc2V2ZW4tZ2FibGVzX2FkdmFuY2VkLmVwdWI",
    rendition: "Reflowable"
  },
  {
    title: "Les Diaboliques",
    author: "Jules Barbey d'Aurevilly",
    cover: "/images/LesDiaboliques.png",
    url: "/read?book=https%3A%2F%2Fpublication-server.readium.org%2FZ3M6Ly9yZWFkaXVtLXBsYXlncm91bmQtZmlsZXMvZGVtby9sZXNfZGlhYm9saXF1ZXMuZXB1Yg",
    rendition: "Reflowable"
  },
  {
    title: "Bella the Dragon",
    author: "Barbara Nick, Elaine, Steckler",
    cover: "/images/Bella.jpg",
    url: "/read?book=https%3A%2F%2Fpublication-server.readium.org%2FZ3M6Ly9yZWFkaXVtLXBsYXlncm91bmQtZmlsZXMvZGVtby9CZWxsYU9yaWdpbmFsMy5lcHVi",
    rendition: "Fixed Layout"
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

      <div className="book-grid">
        { books.map((book, index) => (
          <Link key={ index } href={ book.url } className="book-card">
            <figure className="book-cover">
              <Image 
                src={ book.cover } 
                alt="" 
                width={ 120 }
                height={ 180 }
                className="book-image"
              />
            </figure>
            <div className="book-info">
              <h3 className="book-title">{ book.title }</h3>
              <p className="book-author">{ book.author }</p>
              <p className="book-rendition">{ book.rendition }</p>
            </div>
          </Link>
        )) }
      </div>
    </main>
  );
}
