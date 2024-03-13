import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Alert } from 'react-native';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { useNavigation } from '@react-navigation/native';

const NewPasswordScreen = () => {
  const [newPassword, setNewPassword] = useState('');
  const [newRepeatPassword, setNewRepeatPassword] = useState('');

  const navigation = useNavigation();




  const onSubmitPressed = () => {
  }

  if (newPassword !== newRepeatPassword) {
    Alert.alert('Error', 'New passwords do not match');
    return;
  }


  const onSignInpress = () => {
    navigation.navigate('SignIn');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Reset your password</Text>
        <CustomInput placeholder='Enter your new password' value={newPassword} setValue={setNewPassword} secureTextEntry={true} />
        <CustomInput placeholder='Confirm your new password' value={newRepeatPassword} setValue={setNewRepeatPassword} secureTextEntry={true} />
        <CustomButton text='Submit' onPress={onSubmitPressed} type='PRIMARY' bgColor={''} fgColor={''} />
        <CustomButton text="Back to Sign in" onPress={onSignInpress} type='TERTIARY' bgColor={''} fgColor={''} />
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
});

export default NewPasswordScreen;
