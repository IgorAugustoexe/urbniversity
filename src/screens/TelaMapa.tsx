import React, { useState, useEffect, useContext } from 'react'
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'
import { config, cores, estilos } from '../styles/Estilos'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import MapView, { enableLatestRenderer } from 'react-native-maps'

export default function TelaMapa() {
    enableLatestRenderer()

    return (
        <View style={{ flex: 1 }}>
            <MapView
                style={{ width: '100%', height: '100%' }}
                // obrigatórios  
                mapType='standard'
                maxZoomLevel={20}
                loadingEnabled={false}
                loadingIndicatorColor={cores.azulBtn}
                zoomControlEnabled={true}
                showsCompass={false}
                showsPointsOfInterest={false}
                //customMapStyle={mapaPadrao}
                // localização do usuário
                showsUserLocation={true} //permitir a lozalização do usuário
                userLocationPriority='high'
                showsMyLocationButton={true}
                //opcionais
                //showsTraffic={trafego} // habilitar tráfego
                //liteMode={false} // modo mais leve
                //scrollEnabled={fixarRegiao} // fixar mapa
                // regiao que o maps irá focar
                initialRegion={{
                    latitude: -14.2400732,
                    longitude: -53.1805017,
                    latitudeDelta: 35.0,
                    longitudeDelta: 35.0,
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({

})