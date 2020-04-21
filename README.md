# Vi-sense Frontend

## Usage

### Import Models

Download the the `/gltf` folder from `vi-sense/sample-data` repository and add it to `/public` directory.

### Installation

```
$ npm install 
$ npm run start
```

### Building

```
$ npm run build 
```



# Some notes and conventions for programming

```
export class App {

    #someVariableName;

    constructor() { ... }
}
```

`#someVariableName` is a private member

all static (images, models, ...) files belong to the `/public` folder