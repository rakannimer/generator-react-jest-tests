# React Jest tests yeoman generator

## Installation

First, install [Yeoman](http://yeoman.io) and generator-react-redux-saga-generator using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-react-jest-tests
```


## Commands

Suppose you have the following file structure
```
- app/
	- components/
		- MyComp.js
	- storesOrUtils/
    - someFile.js
```

Silent :

```
yo react-jest-tests:test
```
Verbose :

```
DEBUG=generator-react-jest-tests* yo react-jest-tests:test
```

```
     _-----_
    |       |
    |--(o)--|    ╭──────────────────────────╮
   `---------´   │    Let's create tests    │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `

? Give me the path to components please ! (./src/components/)
```

Give the path to your folder or ```cd``` to it and put ```./``` as path

## License

MIT © [RakanNimer](https://www.github.com/RakanNimer)
