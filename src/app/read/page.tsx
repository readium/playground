import { HttpFetcher } from "@readium/shared";
import { Link } from "@readium/shared";
import { Reader } from "@/components/Reader";

// TODO page metadata w/ generateMetadata

export default async function ReaderPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  let error = "";

  let book = "moby-dick";
  let publicationURL = "";
  if (searchParams["book"]) {
    book = Array.isArray(searchParams["book"]) ? searchParams["book"][0] : searchParams["book"];
  }
  if (book.startsWith("http://") || book.startsWith("https://")) {
    // TODO: use URL.canParse()
    publicationURL = book;
    if (!book.endsWith("manifest.json") && !book.endsWith("/"))
      publicationURL += "/";
  } else
    throw new Error("book parameter is required");

  const manifestLink = new Link({ href: "manifest.json" });
  const fetcher = new HttpFetcher(fetch, publicationURL);
  const fetched = fetcher.get(manifestLink);
  const selfLink = (await fetched.link()).toURL(publicationURL)!;

  let manifest: object | undefined;
  try {
    manifest = await fetched.readAsJSON() as object;
  } catch (error) {
    console.error("Error loading manifest", error);
    error = `Failed loading manifest ${selfLink}`;
  }

  return (
    <>{error ? <span>{error}</span> : manifest ? <Reader rawManifest={manifest} selfHref={selfLink} /> : "Loading..."}</>
  );
}
