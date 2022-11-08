import React, { useState, Fragment, useEffect, useContext, useRef } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { config, cores, estilos } from '../../styles/Estilos'
import { useSelector } from 'react-redux'
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'
import BtnBlue from '../../components/BtnBlue'
import NavBar from '../../components/NavBar'
import { Driver } from '../../types/types'
import { AuthContext } from '../../apis/AuthContext'
import avatarPadrao from '../../../assets/img/avatarPadrao.jpg'

type navigation = {
  props: {
    driver?: Driver
    tela: String
  }
}

export default function TelaVeiculo() {
  const store: any = useSelector<any>(({ user }) => {
    return {
      user: user,
    }
  })

  const navigation = useNavigation<any>()
  const route = useRoute<RouteProp<navigation, 'props'>>()

  const { createRequest } = useContext(AuthContext)

  const [loaderBtn, setLoaderBtn] = useState<boolean>(false)
  const [solicitar, setSolicitar] = useState<boolean>(false)
  const [imagem, setImagem] = useState<any>()

  useEffect(() => {
    verificaTela()
    if (route.params.driver) {
      setSolicitar(!solicitar);
    }
  }, []);
  const assentos = store.user.driver
    ? parseInt(store.user.driver.vehicle.seats) - 2
    : store.user.vehicle
      ? parseInt(store.user.vehicle.seats) - 2
      : route.params.driver
        ? parseInt(route.params.driver?.vehicle?.seats) - 2
        : 0;

  const nomeMotorista = store.user.driver
    ? store.user.driver.user.fullName
    : store.user.vehicle
      ? store.user.user.fullName
      : route.params.driver
        ? route.params.driver.user.fullName
        : 'Motorista'

  const verificaTela = () => {
    switch (route.params.tela) {
      case 'Rota':
        setImagem(store.user.user.photo)
        break
      case 'Home':
        setImagem(store.user.driver.user.photo)
        break
      case 'Pesquisa':
        setImagem(route.params.driver?.user.photo)
        break
    }
  }

  const solicitarMotorista = async () => {
    try {
      setLoaderBtn(true)
      const resp = await createRequest(route.params.driver?.id)
      if (resp) {
        navigation.goBack()
        navigation.goBack()
      }
    } catch (e) {
      console.log(e)
    } finally {
      setLoaderBtn(false)
    }
  }


  // componentes

  const ImagemVeiculo = () => (
    <Image style={styles.imgVeiculo} source={imagem ? { uri: imagem } : avatarPadrao} />
  );

  const Dados = (props: any) => {
    return (
      <View style={styles.cabecalho}>
        <Text style={styles.telefoneMotorista}>{props.phone}</Text>
        <ImagemVeiculo />
        <Fragment>
          <View style={styles.containerInfo}>
            <View style={styles.containerAssentos}>
              <View style={styles.containerTotais}>
                <Text style={styles.subtitulo}>Assentos</Text>
                <Text style={styles.subtitulo}>
                  {props.seats ? props.seats : 'Assentos'}
                </Text>
              </View>

              <View style={styles.containerDisponiveis}>
                <Text style={styles.subtitulo}>Disponíveis</Text>
                <Text style={styles.subtitulo}>
                  {assentos ? assentos : 'Disponíveis'}
                </Text>
              </View>
            </View>
            <View style={styles.containerInfoMotorista}>
              <View style={styles.containerTxt}>
                <Text style={styles.txtInfo}>Marca:</Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.txtInfoDB}>
                  {props.brand ? props.brand : 'Marca'}
                </Text>
              </View>

              <View style={styles.containerTxt}>
                <Text style={styles.txtInfo}>Modelo:</Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.txtInfoDB}>
                  {props.model ? props.model : 'Modelo'}
                </Text>
              </View>
              <View style={styles.containerTxt}>
                <Text style={styles.txtInfo}>Placa:</Text>
                <Text style={styles.txtInfoDB}>
                  {props.plate
                    ? props.plate.slice(0, 3) + '-' + props.plate.slice(3)
                    : 'Placa'}
                </Text>
              </View>
              <View style={styles.containerTxt}>
                <Text style={styles.txtInfo}>Cor:</Text>
                <Text style={styles.txtInfoDB}>
                  {props.color ? props.color : 'Cor'}
                </Text>
              </View>
              <View style={styles.containerTxt}>
                <Text style={styles.txtInfo}>Ano:</Text>
                <Text style={styles.txtInfoDB}>
                  {props.year ? props.year : 'Ano'}
                </Text>
              </View>
            </View>
          </View>
        </Fragment>
      </View>
    );
  };

  const DadosVeiculo = () =>
    store.user.driver ? ( //Visão do estudante
      <Dados
        phone={store.user.user.phone}
        brand={store.user.driver.vehicle.brand}
        model={store.user.driver.vehicle.model}
        color={store.user.driver.vehicle.color}
        year={store.user.driver.vehicle.year}
        plate={store.user.driver.vehicle.plate}
        seats={store.user.driver.vehicle.seats}
      />
    ) : store.user.vehicle && !store.user.user.studentId ? ( //Visao do motorista
      <Dados
        phone={store.user.user.phone}
        brand={store.user.vehicle.brand}
        model={store.user.vehicle.model}
        color={store.user.vehicle.color}
        year={store.user.vehicle.year}
        plate={store.user.vehicle.plate}
        seats={store.user.vehicle.seats}
      />
    ) : route.params.driver ? ( //Para estudante aplicar na rota
      <Dados
        phone={route.params.driver.user.phone}
        brand={route.params?.driver?.vehicle?.brand}
        model={route.params?.driver?.vehicle?.model}
        color={route.params?.driver?.vehicle?.color}
        year={route.params?.driver?.vehicle?.year}
        plate={route.params?.driver?.vehicle?.plate}
        seats={route.params?.driver?.vehicle?.seats}
      />
    ) : (
      //Caso o estudante ainda não esteja cadastrado
      <View
        style={{
          backgroundColor: cores.azulPrimario,
          margin: config.windowWidth / 20,
          alignItems: 'center',
          padding: 5,
          borderRadius: 5,
        }}>
        <Text style={{ color: cores.branco, fontSize: 16, textAlign: 'center' }}>
          Você ainda não está cadastrado em nenhuma rota :(
        </Text>
      </View>
    );
  const BtnRota = (props: any) => {
    return (
      <TouchableOpacity
        style={styles.btnRodape}
        onPress={() => navigation.navigate(`${props.tela}`)}>
        <BtnBlue text={`${props.texto}`} loader={loaderBtn} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={estilos.containerPrincipal}>
      <NavBar titulo={nomeMotorista} botaoEsquerdo={false} />
      <ScrollView>{DadosVeiculo()}</ScrollView>
      {!store.user.driver && store.user.route ? (
        <BtnRota tela="mapaMotorista" texto="Consultar Rota" />
      ) : store.user.driver && store.user.driverId ? (
        <BtnRota tela="mapa" texto="Consultar Rota" />
      ) : (
        <></>
      )}

      {solicitar && (
        <TouchableOpacity
          onPress={() => solicitarMotorista()}
          disabled={loaderBtn}
          style={styles.btnRodape}>
          <BtnBlue text={'SOLICITAR MOTORISTA'} loader={loaderBtn} larguraLoader={config.windowWidth / 5.5} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imgVeiculo: {
    height: config.windowWidth / 2.5,
    width: config.windowWidth / 2.5,
    resizeMode: 'cover',
    marginTop: config.windowWidth / 20,
    alignSelf: 'center',
    borderRadius: 5,
    marginBottom: '2%',
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: cores.disabled
  },

  btnRodape: {
    flex: 5,
    alignSelf: 'center',
  },
  cabecalho: {
    flexDirection: 'column',
    backgroundColor: '#3B4E80',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    paddingVertical: config.windowWidth / 20,
    marginTop: config.windowWidth / 15
  },
  nomeMotorista: {
    fontSize: config.windowWidth / 12,
    color: cores.branco,
    fontWeight: '900',
  },
  telefoneMotorista: {
    fontSize: config.windowWidth / 18,
    color: cores.branco,
    fontWeight: '400',
  },
  containerAssentos: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1D2740',
    borderColor: cores.branco,
    borderWidth: 2,
    borderTopWidth: 4,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    paddingBottom: 6,
  },
  containerInfo: {
    flex: 1,
    backgroundColor: '#1D2740',
    height: 'auto',
    width: '90%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingBottom: 5,
    maxWidth: '90%',
  },
  containerTotais: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  containerDisponiveis: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: '900',
    color: cores.branco,
  },
  containerInfoMotorista: {
    marginTop: '5%',
    flex: 2,
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    width: '95%',
    maxWidth: '95%',
  },
  txtInfo: {
    fontSize: 20,
    fontWeight: '900',
    color: cores.branco,
    marginBottom: '2%',
  },
  containerTxt: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  txtInfoDB: {
    fontSize: 16,
    fontWeight: '400',
    color: cores.branco,
    left: 10,
    bottom: 2,
    width: '75%'
  }
})
