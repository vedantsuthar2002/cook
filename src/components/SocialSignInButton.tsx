import React from 'react';
import { View, Text } from 'react-native';
import CustomButton from './CustomButton';

const onSignInFacebook = () => {
    console.warn('Facebook');
}

const onSignInGoogle = () => {
    console.warn('Google');
}

const onSignInApple = () => {
    console.warn('Apple');
}
const SocialSignInButton = () => {
    return (
        <>
            <CustomButton text='Sign In with Facebook' onPress={onSignInFacebook} type='PRIMARY' bgColor='#E7EAF4' fgColor='#4765A9' />

            <CustomButton text='Sign In with Google' onPress={onSignInGoogle} type='PRIMARY' bgColor='#FAE9EA' fgColor='#DD4D44' />

            <CustomButton text='Sign In with Apple' onPress={onSignInApple} type='PRIMARY' bgColor='#E3E3E3' fgColor='#363636' />
        </>
    )
}

export default SocialSignInButton;