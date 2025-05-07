import React, { useState, useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function Index() {
  const [city, setCity] = useState(null);
  const [hasMap, setHasMap] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const checkMap = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/available-map");
        if (response.ok) {
          const data = await response.json();
          if (data.city) {
            setHasMap(true);
            setCity(data.city);
          } else {
            setHasMap(false);
          }
        } else {
          setHasMap(false);
        }
      } catch (err) {
        console.error("Erreur lors de la vérification de la carte:", err);
        setHasMap(false);
      }
    };

    checkMap(); // ✅ call inside useEffect
  }, []);

  const handleUseMap = () => {
    if (hasMap && city) {
      router.push({
        pathname: '/(Home)/home',
        params: { city },
      });
    } else {
      router.push('/(Home)/home');
    }
  };

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-5xl text-primary font-bold">hello</Text>

      <Link href="/(import)">import</Link>
      <Link href="/(auth)/signup">signup</Link>

      <Pressable onPress={handleUseMap} className="mt-4 p-2 bg-blue-500 rounded">
        <Text className="text-white">Home</Text>
      </Pressable>

      
    </View>
  );
}
