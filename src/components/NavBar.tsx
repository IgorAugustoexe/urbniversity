import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native'
import { config, cores } from '../styles/Estilos'
import { useNavigation } from '@react-navigation/native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft, faXmark } from '@fortawesome/free-solid-svg-icons'

type Props = {
    titulo: string,
    botaoEsquerdo?: boolean,
    voltar?: () => void,
    backgroundColor?: any
}

type PropsButton = {
    color?: string
}

export const BackButton = ({ color }: PropsButton) => (
    <FontAwesomeIcon icon={faChevronLeft} size={config.windowWidth / 14} color={color ? color : cores.branco} />
)

export const RightButton = ({ color }: PropsButton) => (
    <FontAwesomeIcon icon={faXmark} size={config.windowWidth / 13} color={color ? color : cores.branco} />
)

const NavBar = ({ titulo, botaoEsquerdo = true, voltar, backgroundColor }: Props) => {
    const navigation = useNavigation()
    return (
        <View style={[styles.navBar, backgroundColor && { backgroundColor }]}>
            <TouchableOpacity
                style={styles.botaoVoltar}
                hitSlop={styles.areaTouch}
                onPress={() => navigation.goBack()}
                disabled={!botaoEsquerdo}
            >
                {botaoEsquerdo && <BackButton />}
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
                <Text style={styles.tituloNavBar} numberOfLines={1}>{titulo}</Text>
            </View>
            <TouchableOpacity
                style={styles.botaoDireito}
                hitSlop={styles.areaTouch}
                onPress={() => navigation.goBack()}
                disabled={botaoEsquerdo}
            >
                {!botaoEsquerdo && <RightButton />}
            </TouchableOpacity>
        </View>
    )
}

export default NavBar

const styles = StyleSheet.create({
    navBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: config.windowWidth / 20,
        paddingVertical: config.windowWidth / 20,
        borderBottomWidth: 1,
        borderBottomColor: cores.branco
    },
    tituloNavBar: {
        fontSize: 18,
        fontWeight: '800',
        color: cores.fonteBranco,
        textTransform: 'uppercase'
    },
    areaTouch: {
        top: 10,
        bottom: 10,
        left: 20,
        right: 20
    },
    botaoDireito: {
        overflow: 'hidden',
        position: 'absolute',
        right: 0,
        top: 10,
        width: config.windowWidth / 8,
        height: 50,
        justifyContent: 'center'
    },
    botaoVoltar: {
        overflow: 'hidden',
        position: 'absolute',
        left: 0,
        top: 10,
        width: config.windowWidth / 10,
        height: 50,
        justifyContent: 'center'
    }
})