import { View, Text, TextInput } from 'react-native';
import { useState } from 'react';

const Page = () => {
  const [targetStreet, setTargetStreet] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleEvent = async (text: string) => {
    setErrorMessage('');
    setSuccess(false);

    if (!text) {
      setErrorMessage('Veuillez remplir les deux champs.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/changedpoid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetStreet: text }),
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
    }
  };

  const handleChange = (text: string) => {
    setTargetStreet(text);
    handleEvent(text);  // 🔥 call handleEvent every time user types
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ marginBottom: 10 }}>Enter the target street:</Text>
      <TextInput
        value={targetStreet}
        onChangeText={handleChange} // 👈 use custom handler
        placeholder="Type here..."
        style={{
          height: 40,
          width: 250,
          borderColor: 'gray',
          borderWidth: 1,
          paddingHorizontal: 10,
          borderRadius: 5,
        }}
      />
      {errorMessage ? (
        <Text style={{ color: 'red', marginTop: 10 }}>{errorMessage}</Text>
      ) : null}
      {success ? (
        <Text style={{ color: 'green', marginTop: 10 }}>Street submitted successfully!</Text>
      ) : null}
    </View>
  );
};

export default Page;
