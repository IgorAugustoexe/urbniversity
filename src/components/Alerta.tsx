import React, { useState, useRef } from 'react'
import { StyleSheet, Text, View, LayoutAnimation, Platform, UIManager } from 'react-native'
import { useSelector } from 'react-redux'
import { config } from '../styles/Estilos'
import { useAfterMountEffect } from '../helpers/FuncoesPadrao'


export default function Alerta() {
    const store: any = useSelector<any>(({ system }) => {
        return {
            alerta: system.controleAlerta,
            mensagemAlerta: system.mensagemAlerta
        }
    })

    const timeout: { current: NodeJS.Timeout | null } = useRef(null)
    const animOpacidade: any = useRef({
        create: {
            duration: 300,
            type: LayoutAnimation.Types.easeInEaseOut,
            property: LayoutAnimation.Properties.opacity,
            springDamping: 0.7,
        },
        delete: {
            duration: 300,
            type: LayoutAnimation.Types.easeInEaseOut,
            property: LayoutAnimation.Properties.opacity,
        }
    }).current

    const [controleAlerta, setControleAlerta] = useState(false)

    useAfterMountEffect(() => {
        if (controleAlerta === false) {
            if (Platform.OS === 'android') {
                if (UIManager.setLayoutAnimationEnabledExperimental) {
                    UIManager.setLayoutAnimationEnabledExperimental(true);
                }
            }
            LayoutAnimation.configureNext(animOpacidade)
            setControleAlerta(true)
            if (timeout) {
                clearTimeout(timeout.current as NodeJS.Timeout)
                timeout.current = setTimeout(() => {
                    setControleAlerta(false)
                }, 2500)
            }
        }
    }, [store.alerta])

    /**
     * Didmount
     */

    if (controleAlerta === true) {
        return (
            <View style={styles.containerPrincipal}>
                <View style={styles.containerAlerta}>
                    <Text style={{ color: '#FFF', padding: 8, textAlign: 'center' }}>{store.mensagemAlerta}</Text>
                </View>
            </View>
        )
    } else {
        return null
    }

}

const styles = StyleSheet.create({
    containerPrincipal: {
        width: config.windowWidth,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        zIndex: 1,
        top: config.windowHeight / 2.3
    },
    containerAlerta: {
        width: config.windowWidth / 2.5,
        margin: 30,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    }
})