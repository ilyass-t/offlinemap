import { Text, View } from "react-native";
import './global.css';
import {  Link} from "expo-router"
export default function Index() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-5xl text-primary font-bold">hello</Text>
      <Link  href="/(import)">import</Link>
      <Link  href="/(auth)/signup">signup</Link>
      <Link  href="/(Home)/home">Home</Link>

    </View>
  );
}
