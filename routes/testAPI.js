var request = require('request');
var station = require('../db/station');
var models = require('../models');
var line = require('../db/line');
var url = "https://timetable.search.ch/api/route.en.json?from=sierre&to=zinal";
var departureId;
var arrivalId;

request(url, function (error, response, body) {
    var json = JSON.parse(body);
    var lines = json.connections[0].legs;

    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //console.log('body:', body); // Print the HTML for the Google homepage.
    for(let i=1; i < lines.length; i++)
    {
        if(i===3)
            return;
        console.log(lines[i].name);
        station.insertStation(lines[i].name);

        station.getStationIdByName(lines[i].name).then(function (station) {
            departureId = station;
        });
        station.getStationIdByName(lines[i].terminal).then(function (station) {
            arrivalId = station;
        });

        line.insertLine(lines[i].line, 1, 1, 1);

        if(lines[i].stops === null)
            return;

        lines[i].stops.forEach(function(j)
        {
            console.log(j.name);
            station.insertStation(j.name);
        })

    }
});