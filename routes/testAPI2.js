function getStopsForLine(from, to) {
    return new Promise((resolve, reject) => {
        var r = null;
        console.log("API QUERRY: https://timetable.search.ch/api/route.en.json?from=" + from + "&to=" + to)
        axios.get("https://timetable.search.ch/api/route.en.json?from=" + from + "&to=" + to).then((response) => {
            //Check if there is more thant one leg, a leg is a change of bus (and change of line), if there is a change, the line is wrong
            r = response;
            // load all stations because
            if (response.data.connections[0].legs.length <= 2) {
                from = response.data.connections[0].legs[0].name;
                to = response.data.connections[0].legs[0].terminal;
                self.correctStation(from,to).then((results)=>{
                    resolve(results);
                }).catch((error) => {
                    reject(error);
                })
            }
            //
            else {
                var error = '';
                var errorArray = [];
                for (var i = 0; i < response.data.connections[0].legs.length - 1; i++) {

                    var type = response.data.connections[0].legs[i].type;
                    if (type == 'bus' || type == 'post') {
                        error += response.data.connections[0].legs[i].name + ' | '
                            + response.data.connections[0].legs[i].terminal + '\n';
                        errorArray.push([response.data.connections[0].legs[i].name, response.data.connections[0].legs[i].terminal]);
                        //If the line isn't correctly entered, we suggest one based on what the API returns, this is the response[..].name and response[..].terminal fields
                    }
                }
                reject([error, errorArray]);
            }
        }).catch((error) => {
            console.log(error);
            var readableObj = renderAddon.readableObject(r.data)
            reject("The API returns " + readableObj);
        })
    })
}

function correctStation(from,to){
    return new Promise((resolve, reject) => {
        var stops = new Array();
        var idLine;
        console.log("API QUERRY2: https://timetable.search.ch/api/route.en.json?from=" + from + "&to=" + to)
        axios.get("https://timetable.search.ch/api/route.en.json?from=" + from + "&to=" + to).then((response) => {

            var type = response.data.connections[0].legs[0].type;
            idLine = response.data.connections[0].legs[0].line;

            //Check if the transport type is a bus or a postal bus, if not this isn't a bus line
            if (type == 'bus' || type == 'post') {

                var stop = response.data.connections[0].legs[0];
                var station = new Station(null, stop.name, stop.x, stop.y);
                stops.push(station);

                for (var k in response.data.connections[0].legs[0].stops) {
                    stop = response.data.connections[0].legs[0].stops[k];
                    station = new Station(null, stop.name, stop.x, stop.y);

                    stops.push(station);
                }

                stop = response.data.connections[0].legs[0].exit;
                station = new Station(null, stop.name, stop.x, stop.y);
                stops.push(station);
                var results = [];
                results[0] = stops;
                results[1] = idLine;

                resolve(results);

            } else {
                reject("This isn't a bus line");
            }
        })
    })
}

function prepareStation(body) {
    return new Promise((resolve, reject) => {
        self.getStopsForLine(body.departFinal, body.arriveeFinal).then((stops) => {
            self.insertStationInDB(stops, body.zoneFinal).then((msg) => {
                resolve(msg)
            }).catch((error) => {
                reject(error);
            })
        }).catch((error) => {
            reject(error);
        })
    })
}


