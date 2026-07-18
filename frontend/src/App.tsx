import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CoverLetterPage from './pages/CoverLetterPage';
import UploadPage from './pages/UploadPage';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/cover-letter" element={<CoverLetterPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
