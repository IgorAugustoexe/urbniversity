import React, { useEffect, useState, Fragment, useContext } from 'react'
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator, FlatList } from 'react-native'
import { config, cores, estilos } from '../../styles/Estilos'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { AuthContext } from '../../apis/AuthContext'
import BtnBlue from '../../components/BtnBlue'
import NavBar from '../../components/NavBar'

export default function TelaPesquisaMotorista() {
    const store: any = useSelector<any>(({ user }) => {
        return {
            user: user
        }
    })

    const navigation = useNavigation<any>()

    const [loaderReq, setLoaderReq] = useState<boolean>(false)
    const [loaderRefersh, setLoaderRefresh] = useState<boolean>(false)
    const [motoristasDisp, setMotoristasDisp] = useState<any[]>([])
    const [erroReq, setErroReq] = useState<boolean>(false)
    const { getData } = useContext(AuthContext)

    useEffect(() => {
        montarTela()
    }, [])

    const montarTela = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setLoaderRefresh(true)
            } else {
                !loaderReq && setLoaderReq(true)
                erroReq && setErroReq(false)
            }
            const resp = await getData(`${store.user.type}/routes`)
            if (resp) {
                setMotoristasDisp(resp)
                return
            }
            setErroReq(true)
        } catch (e) {
            console.log(e)
            setErroReq(true)
        } finally {
            setLoaderReq(false)
            isRefresh && setLoaderRefresh(false)
        }

    }

    const ListaMotoristas = () => (
        <FlatList
            style={{ paddingTop: 10 }}
            data={motoristasDisp}
            ListEmptyComponent={erroReq ? ErroLoader : RenderListaVazia}
            ListFooterComponent={<View style={{ marginBottom: config.windowWidth / 15 }} />}
            showsVerticalScrollIndicator={true}
            refreshing={loaderRefersh}
            onRefresh={() => !loaderRefersh && montarTela(true)}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
                return (
                    <TouchableOpacity style={{ paddingLeft: '2%', backgroundColor: cores.azulPrimario, marginHorizontal: config.windowWidth / 20, marginVertical: 7, flexDirection: 'row', borderRadius: 5 }}
                        onPress={() => navigation.navigate('veiculo', { driver: item })}>
                        <View>
                            <Image
                                style={styles.imgMotorista}
                                source={{ uri: item.user.photo || 'https://icon-library.com/images/default-profile-icon/default-profile-icon-6.jpg' }}
                            />
                        </View>
                        <View style={{ marginHorizontal: 15 }}>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 18, color: cores.fonteBranco, paddingVertical: 3, fontWeight: 'bold', }}>{item.user.fullName}</Text>
                            <Text style={{ fontSize: 15, color: cores.fonteBranco, paddingVertical: 3 }}>Assentos Disp: {item?.vehicle?.seats}</Text>
                            <Text style={{ fontSize: 15, color: cores.fonteBranco, paddingVertical: 3 }}>Destino: {item.route.university.name} - {item.route.city.name}</Text>
                        </View>
                    </TouchableOpacity>
                )
            }}
        />
    )

    const RenderListaVazia = () => (
        <View style={styles.containerListaVazia}>
            <Text style={styles.txtListaVazia}>Não tem motoristas disponíveis na sua região.</Text>
        </View>
    )

    // COMPONENTES

    const ErroLoader = () => (
        <Fragment>
            {loaderReq ?
                <View style={{ marginTop: config.windowWidth / 3 }}>
                    <ActivityIndicator color={cores.branco} size={'large'} />
                </View>
                :
                <View style={styles.containerErro} >
                    <Text style={styles.txtErroBold}>Erro ao realizar esta operação</Text>
                    <Text style={styles.txtErro}>Por favor verifique sua conexão com a internet e tente novamente.</Text>
                    <TouchableOpacity onPress={() => montarTela()}>
                        <BtnBlue style={{ marginHorizontal: config.windowWidth / 10, marginTop: config.windowWidth / 20 }} text='TENTAR NOVAMENTE' />
                    </TouchableOpacity>
                </View>
            }
        </Fragment >
    )

    return (
        <SafeAreaView style={estilos.containerPrincipal}>
            <NavBar titulo='Motoristas Disponíveis' botaoEsquerdo={true} backgroundColor={cores.backgroundPadrao} />
            {(erroReq || loaderReq) ?
                <ErroLoader />
                :
                ListaMotoristas()
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    imgMotorista: {
        width: 80,
        height: 80,
        borderRadius: 50,
    },
    containerListaVazia: {
        backgroundColor: cores.azulPrimario,
        margin: config.windowWidth / 20,
        alignItems: 'center',
        padding: 5,
        borderRadius: 5
    },
    txtListaVazia: {
        color: cores.branco,
        fontSize: 15,
        textAlign: 'center'
    },
    // ErroLoader
    containerErro: {
        alignItems: 'center',
        marginTop: config.windowWidth / 2,
        backgroundColor: cores.azulPrimario,
        marginHorizontal: config.windowWidth / 20,
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