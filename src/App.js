import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';           // The public landing page
import Dashboard from './Dashboard'; // The private sanctuary
import Login from './Login';
import Register from './Register';
import Journal from './Journal';
import Bibliotherapy from './BibliotherapyLibrary';
import ReadArticle from './ReadLibraryItem';
import Sanctuary from './Sanctuary'; //
import EmotionRegulation from './Emotionregulation';
import Feedback from './Feedback';
import Admin from './Admin';
import AdminRoute from './AdminRoute';



function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* BIBLIOTHERAPY ROUTES */}
        <Route path="/bibliotherapy" element={<Bibliotherapy />} />
        {/* <-- NEW: This dynamic route catches the ID of the article to open */}
        <Route path="/bibliotherapy/:id" element={<ReadArticle />} /> 
        
        {/* PRIVATE ROUTES (Require Login) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/sanctuary" element={<Sanctuary />} />
        <Route path="/regulation" element={<EmotionRegulation />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
