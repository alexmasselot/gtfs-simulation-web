# GtfsSimulationWeb

## building topojson Swiss map

     git clone https://github.com/interactivethings/swiss-maps.git
     cd swiss-maps
     make all   PROPERTIES=name,abbr REPROJECT=true
     cp topo/ch.json xyz/gtfs-simulation-web/src/data/ch.json

## Development notes
### Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `ng build --prod` to build the project. 
The build artifacts will be stored in the `dist/` directory.
Environment is taken out from `environments/environment.prod.ts` 

### Deploy
To deploy the application, it shall be packaged with the scala/play backend application (https://github.com/alexmasselot/gtfs-simulation-play).
Let's suppose it has been clone in the same directory as this Angular app

    ng build --prod
    mkdir -p ../gtfs-simulation-play/public
    rsync -avh dist/ ../gtfs-simulation-play/public/ --delete


### Further help

To get more help on the `angular-cli` use `ng --help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

