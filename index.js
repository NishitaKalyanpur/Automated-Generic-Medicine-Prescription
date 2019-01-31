const express = require('express')
const app = express()
const csv = require('csvtojson')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const trieSearch = require('trie-search')
const { performance } = require('perf_hooks');
var mysql = require('mysql')

function isIn(brand, rec) {
    rec.forEach(r => {
        if (r['brand name'] == brand)
            return true
    })

    return false
}

function make_drugs(path) {
    var obj = {}
    obj.data = JSON.parse(fs.readFileSync(path, err => { if (err) console.log(err) }))
    obj.actIng = new trieSearch('brand name', { ignoreCase: true })
    obj.altMed = new trieSearch('active ingred', { ignoreCase: true })
    obj.condi = new trieSearch('condition', { ignoreCase: true })
    //obj.prop = new trieSearch(['active ingred', 'proportion'], { ignoreCase: true })

    obj.actIng.addAll(obj.data)
    obj.altMed.addAll(obj.data)
    obj.condi.addAll(obj.data)
    //obj.prop.addAll(obj.data)

    obj.subs_cache = {}
    obj.cond_cache = {}

    obj.getForSubstitutes = function (query) {
        if (query in obj.subs_cache) {
            return obj.subs_cache[query]
        }
        else {
            recommendations = []
            obj.actIng.get(query).forEach(drug => {
                if (drug['brand name'].toLowerCase() == query.toLowerCase()) {
                    recommendations.push(drug)
                    results = obj.altMed.get(drug['active ingred'])
                    // results = obj.prop.get()
                    results.forEach(result => {
                        if (result.sr == undefined || typeof result['sr no'] === 'string')
                            if (!isIn(result['brand name'], recommendations)) { recommendations.push(result) }

                    })
                }
            })
            obj.subs_cache[query] = recommendations
            return recommendations
        }
    }

    obj.getForConditions = function (query) {
        if (query in obj.cond_cache) {
            return obj.cond_cache[query]
        }
        else {
            recommendations = []
            obj.condi.get(query).forEach(drug => {
                recommendations.push(drug)
            })
            obj.cond_cache[query] = recommendations
            console.log(recommendations.length)
            return recommendations
        }
    }

    obj.getSubstituteUsingSQL = function (query) {
        return new Promise((resolve, reject) => {
            var connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'medicine'
            });
            recommendations = []
            connection.query("SELECT * FROM `com` WHERE `com`.`brand name` = ?", [query], function (error, results, fields) {
                if (error)
                    console.log(error)
                else {
                    results = JSON.parse(JSON.stringify(results)) 
                    if (results.length > 0) {
                        results.forEach(drug => {
                            recommendations.push(drug)
                            connection.query("SELECT * from `com_gen` WHERE `com_gen`.`active ingred` = ?", [drug['active ingred']], function (error, results, fields) {
                                if (error)
                                    console.log(error)
                                else {
                                    results = JSON.parse(JSON.stringify(results))                                     if (results.length > 0) {
                                        results.forEach(result => {
                                            if (result['brand name'] != drug['brand name']) {
                                                if (result.sr == undefined || typeof result['sr no'] === 'string')
                                                    recommendations.push(result)
                                            }
                                        })
                                        resolve(recommendations)
                                    }
                                    else
                                        console.log('Found none')
                                    console.log('Found', recommendations.length, 'substitutes')
                                }
                            })
                        })
                    } else {
                        resolve([])
                    }
                }
            })
        })
    }

    return obj
}

var drugs_priced = make_drugs('drugs_new_priced.json')
var drugs_conditioned = make_drugs('drugs_new_conditioned.json')
//var drugs_priced_and_conditioned = make_drugs('drugs_new_priced_conditioned.json')
//var drugs_new_priced_or_conditioned = make_drugs('drugs_new_priced_or_conditioned.json')
var com = make_drugs('com.json')
var com_gen = make_drugs('com_gen.json')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.post('/mysql', function (req, res) {
    response = {}
    performance.mark('Start');

    //from showuser
    // response.alt_drugs = com.getForSubstitutes(req.body.query)
    com.getSubstituteUsingSQL(req.body.query).then(rec => {

        response.alt_drugs = rec
        response.rec_drugs = []

        performance.mark('End');
        performance.measure('Total', 'Start', 'End');
        time = performance.getEntriesByName('Total')[0].duration + " milliseconds"
        performance.clearMarks(['Start', 'End']);
        performance.clearMeasures('Total');

        console.log(time, " for the query ", req.body.query, "using mysql")
        response.time = time

        res.send(JSON.stringify(response))
    })
})

app.post('/', function (req, res) {
    response = {}
    performance.mark('Start');

    //from showuser
    if (req.body.datasetForDrugs == "com")
        response.alt_drugs = com.getForSubstitutes(req.body.query)
    else
        response.alt_drugs = drugs_priced.getForSubstitutes(req.body.query)

    if (req.body.datasetForConditions == "com")
        response.rec_drugs = com.getForConditions(req.body.query)
    else
        response.rec_drugs = drugs_conditioned.getForConditions(req.body.query)

    performance.mark('End');
    performance.measure('Total', 'Start', 'End');
    time = performance.getEntriesByName('Total')[0].duration + " milliseconds"
    performance.clearMarks(['Start', 'End']);
    performance.clearMeasures('Total');

    console.log(time, " for the query ", req.body.query, "using trie")
    response.time = time

    console.log(req.body)
    res.send(JSON.stringify(response))
})

app.listen('3000', () => {
    console.log("Server is listening...")
})