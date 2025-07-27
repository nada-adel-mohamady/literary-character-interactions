import { useState } from 'react';
import axios from 'axios';
import './App.css';

type Interaction = {
  source: string;
  target: string;
  weight: number;
};

type BookResponse = {
  text: string;
};

function App() {
  const [bookId, setBookId] = useState('');
  const [bookText, setBookText] = useState('');
  const [characters, setCharacters] = useState<string[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchBook = async () => {
    setError('');
    setCharacters([]);
    setInteractions([]);
    try {
      setLoading(true);
      const res = await axios.get<BookResponse>(`https://literary-character-interactions-production.up.railway.app/api/book/${bookId}`);
      setBookText(res.data.text);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch book. Check if the ID is valid.');
    } finally {
      setLoading(false);
    }
  };

  const analyzeBook = async () => {
    console.log('Analyzing book text:', bookText);
    if (!bookText) return;

    try {
      setLoading(true);
      const res = await axios.post<{
        characters: string[];
        interactions: Interaction[];
      }>('https://literary-character-interactions-production.up.railway.app/api/analyze', {
        text: bookText,
      });
      
      console.log('Analysis result:', res.data);
      console.log('Characters:', res.data.characters);
      console.log('Interactions:', res.data.interactions);
      setCharacters(res.data.characters);
      setInteractions(res.data.interactions);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze book.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Gutenberg Book Analyzer</h1>

      <input
        type="text"
        placeholder="Enter Book ID (e.g. 1787)"
        value={bookId}
        onChange={(e) => setBookId(e.target.value)}
      />
      <button onClick={fetchBook} disabled={loading}>
        Fetch Book
      </button>

      {bookText && (
        <div>
          <h3>Book fetched successfully!</h3>
          <button onClick={analyzeBook} disabled={loading}>
            Analyze Book
          </button>
        </div>
      )}

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {characters.length > 0 && (
        <div>
          <h2>Characters</h2>
          <ul style={{ listStylePosition: 'inside' }}>
            {characters.map((char, i) => (
              <li key={i}>{char}</li>
            ))}
          </ul>
        </div>
      )}

      {interactions.length > 0 && (
        <div>
          <h2>Character Network</h2>
          <ul style={{ listStylePosition: 'inside' }}>
            {interactions.map((interaction, i) => (
              <li key={i}>
                {interaction.source} → {interaction.target} (weight: {interaction.weight})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
