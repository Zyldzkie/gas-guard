import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

const HomeScreen = () => {
  const [gasLevel, setGasLevel] = useState(109);
  const [levelStatus, setLevelStatus] = useState('');

  const classifyGasLevel = (level) => {
    if (level <= 100) return 'Safe';
    if (level <= 300) return 'Moderate';
    return 'Dangerous';
  };

  useEffect(() => {
    const status = classifyGasLevel(gasLevel);
    setLevelStatus(status);
  }, [gasLevel]);

  return (
    <View style={styles.container}>
      <Image source={require('./assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Current Gas Level:</Text>
      <View style={styles.divider} />
      <View style={styles.gasLevelBox}>
        <Text style={styles.gasLevel}>{gasLevel}</Text>
        <Text style={styles.unit}>ppm</Text>
      </View>
      <Text style={styles.level}>
        Level: <Text style={[styles.status, styles[levelStatus.toLowerCase()]]}>{levelStatus}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  logo: { width: 120, height: 120, marginBottom: 20, marginTop: 40 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  divider: { width: '90%', height: 2, backgroundColor: '#007ACC', marginVertical: 10 },
  gasLevelBox: {
    flexDirection: 'row',
    backgroundColor: '#007ACC',
    paddingHorizontal: 60,
    paddingVertical: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop:20,
  },
  gasLevel: { fontSize: 75, fontWeight: 'bold', color: '#fff' },
  unit: { fontSize: 18, marginLeft: 5, marginTop: 50, color: '#fff' },
  level: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  status: { fontSize: 18, fontWeight: 'bold' },
  safe: { color: 'green' },
  moderate: { color: 'orange' },
  dangerous: { color: 'red' },
});

export default HomeScreen;
