import React, { useState, Fragment, useEffect, useContext, useLayoutEffect } from 'react'
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { config, cores, estilos } from '../../styles/Estilos'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons/faGear'
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons/faCalendarDays'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons/faAnglesRight'
import { faVanShuttle } from '@fortawesome/free-solid-svg-icons/faVanShuttle'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import BtnBlue from '../../components/BtnBlue'
import { faEnvelopeOpen } from '@fortawesome/free-regular-svg-icons'
import { store } from '../../redux/store'
import { AuthContext } from '../../apis/AuthContext'
import {Student, Requests} from '../../types/types'

const arrayMotoristas = [
    {
        'imgMotorista': 'https://icon-library.com/images/default-profile-icon/default-profile-icon-6.jpg',
        'nomeEstudante': 'Jorge Pereira',
        'telefone':'19999810297'
    },
    {
        'imgMotorista': 'https://icon-library.com/images/default-profile-icon/default-profile-icon-6.jpg',
        'nomeEstudante': 'Aristeu Corridas',
        'telefone':'19999810297'
    },
    {
        'imgMotorista': 'https://icon-library.com/images/default-profile-icon/default-profile-icon-6.jpg',
        'nomeEstudante': 'Everton Busão e Frete',
        'telefone':'19999810297'
    },
    {
        'imgMotorista': 'https://icon-library.com/images/default-profile-icon/default-profile-icon-6.jpg',
        'nomeEstudante': 'Thomas Turbano',
        'telefone':'19999810297'
    },
    {
        'imgMotorista': 'https://icon-library.com/images/default-profile-icon/default-profile-icon-6.jpg',
        'nomeEstudante': 'Kleberson do Uber',
        'telefone':'19999810297'
    },
    {
        'imgMotorista': 'https://icon-library.com/images/default-profile-icon/default-profile-icon-6.jpg',
        'nomeEstudante': 'Rita Manicure e Frete',
        'telefone':'19999810297'
    }
]

function TelaMostraEstudante() {
        

    const navigation = useNavigation<any>()

    const [loaderReq, setLoaderReq] = useState<boolean>(false)
    const [refresh,setRefresh] = useState<boolean>(false);
    const [erroReq, setErroReq] = useState<boolean>(false)
    const {getStudentsByDriver} = useContext(AuthContext)
    const [requests, setRequests] = useState<Requests[]>();
    const {getRequestsByDriver, acceptRequest, removeRequest, mediador} = useContext(AuthContext)
    const [load, setLoad] = useState(true)
    useEffect(() => {
        didMount()
        navigation.addListener('focus', () => setLoad(!load))
    }, [load, navigation])

    const didMount = async () => { 
        if(load){
            const dtRequests = await getRequestsByDriver();
            setRequests(dtRequests);
            //console.log(JSON.stringify(dtRequests, null, "\t"));
        }
             
    }

    const refreshScreen = async() =>{
        setRequests(undefined);  
        const dtRequests = await getRequestsByDriver();  
        const aux = await dtRequests;
        setRequests(aux);
    }
    useEffect(() =>{
        refreshScreen()
    },[refresh])
    const ListaMotoristas = () => (
        <FlatList
            style={{ paddingTop: 10 }}
            data={requests}
            ListEmptyComponent={erroReq ? ErroLoader : RenderListaVazia}
            ListFooterComponent={<View style={{ marginBottom: config.windowWidth / 15 }} />}
            showsVerticalScrollIndicator={true}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
                return (
                    <TouchableOpacity style={{ backgroundColor: cores.azulPrimario, marginHorizontal: 0, marginVertical: 1, flexDirection: 'row', borderRadius: 0 }}>
                        <View>
                            <Image
                                style={styles.imgMotorista}
                                source={{ uri:'https://icon-library.com/images/default-profile-icon/default-profile-icon-6.jpg' }}
                            />
                        </View>
                        <View style={{flex:1, alignItems:'center',justifyContent:'flex-start',flexDirection:'row', marginHorizontal: 15 }}>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize: 18, color: cores.fonteBranco, paddingVertical: 3, fontWeight: 'bold', }}>
                                {item.student.user.fullName}    
                            </Text>        
                            <View style={{flex:1, flexDirection:'row' ,justifyContent:'flex-end'}}>
                                <TouchableOpacity onPress = {async () => {
                                   const response = await mediador('Deseja mesmo aceitar este estudante?', acceptRequest, item.id, setRefresh); 
                                    }} >
                                    <FontAwesomeIcon style={{alignSelf:'flex-end'}} icon={faCheck} size={config.windowWidth / 12} color={cores.branco} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress = {async () => {
                                    const response = await mediador('Deseja mesmo recusar este estudante?', removeRequest, item.id, setRefresh); 
                                }} >
                                    <FontAwesomeIcon style={{alignSelf:'flex-end'}} icon={faXmark} size={config.windowWidth / 12} color={cores.branco} />
                                </TouchableOpacity>
                            </View>                 
                        </View>
                    </TouchableOpacity>
                )
            }}
        />
    )

    const RenderListaVazia = () => (
        <View style={{ backgroundColor: cores.azulPrimario, margin: config.windowWidth / 20, alignItems: 'center', padding: 5, borderRadius: 5 }}>
            <Text style={{ color: cores.branco, fontSize: 16, textAlign: 'center' }}>Não há estudantes cadastrados na sua rota :(</Text>
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
                    <TouchableOpacity onPress={() => didMount()}>
                        <BtnBlue style={{ marginHorizontal: config.windowWidth / 5, marginTop: config.windowWidth / 20 }} text='TENTAR NOVAMENTE' />
                    </TouchableOpacity>
                </View>
            }
        </Fragment >
    )

    // componentes

    return (
        <SafeAreaView style={estilos.containerPrincipal}>
            {(erroReq || loaderReq) ?
                <ErroLoader />
                :
                <ListaMotoristas />
            }
        </SafeAreaView>
    )
}

