import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import SplashScreen from '@/components/pages/SplashScreen';
import HomePage from '@/components/pages/HomePage';
import SearchPage from '@/components/pages/SearchPage';
import CreatePostPage from '@/components/pages/CreatePostPage';
import ChatsPage from '@/components/pages/ChatsPage';
import ChatRoomPage from '@/components/pages/ChatRoomPage';
import ProfilePage from '@/components/pages/ProfilePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-miami-background via-miami-surface to-miami-background">
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/app" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="create" element={<CreatePostPage />} />
            <Route path="chats" element={<ChatsPage />} />
            <Route path="chats/:chatId" element={<ChatRoomPage />} />
            <Route path="profile/:username" element={<ProfilePage />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;