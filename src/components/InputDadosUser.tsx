import React from 'react'
import { StyleSheet, View, Text, TextInput } from 'react-native'
import { config, cores } from '../styles/Estilos'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

type Props = {
    onChangeText?: (text: string) => void,
    style?: any,
    value: string,
    txtErro: string,
    textoInput: string,
    keyboardType?: any,
    onFocus?: any,
    placeholder?: string,
    autoCapitalize?: any,
    styleIcon?: any,
    icon?: any,
    secureText?: boolean,
    maxLenght?: number
}

export default function InputDadosUser({ onChangeText, style, value, txtErro, textoInput, keyboardType, onFocus, placeholder, autoCapitalize, secureText, maxLenght, styleIcon, icon }: Props) {
    const attTextvalue = (text: string) => {
        onChangeText && onChangeText(text)
    }

    return (
        <View style={[{ width: '90%', marginLeft: config.windowWidth / 20 }, style]}>
            <Text style={[stylesInput.txtInput, txtErro.length > 0 && { color: cores.vermelhoBorder }]}>{textoInput}</Text>
            <TextInput
                style={[stylesInput.inputStyle, txtErro.length > 0 && { borderColor: cores.vermelhoBorder }]}
                value={value}
                keyboardType={keyboardType}
                onChangeText={(text) => attTextvalue(text)}
                onFocus={onFocus}
                placeholder={placeholder}
                placeholderTextColor={cores.fonteCinza}
                autoCapitalize={autoCapitalize}
                secureTextEntry={secureText}
                maxLength={maxLenght}
            />
            <FontAwesomeIcon icon={icon} size={config.windowWidth / 16} color={txtErro.length > 0 ? cores.vermelhoBorder : cores.branco} style={[stylesInput.styleIcon, styleIcon]} />
            {txtErro.length > 0 &&
                <View style={stylesInput.containerInputInvalido}>
                    <Text style={stylesInput.txtErro}>{txtErro}</Text>
                </View>
            }
        </View>
    )
}

export const stylesInput = StyleSheet.create({
    txtInput: {
        fontSize: 16,
        color: cores.fonteBranco
    },

    inputStyle: {
        borderBottomWidth: 1,
        borderColor: cores.azulBtn,
        padding: 5,
        color: cores.fonteBranco,
        paddingRight: config.windowWidth / 9
    },

    styleIcon: {
        position: 'absolute',
        right: 10,
        bottom: 10
    },

    containerInputInvalido: {
        position: 'absolute',
        bottom: -20,
        right: 5
    },

    txtErro: {
        fontSize: 14,
        color: cores.vermelhoBorder
    }
})