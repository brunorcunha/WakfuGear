# Wakfu Gear - FrontEnd
[![Netlify Status](https://api.netlify.com/api/v1/badges/e216e026-dafc-4826-b5e4-fb8264adddbe/deploy-status)](https://app.netlify.com/sites/wakfu-gear/deploys)

Project developed in VueJS to compare, organize and assemble assemblies with Wakfu MMO items.

<p style="text-align: center;">
  <a href="http://wakfu-gear.netlify.com" target="_blank">
    [ Confira a Demo ]
  </a>
</p>

![screenshot](https://user-images.githubusercontent.com/3453372/63224421-519ed980-c19a-11e9-9afd-e03f39a96a30.png)


## Getting started

The instructions below will cause you to have a local copy running on your machine for purposes of collaboration and testing.

### Prerequisites

You'll need a few things before you go any further.

```
- Latest version of NodeJS.
- Some IDE (Editor) to change/execute the code.
- Git to clone the project and send pull requests.
```

## Instalation

With everything ready and installed, clone the project to a specific folder.

```
git clone https://github.com/brunorcunha/WakfuGear-Frontend.git
```

Access the project folder to execute the next commands.

```
npm i
```

NPM is our Node package manager and the `npm i` command is an abbreviation of `npm install`, which will install all project dependencies.

```
npm start
```
The `npm start` command will execute the project.

## Running the tests

To run the unit tests, use the command:

```
npm run unit
```

Always run the tests to keep the application running, exceptionally before making a pull request.

## Deploy

Deploy is when the code is organized for production. Production is the code that end users can access.

```
npm run build
```

The project is already configured for automatic deployment in Netlify as soon as the Master (branch) is updated.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on the encoding style adopted in this project and the pull requests process.

## License

This project is distributed under the MIT license - see [LICENSE.md](LICENSE.md) for more details.
