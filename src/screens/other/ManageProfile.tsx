import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const ManageProfile: React.FC = () => {
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');

    const handleSaveProfile = () => {

        console.log('Profile changes saved!');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Profile</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Username:</Text>
                <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter your username"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Bio:</Text>
                <TextInput
                    style={[styles.input, { height: 100 }]}
                    multiline
                    value={bio}
                    onChangeText={setBio}
                    placeholder="Enter your bio"
                />
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                <Text style={styles.saveButtonText}>Save Profile</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#000'
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#000'
    },
    input: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#FFF5E6',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: 'center',
        borderColor: '#FB9400',
        borderWidth: 1
    },
    saveButtonText: {
        color: '#FB9400',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ManageProfile;
