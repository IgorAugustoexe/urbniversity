import React, { useState, Fragment, useEffect, useContext } from 'react'
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native'
import { config, cores, estilos } from '../../styles/Estilos'
import { useDispatch, useSelector } from 'react-redux'
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'
import BtnBlue from '../../components/BtnBlue'
import NavBar from '../../components/NavBar'
import { controleAlerta } from '../../redux/reducers/sistemaReducer'
import { produceWithPatches } from 'immer'
import { Driver } from '../../types/types'
import { AuthContext } from '../../apis/AuthContext'
import ModalErroGenerico from '../ModalErroGenerico'

type navigation = {
    props: {
        driver?: Driver
    }
}

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
    const { createRequest } = useContext(AuthContext)
    const route = useRoute<RouteProp<navigation, 'props'>>()

    const image = store.user.type == 'driver' && store.user.user.photo
        ||
        route.params?.driver?.user.photo
        ||
        store.user.driver?.user.photo
        ||
        'https://jaraguatenisclube.com.br/images/avatar.png'


    const assentos = store.user.driver ?
        parseInt(store.user.driver.vehicle.seats) - 2 : store.user.vehicle ?
            parseInt(store.user.vehicle.seats) - 2 : route.params.driver ?
                parseInt(route.params.driver?.vehicle?.seats) - 2 : 0

    const nomeMotorista = store.user.driver ?
        store.user.driver.user.fullName : store.user.vehicle ?
            store.user.user.fullName : route.params.driver ?
                route.params.driver.user.fullName : ""

    const solicitarMotorista = async () => {
        await createRequest(route.params.driver?.id)
        navigation.goBack()
    }
    useEffect(() => {
        //console.log(JSON.stringify(route.params.driver, null, "\t"));
        if (route.params.driver) {
            setSolicitar(!solicitar)
        }
    }, [])

    // componentes

    const ImagemVeiculo = () => (
        <Image
            style={styles.imgVeiculo}
            source={{ uri: `${image}` }}
        />
    )
    const Dados = (props: any) => {
        return (

            <View style={styles.cabecalho}>
                <Text style={styles.telefoneMotorista}>
                    {props.phone}
                </Text>
                <ImagemVeiculo />

                {loaderReq ?
                    <ActivityIndicator size={'large'} color={cores.branco} style={{ paddingVertical: config.windowWidth / 5 }} />
                    :
                    <Fragment>
                        <View style={styles.containerInfo}>
                            <View style={styles.containerAssentos}>
                                <View style={styles.containerTotais}>
                                    <Text style={styles.subtitulo}>
                                        Assentos
                                    </Text>
                                    <Text style={styles.subtitulo}>
                                    {props.seats ? props.seats : "Assentos"}
                                    </Text>
                                </View>

                                <View style={styles.containerDisponiveis}>
                                    <Text style={styles.subtitulo}>
                                        Disponíveis
                                    </Text>
                                    <Text style={styles.subtitulo}>
                                        {assentos ? assentos : "Disponíveis"}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.containerInfoMotorista}>
                                <View style={styles.containerTxt}>
                                    <Text style={styles.txtInfo}>
                                        Marca:
                                    </Text>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.txtInfoDB}>
                                        {props.brand ? props.brand : "Marca"}
                                    </Text>
                                </View>

                                <View style={styles.containerTxt}>
                                    <Text style={styles.txtInfo}>
                                        Modelo:
                                    </Text>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.txtInfoDB}>
                                        {props.model ? props.model : "Modelo"}
                                    </Text>
                                </View>
                                <View style={styles.containerTxt}>
                                    <Text style={styles.txtInfo}>
                                        Placa:
                                    </Text>
                                    <Text style={styles.txtInfoDB}>
                                        {props.plate ?  props.plate.slice(0, 3) + "-" +  props.plate.slice(3) : "Placa"}
                                    </Text>
                                </View>
                                <View style={styles.containerTxt}>
                                    <Text style={styles.txtInfo}>
                                        Cor:
                                    </Text>
                                    <Text style={styles.txtInfoDB}>
                                        {props.color ? props.color : "Cor"}
                                    </Text>
                                </View>
                                <View style={styles.containerTxt}>
                                    <Text style={styles.txtInfo}>
                                        Ano:
                                    </Text>
                                    <Text style={styles.txtInfoDB}>
                                        {props.year ? props.year : "Ano"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </Fragment>
                }
            </View>
        )
    }

    const DadosVeiculo = () => (

        store.user.driver ? //Visão do estudante
            <Dados
                phone={store.user.user.phone}
                brand={store.user.driver.vehicle.brand}
                model={store.user.driver.vehicle.model}
                color={store.user.driver.vehicle.color}
                year={store.user.driver.vehicle.year}
                plate={store.user.driver.vehicle.plate}
                seats={store.user.driver.vehicle.seats} />
            : store.user.vehicle && !store.user.user.studentId ? //Visao do motorista
                <Dados
                    phone={store.user.user.phone}
                    brand={store.user.vehicle.brand}
                    model={store.user.vehicle.model}
                    color={store.user.vehicle.color}
                    year={store.user.vehicle.year}
                    plate={store.user.vehicle.plate}
                    seats={store.user.vehicle.seats} />

                : route.params.driver ? //Para estudante aplicar na rota
                    <Dados
                        phone={route.params.driver.user.phone}
                        brand={route.params?.driver?.vehicle?.brand}
                        model={route.params?.driver?.vehicle?.model}
                        color={route.params?.driver?.vehicle?.color}
                        year={route.params?.driver?.vehicle?.year}
                        plate={route.params?.driver?.vehicle?.plate}
                        seats={route.params?.driver?.vehicle?.seats} />
                    : //Caso o estudante ainda não esteja cadastrado
                    <View style={{ backgroundColor: cores.azulPrimario, margin: config.windowWidth / 20, alignItems: 'center', padding: 5, borderRadius: 5 }}>
                        <Text style={{ color: cores.branco, fontSize: 16, textAlign: 'center' }}>Você ainda não está cadastrado em nenhuma rota :(</Text>
                    </View>
    )
    const BtnRota = (props:any) => {
        return (
            <TouchableOpacity
                style={styles.btnRodape}
                onPress={() => navigation.navigate(`${props.tela}`)}
            >
                <BtnBlue
                    text={`${props.texto}`}
                    loader={loaderBtn}
                />

            </TouchableOpacity>)
    }

    return (
        <SafeAreaView style={estilos.containerPrincipal}>
            <NavBar titulo={nomeMotorista} botaoEsquerdo={false}
            />
            <ScrollView>
                {DadosVeiculo()}
            </ScrollView>
            {!store.user.driver && store.user.route?
               <BtnRota tela='mapaMotorista' texto='Consultar Rota'/>
               :
               store.user.driver ? 
               <BtnRota tela='mapa' texto='Consultar Rota'/>
               :
               <></>
            }
             
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
        height: config.windowWidth / 2.5,
        width: config.windowWidth / 2.5,
        resizeMode: 'cover',
        marginTop: config.windowWidth / 20,
        alignSelf: 'center',
        borderRadius: 5,
        marginBottom: '2%',
        borderWidth: 2,
        borderColor: 'white'
    },

    btnRodape: {
        flex: 5,
        alignSelf: 'center',
    },
    cabecalho: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#3B4E80',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    nomeMotorista: {
        fontSize: (config.windowWidth / 12),
        color: cores.branco,
        fontWeight: '900'
    },
    telefoneMotorista: {
        fontSize: (config.windowWidth / 18),
        color: cores.branco,
        fontWeight: '400'
    },
    containerAssentos: {
        flex: 1,
        flexDirection: 'row',
        width: '60%',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1D2740',
        borderColor: cores.branco,
        borderWidth: 2,
        borderTopWidth: 4,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        paddingBottom: 6
    },
    containerInfo: {
        flex: 1,
        backgroundColor: '#1D2740',
        height: 'auto',
        width: '90%',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        paddingBottom: 5,
        maxWidth: '90%'
    },
    containerTotais: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'

    },
    containerDisponiveis: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    subtitulo: {
        fontSize: (config.windowWidth / 21),
        fontWeight: '900',
        color: cores.branco

    },
    containerInfoMotorista: {
        marginTop: '5%',
        flex: 2,
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        alignItems: 'flex-start',
        width: '95%',
        maxWidth: '95%'

    },
    txtInfo: {
        fontSize: (config.windowWidth / 18),
        fontWeight: '900',
        color: cores.branco,
        marginBottom: '2%'
    },
    containerTxt: {
        flex: 1,
        flexDirection: 'row'
    },
    txtInfoDB: {
        fontSize: (config.windowWidth / 18),
        fontWeight: '400',
        color: cores.branco,
        marginLeft: '2%',
        width: '75%'
    },
})