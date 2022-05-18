# App Urbniversity, desenvolvido em React-Native

## 📋 Tutorial ( Basta Ler 👍 )

### Instalação do projeto

Instalação padrão do React-native pode ser encontrada aqui: [Tutorial de instalação do React-Native](https://reactnative.dev/docs/environment-setup)

As versões do NodeJs e OpenJDK recomendadas para o desenvolvimento são

```
nodejs16
openjdk11
```

você pode alterar as versões utilizando [Chocolatey](https://chocolatey.org/) no Windows, [Homebrew](https://brew.sh/) no MacOS, ou consultar o manual de instalação da sua [distro do linux](https://nodejs.org/en/download/package-manager/) 

### Definição de variaveis
O arquivo de exemplo de variaveis de ambiente é o `example.env` que está na raiz do projeto. 

Crie uma cópia na raiz do projeto com o nome `.env` (nada deve ser escrito antes do .) e atribua as variaveis corretamente.

Ao alterar uma variavel no arquivo `.env`, é necessário cortar a execução do bundler e rodar novamente limpando sua cache com o comando `react-native start --reset-cache`

>OBS: O comando `react-native start --reset-cache` funciona em uma codepush também, ou seja,você consegue alterar variaveis de ambiente, limpar a cache e em seguida subir uma codepush :)

Ao criar uma nova variável nova que não está inclusa no `example.env`, declarar ela também no modulo `@env` que está localizado na raiz em [types.d.ts].


### 🧪 Testes

Antes de todo commit, é altamente recomendado utilizar este comando

Para rodar o Linter ESLint

` npm run lint `

Para rodar os testes (ainda não existem no app)

` npm run test `

### Recomendações

Utilizar a extenção ESLint do próprio VSCode


## 🏃‍♂️ Para rodar o projeto
Instanciar a node_modules
`npm i`

Instanciar os pods pra buildar no iOS

`cd ios && pod install`

Para rodar no android

`react-native run-android`

Para rodar no iOS

`react-native run-ios`

rodar em um emulador específico iOS

`react-native run-ios --simulator="iPhone 8"`


## 📲 CodePush
projeto android = `baluarte/Isabela-Flores-Android`

projeto ios = `baluarte/Isabela-Flores-ios`

### Para verificar as atualizações via CodePush

Android `appcenter codepush deployment list -a baluarte/Isabela-Flores-Android`

iOS     `appcenter codepush deployment list -a baluarte/Isabela-Flores-ios`

### Para verificar as chaves

Android `appcenter codepush deployment list -a baluarte/Isabela-Flores-Android -k`

iOS     `appcenter codepush deployment list -a baluarte/Isabela-Flores-ios -k`

### Para liberar uma atualização

Android `appcenter codepush release-react -a baluarte/Isabela-Flores-Android -m -d Production`

iOS     `appcenter codepush release-react -a baluarte/Isabela-Flores-ios -m -d Production`

> <<ATENÇÃO>>

>Se houver alterações na node_modules ou em qualquer arquivo nativo (Android ou iOS), o codepush não irá funcionar e corre o risco de crashar o app pro usuário 
>pois nem sempre o rollback automático do codepush funciona. Nesse caso é nessessário __gerar uma nova versão do aplicativo.__

>Antes de subir uma codepush, conferir a versão do projeto, pois ela só vai funcionar na versão que está selecionada no momento

>__toda codepush gerada deve ser commitada na branch de sua devida versão   ex:"release/1.0"__

>Pode ser que você precise subir codepush em alguma versão antiga, pra isso é necessário trocar de branch pra versão que você quer subir

### como verificar a versão do projeto?

#### Android:

[android/app/build.gradle]

versionName "1.0"

#### iOS

[ios/IsabelaFlores.xcodeproj/project.pbxproj]

MARKETING_VERSION = "0.0.2"   (tem mais de uma flag dessa no arquivo, alterar todas com o mesmo valor)


### 🧪 Tutorial pra subir e testar  uma codepush:

#### iOS:

1- abrir o projeto no xcode (IsabelaFlores.xcworkspace)

2- clicar em "Isabela Flores" ao lado direito do botao stop no canto superior esquerdo

3- edit scheme... > Run > Build Configuration > Production

4- nesse momento o app está na versão de testes de codepush, escolher o emulador/dispositivo e buildar

5- após buildar, fazer as alterações que você precisa no código

6- usar o `comando de subir a atualização` do codepush com as alterações que você fez

7- usar o `comando de deployment list` pra validar se subiu a att com sucesso

8- fechar e abrir o app buildado vai fazer com que baixe a codepush, aí é só validar se sua alteração funcionou

9- pra verificar se o seu app buildado baixou a atualização com sucesso, use o `comando de deployment list` novamente,
 vai exibir um contador de instalações (Install Metrics > Installed:)

#### Android:

1- pode testar de 2 formas, gerando um APK ou buildando a versão release. Mas antes, 
 é recomendado limpar a cache do android, pra isso use o comando `./gradlew clean` dentro da pasta android

#### comando pra gerar o apk: 

`cd android && ./gradlew assembleRelease` 

o apk vai ser gerado dentro de [android/app/build/outputs/apk/release/app.release.apk]

#### comando pra buildar a versão release: 

`npx react-native run-android --variant=release`

>após isso, seguir do passo 5 em diante do iOS ali em cima /\

``` Importante saber: ```

Existe uma tela de debug no app (TelaVersoes.tsx) que exibe a versão atual dele e a versão de codepush atual (caso exista alguma instalada),
pra acessa-la é só __pressionar por 2 segundos__ a barra de pesquisa "Para onde enviar?" na tela inicial.

Da pra verificar todas atualizações, quantidade de downloads/instalações/rollbacks de cada codepush pelo painel da microsoft também,
acessando https://appcenter.ms/apps na conta Baluarte (app.baluarte@gmail.com) 
``` ```

### Chave teste
Foi criada uma chave chamada `Dev_test` que é utilizada para testes de desenvolvimento, para utiliza-la:

Rode o comando de verificar as chaves no sistema operacional desejado, vai aparecer a chave `Dev_test` e `Production`

Copie a chave `Production`

Na barra de pesquisa do VScode do lado esquerdo superior, cole a chave de produção do projeto, vai aparecer o arquivo onde você deve alterar a chave. Nesse arquivo substitua a chave de `produção` pela chave de `teste`.

Lembrando que o arquivo do Android é diferente do arquivo iOS, se quiser alterar nos dois, precisa pegar a chave de produção de cada um, pesquisar e alterar em seus devidos arquivos.

Agora é só buildar o app no SO desejado e subir uma codepush utilizando  o comando de liberar uma atualização alterando `Production` pra `Dev_test`, exemplo:

`appcenter codepush release-react -a baluarte/Isabela-Flores-Android -m -d Dev_test`

>Atenção pra não commitar essas chaves de teste no bitbucket, elas só devem ser utilizadas pra testes localmente.


## 📋 Guia de documentação

## Padrão de commits

Commits seguem o padrão abaixo.

`nomeDaBranch :: descrição da tarefa feita`

É desejavel que os commits tenham foco no menor numero de funcionalidades possivel.


## Desenvolvimento

O Arquivo `FuncoesPadrao.js` possúi funções helpers utilizadas em vários lugares no aplicativo, antes de criar uma função helper, verifique nesse arquivo se ela já não existe...

Existem funções de formatar moeda, remover acento, etc...

Caso crie alguma função helper, **que não vai ser utilizada apenas em um arquivo**, inserir no `FuncoesPadrao.js`


## ⛔️ Tratamentos de erro (Feedback pro usuário)
Atualmente existem 2 tipos de feedback ao usuário caso ocorra erro em alguma requisição (falha  de conexão, oscilação de internet por ex)

1- renderiza um texto direto na tela "Erro ao ... por favor Por favor verifique sua conexão..." e um botão de "Tente Novamente" que efetua a ação novamente

2- renderiza um modal na tela com um aviso genérico, chamando a função navigation.navigate('modalerro') que possúi algumas props (verificar props disponíveis em ModalErroGenerico.tsx)


## 🎉🥳 Produção
Antes de subir uma versão pra store, alterar a versão do projeto:

#### Android:

[android/app/build.gradle]

versionName "1.0"

#### iOS:

[ios/IsabelaFlores.xcodeproj/project.pbxproj]

MARKETING_VERSION = "0.0.1"    (tem mais de uma flag dessa no arquivo, alterar todas com o mesmo valor)

criar uma branch no git com o nome da versão, seguindo a versão do android, no padrão abaixo:

`release/1.0`

>se possivel manter os dois, iOS e Android na mesma versão.


### Gerando apk Android

primeiro limpar o gradlew: `cd android && ./gradlew clean`

depois gerar o apk usando este comando dentro da pasta android: `./gradlew assembleRelease`

vão ser gerados 3 apks dentro de [android/app/build/outputs/apk/release/]

`x86`           é a versão para androids antigos (quase não utilizado)

`armeabi-v7a`   quase todo disposítivo tem suporte pra esse, porém é 32bits

`arm64-v8a`     é o mais recente, utiliza arquitetura 64bits

Você deve fazer **upload de todos** para a Google Play para que ela lide corretamente com a versão correta pra cada tipo de usuário.