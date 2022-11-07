import React, { useState, useContext, useLayoutEffect, Fragment, useCallback } from 'react'
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import { useSelector } from 'react-redux'
import { config, cores, estilos } from '../styles/Estilos'
import BtnBlue from '../components/BtnBlue'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faRightFromBracket, faAnglesRight, faVanShuttle } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from '../apis/AuthContext'
import avatarPadrao from '../../assets/img/avatarPadrao.jpg'
import { useAfterMountEffect } from '../helpers/FuncoesPadrao'

export default function TelaHome() {
  const store: any = useSelector<any>(({ user }) => {
    return {
      user: user,
    }
  })

  const navigation = useNavigation<any>()

  const { logout, refreshUser, mediador, quitFromRoute } = useContext(AuthContext)
  const [userName, setUserName] = useState<string>('')
  const [isDriver, setIsDriver] = useState(false)
  const [loaderReq, setLoaderReq] = useState(false)

  useFocusEffect(
    useCallback(() => {
      requisitarRota()
    }, [])
  )

  useAfterMountEffect(() => {
    requisitarRota()
  }, [store.user.driverId])

  useLayoutEffect(() => {
    setUserName(store.user.user.fullName)
    let driver = store.user.type == 'driver' ? true : false
    setIsDriver(driver)
  }, [])

  const requisitarRota = async () => {
    try {
      !loaderReq && setLoaderReq(true)
      await refreshUser()
    } catch (e) {
      console.log(e)
    } finally {
      setLoaderReq(false)
    }
  }

  const sairRota = async () => {
    await mediador('Deseja mesmo sair desta rota?', quitFromRoute, null)
  }

  return (
    <SafeAreaView style={estilos.containerPrincipal}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.txtBold}>Bem Vindo {userName ? userName : isDriver ? 'Motorista' : 'Estudante'}!</Text>
          <TouchableOpacity onPress={logout}>
            <FontAwesomeIcon
              icon={faRightFromBracket}
              size={config.windowWidth / 16}
              color={cores.branco}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.containerHeader}>
          <Image style={styles.imgUser} source={store.user.user ? { uri: store.user.user.photo } : avatarPadrao} />
          <View style={styles.headerBtn}>
            <TouchableOpacity
              disabled={!isDriver && !store.user.driverId}
              style={styles.containerBtn}
              onPress={() => { navigation.navigate('veiculo', { driver: null }) }}>
              <Text style={[styles.txtBtn, (!isDriver && !store.user.driverId) && { color: cores.disabled }]}>MINHA VAN</Text>
              <FontAwesomeIcon
                icon={faVanShuttle}
                size={config.windowWidth / 12}
                color={(!isDriver && !store.user.driverId) ? cores.disabled : cores.branco}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {(isDriver && store.user.route) ? (
        <TouchableOpacity
          style={styles.btnRota}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('telaRota')}
        >
          <Text style={styles.txtCodigoRota}>Rota: {store.user.route.university.name}</Text>
          <View style={styles.containerRota}>
            <View style={styles.containerInfoRota}>
              <Text style={styles.txtNomeRota}>Motorista: {store.user.user.fullName}</Text>
              <Text style={styles.txtNomeRota}>Cidade: {store.user.route.city.name} - {store.user.route.city.state}</Text>
            </View>
            <View style={{ width: '10%', justifyContent: 'center' }}>
              <FontAwesomeIcon
                icon={faAnglesRight}
                size={config.windowWidth / 13}
                color={cores.branco}
              />
            </View>
          </View>
        </TouchableOpacity>
      )
        :
        (!isDriver && store.user.driverId) ?
          <TouchableOpacity
            style={styles.btnRota}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('mapa')}
          >
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.txtCodigoRota}>Rota: {store.user?.driver?.route?.university?.name}</Text>
            <View style={styles.containerRota}>
              <View style={styles.containerInfoRota}>
                <Text style={styles.txtNomeRota}>Motorista: {store?.user?.driver?.user?.fullName}</Text>
                <Text style={styles.txtNomeRota}>Cidade: {store?.user?.driver?.route?.city?.name} - {store?.user?.driver?.route?.city?.state}</Text>
              </View>
              <View style={{ width: '10%', justifyContent: 'center' }}>
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  size={config.windowWidth / 13}
                  color={cores.branco}
                />
              </View>
            </View>
          </TouchableOpacity>
          :
          <Fragment>
            {loaderReq ?
              <View style={{ marginTop: config.windowWidth / 3 }}>
                <ActivityIndicator color={cores.branco} size={'large'} />
              </View>
              :
              <View style={styles.containerErro}>
                <Text style={[styles.txtBold, { textAlign: 'center' }]}> Parece que você ainda não esta em uma rota.</Text>
                <TouchableOpacity onPress={() => requisitarRota()}>
                  <BtnBlue
                    style={{
                      marginHorizontal: config.windowWidth / 5,
                      marginTop: config.windowWidth / 20,
                    }}
                    text="Atualizar"
                  />
                </TouchableOpacity>
              </View>
            }
          </Fragment>
      }
      {!isDriver && !store.user.driverId ?
        (
          <TouchableOpacity
            style={styles.rodape}
            onPress={() => navigation.navigate('pesquisaMotorista')}>
            <Text style={styles.txtBtnRodape}>Encontrar Motorista</Text>
          </TouchableOpacity>
        )
        :
        (
          <TouchableOpacity
            style={styles.rodape}
            onPress={() => { sairRota() }}>
            <Text style={styles.txtBtnRodape}>Sair da Rota</Text>
          </TouchableOpacity>
        )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  containerInfoRota: {
    width: '85%'
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
    textTransform: 'uppercase',
    maxWidth: '50%'
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
    width: 300
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
    bottom: config.windowWidth / 5,
    backgroundColor: cores.azulBtn,
    padding: 15,
    borderRadius: 20
  },
  txtBtnRodape: {
    fontSize: 16,
    fontWeight: '700',
    color: cores.fonteBranco,
    textAlign: 'center'
  },
  containerErro: {
    alignItems: 'center',
    marginTop: config.windowWidth / 2,
    marginHorizontal: 10,
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 10
  }
});
