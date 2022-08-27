import React, { useState, useEffect, useContext } from 'react'
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Image, PermissionsAndroid } from 'react-native'
import { config, cores, estilos } from '../styles/Estilos'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import Geolocation from '@react-native-community/geolocation'

export default function TelaMapa() {

    const [regiao, setRegiao] = useState<any>(null)

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

    return (
        <View style={{ flex: 1 }}>
            <MapView
                style={{ flex: 1, width: '100%', height: '100%' }}
                onMapReady={() => {
                    PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
                        .then(() => {
                            console.log('aceitou')
                        })
                }} // função chamada ao renderizar o mapa
                initialRegion={regiao} // região inicial
                minZoomLevel={13} // minimo de zoom no mapa
                showsUserLocation // mostrar localização do user
                showsMyLocationButton // precisa do Shows userLocation
                userLocationPriority='high' // precisão da localização
                showsCompass // mostra bússola canto superiror esquerdo
                showsTraffic // mostrar tráfego na região
                loadingEnabled
            >
            </MapView>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: '100%',
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});