import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { useNavigation } from '@react-navigation/native';


const ConfirmEmailScreen = () => {
  const [code, setCode] = useState('');

  const navigation = useNavigation();

  const onConfirmPressed = () => {
    console.warn('onConfirmPressed');
  }

  const onResendpress = () => {
    console.warn('onResendpress');
  }
  const onSignInpress = () => {
    console.warn('signin');
    navigation.navigate('SignIn');
  }



  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Confirm your email</Text>
        <CustomInput placeholder='Enter your confirmation code' value={code} setValue={setCode} secureTextEntry={false} />


        <CustomButton text='Confirm' onPress={onConfirmPressed} type='PRIMARY' bgColor='' fgColor='' />

        <CustomButton text="Resend code" onPress={onResendpress} type='SECONDARY' bgColor='' fgColor='' />

        <CustomButton text="Back to Sign in" onPress={onSignInpress} type='TERTIARY' bgColor='' fgColor='' />
      </View>
    </ScrollView>
  )
}
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

export default ConfirmEmailScreen;