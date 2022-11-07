import React, { useState, Fragment, useEffect, useContext } from 'react'
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator, FlatList } from 'react-native'
import { config, cores, estilos } from '../../styles/Estilos'
import { useSelector } from 'react-redux'
import { AuthContext, navigationRef } from '../../apis/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faXmark, faCheck } from '@fortawesome/free-solid-svg-icons'
import BtnBlue from '../../components/BtnBlue'
import NavBar from '../../components/NavBar'
import avatarPadrao from '../../../assets/img/avatarPadrao.jpg'

export default function TelaSolicitacoes() {
    const store: any = useSelector<any>(({ user }) => {
        return {
            user: user
        }
    })

    const { acceptRequest, removeRequest, mediador, getData } = useContext(AuthContext)

    const [loaderReq, setLoaderReq] = useState<boolean>(false)
    const [loaderRefresh, setLoaderRefresh] = useState<boolean>(false)
    const [erroReq, setErroReq] = useState<boolean>(false)
    const [listaSolitacoes, setListaSolicitacoes] = useState<any[]>([])

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
            const resp = await getData(`request/${store.user.type}`)
            if (resp) {
                setListaSolicitacoes(resp)
            }
        } catch (e) {
            console.log(e)
            setErroReq(true)
        } finally {
            setLoaderReq(false)
            isRefresh && setLoaderRefresh(false)
        }
    }

    const controleSolicitacao = async (tipo: number, id: string) => {
        await mediador(tipo == 0 ? 'Deseja mesmo aceitar este estudante?' : 'Deseja mesmo recusar este estudante?', tipo == 0 ? acceptRequest : removeRequest, id)
        montarTela()
    }

    // COMPONENTES 

    const ListaSolicitacoes = () => (
        <FlatList
            style={{ paddingTop: 10 }}
            data={listaSolitacoes}
            ListEmptyComponent={erroReq ? ErroLoader : RenderListaVazia}
            ListFooterComponent={<View style={{ marginBottom: config.windowWidth / 15 }} />}
            showsVerticalScrollIndicator
            refreshing={loaderRefresh}
            onRefresh={() => !loaderReq && montarTela(true)}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
                return (
                    <View style={styles.lista}>
                        <Image
                            style={styles.imgEstudante}
                            source={item.student.user.photo ? { uri: item.student.user.photo } : avatarPadrao}
                        />
                        <View style={styles.containerLista}>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 18, color: cores.fonteBranco, paddingVertical: 3, fontWeight: 'bold', }}>
                                {item.student.user.fullName}
                            </Text>
                            <View style={{ flexDirection: 'row', width: config.windowWidth / 5, justifyContent: 'space-between' }}>
                                <TouchableOpacity onPress={() => controleSolicitacao(0, item.id)}>
                                    <FontAwesomeIcon style={{ alignSelf: 'flex-end' }} icon={faCheck} size={config.windowWidth / 12} color={cores.branco} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => controleSolicitacao(1, item.id)}>
                                    <FontAwesomeIcon style={{ alignSelf: 'flex-end' }} icon={faXmark} size={config.windowWidth / 12} color={cores.branco} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )
            }}
        />
    )

    const RenderListaVazia = () => (
        <View style={styles.containerListaVazia}>
            <Text style={styles.txtListaVazia}>Não há novas solicitações para a sua rota.</Text>
        </View>
    )

    const ErroLoader = () => (
        <Fragment>
            {loaderReq ?
                <View style={{ paddingTop: config.windowWidth / 5 }}>
                    <ActivityIndicator color={cores.branco} size={'large'} />
                </View>
                :
                <View style={styles.containerErro} >
                    <Text style={styles.txtErroBold}>Erro ao realizar está operação</Text>
                    <Text style={styles.txtErro}>Por favor verifique sua conexão com a internet e tente novamente.</Text>
                    <TouchableOpacity onPress={() => montarTela()}>
                        <BtnBlue style={{ marginHorizontal: config.windowWidth / 5, marginTop: config.windowWidth / 20 }} text='TENTAR NOVAMENTE' />
                    </TouchableOpacity>
                </View>
            }
        </Fragment >
    )

    return (
        <SafeAreaView style={estilos.containerPrincipal}>
            <NavBar titulo='Solicitações' botaoEsquerdo={false} />
            {(erroReq || loaderReq) ?
                <ErroLoader />
                :
                ListaSolicitacoes()
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    imgEstudante: {
        width: 60,
        height: 60,
        marginVertical: 10,
        marginLeft: 5,
        borderRadius: 50,
        backgroundColor: cores.disabled
    },
    lista: {
        backgroundColor: cores.azulPrimario,
        flexDirection: 'row',
        marginHorizontal: config.windowWidth / 20,
        paddingVertical: 5,
        borderRadius: 10,
        paddingHorizontal: 10
    },
    containerLista: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: config.windowWidth / 1.5,
        left: 13
    },
    // ListaVazia
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
        marginHorizontal: 10,
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