import React, { useState, useEffect, useRef, useContext } from 'react'
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Image, PermissionsAndroid } from 'react-native'
import { config, cores, estilos } from '../../styles/Estilos'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faFlagCheckered } from '@fortawesome/free-solid-svg-icons/faFlagCheckered'
import MapView, { Marker, Polyline } from 'react-native-maps'
import Geolocation from '@react-native-community/geolocation'
import MapViewDirections from 'react-native-maps-directions'
import { mapaNoite } from './estilosMapa'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'
import { AuthContext } from '../../apis/AuthContext'
import { useDispatch, useSelector } from 'react-redux'
import { selection_sort } from '../../helpers/FuncoesPadrao'

const options = {
    enableVibrateFallBack: true,
    ignoreAndroidSystemSettings: true
}

export default function TelaMapa() {

    const store: any = useSelector<any>(({ user }) => {
        return {
            user: user
        }
    })
    const [regiao, setRegiao] = useState<any>({"latitude": -21.96981, "latitudeDelta": 0.0922, "longitude": -46.79850499999999, "longitudeDelta": 0.0421})
    const [pontos, setPontos] = useState<any>([])

    const [origem, setOrigem] = useState<any>({
        latitude: -21.977346,
        longitude: -46.798710
    })

    const [destino, setDestino] = useState<any>({
        latitude: -21.964768,
        longitude: -46.791870
    })
    const [loading, setLoading] = useState(false)
    const { getSpots } = useContext(AuthContext)
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
            console.log("Tem")
            let spots: any = []
            aux.forEach((element: any) => {
                spots.push({ latitude: Number(element.lat), longitude: Number(element.lng) })
            });

            var unifaeComp = Math.pow(unifae.latitude + unifae.longitude, 2)
            var unifeobComp = Math.pow(unifeob.latitude + unifeob.longitude, 2)


            setOrigem(spots[0])
            if (store.user.university.name.toUpperCase() === "UNIFAE") {
                selection_sort(spots, unifaeComp)
                setPontos(spots)
                setOrigem(spots[0])
            } else {
                selection_sort(spots, unifeobComp)
                setPontos(spots)
                setOrigem(spots[0])
            }
        }

        if (store.user.university.name.toUpperCase() === "UNIFAE") {
            setDestino(unifae)
        } else {
            setDestino(unifeob)
        }

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

    if (!loading) {
        setLoading(true)
        recuperaPontos()
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                onMapReady={() => {
                    PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
                        .then(() => {
                            console.log('aceitou')
                        })
                }} // função chamada ao renderizar o mapa
                initialRegion={regiao.length > 0 ? regiao : 
                    {"latitude": -21.96981, 
                    "latitudeDelta": 0.0922, 
                    "longitude": -46.79850499999999, 
                    "longitudeDelta": 0.0421}} // região inicial
                //minZoomLevel={14} // minimo de zoom no mapa
                showsUserLocation // mostrar localização do user
                showsMyLocationButton // precisa do Shows userLocation
                userLocationPriority='high' // precisão da localização
                showsCompass // mostra bússola canto superiror esquerdo
                //showsTraffic // mostrar tráfego na região
                customMapStyle={mapaNoite}// estilo do mapa
                loadingEnabled
                zoomEnabled
            >
                {
                pontos.length > 0 &&
                pontos.map((item: any, index: number) => (
                    <Marker key={index} coordinate={item} />
                ))
            }

                <Marker
                    coordinate={origem.length  ? origem : {
                        latitude: -21.964652345070213,
                        longitude: -46.791549417993124}}
                    draggable
                    onDragStart={() => ReactNativeHapticFeedback.trigger("impactMedium", options)}
                    onDragEnd={(event) => setOrigem(event.nativeEvent.coordinate)}
                    image={require('../../../assets/img/onibusImage.png')}
                />
                <Marker
                    coordinate={destino.length > 0 ? destino : {
                        latitude: -21.96981,
                        longitude: -46.79850499999999} }
                    draggable
                    onDragStart={() => ReactNativeHapticFeedback.trigger("impactMedium", options)}
                    onDragEnd={(event) => setDestino(event.nativeEvent.coordinate)}
                    pinColor={'pink'}
                />
                {pontos.length >= 0 ?

                    <MapViewDirections
                        apikey={'AIzaSyCff_T9kaWmUkjKtS37Me0ypoIL--Nxksg'}
                        origin={origem}
                        waypoints={pontos}
                        destination={destino}
                        strokeColor="#3399CC" // cor da linha
                        strokeWidth={3} // grossura da linha
                    />
                    :

                    <MapViewDirections
                        apikey={'AIzaSyCff_T9kaWmUkjKtS37Me0ypoIL--Nxksg'}
                        origin={origem}
                        destination={destino}
                        strokeColor="#3399CC" // cor da linha
                        strokeWidth={3} // grossura da linha
                    />
                }
            </MapView>
        </View >
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: cores.branco,
        alignItems: 'center',
        justifyContent: 'center'
    },
    map: {
        width: '100%',
        height: '100%',
    },
});