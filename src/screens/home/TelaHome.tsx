import React, {useState, useContext, useLayoutEffect, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {config, cores, estilos} from '../../styles/Estilos';
import BtnBlue from '../../components/BtnBlue';
import {useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faGear,
  faAnglesRight,
  faVanShuttle,
} from '@fortawesome/free-solid-svg-icons';
import {AuthContext} from '../../apis/AuthContext';
import {popUpErroGenerico} from '../PopUpErroGenerico';
import {faRightFromBracket} from '@fortawesome/free-solid-svg-icons/faRightFromBracket';
import {setInfo} from '../../redux/reducers/usuarioReducer';

export default function TelaHome() {
  const store: any = useSelector<any>(({user}) => {
    return {
      user: user,
    };
  });

  const {logout, refreshUser, mediador, quitFromRoute} =
    useContext(AuthContext);
  const [userName, setUserName] = useState<string>('');
  const [isDriver, setIsDriver] = useState(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const image = store.user.user
    ? store.user.user.photo
    : 'https://jaraguatenisclube.com.br/images/avatar.png';
  useLayoutEffect(() => {
    setUserName(store.user.user.fullName);
    let driver = store.user.type == 'driver' ? true : false;
    setIsDriver(driver);
  }, []);
  const updateScreen = async (forceUpdate: boolean) => {
    if ((!store.user.route && !store.user.driverId) || forceUpdate) {
      const aux = store.user;
      try {
        const resp = await refreshUser();
      } catch (e) {
        console.log(e);
      }
    }
  };
  const updateOnRemove = async () => {
    const aux = store.user;
    try {
      dispatch(setInfo({driver: null}));
      dispatch(setInfo({diverId: null}));
      const resp = await refreshUser();
    } catch (e) {
      console.log(e);
    }
  };
  const sairRota = async () => {
    const response = await mediador(
      'Deseja mesmo sair desta rota?',
      quitFromRoute,
      null,
      setRefresh,
    );
  };

  useEffect(() => {
    if (refresh) {
      updateOnRemove();
    }
  }, [refresh]);

  return (
    <SafeAreaView style={estilos.containerPrincipal}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.txtBold}>
            Bem Vindo{' '}
            {userName ? userName : isDriver ? 'Motorista' : 'Estudante'}!
          </Text>
          <TouchableOpacity onPress={logout}>
            <FontAwesomeIcon
              icon={faRightFromBracket}
              size={config.windowWidth / 16}
              color={cores.branco}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.containerHeader}>
          <Image style={styles.imgUser} source={{uri: `${image}`}} />
          <View style={styles.headerBtn}>
            <TouchableOpacity
              style={styles.containerBtn}
              onPress={() => {
                !isDriver && store.user.driverId
                  ? navigation.navigate('veiculo', {driver: null})
                  : popUpErroGenerico({
                      type: 'customInfo',
                      text1: 'Opa!',
                      text2: `Parece que você não está cadastrado(a) em nenhuma rota`,
                    });
              }}>
              <Text style={styles.txtBtn}>MINHA VAN</Text>
              <FontAwesomeIcon
                icon={faVanShuttle}
                size={config.windowWidth / 12}
                color={cores.branco}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {isDriver && store.user.route ? (
        <TouchableOpacity
          style={styles.btnRota}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('telaRota')}>
          <Text style={styles.txtCodigoRota}>
            Rota: {store.user.route.university.name}
          </Text>
          <View style={styles.containerRota}>
            <View style={styles.containerInfoRota}>
              <Text style={styles.txtNomeRota}>
                Motorista: {store.user.user.fullName}
              </Text>
              <Text style={styles.txtNomeRota}>
                Cidade: {store.user.route.city.name} -{' '}
                {store.user.route.city.state}
              </Text>
            </View>
            <View style={{width: '10%', justifyContent: 'center'}}>
              <FontAwesomeIcon
                icon={faAnglesRight}
                size={config.windowWidth / 13}
                color={cores.branco}
              />
            </View>
          </View>
        </TouchableOpacity>
      ) : !isDriver && store.user.driverId ? (
        <TouchableOpacity
          style={styles.btnRota}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('mapa')}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.txtCodigoRota}>
            Rota: {store.user?.driver?.route?.university?.name}
          </Text>
          <View style={styles.containerRota}>
            <View style={styles.containerInfoRota}>
              <Text style={styles.txtNomeRota}>
                Motorista: {store?.user?.driver?.user?.fullName}
              </Text>
              <Text style={styles.txtNomeRota}>
                Cidade: {store?.user?.driver?.route?.city?.name} -{' '}
                {store?.user?.driver?.route?.city?.state}
              </Text>
            </View>
            <View style={{width: '10%', justifyContent: 'center'}}>
              <FontAwesomeIcon
                icon={faAnglesRight}
                size={config.windowWidth / 13}
                color={cores.branco}
              />
            </View>
          </View>
        </TouchableOpacity>
      ) : isDriver ? (
        <View style={styles.containerErro}>
          <Text style={[styles.txtBold, {textAlign: 'center'}]}>
            Parece que você ainda não esta em uma rota.
          </Text>
          <TouchableOpacity onPress={async () => await updateScreen(false)}>
            <BtnBlue
              style={{
                marginHorizontal: config.windowWidth / 5,
                marginTop: config.windowWidth / 20,
              }}
              text="Atualizar"
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.containerErro}>
          <Text style={[styles.txtBold, {textAlign: 'center'}]}>
            Parece que você ainda não esta em uma rota.
          </Text>
          <TouchableOpacity onPress={async () => await updateScreen(false)}>
            <BtnBlue
              style={{
                marginHorizontal: config.windowWidth / 5,
                marginTop: config.windowWidth / 20,
              }}
              text="Atualizar"
            />
          </TouchableOpacity>
        </View>
      )}
      {!isDriver && !store.user.driverId ? (
        <TouchableOpacity
          style={styles.rodape}
          onPress={() => navigation.navigate('pesquisaMotorista')}>
          <Text style={styles.txtBtnRodape}>Encontrar Motorista</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.rodape}
          onPress={() => {
            sairRota();
          }}>
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
    borderColor: cores.pretoBorder,
  },
  containerHeader: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: config.windowWidth / 20,
  },
  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.azulDisabled,
    borderRadius: 15,
  },
  containerBtn: {
    alignItems: 'center',
    padding: 10,
  },
  containerRota: {
    marginTop: 10,
    padding: 13,
    flexDirection: 'row',
  },
  containerInfoRota: {
    width: '85%',
  },
  btnRota: {
    backgroundColor: cores.azulBtn,
    marginTop: config.windowWidth / 15,
    marginHorizontal: 5,
    borderRadius: 15,
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
    maxWidth: '50%',
  },
  txtNomeRota: {
    fontSize: 18,
    color: cores.branco,
    width: '90%',
  },
  txtBtn: {
    fontSize: 14,
    color: cores.fonteBranco,
    bottom: 5,
  },
  txtBold: {
    fontSize: 18,
    fontWeight: '700',
    color: cores.fonteBranco,
    width: 300,
  },
  imgUser: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: cores.branco,
    borderRadius: 3,
  },
  rodape: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: config.windowWidth / 5,
    backgroundColor: cores.azulBtn,
    padding: 15,
    borderRadius: 20,
  },
  txtBtnRodape: {
    fontSize: 16,
    fontWeight: '700',
    color: cores.fonteBranco,
    textAlign: 'center',
  },
  containerErro: {
    alignItems: 'center',
    marginTop: config.windowWidth / 2,
    marginHorizontal: 10,
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 10,
  },
});
