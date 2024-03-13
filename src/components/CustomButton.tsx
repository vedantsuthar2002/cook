import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

type CustomButtonProps = {
    onPress?: () => void;
    text: string;
    type: 'PRIMARY' | 'TERTIARY' | 'SECONDARY';
    bgColor: string;
    fgColor: string;
};

const CustomButton = (props: CustomButtonProps) => {
    return (
        <Pressable onPress={props.onPress} style={[styles.container,
        styles[`container_${props.type}`],
        props.bgColor ? { backgroundColor: props.bgColor } : {},]}>
            <Text style={[styles.text,
            styles[`text_${props.type}`],
            props.fgColor ? { color: props.fgColor } : {},]}>{props.text}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 15,
        marginVertical: 5,
        alignItems: 'center',
        borderRadius: 5,
    },
    container_PRIMARY: {
        backgroundColor: '#FB9400',
    },
    container_SECONDARY: {
        borderColor: '#FB9400',
        borderWidth: 2,
    },
    container_TERTIARY: {

    },
    text: {
        fontWeight: 'bold',
    },
    text_PRIMARY: {
        fontWeight: 'bold',
        color: 'white',
    },
    text_TERTIARY: {
        color: 'grey',
    },
    text_SECONDARY: {
        color: '#FB9400',
    }
});

export default CustomButton;
