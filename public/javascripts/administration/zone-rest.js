$(document).ready(function(){
    $('.modal#modal-edit-zone').modal({
        ready: function(modal, trigger) {
            modal.find('input[id="zone-edit-id"]').val(trigger.data('id'));
            modal.find('input[id="zone-edit-name"]').val(trigger.data('name'));
            Materialize.updateTextFields();

        }
    });
});

/**
 * Update zone
 */
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
                    errorToast(translation[$_LANG()].ZONERESTEXIST);
                }
                else
                {
                    refreshZones();
                    $("#modal-edit-zone").modal('close');
                    resetForm("#edit-zone-form");
                    successToast(translation[$_LANG()].ZONERESTMAJ);
                }
            });
}

/**
 * Create zone
 */
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
                    errorToast(translation[$_LANG()].ZONERESTEXIST);
                }
                else
                {
                    $("#modal-add-zone").modal('close');
                    refreshZones();
                    resetForm("#add-zone-form");
                    successToast(translation[$_LANG()].ZONERESTADD);
                }
            });
}

/**
 * Delete zone
 * @param id
 */
function deleteZone(id){

    superagent
        .delete("/administration/admin/zone/"+id)
        .end(function(err, res)
        {
            if (err || !res.ok)
            {
                errorToast(translation[$_LANG()].ZONERESTINTERNERROR);
            } else
            {
                refreshZones();
                successToast(translation[$_LANG()].ZONERESTDELETE);
            }
        });
}

/**
 * Refresh zones
 */
function refreshZones() {
    $("#tab-zones").load(" #tab-zones");
}

/**
 * Reset form
 * @param selector
 */
function resetForm(selector) {
    $(selector)[0].reset();
}