import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Create from './pages/Create';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import BlogDetails from './pages/BlogDetails';
import NotFound from './pages/NotFound';
import Update from './pages/Update';

function App() {

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/create' element={<Create />} />
            <Route path='/update/:id' element={<Update />} />
            <Route path='/blogs/:id' element={<BlogDetails/>} />
            <Route path='*' element={<NotFound/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;