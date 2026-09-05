import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { RedirectHandler } from './pages/RedirectHandler';
import { Analytics } from './pages/Analytics';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:shortCode" element={<RedirectHandler />} />
          <Route path="/analytics/:shortCode" element={<Analytics />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
