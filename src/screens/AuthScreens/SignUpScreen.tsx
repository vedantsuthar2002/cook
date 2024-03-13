import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Alert } from 'react-native';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import SocialSignInButton from '../../components/SocialSignInButton';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


const SignUpScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [message, setMessage] = useState(' ');
  const navigation = useNavigation();

  useEffect(() => {
  }, []);;

  const onRegisterPressed = async () => {
    try {
      if (name.length > 0 && email.length > 0 && password.length > 0 && passwordRepeat.length > 0) {
        const response = await auth().createUserWithEmailAndPassword(email, password);

        const userData = {
          id: response.user.uid,
          name: name,
          email: email,
        }
        await firestore().collection("Users").doc(response.user.uid).set(userData);
        await auth().currentUser?.sendEmailVerification();
        await auth().signOut();
        Alert.alert("Plese Verify Your Email Check Out Link IN Your Inbox")
        navigation.navigate('SignIn');
      } else {
        Alert.alert('Please Enter All Details');
      }
    } catch (error: any) {
      console.log(error);
      setMessage(error.message);
    }
    if (password !== passwordRepeat) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
  }



  const onTermsOfUsePressed = () => {
    console.warn('onTermsOfUsePressed');
  };

  const onPrivacyPressed = () => {
    console.warn('onPrivacyPressed');
  };

  const onSignInpress = () => {
    navigation.navigate('SignIn');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Create an account</Text>
        <CustomInput placeholder="Name" value={name} setValue={setName} secureTextEntry={false} />
        <CustomInput placeholder="Email" value={email} setValue={setEmail} secureTextEntry={false} />
        <CustomInput placeholder="Password" value={password} setValue={setPassword} secureTextEntry />
        <CustomInput placeholder="Repeat Password" value={passwordRepeat} setValue={setPasswordRepeat} secureTextEntry />
        <CustomButton text="Register" onPress={onRegisterPressed} type="PRIMARY" bgColor={''} fgColor={''} />
        <Text>{message}</Text>

        <Text style={styles.text}>By registering, you confirm that you accept our{' '}<Text style={styles.link} onPress={onTermsOfUsePressed}>Terms of Use</Text> and {' '}<Text style={styles.link} onPress={onPrivacyPressed}>Privacy Policy</Text></Text>

        <SocialSignInButton />

        <CustomButton text="Have an account? Sign in" onPress={onSignInpress} type='TERTIARY' bgColor='' fgColor='' />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051C60',
    margin: 10,
  },
  text: {
    color: 'gray',
    marginVertical: 10,
  },
  link: {
    color: '#FB9400',
  },
});

export default SignUpScreen;
