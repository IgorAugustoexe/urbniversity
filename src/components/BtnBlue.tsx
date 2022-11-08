import React from 'react'
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native'
import { cores } from '../styles/Estilos'

type Props = {
    text: string
    loader?: boolean
    larguraLoader?: number
    style?: any
}

export default function BtnBlue({ text, loader, style, larguraLoader }: Props) {
    return (
        <View style={[styles.btn, style]}>
            {loader ? <ActivityIndicator color={cores.branco} style={[{ paddingVertical: 2, paddingHorizontal: larguraLoader ? larguraLoader : 0 }]} /> : <Text style={styles.textoBtn}>{text}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    btn: {
        backgroundColor: cores.azulBtn,
        alignItems: 'center',
        borderRadius: 20,
        padding: 13,
    },
    textoBtn: {
        fontSize: 16,
        color: cores.fonteBranco,
        fontWeight: 'bold'
    }
})