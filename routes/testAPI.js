var axios = require("axios");
var async = require("async");
var dbStation = require('../db/station');

var line = require('../db/line');
var url = "https://timetable.search.ch/api/route.en.json?from=sierre&to=zinal";


// request(url, function (error, response, body) {
//     var json = JSON.parse(body);
//     var lines = json.connections[0].legs;
//
//     console.log('error:', error); // Print the error if one occurred
//     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//     //console.log('body:', body); // Print the HTML for the Google homepage.
//    for(let i=1; i < lines.length; i++)
//     {
//         if(i===3)
//             return;
//
//         var stationPromise = station.insertStation(lines[i].name);
//         var linePromise = line.insertLine(lines[i].line,1,lines[i].name,lines[i].terminal);
//
//         Promise.all([stationPromise, linePromise]).then(function (result) {
//                 resolve(result);
//                 console.log(result);
//         });
//
//
//         if(lines[i].stops === null)
//             return;
//
//         lines[i].stops.forEach(function(j)
//         {
//             console.log(j.name);
//             station.insertStation(j.name);
//         })
//
//     }
// });

// request(url, function (error, response, body) {
//     var json = JSON.parse(body);
//     var lines = json.connections[0].legs;
//
//     console.log('error:', error); // Print the error if one occurred
//     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//     //console.log('body:', body); // Print the HTML for the Google homepage.
//     for(let i=1; i < lines.length; i++)
//     {
//         station.insertStation(lines[i].name).then(function () {
//             return Promise.all([
//                 station.getStationIdByName(lines[i].name),
//                 station.getStationIdByName(lines[i].terminal)
//             ]).then(function (result) {
//
//                 console.log(lines[i].line+"line test");
//                 return line.createLine(lines[i].line,1,result[0],result[1]);
//
//
//             }).then(function () {
//                 if(lines[i].stops === null)
//                     return;
//
//                 lines[i].stops.forEach(function(j)
//                 {
//                     console.log(j.name);
//                     return station.insertStation(j.name);
//                 })
//             })
//         });
//     }
// });

// var requestStations = request(url, function (error, response, body) {
//     var json = JSON.parse(body);
//     var lines = json.connections[0].legs;
//
//     console.log('error:', error); // Print the error if one occurred
//     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//     //console.log('body:', body); // Print the HTML for the Google homepage.
//     for(let i=1; i < lines.length; i++)
//     {
//         station.insertStation(lines[i].name).then(function ()
//         {
//             lines[i].stops.forEach(function(j)
//             {
//                 return station.insertStation(j.name);
//             })
//         });
//     }
//
// });
//
// var requestLines = request(url, function (error, response, body) {
//     var json = JSON.parse(body);
//     var lines = json.connections[0].legs;
//
//     console.log('error:', error); // Print the error if one occurred
//     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//     //console.log('body:', body); // Print the HTML for the Google homepage.
//     for(let i=1; i < lines.length; i++)
//     {
//         let line = lines[i].line;
//         console.log("line here : "+line);
//         if(line != null)
//         {
//             let departure;
//             let arrival;
//
//             station.getStationIdByName(lines[i].name)
//                 .then(function (departureId) {
//                     departure = departureId;
//                     return station.getStationIdByName(lines[i].terminal);
//                 })
//                 .then(function (arrivalId) {
//                     arrival = arrivalId;
//                     console.log("line : " + line + " | " + departureId + " " + arrivalId);
//                     line.createLine(line, 1, departure, arrival);
//                 })
//         }
//     }
// });



// var getAPIStations = function (url) {
//     axios.get(url).then(function (response) {
//         console.log(response.data.connections);
//
//         var linesArray = response.data.connections[0].legs;
//
//         async.eachOf(linesArray, function (value, key, callback1) {
//
//             console.log("Index : "+key);
//             console.log("Value : "+value.name);
//
//             station.insertStation(value.name);
//
//             return callback1(null);
//
//
//             if(value.stops === null)
//                 return;
//             else
//             {
//                 async.each(value.stops, function (stop, callback2) {
//                     station.insertStation(stop.name);
//                     return callback2(null);
//
//
//                 }, function (error) {
//                     if(error)
//                         console.error(error.message);
//
//                     console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH");
//
//
//                 });
//             }
//
//
//
//
//         }, function (error) {
//             if(error)
//                 console.error(error.message);
//
//             console.log("IIIIIIIIIIIIIIIIIIIIII");
//             getAPILines(url);
//
//         })
//     }).catch(function (error) {
//         console.log(error);
//     })
// }
//
// var getAPILines = function (url) {
//     axios.get(url).then(function (response) {
//         console.log(response.data.connections);
//
//         var linesArray = response.data.connections[0].legs;
//
//         async.eachOf(linesArray, function (value, key, callback3) {
//
//             console.log("Index : "+key);
//             console.log("Value raf : "+value.line);
//             console.log("Value departure : "+value.name);
//             console.log("Value arrival : "+value.terminal);
//             console.log("Value stops : "+value.stops);
//
//             var departureId = station.getStationIdByName(value.name);
//             var arrivalId = station.getStationIdByName(value.terminal);
//
//             callback3(null, value.line, departureId, arrivalId);
//
//         }, function (error, line, departureId, arrivalId) {
//             if(error)
//                 console.error(error.message);
//
//             line.createLine(line,1,departureId,arrivalId);
//             console.error("done :"+departureId +"  "+arrivalId);
//
//         })
//     }).catch(function (error) {
//         console.log(error);
//     })
// }
//
// getAPIStations(url);

var getAPIStations = function (url) {
    axios.get(url).then(function (response) {
        console.log(response.data.connections);


        var linesArray = response.data.connections[0].legs;
        //DELETE FIRST LEG
        linesArray.splice(0,1);

        var stationsToAdd = [];

        for (var i = 0; i < linesArray.length; i++)
        {
            stationsToAdd.push(linesArray[i]);

            if(linesArray[i].stops != null)
            {
                for (var j = 0; j < linesArray[i].stops.length; j++)
                {
                    let station = linesArray[i].stops[j];
                    stationsToAdd.push(station);
                }
            }
        }

        dbStation.insertStationInDatabase(stationsToAdd);

    }).catch(function (error) {
        console.log(error);
    })
}

getAPIStations(url);







