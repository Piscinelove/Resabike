$(document).ready(function(){
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
                    errorToast(translation[$_LANG()].USERRESTEXIST);
                }
                else
                {
                    refreshUsers();
                    $("#modal-edit-user").modal('close');
                    resetForm("#edit-user-form");
                    successToast(translation[$_LANG()].USERRESTMAJ);
                }
            });
}

function createUser(){
    var username = $("#user-add-username").val();
    var email = $("#user-add-email").val();
    var password = $("#user-add-password").val();
    var password2 = $("#user-add-password2").val();
    var idRole = $("#user-add-role").val();
    var idZone = $("#user-add-zone").val();


    if($("#add-user-form").valid())
        superagent
            .post("/administration/admin/users")
            .send({
                username: username,
                email: email,
                password: password,
                password2: password2,
                idRole: idRole,
                idZone: idZone
            })
            .end(function (err, res) {
                if (err || !res.ok) {
                    errorToast(translation[$_LANG()].USERRESTEXIST);
                }
                else {
                    refreshUsers();
                    $("#modal-add-user").modal('close');
                    resetForm("#add-user-form");
                    successToast(translation[$_LANG()].USERRESTADD);
                }
            });
    else
        errorToast(translation[$_LANG()].USERRESTFILLFORM);
}

function deleteUser(id){

    superagent
        .delete("/administration/admin/users/"+id)
        .end(function(err, res)
        {
            $('#select').val();
            if (err || !res.ok)
            {
                errorToast(translation[$_LANG()].USERRESTINTERNERROR);
            } else
            {
                refreshUsers();
                successToast(translation[$_LANG()].USERRESTDELETE);
            }
        });
}

function refreshUsers() {
    $("#tab-users").load(" #tab-users");
}

function resetForm(selector) {
    $(selector)[0].reset();
}