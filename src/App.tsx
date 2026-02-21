import React from 'react';
import { Activity } from 'lucide-react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <div className="flex items-center space-x-3 mb-6">
        <Activity className="w-12 h-12 text-blue-500" />
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
          FizyoPoz AI
        </h1>
      </div>
      <p className="text-gray-400 text-lg max-w-lg text-center mb-8">
        Real-time MediaPipe Pose exercise tracking and Supabase integration.
        Waiting for HTML designs...
      </p>
    </div>
  );
}

export default App;
