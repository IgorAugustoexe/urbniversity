import React from 'react'
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'
import { useDispatch } from 'react-redux'
import { config, cores, estilos } from '../../styles/Estilos'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons/faGear'
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons/faCalendarDays'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons/faAnglesRight'
import { faVanShuttle } from '@fortawesome/free-solid-svg-icons/faVanShuttle'

type navigation = {
    props: {
        isDrive: boolean
    }
}

export default function TelaHome() {
    const navigation = useNavigation<any>()
    const route = useRoute<RouteProp<navigation, 'props'>>()
    const dispatch = useDispatch()

    console.log(route.params)

    return (
        <SafeAreaView style={estilos.containerPrincipal}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.txtBold}>Bem Vindo {route.params.isDrive ? 'Motorista' : 'Estudante'}!</Text>
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
                        <TouchableOpacity style={styles.containerBtn} onPress={() => navigation.navigate('veiculo')}>
                            <Text style={styles.txtBtn}>MINHA VAN</Text>
                            <FontAwesomeIcon icon={faVanShuttle} size={config.windowWidth / 12} color={cores.branco} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.containerBtn} onPress={() => console.log('navigation.navigate(financeiro)')}>
                            <Text style={styles.txtBtn}>CALENDARIO</Text>
                            <FontAwesomeIcon icon={faCalendarDays} size={config.windowWidth / 12} color={cores.branco} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {route.params.isDrive ?
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
                    <Text style={[styles.txtBold, { textAlign: 'center' }]}>Você não está cadastrado em nenhuma rota, clique no botão abaixo para encontrar seu Motorista!</Text>
                </View>
            }

            {!route.params.isDrive &&
                <TouchableOpacity style={styles.rodape} onPress={() => navigation.navigate('pesquisaMotorista')}>
                    <Text style={styles.txtBtnRodape}>Encontrar Motorista</Text>
                </TouchableOpacity>
            }
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
        backgroundColor: cores.azulPrimario,
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