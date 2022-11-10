import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { cores, config } from '../styles/Estilos'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { useNavigation } from '@react-navigation/native'

export default function BtnVoltar() {
    const navigation = useNavigation<any>()
    return (
        <View style={styles.btnVoltar}>
            <TouchableOpacity
                style={styles.areaBtnVoltar}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => navigation.goBack()}
            >
                <FontAwesomeIcon icon={faChevronLeft} size={config.windowWidth / 14} color={cores.branco} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    // BtnVoltar
    btnVoltar: {
        position: 'absolute',
        zIndex: 2,
        top: 10,
        left: 10
    },
    areaBtnVoltar: {
        alignItems: 'center',
        padding: 8,
        backgroundColor: cores.azulBtn,
        borderRadius: 30
    },
})
