import React, { useState, Fragment } from 'react'
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native'
import { config, cores, estilos } from '../../styles/Estilos'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import BtnBlue from '../../components/BtnBlue'
import NavBar from '../../components/NavBar'
import { controleAlerta } from '../../redux/reducers/sistemaReducer'

export default function TelaVeiculo() {

    const store: any = useSelector<any>(({ user }) => {
        return {
            user: user
        }
    })
    const navigation = useNavigation<any>()
    const dispatch = useDispatch()

    const [loaderReq, setLoaderReq] = useState<boolean>(false)
    const [loaderBtn, setLoaderBtn] = useState<boolean>(false)
    const [solicitar, setSolicitar] = useState<boolean>(false)
    
    const assentos = store.user.driver ? parseInt(store.user.driver.vehicle.seats) - 2 : store.user.vehicle ? parseInt(store.user.vehicle.seats) - 2 : 0
    const nomeMotorista = store.user.driver ? store.user.driver.user.fullName : store.user.vehicle ? store.user.user.fullName : ""
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
        store.user.driver ? //Visão do motorista
        <View style={{ padding: config.windowWidth / 30 }}>
            <View style={{ alignItems: 'center', paddingBottom: config.windowWidth / 20 }}>
                <Text style={{ color: cores.branco, fontSize: 16, fontWeight: '500' }}>{store.user.user.phone}</Text>
                <Text style={{ color: cores.branco, fontSize: 16, fontWeight: '500', paddingTop: 5 }}>Valor: R$</Text>
            </View>
            <View style={{ backgroundColor: cores.azulSecundario, padding: config.windowWidth / 20, borderRadius: 10 }}>
                {loaderReq ?
                    <ActivityIndicator size={'large'} color={cores.branco} style={{ paddingVertical: config.windowWidth / 5 }} />
                    :
                    <Fragment>
                        <View style={{ flexDirection: 'row',  maxWidth:'80%' }}>
                            <Text style={{ color: cores.fonteCinza, fontSize: 16, fontWeight: 'bold', paddingRight: config.windowWidth / 20 }}>Marca:</Text>
                            <Text style={{ color: cores.branco, fontSize: 16, fontWeight: '500' }}>{store.user.driver.vehicle.brand}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: config.windowWidth / 20, maxWidth:'80%' }}>
                            <Text style={{ color: cores.fonteCinza, fontSize: 16, fontWeight: 'bold', paddingRight: config.windowWidth / 20 }}>Modelo:</Text>
                            <Text style={{ color: cores.branco, fontSize: 16, fontWeight: '500' }} numberOfLines={1} ellipsizeMode="tail">{store.user.driver.vehicle.model}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: config.windowWidth / 20,  maxWidth:'80%' }}>
                            <Text style={{ color: cores.fonteCinza, fontSize: 16, fontWeight: 'bold', paddingRight: config.windowWidth / 20 }}>Cor Veículo:</Text>
                            <Text style={{ color: cores.branco, fontSize: 16, fontWeight: '500' }}>{store.user.driver.vehicle.color}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: config.windowWidth / 20,  maxWidth:'80%' }}>
                            <Text style={{ color: cores.fonteCinza, fontSize: 16, fontWeight: 'bold', paddingRight: config.windowWidth / 20 }}>Placa:</Text>
                            <Text style={{ color: cores.branco, fontSize: 16, fontWeight: '500' }}>PLACA</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: config.windowWidth / 20,  maxWidth:'80%' }}>
                            <Text style={{ color: cores.fonteCinza, fontSize: 16, fontWeight: 'bold', paddingRight: config.windowWidth / 20 }}>Ano:</Text>
                            <Text style={{ color: cores.branco, fontSize: 16, fontWeight: '500' }}>{store.user.driver.vehicle.year}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: config.windowWidth / 20,  maxWidth:'80%'}}>
                            <Text style={{ color: cores.fonteCinza, fontSize: 16, fontWeight: 'bold', paddingRight: config.windowWidth / 20 }}>Assentos Disponíveis:</Text>
                            <Text style={{ color: cores.branco, fontSize: 16, fontWeight: '500' }}>{assentos}/{store.user.driver.vehicle.seats}</Text>
                        </View>
                    </Fragment>
                }
            </View>
        </View >
        : !store.user.user.studentId ? //Visao do estudante
        <View style={{ padding: config.windowWidth / 30 }}>
            <View style={{ alignItems: 'center', paddingBottom: config.windowWidth / 20 }}>
                <Text style={{ color: cores.branco, fontSize: 16, fontWeight: '500' }}>{store.user.user.phone}</Text>
                <Text style={{ color: cores.branco, fontSize: 16, fontWeight: '500', paddingTop: 5 }}>Valor: R$</Text>
            </View>
            <View style={{ backgroundColor: cores.azulSecundario, padding: config.windowWidth / 20, borderRadius: 10 }}>
                {loaderReq ?
                    <ActivityIndicator size={'large'} color={cores.branco} style={{ paddingVertical: config.windowWidth / 5 }} />
                    :
                    <Fragment>
                        <View style={{ flexDirection: 'row',  maxWidth:'80%' }}>
                            <Text style={{ color: cores.fonteCinza, fontSize: 16, fontWeight: 'bold', paddingRight: config.windowWidth / 20 }}>Marca:</Text>
                            <Text style={{ color: cores.branco, fontSize: 16, fontWeight: '500' }}>{store.user.vehicle.brand}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: config.windowWidth / 20, maxWidth:'80%' }}>
                            <Text style={{ color: cores.fonteCinza, fontSize: 16, fontWeight: 'bold', paddingRight: config.windowWidth / 20 }}>Modelo:</Text>
                            <Text style={{ color: cores.branco, fontSize: 16, fontWeight: '500' }} numberOfLines={1} ellipsizeMode="tail">{store.user.vehicle.model}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: config.windowWidth / 20,  maxWidth:'80%' }}>
                            <Text style={{ color: cores.fonteCinza, fontSize: 16, fontWeight: 'bold', paddingRight: config.windowWidth / 20 }}>Cor Veículo:</Text>
                            <Text style={{ color: cores.branco, fontSize: 16, fontWeight: '500' }}>{store.user.vehicle.color}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: config.windowWidth / 20,  maxWidth:'80%' }}>
                            <Text style={{ color: cores.fonteCinza, fontSize: 16, fontWeight: 'bold', paddingRight: config.windowWidth / 20 }}>Placa:</Text>
                            <Text style={{ color: cores.branco, fontSize: 16, fontWeight: '500' }}>PLACA</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: config.windowWidth / 20,  maxWidth:'80%' }}>
                            <Text style={{ color: cores.fonteCinza, fontSize: 16, fontWeight: 'bold', paddingRight: config.windowWidth / 20 }}>Ano:</Text>
                            <Text style={{ color: cores.branco, fontSize: 16, fontWeight: '500' }}>{store.user.vehicle.year}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: config.windowWidth / 20,  maxWidth:'80%'}}>
                            <Text style={{ color: cores.fonteCinza, fontSize: 16, fontWeight: 'bold', paddingRight: config.windowWidth / 20 }}>Assentos Disponíveis:</Text>
                            <Text style={{ color: cores.branco, fontSize: 16, fontWeight: '500' }}>{assentos}/{store.user.vehicle.seats}</Text>
                        </View>
                    </Fragment>
                }
            </View>
        </View >
        : //Caso o estudante ainda não esteja cadastrado
        <View style={{ backgroundColor: cores.azulPrimario, margin: config.windowWidth / 20, alignItems: 'center', padding: 5, borderRadius: 5 }}>
            <Text style={{ color: cores.branco, fontSize: 16, textAlign: 'center' }}>Você ainda não está cadastrado em nenhuma rota :(</Text>
        </View>
    )

    return (
        <SafeAreaView style={estilos.containerPrincipal}>
            <NavBar titulo={nomeMotorista} botaoEsquerdo={false} backgroundColor={cores.backgroundPadrao} />
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