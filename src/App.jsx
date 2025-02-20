// src/App.jsx
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faUserCircle, 
    faSearch, 
    faArrowRight, 
    faRobot 
} from "@fortawesome/free-solid-svg-icons";
import "./home.css";

const App = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Header */}
      <header>
        <div className="container">
          <div className="logo">TECHSPIRE</div>
          <nav>
            <a href="#" onClick={() => navigate("/")}>Home</a>
            <a href="#" onClick={() => navigate("/about")}>About</a>
            <a href="#" onClick={() => navigate("/contact")}>Contact Us</a>
          </nav>
          <div className="right-section">
            <div className="search-container">
              <input 
                className="search-input" 
                placeholder="Search..." 
                type="text" 
              />
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
            </div>
            <FontAwesomeIcon icon={faUserCircle} className="user-icon" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="main-content">
        <h1>Revolutionizing Digital Well-Being</h1>
        <p>Empowering technology for a smarter and healthier future.</p>
        
        <div className="card-container">
          <div className="card" onClick={() => navigate("/camera")}>
            <div className="card-title">Camera</div>
            <FontAwesomeIcon icon={faArrowRight} className="card-icon" />
          </div>
          <div className="card" onClick={() => navigate("/proxy")}>
            <div className="card-title">Proxy</div>
            <FontAwesomeIcon icon={faArrowRight} className="card-icon" />
          </div>
        </div>
      </main>

      {/* Chatbot Icon */}
      <footer className="chatbot-footer" onClick={() => navigate("/chatbot")}>
        <FontAwesomeIcon icon={faRobot} className="chatbot-icon" />
      </footer>
    </div>
  );
};

export default App;