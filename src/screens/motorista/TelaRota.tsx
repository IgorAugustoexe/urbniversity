import React, { useState, Fragment, useEffect, useContext, useLayoutEffect } from 'react'
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator, FlatList, Linking } from 'react-native'
import { config, cores, estilos } from '../../styles/Estilos'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from '../../apis/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faXmark, faVanShuttle, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import BtnBlue from '../../components/BtnBlue'
import avatarPadrao from '../../../assets/img/avatarPadrao.jpg'

export default function TelaRota() {
  const store: any = useSelector<any>(({ user }) => {
    return {
      user: user,
    }
  })

  const navigation = useNavigation<any>()

  const { logout, getData, mediador, removeFromRoute } = useContext(AuthContext)

  const [userName, setUserName] = useState<string>('')
  const [isDriver, setIsDriver] = useState(false)
  const [requests, setRequests] = useState<any[]>([])
  const [loaderReq, setLoaderReq] = useState<boolean>(false)
  const [loaderRefresh, setLoaderRefresh] = useState<boolean>(false)
  const [listaEstudantes, setListaEstudantes] = useState<any[]>([])
  const [erroReq, setErroReq] = useState<boolean>(false)

  useEffect(() => {
    montarTela()
  }, [])

  useLayoutEffect(() => {
    setUserName(store.user.user.fullName);
    let driver = store.user.type == 'driver' ? true : false
    setIsDriver(driver)
  }, [])

  const montarTela = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setLoaderRefresh(true)
      } else {
        !loaderReq && setLoaderReq(true)
        erroReq && setErroReq(false)
      }
      const resp = await getData(`${store.user.type}/students`)
      if (resp) {
        setListaEstudantes(resp)
      }
    } catch (e) {
      console.log(e)
      setErroReq(true)
    } finally {
      setLoaderReq(false)
      isRefresh && setLoaderRefresh(false)
    }
  }

  const removeEstudante = async (id: string) => {
    await mediador('Deseja mesmo remover este estudante?', removeFromRoute, id)
  }

  const callWhatsapp = (number: string) => {
    let url = 'whatsapp://send?text=' + '' + '&phone=55' + number
    Linking.openURL(url)
      .then(data => {
        console.log('WhatsApp Opened successfully ' + data)
      })
      .catch(e => {
        console.log(e)
      })
  }

  // COMPONENTES

  const Header = () => (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.txtBold}>Bem Vindo {userName ? userName : isDriver ? 'Motorista' : 'Estudante'}!
        </Text>
        <TouchableOpacity onPress={logout}>
          <FontAwesomeIcon
            icon={faRightFromBracket}
            size={config.windowWidth / 15}
            color={cores.branco}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.containerHeader}>
        <Image style={styles.imgUser} source={store.user.user ? { uri: store.user.user.photo } : avatarPadrao} />
        <View style={styles.headerBtn}>
          <TouchableOpacity style={styles.containerBtn} onPress={() => navigation.navigate('veiculo', { driver: null })}>
            <Text style={styles.txtBtn}>MEU VEÍCULO</Text>
            <FontAwesomeIcon
              icon={faVanShuttle}
              size={config.windowWidth / 12}
              color={cores.branco}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.containerBtn} onPress={() => navigation.navigate('solicitacoes')}>
            <Text style={styles.txtBtn}>SOLICITAÇÕES</Text>
            <View style={styles.reqContainer}>
              <Text style={styles.reqCounter}>
                {requests ? requests.length : '0'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  const ListaEstudantes = () => (
    <FlatList
      style={{ paddingTop: 10 }}
      data={listaEstudantes}
      ListEmptyComponent={erroReq ? ErroLoader : RenderListaVazia}
      ListFooterComponent={<View style={{ marginBottom: config.windowWidth / 15 }} />}
      showsVerticalScrollIndicator
      refreshing={loaderRefresh}
      onRefresh={() => !loaderRefresh && montarTela(true)}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => {
        return (
          <TouchableOpacity
            style={{ backgroundColor: cores.azulPrimario, marginVertical: 5, flexDirection: 'row', paddingHorizontal: 8 }}>
            <Image
              style={styles.imgMotorista}
              source={item.user.photo ? { uri: item.user.photo } : avatarPadrao}
            />
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', marginHorizontal: 15 }}>
              <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 18, color: cores.fonteBranco, paddingVertical: 3, fontWeight: 'bold' }}>
                {item.user.fullName}
              </Text>
              <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end' }} onPress={() => removeEstudante(item.id)}>
                <FontAwesomeIcon
                  style={{ alignSelf: 'flex-end' }}
                  icon={faXmark}
                  size={config.windowWidth / 11}
                  color={cores.branco}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )
      }}
    />
  )

  const RenderListaVazia = () => (
    <View style={styles.containerListaVazia}>
      <Text style={styles.txtListaVazia}>Não há estudantes cadastrados na sua rota.</Text>
    </View>
  )

  const ErroLoader = () => (
    <Fragment>
      {loaderReq ?
        <View style={{ paddingTop: config.windowWidth / 5 }}>
          <ActivityIndicator color={cores.branco} size={'large'} />
        </View>
        :
        <View style={styles.containerErro}>
          <Text style={styles.txtErroBold}>Erro ao realizar está operação</Text>
          <Text style={styles.txtErro}> Por favor verifique sua conexão com a internet e tente novamente.</Text>
          <TouchableOpacity onPress={() => montarTela()}>
            <BtnBlue style={{ marginHorizontal: config.windowWidth / 5, marginTop: config.windowWidth / 20 }} text="TENTAR NOVAMENTE" />
          </TouchableOpacity>
        </View>
      }
    </Fragment>
  )

  return (
    <SafeAreaView style={estilos.containerPrincipal}>
      <Header />
      {(erroReq || loaderReq) ?
        <ErroLoader />
        :
        ListaEstudantes()
      }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  // Header
  header: {
    padding: config.windowWidth / 20,
    backgroundColor: cores.azulPrimario,
    borderBottomWidth: 1,
    borderColor: cores.pretoBorder
  },
  containerHeader: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: config.windowWidth / 20
  },
  headerBtn: {
    maxWidth: '85%',
    marginLeft: '1%',
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
  txtBtn: {
    fontSize: config.windowWidth / 30,
    color: cores.fonteBranco,
    bottom: 5
  },
  txtBold: {
    fontSize: 18,
    fontWeight: '700',
    color: cores.fonteBranco,
    width: 300
  },
  imgUser: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: cores.branco,
    borderRadius: 50
  },
  rodape: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: config.windowWidth / 20,
    backgroundColor: cores.azulBtn,
    padding: 15,
    borderRadius: 20
  },
  imgMotorista: {
    width: 60,
    height: 60,
    marginVertical: 10,
    marginLeft: 5,
    borderRadius: 50
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
  },
  reqContainer: {
    width: config.windowWidth / 12,
    height: config.windowWidth / 12,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center'
  },
  reqCounter: {
    fontSize: config.windowWidth / 19.5,
    color: 'white',
    fontWeight: 'bold'
  }
})  
