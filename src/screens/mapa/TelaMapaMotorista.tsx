import React, { useState, useEffect, useRef, Fragment } from 'react'
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, PermissionsAndroid } from 'react-native'
import { config, cores, estilos } from '../../styles/Estilos'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft'
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen'
import { faBroom } from '@fortawesome/free-solid-svg-icons/faBroom'
import MapView, { Marker } from 'react-native-maps'
import Geolocation from '@react-native-community/geolocation'
import MapViewDirections from 'react-native-maps-directions'
import { mapaNoite } from './estilosMapa'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'
import { navigationRef } from '../../apis/AuthContext'
import { width } from '@fortawesome/free-solid-svg-icons/faGear'

const options = {
    enableVibrateFallBack: true,
    ignoreAndroidSystemSettings: true
}

export default function TelaMapaMotorista() {
    const navigation = useNavigation<any>()

    const [regiao, setRegiao] = useState<any>({})
    const [pontos, setPontos] = useState<any>([])
    const [origem, setOrigem] = useState<any>({})
    const [destino, setDestino] = useState<any>({})
    const [ativarMarcadores, setAtivarMarcadores] = useState<boolean>(false)

    useEffect(() => {
        pegarLocalizacaoUser()
    }, [])

    const pegarLocalizacaoUser = () => {
        Geolocation.getCurrentPosition(info => {
            setRegiao({
                latitude: info.coords.latitude,
                longitude: info.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            })
        },
            () => { console.log('erro') }, {
            enableHighAccuracy: true,
            timeout: 2000
        })
    }

    const adicionarMarcador = (coordenada: any) => {
        if (ativarMarcadores) {
            setPontos([...pontos, coordenada])
        }
        return
    }

    const salvarMarcadores = () => {
        setOrigem(pontos[0])
        setDestino(pontos[pontos.length - 1])
        setAtivarMarcadores(false)
    }

    // COMPONENTES

    const Btnvoltar = () => (
        <View style={styles.btnVoltar}>
            <TouchableOpacity
                style={styles.areaBtnVoltar}
                hitSlop={styles.hitSlopPadrao}
                onPress={() => navigation.goBack()}
            >
                <FontAwesomeIcon icon={faChevronLeft} size={config.windowWidth / 14} color={cores.branco} />
            </TouchableOpacity>
        </View>
    )

    const EdicaoMarcadores = () => (
        <Fragment>
            <View style={styles.containerTxtInformativo}>
                <Text style={styles.txtInformativo}>Clique em qualquer local do mapa para adicionar pontos de parada</Text>
            </View>

            <TouchableOpacity style={styles.btnSalvar} onPress={() => salvarMarcadores()}>
                <Text style={styles.txtInformativo}>Salvar Pontos</Text>
            </TouchableOpacity>
        </Fragment>
    )

    const BtnEditar = () => (
        <View style={styles.btnEditarMarcadores}>
            <TouchableOpacity
                style={styles.areaBtnEditarMarcadores}
                hitSlop={styles.hitSlopPadrao}
                onPress={() => setAtivarMarcadores(true)}
            >
                <FontAwesomeIcon icon={faPen} size={config.windowWidth / 20} color={cores.branco} />
            </TouchableOpacity>
        </View>
    )

    const BtnLimpar = () => (
        <View style={[styles.btnEditarMarcadores, { top: config.windowWidth / 2 }]}>
            <TouchableOpacity
                style={styles.areaBtnEditarMarcadores}
                hitSlop={styles.hitSlopPadrao}
                onPress={() => setPontos([])}
            >
                <FontAwesomeIcon icon={faBroom} size={config.windowWidth / 20} color={cores.branco} />
            </TouchableOpacity>
        </View>
    )

    const Mapa = () => (
        <MapView
            style={styles.map}
            onPress={(event) => adicionarMarcador(event.nativeEvent.coordinate)}
            onMapReady={() => {
                PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
                    .then(() => {
                        console.log('aceitou')
                    })
            }} // função chamada ao renderizar o mapa
            initialRegion={regiao} // região inicial
            //minZoomLevel={14} // minimo de zoom no mapa
            showsUserLocation // mostrar localização do user
            showsMyLocationButton // precisa do Shows userLocation
            userLocationPriority='high' // precisão da localização
            showsCompass // mostra bússola canto superiror esquerdo
            //showsTraffic // mostrar tráfego na região
            // customMapStyle={mapaNoite}// estilo do mapa
            loadingEnabled
            zoomControlEnabled
        >
            {
                pontos.length > 0 &&
                pontos.map((item: any, index: number) => (
                    <Marker key={index} coordinate={item} />
                ))
            }

            {!ativarMarcadores && pontos.length >= 2 &&
                <Fragment>
                    <Marker
                        coordinate={origem}
                        draggable
                        onDragStart={() => ReactNativeHapticFeedback.trigger("impactMedium", options)}
                        onDragEnd={(event) => setOrigem(event.nativeEvent.coordinate)}
                        image={require('../../../assets/img/onibusImage.png')}
                    />
                    <Marker
                        coordinate={destino}
                        draggable
                        onDragStart={() => ReactNativeHapticFeedback.trigger("impactMedium", options)}
                        onDragEnd={(event) => setDestino(event.nativeEvent.coordinate)}
                        pinColor={'pink'}
                    />

                    <MapViewDirections
                        apikey={'AIzaSyCff_T9kaWmUkjKtS37Me0ypoIL--Nxksg'}
                        origin={origem}
                        waypoints={pontos}
                        destination={destino}
                        strokeColor="#3399CC" // cor da linha
                        strokeWidth={3} // grossura da linha
                    />
                </Fragment>
            }
        </MapView>
    )

    return (
        <View style={{ flex: 1 }}>
            <Btnvoltar />
            {Mapa()}
            {ativarMarcadores ?
                <Fragment>
                    <EdicaoMarcadores />
                    <BtnLimpar />
                </Fragment>
                :
                <BtnEditar />
            }
        </View >
    )
}

const styles = StyleSheet.create({
    // mapa
    map: {
        width: '100%',
        height: '100%',
    },
    // EdicaoMarcadores
    containerTxtInformativo: {
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: cores.azulSecundario,
        padding: 10,
        borderRadius: 5,
        top: config.windowWidth / 5
    },
    txtInformativo: {
        fontSize: 14,
        color: cores.branco,
        textAlign: 'center'
    },
    btnSalvar: {
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: cores.azulBtn,
        padding: 10,
        borderRadius: 10,
        bottom: config.windowWidth / 10
    },
    // EdicaoMarcadores
    btnEditarMarcadores: {
        position: 'absolute',
        zIndex: 2,
        top: config.windowWidth / 6,
        right: 10
    },
    areaBtnEditarMarcadores: {
        alignItems: 'center',
        padding: 12,
        backgroundColor: cores.azulBtn,
        borderRadius: 30,
    },
    // BtnEditar
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
        borderRadius: 30,
    },
    // globais
    hitSlopPadrao: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
    },
})