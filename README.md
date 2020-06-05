# Wakfu Gear

[pt-BR] Ferramenta para comparação de itens e montagem de conjuntos do MMO Wakfu.
[en] Tool for items comparison and sets build for Wakfu MMO.

# Guide to development

## Using local node
### Requirements

- NodeJS 12.x or higher

### Setting up

[pt-BR] Siga os guias dos READMEs dentro das pastas `api(wakfu-api)` e `app(wakfu-gear)`.
[en] Follow the README's guides inside the `api(wakfu-api)` and `app(wakfu-gear)` folders.

## Using docker
### Requirements

- docker 18.x or higher
- docker-compose 1.25.x or higher

> Note: If you are in linux, remember to follow the post-installation guide on [docker wiki](https://docs.docker.com/install/linux/linux-postinstall/)

### Setting up

Clone the repository:
```sh
$ git clone git@github.com:brunorcunha/WakfuGear.git
```

Compose the environment:
```sh
$ docker-compose up -d
```

#### Useful commands

```sh
# connect to container console
$ docker-compose exec -it "api|web" bash

# npm usage
$ docker-compose exec -it "api|web" npm <npm params>

# test run
$ docker-compose run -it --rm "api|web" -e NODE_ENV=test npm test
```

# How to contribute

TODO
