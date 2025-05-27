"use client";

import { BookUrlConverter } from "@edrlab/thorium-web/epub";
import { Link } from "react-aria-components";

import "./app.css";

export default function Home() {
  return (
    <main id="home">
      <h1>Welcome to Readium Playground (Under Development)</h1>

      <BookUrlConverter />

      <p>Alternatively, here’s a list of reflowable and fixed-layout publications you can read and test:</p>

      <ul>
        <li>
          <Link href="/read?book=https%3A%2F%2Fpublication-server.readium.org%2FZ3M6Ly9yZWFkaXVtLXBsYXlncm91bmQtZmlsZXMvZGVtby9tb2J5LWRpY2suZXB1Yg">Moby Dick (reflow)</Link>
        </li>
        <li>
          <Link href="/read?book=https%3A%2F%2Fpublication-server.readium.org%2FZ3M6Ly9yZWFkaXVtLXBsYXlncm91bmQtZmlsZXMvZGVtby9uYXRoYW5pZWwtaGF3dGhvcm5lX3RoZS1ob3VzZS1vZi10aGUtc2V2ZW4tZ2FibGVzX2FkdmFuY2VkLmVwdWI">The House of the Seven Gables (reflow advanced)</Link>
        </li>
        <li>
          <Link href="/read?book=https%3A%2F%2Fpublication-server.readium.org%2FZ3M6Ly9yZWFkaXVtLXBsYXlncm91bmQtZmlsZXMvZGVtby9sZXNfZGlhYm9saXF1ZXMuZXB1Yg">Les Diaboliques (reflow french)</Link>
        </li>
        <li>
          <Link href="/read?book=https%3A%2F%2Fpublication-server.readium.org%2FZ3M6Ly9yZWFkaXVtLXBsYXlncm91bmQtZmlsZXMvZGVtby9CZWxsYU9yaWdpbmFsMy5lcHVi">Bella the Dragon (FXL)</Link>
        </li>
      </ul>
    </main>
  );
}
