function updateZone(id, name){
    //CALL PUT FOR UPDATING THE ZONE
    superagent.put("/administration/admin/zone")
        .send({id: id, name: name})
        .then(function(){
            window.location.href="/administration/admin/zone";
        });
}

function deleteZone(id){
    //CALL DELETE FOR REMOVING THE ZONE
    superagent.delete("/administration/admin/zone/"+id)
        .then(function(){
            window.location.href="/administration/admin/zone";
        });
}