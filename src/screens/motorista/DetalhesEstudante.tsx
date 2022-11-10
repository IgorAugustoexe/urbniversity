import React, {useContext} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import {config, cores} from '../../styles/Estilos';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faGraduationCap,
  faLocationDot,
  faPhone,
  faSchoolFlag,
  faTreeCity,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import avatarPadrao from '../../../assets/img/avatarPadrao.jpg';
import {AuthContext} from '../../apis/AuthContext';

type navigation = {
  props: {
    id: string;
    imagem: string;
    cidade: string;
    uf: string;
    endereco: string;
    faculdade: string;
    nome: string;
    celular: string;
  };
};

export default function DetalhesEstudante() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<navigation, 'props'>>();

  const {mediador, removeFromRoute} = useContext(AuthContext);

  const removeEstudante = async () => {
    await mediador(
      'Deseja mesmo remover este estudante?',
      removeFromRoute,
      route.params.id,
    );
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View style={styles.container}>
        <TouchableOpacity
          style={{alignSelf: 'flex-end'}}
          onPress={() => navigation.goBack()}>
          <FontAwesomeIcon
            icon={faXmark}
            size={config.windowWidth / 12}
            color={cores.branco}
          />
        </TouchableOpacity>
        <View style={{alignItems: 'center'}}>
          <Image
            style={styles.imgEstudante}
            source={
              route.params.imagem ? {uri: route.params.imagem} : avatarPadrao
            }
          />
        </View>
        <View
          style={{
            borderBottomWidth: 0.5,
            borderColor: cores.branco,
            paddingTop: 20,
            marginHorizontal: config.windowWidth / 4,
          }}
        />
        <View style={styles.containerInfoEstudante}>
          <View style={styles.divisorIconeTxt}>
            <FontAwesomeIcon
              icon={faTreeCity}
              size={config.windowWidth / 16}
              color={cores.branco}
            />
            <Text style={styles.txtInfo}>{route.params.cidade}</Text>
          </View>
          <View style={styles.divisorIconeTxt}>
            <FontAwesomeIcon
              icon={faLocationDot}
              size={config.windowWidth / 16}
              color={cores.branco}
            />
            <Text style={styles.txtInfo}>{route.params.endereco}</Text>
          </View>
          <View style={styles.divisorIconeTxt}>
            <FontAwesomeIcon
              icon={faSchoolFlag}
              size={config.windowWidth / 16}
              color={cores.branco}
            />
            <Text style={styles.txtInfo}>{route.params.faculdade}</Text>
          </View>
          <View style={styles.divisorIconeTxt}>
            <FontAwesomeIcon
              icon={faGraduationCap}
              size={config.windowWidth / 16}
              color={cores.branco}
            />
            <Text style={styles.txtInfo}>{route.params.nome}</Text>
          </View>
          <View style={[styles.divisorIconeTxt, {paddingBottom: 0}]}>
            <FontAwesomeIcon
              icon={faPhone}
              size={config.windowWidth / 18}
              color={cores.branco}
            />
            <Text style={styles.txtInfo}>{route.params.celular}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.btnRemover}
          onPress={() => removeEstudante()}>
          <Text style={styles.txtBtn}>Remover Estudante</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: config.windowWidth / 1.15,
    height: 'auto',
    maxHeight: config.windowWidth / 0.68,
    borderRadius: 7,
    backgroundColor: cores.backgroundPadrao,
    padding: 15,
  },
  imgEstudante: {
    width: 160,
    height: 160,
    borderRadius: 5,
  },
  containerInfoEstudante: {
    padding: config.windowWidth / 20,
    backgroundColor: cores.azulDisabled,
    marginTop: 15,
    borderRadius: 5,
  },
  divisorIconeTxt: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  txtInfo: {
    fontSize: 15,
    color: cores.fonteBranco,
    left: 12,
  },
  btnRemover: {
    alignSelf: 'center',
    marginTop: config.windowWidth / 30,
    backgroundColor: cores.vermelho,
    padding: 12,
    borderRadius: 20,
  },
  txtBtn: {
    fontSize: 16,
    color: cores.fonteBranco,
    fontWeight: 'bold',
  },
});
