import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, FlatList, Alert, StyleSheet, SafeAreaView } from 'react-native';

interface TrafficEntry {
    city: string;
    street: string;
    from_hour: string;
    to_hour: string;
}

export default function DeclareTrafficScreen() {
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [fromHour, setFromHour] = useState('');
    const [toHour, setToHour] = useState('');
    const [total, setTotal] = useState(0);
    const [entries, setEntries] = useState<TrafficEntry[]>([]);
    const [editIndex, setEditIndex] = useState<number | null>(null);  // Index de l'entrée à modifier

    // Fetch les données d'embouteillage
    const fetchTraffic = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/all');
            const data = await response.json();
            setEntries(data);
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch le total des embouteillages
    const fetchTotal = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/total');
            const data = await response.json();
            setTotal(data.total);  // Mise à jour du total
        } catch (err) {
            console.error(err);
        }
    };

    // Exécution des fetchs au démarrage
    useEffect(() => {
        fetchTraffic();
        fetchTotal();
    }, []);

    // Soumettre un nouvel embouteillage ou mettre à jour un embouteillage
    const submitTraffic = async () => {
        if (!city || !street || !fromHour || !toHour) {
            Alert.alert('Erreur', 'Tous les champs sont requis');
            return;
        }

        try {
            let response;
            if (editIndex !== null) {
                // Mise à jour de l'embouteillage
                response = await fetch(`http://localhost:3000/api/update/${editIndex}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ city, street, from_hour: fromHour, to_hour: toHour }),
                });
            } else {
                // Déclaration d'un nouvel embouteillage
                response = await fetch('http://localhost:3000/api/declare', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ city, street, from_hour: fromHour, to_hour: toHour }),
                });
            }

            if (response.ok) {
                Alert.alert(editIndex !== null ? 'Succès' : 'Embouteillage enregistré', editIndex !== null ? 'Embouteillage mis à jour' : 'Embouteillage enregistré');
                setCity('');
                setStreet('');
                setFromHour('');
                setToHour('');
                setEditIndex(null);  // Réinitialiser l'index de modification
                fetchTraffic();  // Rafraîchir les embouteillages
                fetchTotal();    // Rafraîchir le total
            } else {
                Alert.alert('Erreur', 'Erreur lors de l\'enregistrement');
            }
        } catch (err) {
            console.error(err);
            Alert.alert('Erreur réseau');
        }
    };

    // Modifier un embouteillage
    const modifyTraffic = (index: number) => {
        const entry = entries[index];
        setCity(entry.city);
        setStreet(entry.street);
        setFromHour(entry.from_hour);
        setToHour(entry.to_hour);
        setEditIndex(index);  // Définir l'index de l'entrée à modifier
    };

    // Supprimer un embouteillage
    const deleteTraffic = (index: number) => {
        Alert.alert(
            'Confirmation',
            'Voulez-vous vraiment supprimer cette déclaration ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await fetch(`http://localhost:3000/api/delete/${index}`, {
                                method: 'DELETE',
                            });

                            if (response.ok) {
                                Alert.alert('Succès', 'Embouteillage supprimé.');
                                fetchTraffic();
                                fetchTotal();
                            } else {
                                Alert.alert('Erreur', 'Échec de la suppression.');
                            }
                        } catch (error) {
                            console.error(error);
                            Alert.alert('Erreur', 'Erreur réseau.');
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };


    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Déclarer un embouteillage</Text>

            {/* Formulaire pour déclarer ou modifier un embouteillage */}
            <TextInput
                placeholder="Ville"
                value={city}
                onChangeText={setCity}
                style={styles.input}
            />
            <TextInput
                placeholder="Rue"
                value={street}
                onChangeText={setStreet}
                style={styles.input}
            />
            <TextInput
                placeholder="Heure de début (ex: 08:00)"
                value={fromHour}
                onChangeText={setFromHour}
                style={styles.input}
            />
            <TextInput
                placeholder="Heure de fin (ex: 10:00)"
                value={toHour}
                onChangeText={setToHour}
                style={styles.input}
            />
            <Button title={editIndex !== null ? 'Mettre à jour' : 'Déclarer'} onPress={submitTraffic} />

            {/* Affichage du total des embouteillages */}
            <Text style={styles.subtitle}>Total des embouteillages déclarés : {total}</Text>

            {/* Affichage des entrées avec options de modification et suppression */}
            <FlatList
                data={entries}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={() => (
                    <View style={[styles.row, styles.headerRow]}>
                        <Text style={styles.cell}>Ville</Text>
                        <Text style={styles.cell}>Rue</Text>
                        <Text style={styles.cell}>Début</Text>
                        <Text style={styles.cell}>Fin</Text>
                        <Text style={styles.cell}>Actions</Text>
                    </View>
                )}
                renderItem={({ item, index }) => (
                    <View style={styles.row}>
                        <Text style={styles.cell}>{item.city}</Text>
                        <Text style={styles.cell}>{item.street}</Text>
                        <Text style={styles.cell}>{item.from_hour}</Text>
                        <Text style={styles.cell}>{item.to_hour}</Text>
                        <View style={styles.actions}>
                            <Text style={styles.actionButton} onPress={() => modifyTraffic(index)}>✏️</Text>
                            <Text style={styles.actionButton} onPress={() => deleteTraffic(index)}>🗑️</Text>
                        </View>
                    </View>
                )}
            />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 6, borderRadius: 5 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
    subtitle: { marginTop: 24, fontSize: 18, fontWeight: 'bold' },
    entry: { marginVertical: 4 },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 8,
        alignItems: 'center',
    },
    headerRow: {
        backgroundColor: '#eee',
        fontWeight: 'bold',
    },
    cell: {
        flex: 1,
        paddingHorizontal: 4,
        fontSize: 14,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'center',
        flex: 1,
    },
    actionButton: {
        fontSize: 18,
        marginHorizontal: 6,
    },

});
