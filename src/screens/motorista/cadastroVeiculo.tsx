import React, { useState, Fragment } from 'react'
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'
import { useDispatch } from 'react-redux'
import { config, cores, estilos } from '../../styles/Estilos'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons/faGear'
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons/faMapLocationDot'
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons/faCalendarDays'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons/faAnglesRight'
import { faCoins } from '@fortawesome/free-solid-svg-icons/faCoins'
import { faVanShuttle } from '@fortawesome/free-solid-svg-icons/faVanShuttle'
import InputDadosUser from '../../components/InputDadosUser'

export default function TelaCadastroVeiculo() {

    const [placa, setPlaca] = useState<string>('')
    const [modelo, setModelo] = useState<string>('')
    const [marca, setMarca] = useState<string>('')
    const [ano, setAno] = useState<string>('')
    const [acentos, setAcentos] = useState<string>('')
    const [corPredominante, setCorPredominante] = useState<string>('')

    const [txtPlacaInvalida, setTxtPlacaInvalida] = useState<string>('')
    const [txtModeloInvalido, setTxtModeloInvalido] = useState<string>('')
    const [txtMarcaInvalida, setTxtMarcaInvalida] = useState<string>('')
    const [txtAnoInvalido, setTxtAnoInvalido] = useState<string>('')
    const [txtAcentosInvalidos, setTxtAcentosInvalidos] = useState<string>('')
    const [txtCorPredominante, setTxtCorPredominante] = useState<string>('')

    const ImagemVeiculo = () => (
        <TouchableOpacity>
            <Image
                style={styles.imgVeiculo}
                source={{ uri: 'https://img2.gratispng.com/20180510/dkw/kisspng-van-car-computer-icons-professional-services-5af3da1ab964b2.8835695915259305227594.jpg' }}
            />
        </TouchableOpacity>
    )

    const DadosVeiculo = () => (
        <View style={{ padding: config.windowWidth / 30 }}>
            <View style={styles.espacoInputs}>
                <InputDadosUser
                    onChangeText={(text) => setMarca(text)}
                    value={marca}
                    textoInput={'Marca'}
                    placeholder={'Digite a Marca'}
                    onFocus={() => txtMarcaInvalida.length > 0 && setTxtMarcaInvalida('')}
                    txtErro={txtMarcaInvalida}
                />
                <InputDadosUser
                    onChangeText={(text) => setModelo(text)}
                    value={modelo}
                    textoInput={'Modelo'}
                    placeholder={'Digite o Modelo'}
                    onFocus={() => txtModeloInvalido.length > 0 && setTxtModeloInvalido('')}
                    txtErro={txtModeloInvalido}
                />
            </View>
            <View style={{ flexDirection: 'row' }}>
                <InputDadosUser
                    style={{ width: '40%' }}
                    onChangeText={(text) => setPlaca(text)}
                    value={placa}
                    textoInput={'Placa'}
                    placeholder={'Digite a Placa'}
                    onFocus={() => txtPlacaInvalida.length > 0 && setTxtPlacaInvalida('')}
                    txtErro={txtPlacaInvalida}
                    autoCapitalize={'characters'}
                    maxLenght={7}
                />
                <InputDadosUser
                    style={{ width: '40%' }}
                    onChangeText={(text) => setAno(text)}
                    value={ano}
                    textoInput={'Ano'}
                    placeholder={'Digite o Ano'}
                    keyboardType={'number-pad'}
                    onFocus={() => txtModeloInvalido.length > 0 && setTxtModeloInvalido('')}
                    txtErro={txtModeloInvalido}
                    maxLenght={4}
                />
            </View>
        </View>
    )

    return (
        <SafeAreaView style={estilos.containerPrincipal}>
            <ImagemVeiculo />
            {DadosVeiculo()}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    imgVeiculo: {
        height: config.windowWidth / 1.5,
        width: config.windowWidth,
        resizeMode: 'cover',
    },

    espacoInputs: {
        paddingTop: 10
    },

})