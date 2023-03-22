var express=require("express");
var app=express();

var bunyan = require("bunyan");
const LOG_LEVEL = process.env.LOG_LEVEL || "info";
var log = bunyan.createLogger({name: "diagnosis-search", level: LOG_LEVEL});

var axios=require("axios");

var port = process.env.PORT || 3000;

const ICD_CONTAINER = process.env.ICD_CONTAINER_PATH || "http://localhost:9000"

app.listen(port, () => {
    log.info("Diagnosis search service running on port %d", port);
    log.info("Expect to find an ICD-API listenting at %s", ICD_CONTAINER);
});

app.get("/search", (req, res) => {
    let lang;
    let errResponse = "";
    if (req.query.lang) {
        if (["en", "ar"].includes(req.query.lang)) lang=req.query.lang;
        else {
            log.warn("Request received for invalid language: ", req.query.lang)
            errResponse += "Invalid lang - expected en or ar: ";
        }
    }
    else lang="en";
    if (req.query.q && lang) {
        log.info("Request received for", req.query.q);
        getFromIcd(req.query.q, lang)
        .then(result => {          
            var returnArray = [];
            result.destinationEntities.forEach(element => {
                var decodedTitle= element.title.replace(/\<em class=\'found\'\>/g,'').replace(/\<\/em\>/g,'');
                returnArray.push({code: element.theCode, score: element.score, title: element.title, plainTitle: decodedTitle});
              
            });
            if (returnArray.length >0)
                res.status(200).send(returnArray);
            else
                res.status(404).send("No entries found");
        })
        .catch((err) => {
            log.error(JSON.stringify(err));
            res.status(500).send(err.message);
        });
    } else {
        log.warn("received GET at /search missing the search parameter");
        if (!req.query.q) errResponse += "Expected parameter q='something' : ";
        res.status(400).send(errResponse);
    }
});


const getFromIcd = (query, language) => {
  return new Promise((resolve, reject) => {
    const url = ICD_CONTAINER + "/icd/release/11/2022-02/mms/search?q=" + query;
    log.debug ("Calling ICD-API at URL: %s", url);
    if (!language) return reject("Missing Language");
    else {
    axios( {
        method: 'get',
        url: url,
        headers : {
            "API-Version": "v2",
            "Accept": "application/json",
            "Accept-language": language
        }
      })
      .then((response) => {
        if (response.data.error) {
            log.error("Error returned by the ICD-API: %s", response.errorMessage)
            return reject(new Error ("Error returned by the ICD-API:" + response.errorMessage));
        }
        else {
             resolve (response.data);
        }
      })
      .catch((err) => {
        if (err.response) {
            log.error(err.response.data);
            log.error(err.response.status);
            log.error(err.response.headers);
            return reject(new Error("FROM ICD-API: " + err.response.data));
        } 
        return reject(new Error(err));
      });
    }
  })
}