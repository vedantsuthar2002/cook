import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import ImagePicker, { launchCamera, launchImageLibrary, CameraOptions, ImagePickerResponse } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
const ImagePickerModel = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState<ImagePickerResponse | null>(null);

    const takePhotoFromCamera = () => {
        const options: CameraOptions = {
            mediaType: 'photo',
            maxWidth: 800,
            maxHeight: 600,
            quality: 1,
        };
        launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                setSelectedImage(response);
                setModalVisible(false);
            }
        });
    };

    const choosePhotoFromLibrary = () => {
        const options: CameraOptions = {
            mediaType: 'photo',
            maxWidth: 800,
            maxHeight: 600,
            quality: 1,
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                setSelectedImage(response);
                setModalVisible(false);
            }
        });
    };

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    return (
        <View>
            <TouchableOpacity style={styles.optionBox} onPress={openModal}>
                <Text style={styles.optionText}>Add Photo</Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.optionButton} onPress={takePhotoFromCamera}>
                            <Text style={styles.optionButtonText}>Open Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionButton} onPress={choosePhotoFromLibrary}>
                            <Text style={styles.optionButtonText}>Choose from Library</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {selectedImage && !selectedImage.error && (
                <View style={{ alignItems: 'center' }}>
                    <Text>Selected Image:</Text>
                    <Image source={{ uri: selectedImage.uri }} style={{ width: 200, height: 200 }} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    optionBox: {
        padding: 16,
        marginBottom: 20,
        paddingVertical: 50,
        backgroundColor: '#FFF',
        borderColor: '#E8E8E8',
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',

    },
    optionText: {
        fontSize: 16,
        color: '#9CA3AF',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 8,
        width: '80%',
    },
    optionButton: {
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        alignItems: 'center',
    },
    optionButtonText: {
        fontSize: 16,
        color: '#000',
    },
    closeButton: {
        padding: 10,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF0000',
    },
});

export default ImagePickerModel;
