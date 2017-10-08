var axios = require("axios");
var async = require("async");
var dbStation = require('../db/station');

var line = require('../db/line');
var url = "https://timetable.search.ch/api/route.en.json?from=sierre&to=zinal";


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







