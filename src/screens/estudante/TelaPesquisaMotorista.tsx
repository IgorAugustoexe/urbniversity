import React, { useEffect, useState, Fragment } from 'react'
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import { config, cores, estilos } from '../../styles/Estilos'
import { useNavigation } from '@react-navigation/native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import BtnBlue from '../../components/BtnBlue'
import NavBar from '../../components/NavBar'

const arrayMotoristas = [
    {
        'imgMotorista': 'https://icon-library.com/images/default-profile-icon/default-profile-icon-6.jpg',
        'nomeMotorista': 'Jorge Pereira',
        'assentosDisponíveis': 10,
        'buscaCasa': true,
    },
    {
        'imgMotorista': 'https://icon-library.com/images/default-profile-icon/default-profile-icon-6.jpg',
        'nomeMotorista': 'Aristeu Corridas',
        'assentosDisponíveis': 5,
        'buscaCasa': false,
    },
    {
        'imgMotorista': 'https://icon-library.com/images/default-profile-icon/default-profile-icon-6.jpg',
        'nomeMotorista': 'Everton Busão e Frete',
        'assentosDisponíveis': 10,
        'buscaCasa': false,
    },
    {
        'imgMotorista': 'https://icon-library.com/images/default-profile-icon/default-profile-icon-6.jpg',
        'nomeMotorista': 'Thomas Turbano',
        'assentosDisponíveis': 5,
        'buscaCasa': true,
    },
    {
        'imgMotorista': 'https://icon-library.com/images/default-profile-icon/default-profile-icon-6.jpg',
        'nomeMotorista': 'Kleberson do Uber',
        'assentosDisponíveis': 20,
        'buscaCasa': false,
    },
    {
        'imgMotorista': 'https://icon-library.com/images/default-profile-icon/default-profile-icon-6.jpg',
        'nomeMotorista': 'Rita Manicure e Frete',
        'assentosDisponíveis': 50,
        'buscaCasa': true,
    }
]

export default function TelaPesquisaMotorista() {
    const navigation = useNavigation<any>()

    const [loaderReq, setLoaderReq] = useState<boolean>(false)
    const [erroReq, setErroReq] = useState<boolean>(false)

    useEffect(() => {
        didMount()
    }, [])

    const didMount = () => {
        // implementar req
    }

    const ListaMotoristas = () => (
        <FlatList
            style={{ paddingTop: 10 }}
            //ref={scrollRef}
            data={arrayMotoristas}
            //keyboardShouldPersistTaps={'always'}
            ListEmptyComponent={erroReq ? ErroLoader : RenderListaVazia}
            //ListFooterComponent={renderFooterComponent}
            showsVerticalScrollIndicator={true}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
                return (
                    <TouchableOpacity style={{ backgroundColor: cores.azulPrimario, marginHorizontal: config.windowWidth / 20, marginVertical: 7, flexDirection: 'row', borderRadius: 5 }}>
                        <View>
                            <Image
                                style={styles.imgMotorista}
                                source={{ uri: item.imgMotorista }}
                            />
                        </View>
                        <View style={{ marginHorizontal: 15 }}>
                            <Text style={{ fontSize: 18, color: cores.fonteBranco, paddingVertical: 3, fontWeight: 'bold', }}>{item.nomeMotorista}</Text>
                            <Text style={{ fontSize: 15, color: cores.fonteBranco, paddingVertical: 3 }}>Assentos Disp: {item.assentosDisponíveis}</Text>
                            <Text style={{ fontSize: 15, color: cores.fonteBranco, paddingVertical: 3 }}>Busca em Casa: {item.buscaCasa ? 'Sim' : 'Não'}</Text>
                        </View>
                    </TouchableOpacity>
                )
            }}
        />
    )

    const RenderListaVazia = () => (
        <View style={{ backgroundColor: cores.azulPrimario, margin: config.windowWidth / 20, alignItems: 'center', padding: 5, borderRadius: 5 }}>
            <Text style={{ color: cores.branco, fontSize: 16, textAlign: 'center' }}>Não tem motoristas disponíveis na sua região :(</Text>
        </View>
    )

    const ErroLoader = () => (
        <Fragment>
            {loaderReq ?
                <View style={{ paddingTop: config.windowWidth / 5 }}>
                    <ActivityIndicator color={cores.branco} size={'large'} />
                </View>
                :
                <View style={styles.containerErro} >
                    <Text style={styles.txtErroBold}>Erro ao realizar está operação</Text>
                    <Text style={styles.txtErro}>Por favor verifique sua conexão com a internet e tente novamente.</Text>
                    <TouchableOpacity onPress={() => didMount()}>
                        <BtnBlue style={{ marginHorizontal: config.windowWidth / 5, marginTop: config.windowWidth / 20 }} text='TENTAR NOVAMENTE' />
                    </TouchableOpacity>
                </View>
            }
        </Fragment >
    )

    // componentes

    return (
        <SafeAreaView style={estilos.containerPrincipal}>
            <NavBar titulo='Motoristas Disponíveis' botaoEsquerdo={true} backgroundColor={cores.backgroundPadrao} />
            {(erroReq || loaderReq) ?
                <ErroLoader />
                :
                <ListaMotoristas />
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    imgMotorista: {
        width: 80,
        height: 80,
        borderRadius: 5
    },

    containerErro: {
        alignItems: 'center',
        marginTop: config.windowWidth / 2,
        backgroundColor: cores.azulPrimario,
        marginHorizontal: 10,
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderRadius: 10
    },

    txtErroBold: {
        fontSize: 18,
        fontWeight: 'bold',
        color: cores.fonteBranco,
        paddingVertical: 5
    },

    txtErro: {
        fontSize: 16,
        color: cores.fonteBranco,
        textAlign: 'center'
    }

})