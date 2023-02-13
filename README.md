# diagnosis-search
Wrapper for the WHO-ICD-11 api


## What this project offers

A simplified GET interface that fronts onto the WHO-ICD-11 API and gives simpler results.
Whereas the WHO Api offers very verbose output covering synonyms this API accepts a search term and returns a simple array:

[
  { code:
    description: 
    score: 0.05
  }
]



# Getting Started

## Pre-requisite is to have the ICD-API running as a docker container locally

```
docker pull whoicd/icd-api
docker run -p 9000:80 -e include=2022-02_ar-en -e acceptLicense=true -e saveAnalytics=true whoicd/icd-api
```

would set up the docker container, listening on port 9000 and containing both arabic and english entries.

```
____________________________________________________________________________

  ooooo   .oooooo.  oooooooooo.               .o.       ooooooooo.   ooooo
   888   d8P    Y8b  888     Y8b             .888.       888    Y88.  888
   888  888          888      888           .8 888.      888   .d88   888
   888  888          888      888          .8   888.     888ooo88P    888
   888  888          888      888  88888  .88ooo8888.    888          888
   888   88b    ooo  888     d88         .8       888.   888          888
  o888o   Y8bood8P  o888bood8P          o88o     o8888o o888o        o888o

                         https://icd.who.int/icdapi
____________________________________________________________________________

Saving Analytics is ON
Starting ICD-API
ICD-11 Container is Running!
You may close the shell window or Ctrl-C to return to shell (container will continue to run)
```

## Using this API wrapper

### Node
The api was written using Node 16.19.0 - but doesn't use anything particularly special.

### To develop locally
```
npm install
npm run dev
```


### Envioronment variables
- LOG_LEVEL: defaults to "info"
- PORT: the port the API will be available on default 3000
- ICD_CONTAINER_PATH:  The location to call the ICD docker container. Default "http://localhost:9000"


### Making a query
http://localhost:3000/search?q=malaria&lang=en
http://localhost:3000/search?q=ملاريا&lang=ar

There is just a single endpoint.

## Logs
The log output is all to STDOUT
```
{"name":"diagnosis-search","hostname":"WINDOWS-60A8M75","pid":26536,"level":30,"msg":"Diagnosis search service running on port 3000","time":"2023-02-13T11:51:19.643Z","v":0}
{"name":"diagnosis-search","hostname":"WINDOWS-60A8M75","pid":26536,"level":30,"msg":"Expect to find an ICD-API listenting at http://localhost:9000","time":"2023-02-13T11:51:19.644Z","v":0}

{"name":"diagnosis-search","hostname":"WINDOWS-60A8M75","pid":26536,"level":30,"msg":"Request received for malaria","time":"2023-02-13T11:52:34.514Z","v":0}
```
