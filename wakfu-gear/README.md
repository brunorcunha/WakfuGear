# Wakfu Gear - FrontEnd
[![Netlify Status](https://api.netlify.com/api/v1/badges/e216e026-dafc-4826-b5e4-fb8264adddbe/deploy-status)](https://app.netlify.com/sites/wakfu-gear/deploys)

Projeto desenvolvido em VueJS para comparar, organizar e montar conjuntos com os itens do MMO Wakfu.

<p style="text-align: center;">
  <a href="http://wakfu-gear.netlify.com" target="_blank">
    [ Confira a Demo ]
  </a>
</p>

![screenshot](https://user-images.githubusercontent.com/3453372/63224421-519ed980-c19a-11e9-9afd-e03f39a96a30.png)


## Começando

As instruções abaixo farão com que você tenha uma cópia local em execução na sua máquina para fins de colaboração e testes.

### Pré-requisitos

Você precisará de algumas coisas antes de continuar.

```
- Última versão do NodeJS.
- Alguma IDE (Editor) para alterar/executar o código.
- O Git para clonar o projeto e enviar pull requests.
```

## Instalando

Com tudo pronto e instalado, clone o projeto para alguma pasta específica.

```
git clone https://github.com/brunorcunha/WakfuGear-Frontend.git
```

Acesse a pasta do projeto para executar os próximos comandos.

```
npm i
```

NPM é nosso gerenciador de pacotes do Node e o comando `npm i` é uma abreviação de `npm install`, que irá instalar todas as dependencias do projeto.

```
npm start
```
O comando `npm start` irá executar o projeto.

## Rodando os testes

Para executar os testes unitários, utilize o comando:

```
npm run unit
```

Sempre rode os testes para manter a aplicação funcionando, excepcionalmente antes de fazer um pull request.

## Deploy

Deploy é quando o código é organizado para a produção. A produção é o código que os usuários finais poderão ter acesso.

```
npm run build
```

O projeto já está configurado para deploy automático na Netlify assim que a Master (branch) é atualizada.

## Contribuindo

Por favor, leia o [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes sobre o estilo de codificação adotado nesse projeto e o processo de pull requests.

## Licença

Esse projeto é distribuido sob a licença MIT - veja [LICENSE.md](LICENSE.md) para mais detalhes.
