import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  useWindowDimensions,
  TouchableOpacity,
  
} from 'react-native';
import { useRouter } from 'expo-router';

type Place = {
  id: string;
  city: string;
  country: string;
};

export default function Page() {
  const { width } = useWindowDimensions();
  const isWide = width > 600;
  const [places, setPlaces] = useState<Place[]>([]);
  const router = useRouter();
  const [deletingCity, setDeletingCity] = useState<string | null>(null);


  useEffect(() => {
    
    fetchPlaces();
  }, []);
  const fetchPlaces = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/cities');
        if (!res.ok) throw new Error('Erreur lors de la récupération des maps');
        const data = await res.json();
        setPlaces(data);
      } catch (err) {
        console.error('Failed to fetch places:', err);
        Alert.alert('Erreur', 'Impossible de récupérer la liste des maps.');
      }
    };
  
  
  const handleDelete = async (city: string) => {
    setDeletingCity(city);
    try {
      const response = await fetch(`http://localhost:3000/api/delete-map/${city}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', `Deleted: ${result.deletedFiles.join(', ')}`);
        await fetchPlaces();
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not delete files');
    }
    };

  const handleUseMap = (place: Place) => {
    router.push({
      pathname: '/(Home)/home',
      params: { city: place.city },
    });
  };

  return (
    <View className="flex-1 bg-white pt-12 px-5">
      <Text className="text-2xl font-bold text-center mb-6">
        📍 Maps téléchargées
      </Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View
          className={`flex ${isWide ? 'flex-row flex-wrap justify-between' : 'flex-col'}`}
        >
          {places.map((place) => (
            <View
              key={place.id}
              className={`bg-gray-100 rounded-2xl p-5 mb-4 shadow ${
                isWide ? 'w-[48%]' : 'w-full'
              }`}
            >
              <Text className="text-lg font-semibold mb-4 text-gray-800 text-center capitalize">
                {place.city}{place.country ? `, ${place.country}` : ''}
              </Text>
              <View className="px-4 space-y-2">
                <TouchableOpacity
                  className="bg-blue-800 py-2 rounded-full"
                  onPress={() => handleUseMap(place)}
                >
                  <Text className="text-white text-center font-medium">
                    Utiliser cette carte
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-red-800 py-2 rounded-full"
                  onPress={() => handleDelete(place.city)}
                >
                  <Text className="text-white text-center font-medium">
                    {deletingCity === place.city ? 'Start deleting...' : 'Supprimer cette carte'}
                  </Text>
                </TouchableOpacity>
              </View>

            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