export default function TelaRota() {
    const store: any = useSelector<any>(({ user }) => {
        return {
            user: user
        }
    })

    const {logout } = useContext(AuthContext)
    const [userName, setUserName] = useState<string>('')
    const [isDriver, setIsDriver] = useState(false)
    const navigation = useNavigation<any>()
    const route = useRoute<RouteProp<navigation, 'props'>>()
    const dispatch = useDispatch()

    useLayoutEffect(() => {
        setUserName(store.user.user.fullName)
        let driver = store.user.type == 'driver' ? true : false 
        setIsDriver(driver)
        //console.log(store.user.driver)
    }, [])

    return (
        <SafeAreaView style={estilos.containerPrincipal}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.txtBold}>Bem Vindo {userName ? userName : isDriver ? 'Motorista' : 'Estudante'}!</Text>
                    <TouchableOpacity onPress={logout}>
                        <FontAwesomeIcon icon={faGear} size={config.windowWidth / 16} color={cores.branco} />
                    </TouchableOpacity>
                </View>

                <View style={styles.containerHeader}>
                    <Image
                        style={styles.imgUser}
                        source={{ uri: 'https://jaraguatenisclube.com.br/images/avatar.png' }}
                    />
                    <View style={styles.headerBtn}>
                        <TouchableOpacity style={styles.containerBtn} onPress={() => navigation.navigate('veiculo',{driver:null})}>
                            <Text style={styles.txtBtn}>MINHA VAN</Text>
                            <FontAwesomeIcon icon={faVanShuttle} size={config.windowWidth / 12} color={cores.branco} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.containerBtn} onPress={() => console.log('navigation.navigate(financeiro)')}>
                            <Text style={styles.txtBtn}>CALENDARIO</Text>
                            <FontAwesomeIcon icon={faCalendarDays} size={config.windowWidth / 12} color={cores.branco} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <TelaMostraEstudante />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    header: {
        padding: config.windowWidth / 20,
        backgroundColor: cores.azulPrimario,
        borderBottomWidth: 1,
        borderColor: cores.pretoBorder,
    },

    containerHeader: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: config.windowWidth / 20
    },

    headerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: cores.azulDisabled,
        borderRadius: 15
    },

    containerBtn: {
        alignItems: 'center',
        padding: 10
    },

    containerRota: {
        marginTop: 10,
        padding: 13,
        flexDirection: 'row'
    },
    containerInfoRota:{
        width:'85%'
    },
    btnRota: {
        backgroundColor: cores.azulBtn,
        marginTop: config.windowWidth / 15,
        marginHorizontal: 5,
        borderRadius: 15
    },

    txtCodigoRota: {
        fontSize: 16,
        color: cores.fonteBranco,
        backgroundColor: cores.azulPrimario,
        position: 'absolute',
        top: -16,
        left: 10,
        padding: 7,
        borderRadius: 5,
        textTransform:'uppercase',
        maxWidth:'50%',
    },

    txtNomeRota: {
        fontSize: 18,
        color: cores.branco,
        width: '90%'
    },

    txtBtn: {
        fontSize: 14,
        color: cores.fonteBranco,
        bottom: 5
    },

    txtBold: {
        fontSize: 18,
        fontWeight: '700',
        color: cores.fonteBranco,
        width:300  
    },

    imgUser: {
        width: 80,
        height: 80,
        resizeMode: 'cover',
        borderWidth: 2,
        borderColor: cores.branco,
        borderRadius: 3
    },

    rodape: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: config.windowWidth / 20,
        backgroundColor: cores.azulBtn,
        padding: 15,
        borderRadius: 20,
    },

    txtBtnRodape: {
        fontSize: 16,
        fontWeight: '700',
        color: cores.fonteBranco,
        textAlign: 'center'
    },imgMotorista: {
        width: 60,
        height: 60,
        marginVertical:10,
        marginLeft:5,
        borderRadius: 50
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
    },reqContainer:{
        width:config.windowWidth / 12,
        height:config.windowWidth / 12,
        borderWidth:2,
        borderColor:'white',
        borderRadius:80,
        alignItems: 'center',
        justifyContent: 'center'
    },
    reqCounter:{
        fontSize:20,
        color:'white',
        fontWeight:'bold'
    }
})