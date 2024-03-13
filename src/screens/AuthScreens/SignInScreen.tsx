import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, useWindowDimensions, Text, ScrollView, Alert } from 'react-native';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import SocialSignInButton from '../../components/SocialSignInButton';
import { StackActions, useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(' ');

  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();

  const onSignInPressed = async () => {
    try {
      if (email.length > 0 && password.length > 0) {
        const user = await auth().signInWithEmailAndPassword(email, password);
        console.log(user);
        if (user.user.emailVerified) {
          Alert.alert('You are Verified!');
          navigation.dispatch(StackActions.replace('tab'));
        } else {
          Alert.alert('Please verify your Email Chechout Inbox');
          await auth().currentUser?.sendEmailVerification();
          await auth().signOut();
        }
      } else {
        Alert.alert('Please Enter All Data');
      }
    } catch (error: any) {
      console.log(error);
      setMessage(error.message);
    }
  }


  const onForgotPasswordPressed = () => {
    navigation.navigate('ForgotPassword');
  };

  const onSignUppress = () => {
    navigation.navigate('SignUp');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <View style={styles.logoCantainer}>
          <Image source={require('../../assets/images/Logo.png')} style={[styles.logo, { height: height * 0.3 }]} resizeMode='contain' />
        </View>
        <CustomInput placeholder="Email" value={email} setValue={setEmail} secureTextEntry={false} />

        <CustomInput placeholder='Password' value={password} setValue={setPassword} secureTextEntry />

        <CustomButton text='Sign In' onPress={onSignInPressed} type='PRIMARY' bgColor='' fgColor='' />
        <Text>{message}</Text>


        <CustomButton text='Forgot password?' onPress={onForgotPasswordPressed} type='TERTIARY' bgColor='' fgColor='' />

        <SocialSignInButton />

        <CustomButton text="Don't have an account? Create one" onPress={onSignUppress} type='TERTIARY' bgColor='' fgColor='' />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: '30%',
    maxWidth: 150,
    maxHeight: 150,
    borderRadius: 150,
  },
  logoCantainer: {
    width: '90%',
    height: 100,
    marginVertical: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignInScreen;
