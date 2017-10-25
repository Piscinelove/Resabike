$(document).ready(function(){
    // $('.add-lines').click(function(e){
    //     e.stopPropagation();
    //
    //     $(".modal#modal-add-line").modal("open");
    // });

    $('.modal#modal-edit-user').modal({
        ready: function(modal, trigger) {
            modal.find('input[id="user-edit-id"]').val(trigger.data('id'));
            modal.find('input[id="user-edit-username"]').val(trigger.data('username'));
            modal.find('input[id="user-edit-email"]').val(trigger.data('email'));
            modal.find('select[id="user-edit-role"]').val(trigger.data('idrole'));
            $('select[id="user-edit-role"]').material_select();
            modal.find('select[id="user-edit-zone"]').val(trigger.data('idzone'));
            $('select[id="user-edit-zone"]').material_select();
            Materialize.updateTextFields();


        }
    });


    $('.modal#modal-add-line').modal({
        ready: function(modal, trigger) {
            modal.find('input[id="line-add-idZone"]').val(trigger.data('id'));
            alert(modal.find('input[id="line-add-idZone"]').val(trigger.data('id')));
            Materialize.updateTextFields();


        }
    });
});

function updateUser(){
    var id = $("#user-edit-id").val();
    var username = $("#user-edit-username").val();
    var email = $("#user-edit-email").val();
    var chpassword = $("#user-edit-chpassword").val();
    var chpassword2 = $("#user-edit-chpassword2").val();
    var idRole = $("#user-edit-role").val();
    var idZone = $("#user-edit-zone").val();

    if($("#edit-user-form").valid())
        superagent
            .put("/administration/admin/users")
            .send({id: id, email: email, chpassword:chpassword,idRole:idRole,idZone:idZone})
            .end(function(err, res)
            {
                if (err || !res.ok)
                {
                    errorToast("Cet user existe déjà");
                }
                else
                {
                    refreshUsers();
                    $("#modal-edit-user").modal('close');
                    resetForm("#edit-user-form");
                    successToast("User mise à jour");
                }
            });
}

function createLine(){
    var idZone = $("#line-add-idZone").val();
    var departure = $("#line-add-departure").val();
    var terminal = $("#line-add-terminal").val();

    if($("#add-line-form").valid())
        superagent
            .post("/administration/admin/lines")
            .send({
                idZone: idZone,
                departure: departure,
                terminal: terminal
            })
            .end(function (err, res) {
                if (err || !res.ok) {
                    errorToast("Cette ligne existe déjà");
                }
                else {
                    refreshUsers();
                    $("#modal-add-user").modal('close');
                    resetForm("#add-user-form");
                    successToast("Ligne ajoutée");
                }
            });
    else
        errorToast("Veuillez bien à remplir le formulaire");
}

function deleteUser(id){

    superagent
        .delete("/administration/admin/users/"+id)
        .end(function(err, res)
        {
            if (err || !res.ok)
            {
                errorToast("Erreur interne");
                Materialize.toast("Erreur interne", 2000);
            } else
            {
                refreshUsers();
                successToast("User supprimé");
            }
        });
}

function refreshUsers() {
    $("#tab-users").load(" #tab-users");
}

function resetForm(selector) {
    $(selector)[0].reset();
}