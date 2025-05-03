import { Stack } from "expo-router";
import './global.css';
import { SafeAreaProvider } from "react-native-safe-area-context";
import Safescreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
export default function RootLayout() {
  
  return (  

      
    <SafeAreaProvider>
      <Safescreen>
      <Stack  screenOptions={{headerShown: false}}>
        <Stack.Screen name="index"/>
        <Stack.Screen name="(auth)"/>
        <Stack.Screen name="(Home)"/>

      </Stack>
      </Safescreen>
      <StatusBar style="dark"/>
    </SafeAreaProvider>

);
}
