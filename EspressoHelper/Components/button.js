import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import { withOrientation } from 'react-navigation';

export default function MainPageButton({text, onPress}) {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.button}>
                <Text style={styles.text}>{text}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button:{
        borderRadius:8,
        paddingVertical:16,
        paddingHorizontal:8,
        backgroundColor: '#2C1503',
        width: vw(90),
        alignContent: "center",
        alignItems: "center",
        marginVertical: 8,
    },
    text: {
        color: '#FFF'
    }
})