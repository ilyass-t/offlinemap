import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, TouchableOpacity } from 'react-native';
import {
    View,
    Text,
    TextInput,
    Button,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
type Coordinates = {
    latitude: number;
    longitude: number;
    accuracy?: number;
    altitude?: number | null;
    altitudeAccuracy?: number | null;
    heading?: number | null;
    speed?: number | null;
};

const getCurrentLocation = async (): Promise<Coordinates | null> => {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            resolve(null);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve(position.coords as Coordinates);
            },
            (error) => {
                alert('Failed to get location: ' + error.message);
                resolve(null);
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    });
};


export default function DisplayMapScreen() {
    const [city, setCity] = useState('');
    const [cityFromParam, setCityFromParam] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [mapUrl, setMapUrl] = useState('');
    const [destination, setDestination] = useState('');
    const params = useLocalSearchParams();

    const getBackendUrl = () => {
        if (Platform.OS === 'web') {
            return 'http://localhost:3000/api/city-map/';
        } else {
            const ip = '192.168.11.102'; // Replace with your local IP
            return `http://${ip}:3000/api/city-map/`;
        }
    };

    const handleShowMap = async () => {
        if (!city.trim()) {
            Alert.alert("Erreur", "Veuillez saisir une ville.");
            return;
        }

        const formattedCity = city.trim().toLowerCase();
        const url = `${getBackendUrl()}${formattedCity}`;

        try {
            const response = await fetch(url, { method: "HEAD" });
            if (!response.ok) {
                Alert.alert("Carte introuvable", `Aucune carte pour ${formattedCity}`);
                return;
            }
            setMapUrl(url);
            setShowMap(true);
        } catch (err) {
            console.error(err);
            Alert.alert("Erreur", "Impossible de contacter le serveur.");
        }
    };

    // Load city from params
    useEffect(() => {
        if (params.city) {
            setCity(params.city.toString());
            setCityFromParam(true);
        }
    }, [params.city]);

    // Trigger map display only if city was set from param
    useEffect(() => {
        if (cityFromParam && city.trim()) {
            handleShowMap();
            setCityFromParam(false);
        }
    }, [city, cityFromParam]);

    const handleCalculatePath = async () => {
        try {
            const coords = await getCurrentLocation();
            console.log(coords);
            if (!coords) return;

            if (!mapUrl) {
                Alert.alert('Erreur', 'La carte n\'est pas encore chargée');
                return;
            }

            const urlParts = mapUrl.split('/');
            const cityName = urlParts[urlParts.length - 1];
            const graphmlFile = `ALL${cityName}.graphml`;

            const backendUrl = Platform.OS === 'web'
                ? 'http://localhost:3000/api/shortest-path'
                : 'http://192.168.11.102:3000/api/shortest-path';

            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    start_lat: coords.latitude,
                    start_lon: coords.longitude,
                    end_street: destination,
                    graphml_file: graphmlFile,
                }),
            });

            let url_name = destination.replace(/\s+/g, '');

            if (response.ok) {
                const newMapUrl = Platform.OS === 'web'
                    ? `http://localhost:3000/api/path-map/${url_name}`
                    : `http://192.168.11.102:3000/api/path-map/${url_name}`;

                setMapUrl(newMapUrl);
                Alert.alert('Succès', 'Chemin calculé et carte affichée !');
            } else {
                Alert.alert('Erreur', 'Impossible de calculer le chemin.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Erreur', 'Erreur réseau.');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
          {!showMap ? (
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 16,
              }}
            >
              <View
                style={{
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  borderRadius: 20,
                  padding: 24,
                  width: '100%',
                  maxWidth: 400,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                  elevation: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '700',
                    textAlign: 'center',
                    marginBottom: 24,
                    color: '#1f2937',
                  }}
                >
                  Affichage de la carte offline
                </Text>
      
                <Text style={{ marginBottom: 8, color: '#374151' }}>Nom de la ville</Text>
                <TextInput
                  style={{
                    borderColor: '#d1d5db',
                    borderWidth: 1,
                    borderRadius: 10,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    marginBottom: 20,
                    backgroundColor: '#fff',
                    color: '#111827',
                    fontSize: 16,
                  }}
                  placeholder="ex: Marrakech"
                  value={city}
                  onChangeText={setCity}
                  placeholderTextColor="#9ca3af"
                />
      
                <TouchableOpacity
                  onPress={handleShowMap}
                  style={{
                    backgroundColor: '#1e40af',
                    paddingVertical: 12,
                    borderRadius: 999,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>
                    Afficher la carte
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          ) : (
            <View style={{ flex: 1 }}>
              {Platform.OS === 'web' ? (
                <iframe
                  src={mapUrl}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="geolocation"
                  title="Map"
                />
              ) : (
                <WebView
                  source={{ uri: mapUrl }}
                  style={{ flex: 1 }}
                  originWhitelist={['*']}
                />
              )}
      
              <View
                style={{
                  position: 'absolute',
                  top: 20,
                  left: 20,
                  right: 20,
                  zIndex: 1,
                  padding: 16,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 5,
                }}
              >
                <TextInput
                  placeholder="Entrez votre destination"
                  value={destination}
                  onChangeText={setDestination}
                  style={{
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 12,
                    fontSize: 16,
                    backgroundColor: '#fff',
                  }}
                  placeholderTextColor="#9ca3af"
                />
                <TouchableOpacity
                  onPress={handleCalculatePath}
                  style={{
                    backgroundColor: '#1e40af',
                    paddingVertical: 12,
                    borderRadius: 999,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>
                    Voir la destination
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </SafeAreaView>
      );
      
}
