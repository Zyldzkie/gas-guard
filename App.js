import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { auth } from './firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import RegisterScreen from './RegisterScreen';

function App() {
  return (
    <RegisterScreen />
  );
}

export default App; 