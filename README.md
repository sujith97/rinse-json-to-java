### Pre install steps for Linux users ###

* Git clone and 'cd' into the directory.
```
git clone git@gitli.corp.linkedin.com:rinse-json-to-java/rinse-json-to-java.git
cd /path/to/rinse-json-to-java/
```

* Execute a one time setup which installs node and other global dependencies (Typescript, Gulp and TypeScript Definitions).
```
sh setup.sh
```

* Now its time to execute one more one time installation step which installs project's local dependencies
```
npm run deps
```


### Execution ###

After you successfully executed the setup steps, you can simple execute the following command to generate the java version of JSON files.
```
npm run generate
```