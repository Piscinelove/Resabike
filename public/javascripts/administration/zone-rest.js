function updateZone(){
    var id = $("#zone-edit-id").val();
    var name = $("#zone-edit-name").val();

    superagent
        .put("/administration/admin/zone")
        .send({id: id, name: name})
        .end(function(err, res)
        {
            if (err || !res.ok)
            {
                Materialize.toast("Cette zone existe déjà", 4000);
            }
            else
            {
                $("#modal-edit-zone").modal('close');
                Materialize.toast("Zone mise à jour", 500,'',function()
                {
                    location.reload();
                });
            }
        });
}

function createZone(){
    var name = $("#zone-add-name").val();

    // if(name === "" || name === null)
    // {
    //     Materialize.toast("Veuillez saisir un nom de zone", 4000);
    //     return;
    // }

    superagent
        .post("/administration/admin/zone")
        .send({name: name})
        .end(function(err, res)
        {
            if (err || !res.ok)
            {
                Materialize.toast("Cette zone existe déjà", 4000);
            }
            else
            {
                refresh();
                $("#modal-add-zone").modal('close');
                resetForm("#add-zone-form");
                Materialize.toast("Zone ajoutée", 4000);
            }
        });
}

function deleteZone(id){

    superagent.delete("/administration/admin/zone/"+id)
        .end(function(err, res){
            if (err || !res.ok) {
                Materialize.toast("Erreur interne", 4000);
            } else {
                Materialize.toast("Zone supprimée", 500,'',function()
                {
                    window.location.href="/administration/admin/zone";
                });
            }
        });
}

function refresh() {
    $("#tab-zones").load(" #tab-zones");
}

function resetForm(selector) {
    $(selector)[0].reset();
}