import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Link from '@mui/material/Link';

export default function Home() {
  return (
    <main>
      <h1>Welcome to the Readium Playground (Under Development)</h1>

      <p>Here’s a quick access to a reflowable and a Fixed-Layout Publication:</p>

      <List>
        <ListItem>
          <Link href="/read?book=https%3A%2F%2Fpublication-server.readium.org%2FbW9ieS1kaWNrLmVwdWI">Moby Dick (reflow)</Link>
        </ListItem>
        <ListItem>
          <Link href="/read?book=https%3A%2F%2Fpublication-server.readium.org%2FQmVsbGFPcmlnaW5hbDMuZXB1Yg">Bella the Dragon (FXL)</Link>
        </ListItem>
      </List>
    </main>
  );
}
