import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const SearchScreen = () => {
    return (
        <View style={styles.root}>
            <Text>SearchScreen</Text>
        </View>
    )
}

export default SearchScreen

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    }
})