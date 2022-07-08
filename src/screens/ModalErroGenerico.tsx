import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { Fragment } from 'react'
import { StyleSheet, View, TouchableOpacity, Text, Image, ImageBackground } from 'react-native'
import { config, cores } from '../styles/Estilos'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons/faTriangleExclamation'

type navigation = {
    props: {
        icone?: any,
        texto?: string,
        btnTxt?: string,
        btn1Func?: () => void,
        btn2Txt?: string,
        btn2Func?: () => void,
    }
}

export default function ModalErroGenerico() {
    const navigation = useNavigation<any>()
    const route = useRoute<RouteProp<navigation, 'props'>>()

    const { icone, texto, btnTxt, btn2Txt, btn1Func, btn2Func } = { ...route.params }

    const onPressLeft = () => {
        navigation.goBack()
        if (btn1Func) {
            btn1Func()
        }
    }

    const onPressRight = () => {
        navigation.goBack()
        if (btn2Func) {
            btn2Func()
        }
    }

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <View style={styles.containerAlert}>
                <View style={styles.containerImgTxt}>
                    <FontAwesomeIcon icon={icone || faTriangleExclamation} size={config.windowWidth / 12} color={cores.branco} style={styles.icon} />
                    <Text style={styles.txtAviso}>{texto || 'ocorreu um erro ao realizar esta operação, por favor verifique sua conexão e tente novamente.'}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => onPressLeft()} style={[styles.botoes, { borderRightWidth: 0.25 }, !btn2Txt && { width: '100%' }]} hitSlop={{ top: 10 }}>
                        <Text style={[styles.txtAviso, { color: cores.fonteBranco }]}>{btnTxt || 'ok'}</Text>
                    </TouchableOpacity>
                    {btn2Txt &&
                        <TouchableOpacity onPress={() => onPressRight()} style={[styles.botoes, { borderLeftWidth: 0.25 }]} hitSlop={{ top: 10 }}>
                            <Text style={[styles.txtAviso, { color: cores.fonteBranco }]}>{btn2Txt}</Text>
                        </TouchableOpacity>
                    }

                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    containerAlert: {
        width: config.windowWidth / 1.2,
        borderRadius: 5,
        backgroundColor: cores.azulPrimario,
        overflow: 'hidden',
    },
    containerImgTxt: {
        paddingTop: config.windowWidth / 22,
        paddingBottom: config.windowWidth / 19,
        alignItems: 'center'
    },
    txtAviso: {
        fontWeight: '700',
        color: cores.fonteBranco,
        textTransform: 'uppercase',
        textAlign: 'center',
        maxWidth: '85%'
    },
    icon: {
        width: config.windowWidth / 6,
        height: config.windowWidth / 6,
        marginBottom: 6
    },
    botoes: {
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 0.5,
        paddingVertical: 12,
        borderColor: cores.branco,

    }
})