import axios from 'axios';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

export default function App() {
    const [message, setMessage] = useState('');
    const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

    // TODO fix proxy port for CORS
    useEffect(() => {
        axios.get(`${apiUrl}/register`)
            .then(response => setMessage(response.data))
            .catch(error => console.error('Error fetching data:', error.message));
    }, []);

    return (
        <View>
            <Text>Backend URL: {apiUrl}</Text>
            <Text>Backend Message: {message}</Text>
        </View>
    );
}
