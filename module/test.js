function test(timestamp) {
    var date = timestamp.split(' ')[0].split('-')[1]+"/"+timestamp.split(' ')[0].split('-')[2]+"/"+timestamp.split(' ')[0].split('-')[0];
    var hour = timestamp.split(' ')[1].split(':')[0]+":"+timestamp.split(' ')[1].split(':')[1];

    console.log(date);
    console.log(hour);
}
test("2017-10-28 17:40:00");