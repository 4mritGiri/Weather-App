import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AppNavigation from './navigation/appNavigation';
import 'react-native-gesture-handler';


export default function App() {
  return (
    <AppNavigation />
  );
}
