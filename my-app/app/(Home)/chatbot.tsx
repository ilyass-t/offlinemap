import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faWindowMinimize, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

export default function Chatbot() {
    const [isChatVisible, setIsChatVisible] = useState(false);
    const [messages, setMessages] = useState([
        { from: 'bot', text: "Bonjour ! Comment puis-je vous aider aujourd'hui ? 😊" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const toggleChatWindow = () => {
        setIsChatVisible(!isChatVisible);
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { from: 'user', text: userMessage }]);
        setInput('');
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:3000/api/chatbot', {
                query: userMessage,
            });

            setMessages(prev => [...prev, { from: 'bot', text: res.data.response }]);
        } catch (err) {
            setMessages(prev => [...prev, { from: 'bot', text: '❌ Erreur lors de la requête.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>💬 Welcome to WayGuide chatbot</Text>

            {isChatVisible && (
                <View style={styles.chatWindow}>
                    <View style={styles.chatHeader}>
                        <Text style={styles.chatTitle}>Chat with Us</Text>
                        <View style={styles.chatHeaderActions}>
                            <TouchableOpacity onPress={toggleChatWindow} style={styles.minimizeButton}>
                                <FontAwesomeIcon icon={faWindowMinimize} size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={toggleChatWindow} style={styles.closeButton}>
                                <FontAwesomeIcon icon={faCircleXmark} size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView style={styles.chatBody}>
                        {messages.map((msg, idx) => (
                            <View
                                key={idx}
                                style={msg.from === 'user' ? styles.userMessage : styles.botMessage}
                            >
                                <Text style={msg.from === 'user' ? styles.userText : styles.botText}>
                                    {msg.text}
                                </Text>
                            </View>
                        ))}
                        {loading && (
                            <View style={styles.botMessage}>
                                <Text style={styles.botText}>⏳ En cours de traitement...</Text>
                            </View>
                        )}
                    </ScrollView>

                    <View style={styles.inputContainer}>
                        <TextInput
                            value={input}
                            onChangeText={setInput}
                            style={styles.input}
                            placeholder="Tapez votre message..."
                        />
                        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                            <Text style={styles.sendButtonText}>Envoyer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <TouchableOpacity style={styles.chatButton} onPress={toggleChatWindow}>
                <Text style={styles.chatIcon}>💬</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ADD8E6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 22,
        color: 'white',
        marginBottom: 20,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    chatButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#0078d4',
        padding: 16,
        borderRadius: 50,
        elevation: 5,
    },
    chatIcon: {
        color: '#fff',
        fontSize: 24,
    },
    chatWindow: {
        position: 'absolute',
        bottom: 80,
        right: 20,
        height: 480,
        width: 320,
        backgroundColor: '#e2ecf5',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 6,
        overflow: 'hidden',
    },
    chatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#0078d4',
        padding: 10,
    },
    chatTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    chatHeaderActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    minimizeButton: {
        marginRight: 10,
    },
    closeButton: {},
    chatBody: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f4f7fa',
    },
    botMessage: {
        backgroundColor: '#e2ecf5',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        alignSelf: 'flex-start',
        maxWidth: '80%',
    },
    userMessage: {
        backgroundColor: '#0078d4',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        alignSelf: 'flex-end',
        maxWidth: '80%',
    },
    botText: {
        color: '#333',
    },
    userText: {
        color: '#fff',
    },
    inputContainer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: '#ccc',
        padding: 5,
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#0078d4',
        borderRadius: 20,
        paddingHorizontal: 15,
        justifyContent: 'center',
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
