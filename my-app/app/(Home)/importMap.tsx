import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ImageBackground,
} from 'react-native';

export default function ImportMapScreen() {
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  const startProgress = () => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 60000,
      useNativeDriver: false,
    }).start();
  };

  const handleDownload = async () => {
    setErrorMessage('');
    setSuccess(false);
    setLoading(true);
    startProgress();

    if (!city || !type) {
      setErrorMessage('Veuillez remplir les deux champs.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, type }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 10000);
      } else {
        setErrorMessage(data.message || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Erreur de requête :', error);
      setErrorMessage('Impossible de contacter le serveur.');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  };

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <ImageBackground
      source={require('../../assets/images/ville.jpg')}
      resizeMode="cover"
      className="flex-1"
    >
      <SafeAreaView className="flex-1 bg-black/50">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1 justify-center items-center px-4"
        >
          <View className="bg-white/90 rounded-3xl p-6 w-full max-w-xl shadow-2xl">
            <Text className="text-2xl font-bold text-center text-gray-800 mb-6">
              Importer les données cartographiques
            </Text>
  
            {errorMessage ? (
              <Text className="text-red-500 text-center mb-4">{errorMessage}</Text>
            ) : null}
  
            {loading && (
              <View className="h-3 w-full bg-gray-200 rounded-full mb-4 overflow-hidden">
                <Animated.View
                  style={{
                    height: '100%',
                    backgroundColor: '#16a34a', // Tailwind green-600
                    width: widthInterpolated,
                    borderRadius: 999,
                  }}
                />
              </View>
            )}
  
            {success && !loading && (
              <Text className="text-green-600 text-center mb-4">
                ✅ Téléchargement terminé avec succès !
              </Text>
            )}
  
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-1">Nom de la ville</Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 bg-white text-black text-base"
                placeholder="ex: Marrakesh"
                value={city}
                onChangeText={setCity}
                placeholderTextColor="#888"
              />
            </View>
  
            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-1">Type de données</Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 bg-white text-black text-base"
                placeholder="graphml, tiles, both"
                value={type}
                onChangeText={setType}
                placeholderTextColor="#888"
              />
            </View>
  
            <View className="rounded-xl overflow-hidden">
              <Button title="📥 Télécharger" onPress={handleDownload} color="#1e40af" />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
  
}
