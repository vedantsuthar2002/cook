import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, StatusBar, Image } from 'react-native';
import { StackActions, useNavigation } from "@react-navigation/native";
import Auth from '@react-native-firebase/auth';

const SplashScreen = () => {
    const [isUserSignIn, setIsUserSignIn] = useState(false)
    Auth().onAuthStateChanged((user) => {
        if (user !== null) {
            setIsUserSignIn(true);
        }
    });
    const navigation = useNavigation();
    useEffect(() => {
        setTimeout(async () => {
            const unsubscribe = await Auth().onAuthStateChanged(user => {
                const routeName = user !== null ? 'tab' : 'signNavigation';
                navigation.dispatch(StackActions.replace(routeName));
            });
            unsubscribe();
        }, 3000);
        return () => { };
    }, []);
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#FB9400" barStyle="light-content" />
            <View style={styles.content}>

                <Image
                    source={require('../../assets/images/FUllLogo.png')}
                    style={styles.image}
                    resizeMode='contain'
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FB9400',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ellips: {
        width: 115,
        height: 115,
        borderRadius: 50,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 180,
        height: 180,
    },
});

export default SplashScreen;
