# Vi-sense Frontend

## Usage

### Import Models

Download the the `/gltf` folder from `vi-sense/sample-data` repository and add it to `/public` directory.

### Installation

```
$ npm install 
```

### Development
```
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

`#someVariableName` is a private member variable. The # can also be used to declare a private function.

All static files (images, models, ...) belong to `/public`.
