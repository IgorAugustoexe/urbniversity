import React, { useState, Fragment } from 'react'
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Image, TextInput } from 'react-native'
import { config, cores, estilos } from '../styles/Estilos'
import { useNavigation } from '@react-navigation/native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons/faGear'
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons/faMapLocationDot'
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons/faCalendarDays'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons/faAnglesRight'

export default function TelaLogin() {
    const navigation = useNavigation<any>()

    return (
        <SafeAreaView style={estilos.containerPrincipal}>
            <View style={{ paddingTop: config.windowWidth / 10, paddingHorizontal: config.windowWidth / 4 }}>
                <Text style={{ fontSize: 26, fontWeight: '700', color: cores.fonteBranco, textAlign: 'left', }}>URBNiversity</Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: cores.azulBtn, textAlign: 'right', }}>ESTUDANTE</Text>
            </View>

            <Fragment>
                <View style={{ paddingTop: config.windowWidth / 10, alignItems: 'center' }}>
                    <Text style={{ fontSize: 26, fontWeight: 'bold', color: cores.fonteBranco }}>Login</Text>
                </View>
                <View style={{ paddingTop: 15 }}>
                    <Text style={{ fontSize: 16, color: cores.fonteBranco }}>Email</Text>
                    <TextInput></TextInput>
                </View>
            </Fragment>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

})