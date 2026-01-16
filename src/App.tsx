import React, { useState } from 'react';
import Navbar from './components/Navbar';
import OrderPage from './pages/OrderPage';
import './styles/main.scss';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleToggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <div className="app">
      <Navbar
        isLoggedIn={isLoggedIn}
        onToggleLogin={handleToggleLogin}
      />
      <main>
        <OrderPage />
      </main>
    </div>
  );
}

export default App;
