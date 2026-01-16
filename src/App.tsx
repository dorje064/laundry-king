import React, { useState } from 'react';
import Navbar from './components/Navbar';
import OrderPage from './pages/OrderPage';
import LoginModal from './components/LoginModal';
import './styles/main.scss';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <div className="app">
      <Navbar
        isLoggedIn={isLoggedIn}
        onToggleLogin={handleLoginClick}
      />
      <main>
        <OrderPage />
      </main>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseModal}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;
