import React, { Fragment } from 'react'
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
    icon?: any,
    secureText?: boolean,
    maxLenght?: number
}

export default function InputDadosUser({ onChangeText, style, value, txtErro, textoInput, keyboardType, onFocus, placeholder, autoCapitalize, secureText, maxLenght, icon }: Props) {
    const attTextvalue = (text: string) => {
        onChangeText && onChangeText(text)
    }

    return (
        <Fragment>
            <Text style={[styles.txtInput, txtErro.length > 0 && { color: cores.vermelhoBorder }]}>{textoInput}</Text>
            <TextInput
                style={[styles.inputStyle, txtErro.length > 0 && { borderColor: cores.vermelhoBorder }, style]}
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
            <FontAwesomeIcon icon={icon} size={config.windowWidth / 16} color={txtErro.length > 0 ? cores.vermelhoBorder : cores.branco} style={styles.styleIcon} />
            {txtErro.length > 0 &&
                <View style={styles.containerInputInvalido}>
                    <Text style={styles.txtErro}>{txtErro}</Text>
                </View>
            }
        </Fragment>
    )
}

const styles = StyleSheet.create({
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