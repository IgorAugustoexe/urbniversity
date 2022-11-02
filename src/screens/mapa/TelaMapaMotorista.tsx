import React, { useContext, useState, useEffect, Fragment } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, PermissionsAndroid } from 'react-native'
import { config, cores } from '../../styles/Estilos'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPen, faBroom } from '@fortawesome/free-solid-svg-icons'
import MapView, { Marker } from 'react-native-maps'
import Geolocation from '@react-native-community/geolocation'
import MapViewDirections from 'react-native-maps-directions'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'
import { AuthContext } from '../../apis/AuthContext'
import { selection_sort } from '../../helpers/FuncoesPadrao'
import BtnVoltar from '../../components/BtnVoltar'

const options = {
    enableVibrateFallBack: true,
    ignoreAndroidSystemSettings: true
}

export default function TelaMapaMotorista() {
    const store: any = useSelector<any>(({ user }) => {
        return {
            user: user
        }
    })

    const [regiao, setRegiao] = useState<any>({ "latitude": -21.96981, "latitudeDelta": 0.0922, "longitude": -46.79850499999999, "longitudeDelta": 0.0421 })
    const [pontos, setPontos] = useState<any>([])
    const [origem, setOrigem] = useState<any>({ "latitude": -21.969815466912234, "longitude": -46.793406003040985 })
    const [destino, setDestino] = useState<any>({ "latitude": -21.964652345070213, "longitude": -46.791549417993124 })
    const [ativarMarcadores, setAtivarMarcadores] = useState<boolean>(false)
    const [loading, setLoading] = useState(false)
    const { getSpots, setSpots } = useContext(AuthContext)
    const [newSpots, setNewSpots] = useState<any>([])
    const unifae = {
        latitude: -21.964652345070213,
        longitude: -46.791549417993124
    }
    const unifeob = {
        latitude: -21.969815466912234,
        longitude: -46.793406003040985
    }


    useEffect(() => {
        pegarLocalizacaoUser()

    }, [])

    const recuperaPontos = async () => {
        let aux = await getSpots();
        if (aux.length > 0) {
            let spots: any = []
            aux.forEach((element: any) => {
                spots.push({ latitude: Number(element.lat), longitude: Number(element.lng) })
            });


            var unifaeComp = Math.pow(unifae.latitude + unifae.longitude, 2)
            var unifeobComp = Math.pow(unifeob.latitude + unifeob.longitude, 2)

            if (store.user.route.university.name.toUpperCase() === "UNIFAE") {
                selection_sort(pontos, unifaeComp)
                setPontos(spots)
                setOrigem(spots[0])
            } else {
                selection_sort(pontos, unifeobComp)
                setPontos(spots)
                setOrigem(spots[0])
            }
        }
        if (store.user.route.university.name.toUpperCase() === "UNIFAE") {
            setDestino(unifae)
        } else {
            setDestino(unifeob)
        }



        //setDestino(spots[spots.length - 1])

    }
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
            setNewSpots([...newSpots, coordenada])
        }
        return
    }
    const handelSave = async () => {
 
        setSpots(newSpots)

    }
    const salvarMarcadores = () => {
        var unifaeComp = Math.pow(unifae.latitude + unifae.longitude, 2)
        var unifeobComp = Math.pow(unifeob.latitude + unifeob.longitude, 2)
        setOrigem(pontos[0])
        if (store.user.route.university.name.toUpperCase() === "UNIFAE") {

            selection_sort(pontos, unifaeComp)
            setPontos(pontos)
            setOrigem(pontos[0])
            setDestino(unifae)
        } else {
            selection_sort(pontos, unifeobComp)
            setPontos(pontos)
            setOrigem(pontos[0])
            setDestino(unifeob)
        }
        handelSave()
        //setDestino(pontos[pontos.length - 1])
        setAtivarMarcadores(false)
    }

    if (!loading) {
        setLoading(true)
        recuperaPontos()
    }

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
            initialRegion={regiao.length > 0 ? regiao :
                {
                    "latitude": -21.96981,
                    "latitudeDelta": 0.0922,
                    "longitude": -46.79850499999999,
                    "longitudeDelta": 0.0421
                }
            } // região inicial
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
                pontos.map((item: any, index: number) => {
                    return (
                        <Marker key={index} coordinate={item} />
                    )
                })
            }

            {!ativarMarcadores && pontos.length >= 2 &&
                <Fragment>
                    <Marker
                        coordinate={origem.length ? origem : {
                            latitude: -21.964652345070213,
                            longitude: -46.791549417993124
                        }}
                        draggable
                        onDragStart={() => ReactNativeHapticFeedback.trigger("impactMedium", options)}
                        onDragEnd={(event) => setOrigem(event.nativeEvent.coordinate)}
                        image={require('../../../assets/img/onibusImage.png')}
                    />
                    <Marker
                        coordinate={destino.length > 0 ? destino : {
                            latitude: -21.96981,
                            longitude: -46.79850499999999
                        }}
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
            <BtnVoltar />
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
        width: config.windowWidth,
        height: config.windowHeight
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
        borderRadius: 30
    },
    hitSlopPadrao: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
    }
})