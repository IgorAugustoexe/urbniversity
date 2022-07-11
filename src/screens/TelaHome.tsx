import React, { useState, Fragment } from 'react'
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'
import { config, cores, estilos } from '../styles/Estilos'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons/faGear'
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons/faMapLocationDot'
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons/faCalendarDays'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons/faAnglesRight'

type navigation = {
    props: {
        isDrive: boolean
    }
}

export default function TelaHome() {
    const navigation = useNavigation<any>()
    const route = useRoute<RouteProp<navigation, 'props'>>()

    console.log(route)

    const [temMotorista, setTemMotorista] = useState<boolean>(true)

    return (
        <SafeAreaView style={estilos.containerPrincipal}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.txtBold}>Bem Vindo Estudante!</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('login')}>
                        <FontAwesomeIcon icon={faGear} size={config.windowWidth / 16} color={cores.branco} />
                    </TouchableOpacity>
                </View>

                <View style={styles.containerHeader}>
                    <Image
                        style={styles.imgUser}
                        source={{ uri: 'https://jaraguatenisclube.com.br/images/avatar.png' }}
                    />
                    <View style={styles.headerBtn}>
                        <TouchableOpacity
                            style={styles.containerBtn}
                        >
                            <Text style={styles.txtBtn}>VER MAPA</Text>
                            <FontAwesomeIcon icon={faMapLocationDot} size={config.windowWidth / 12} color={cores.branco} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.containerBtn}
                        >
                            <Text style={styles.txtBtn}>CALENDÁRIO</Text>
                            <FontAwesomeIcon icon={faCalendarDays} size={config.windowWidth / 12} color={cores.branco} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {temMotorista ?
                <TouchableOpacity style={styles.btnRota} activeOpacity={0.8}>
                    <Text style={styles.txtCodigoRota}>Rota: 1874</Text>
                    <View style={styles.containerRota}>
                        <Text style={styles.txtNomeRota}>UNIFAE - Centro Universitário das Faculdades Associadas de Ensino - FAE</Text>
                        <View style={{ width: '10%', justifyContent: 'center' }}>
                            <FontAwesomeIcon icon={faAnglesRight} size={config.windowWidth / 13} color={cores.branco} />
                        </View>
                    </View>
                </TouchableOpacity>
                :
                <View style={{ padding: config.windowWidth / 10 }}>
                    <Text style={[styles.txtBold, { alignItems: 'center' }]}>Você não está cadastrado em nenhuma rota, clique no botão abaixo para encontrar seu Motorista!</Text>
                </View>
            }


            <TouchableOpacity style={styles.rodape}>
                <Text style={styles.txtBtnRodape}>{temMotorista ? 'Visualizar meu Veículo' : 'Encontrar Motorista'}</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    header: {
        padding: config.windowWidth / 20,
        backgroundColor: cores.azulPrimario,
        borderBottomWidth: 1,
        borderColor: cores.pretoBorder,
    },

    containerHeader: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: config.windowWidth / 20
    },

    headerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: cores.azulDisabled,
        borderRadius: 15
    },

    containerBtn: {
        alignItems: 'center',
        padding: 10
    },

    containerRota: {
        marginTop: 10,
        padding: 13,
        flexDirection: 'row'
    },

    btnRota: {
        backgroundColor: cores.azulBtn,
        marginTop: config.windowWidth / 15,
        marginHorizontal: 5,
        borderRadius: 15
    },

    txtCodigoRota: {
        fontSize: 16,
        color: cores.fonteBranco,
        backgroundColor: cores.azulEscuro,
        position: 'absolute',
        top: -16,
        left: 10,
        padding: 7,
        borderRadius: 5
    },

    txtNomeRota: {
        fontSize: 18,
        color: cores.branco,
        width: '90%'
    },

    txtBtn: {
        fontSize: 14,
        color: cores.fonteBranco,
        bottom: 5
    },

    txtBold: {
        fontSize: 18,
        fontWeight: '700',
        color: cores.fonteBranco
    },

    imgUser: {
        width: 80,
        height: 80,
        resizeMode: 'cover',
        borderWidth: 2,
        borderColor: cores.branco,
        borderRadius: 3
    },

    rodape: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: config.windowWidth / 20,
        backgroundColor: cores.azulBtn,
        padding: 15,
        borderRadius: 20,
    },

    txtBtnRodape: {
        fontSize: 16,
        fontWeight: '700',
        color: cores.fonteBranco,
        textAlign: 'center'
    },
})