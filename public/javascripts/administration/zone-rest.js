$(document).ready(function(){
    $('.modal.modal-edit-zone').modal({
        ready: function(modal, trigger) {
            modal.find('input[id="zone-edit-id"]').val(trigger.data('id'));
            modal.find('input[id="zone-edit-name"]').val(trigger.data('name'));
            Materialize.updateTextFields();

        }
    });
});

function updateZone(){
    var id = $("#zone-edit-id").val();
    var name = $("#zone-edit-name").val();

    if($("#edit-zone-form").valid())
        superagent
            .put("/administration/admin/zone")
            .send({id: id, name: name})
            .end(function(err, res)
            {
                if (err || !res.ok)
                {
                    errorToast("Cette zone existe déjà");
                }
                else
                {
                    refreshZones();
                    $("#modal-edit-zone").modal('close');
                    resetForm("#edit-zone-form");
                    successToast("Zone mise à jour");
                }
            });
}

function createZone(){
    var name = $("#zone-add-name").val();


    if($("#add-zone-form").valid())
        superagent
            .post("/administration/admin/zone")
            .send({name: name})
            .end(function(err, res)
            {
                if (err || !res.ok)
                {
                    errorToast("Cette zone existe déjà");
                }
                else
                {
                    $("#modal-add-zone").modal('close');
                    refreshZones();
                    resetForm("#add-zone-form");
                    successToast("Zone ajoutée");
                }
            });
}

function deleteZone(id){

    superagent
        .delete("/administration/admin/zone/"+id)
        .end(function(err, res)
        {
            if (err || !res.ok)
            {
                errorToast("Erreur interne");
                Materialize.toast("Erreur interne", 2000);
            } else
            {
                refreshZones();
                successToast("Zone supprimée");
            }
        });
}

function refreshZones() {
    $("#tab-zones").load(" #tab-zones");
}

function resetForm(selector) {
    $(selector)[0].reset();
}