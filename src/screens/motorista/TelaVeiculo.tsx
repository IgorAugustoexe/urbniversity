import React, { useState, Fragment } from 'react'
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native'
import { config, cores, estilos } from '../../styles/Estilos'
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import BtnBlue from '../../components/BtnBlue'
import NavBar from '../../components/NavBar'
import { controleAlerta } from '../../redux/reducers/sistemaReducer'

export default function TelaVeiculo() {
    const navigation = useNavigation<any>()
    const dispatch = useDispatch()

    const [loaderReq, setLoaderReq] = useState<boolean>(false)
    const [loaderBtn, setLoaderBtn] = useState<boolean>(false)
    const [solicitar, setSolicitar] = useState<boolean>(false)

    const solicitarMotorista = () => {
        dispatch(controleAlerta('Solicitação com sucesso!'))
        navigation.goBack()
    }

    // componentes

    const ImagemVeiculo = () => (
        <Image
            style={styles.imgVeiculo}
            source={{ uri: 'https://img2.gratispng.com/20180510/dkw/kisspng-van-car-computer-icons-professional-services-5af3da1ab964b2.8835695915259305227594.jpg' }}
        />
    )

    const DadosVeiculo = () => (
        <View style={{ padding: config.windowWidth / 30 }}>
            <View style={{ alignItems: 'center', paddingBottom: config.windowWidth / 20 }}>
                <Text style={{ color: cores.fonteBranco, fontSize: 16, fontWeight: 'bold', paddingVertical: 10 }}>Nome Motorista</Text>
                <Text style={{ color: cores.branco, fontSize: 16, fontWeight: '500' }}>Contato</Text>
                <Text style={{ color: cores.branco, fontSize: 16, fontWeight: '500', paddingTop: 5 }}>Valor</Text>
            </View>
            <View style={{ backgroundColor: cores.azulSecundario, padding: config.windowWidth / 20, borderRadius: 10 }}>
                {loaderReq ?
                    <ActivityIndicator size={'large'} color={cores.branco} style={{ paddingVertical: config.windowWidth / 5 }} />
                    :
                    <Fragment>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: cores.fonteCinza, fontSize: 16, fontWeight: 'bold', paddingRight: config.windowWidth / 20 }}>Marca e Modelo:</Text>
                            <Text style={{ color: cores.branco, fontSize: 16, fontWeight: '500' }}>Marca e Modelo</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: config.windowWidth / 20 }}>
                            <Text style={{ color: cores.fonteCinza, fontSize: 16, fontWeight: 'bold', paddingRight: config.windowWidth / 20 }}>Cor Veículo:</Text>
                            <Text style={{ color: cores.branco, fontSize: 16, fontWeight: '500' }}>Cor</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: config.windowWidth / 20 }}>
                            <Text style={{ color: cores.fonteCinza, fontSize: 16, fontWeight: 'bold', paddingRight: config.windowWidth / 20 }}>Placa:</Text>
                            <Text style={{ color: cores.branco, fontSize: 16, fontWeight: '500' }}>Numero da Placa</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: config.windowWidth / 20 }}>
                            <Text style={{ color: cores.fonteCinza, fontSize: 16, fontWeight: 'bold', paddingRight: config.windowWidth / 20 }}>Ano:</Text>
                            <Text style={{ color: cores.branco, fontSize: 16, fontWeight: '500' }}>Ano veiculo</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: config.windowWidth / 20 }}>
                            <Text style={{ color: cores.fonteCinza, fontSize: 16, fontWeight: 'bold', paddingRight: config.windowWidth / 20 }}>Ano:</Text>
                            <Text style={{ color: cores.branco, fontSize: 16, fontWeight: '500' }}>Ano veiculo</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: config.windowWidth / 20 }}>
                            <Text style={{ color: cores.fonteCinza, fontSize: 16, fontWeight: 'bold', paddingRight: config.windowWidth / 20 }}>Assentos Disponíveis:</Text>
                            <Text style={{ color: cores.branco, fontSize: 16, fontWeight: '500' }}>10/20</Text>
                        </View>
                    </Fragment>
                }
            </View>
        </View >
    )

    return (
        <SafeAreaView style={estilos.containerPrincipal}>
            <NavBar titulo='Nome Motorista' botaoEsquerdo={false} backgroundColor={cores.backgroundPadrao} />
            <ScrollView>
                <ImagemVeiculo />
                {DadosVeiculo()}
            </ScrollView>
            {solicitar &&
                <TouchableOpacity onPress={() => solicitarMotorista()} disabled={loaderBtn} style={styles.btnRodape}>
                    <BtnBlue
                        text={'SOLICITAR MOTORISTA'}
                        loader={loaderBtn}
                    />
                </TouchableOpacity>
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    imgVeiculo: {
        height: config.windowWidth / 2,
        width: config.windowWidth / 1.5,
        resizeMode: 'cover',
        marginTop: config.windowWidth / 20,
        alignSelf: 'center',
        borderRadius: 5,
    },

    btnRodape: {
        marginVertical: config.windowWidth / 30,
        marginHorizontal: config.windowWidth / 10
    }
})