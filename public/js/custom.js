let table = document.getElementById('main-table');
let addUser = document.getElementById('addUser');
let deleteUser = document.getElementsByClassName('deleteUser');

let editingTd;

table.onclick = function (event) {

    // 3 возможных цели

    let target = event.target.closest('.edit-cancel,.edit-ok,td');

    if (!table.contains(target) || target.className == 'btn-box') return;

    if (target.className == 'edit-cancel') {
        finishTdEdit(editingTd.elem, false);
    } else if (target.className == 'edit-ok') {
        finishTdEdit(editingTd.elem, true);
    } else if (target.nodeName == 'TD') {
        if (editingTd) return; // уже редактируется

        makeTdEditable(target);
    }

};
addUser.onclick = function (event) {
    var form = '#form-add';
    var first_name = $(form + ' input[name="first_name"]').val();
    var second_name = $(form + ' input[name="second_name"]').val();
    var email = $(form + ' input[name="email"]').val();

    let RegEmail = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
    let RegName = /^[a-zA-Zа-яА-Я'][a-zA-Zа-яА-Я-' ]+[a-zA-Zа-яА-Я']?$/u;
    // console.log(element[0].getAttribute("name"));

        if (first_name === '' || second_name === '' ||email === ''){
            alert('Заполните Поле: ' + td.dataset.info);
            return false;
        }

        if (first_name){
            if (!first_name.match(RegName)){
                alert('Введите коректно Поле: First Name');
                $(form + ' input[name="first_name"]').css("border",'2px solid red');
                return false
            }
        }
        if (second_name){
            if (!second_name.match(RegName)){
                alert('Введите коректно Поле: Second Name');
                $(form + ' input[name="second_name"]').css("border",'2px solid red');
                return false
            }
        }

        if (email){
            if (!email.match(RegEmail)){
                alert('Введите коректно Поле: Email');
                $(form + ' input[name="email"]').css("border",'2px solid red');
                return false
            }
        }
    $.ajax({
        type: "POST",
        data: {first_name: first_name, second_name: second_name, email: email},
        url: "../add.php",
        beforeSend: function () {
            $('#addUser').button('loading');
        },
        complete: function () {
            $('#addUser').button('reset');

        },
        success: function (e) {
            let answer = JSON.parse(e);
            $("#addUserModal").modal('hide');
            // console.log(answer[0].id);
            if(answer.success !== false){
                $('#main-table tbody').append('<tr data-id="' + answer[0].id + '"> <th scope="row">' + answer[0].id + '</th> <td data-info="first_name" data-id="' + answer[0].id + '">' + first_name + '</td> <td data-info="second_name" data-id="' + e + '">' + second_name + '</td>'
                    + '<td data-info="email" data-id="' + answer[0].id + '">' + email + '</td>' +
                    '<td class="btn-box">' +
                    '<div class="btn-group" role="group" aria-label="Basic example">' +
                    ' <button type="button" class="btn btn-danger deleteUser">Delete</button>' +
                    '</div>' +
                    '</td>' +
                    '</tr>');
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
        alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
};
$(".deleteUser").on('click', function (event) {
    let id = event.target.dataset.id;
    let areYouSure = confirm("Вы - уверены?");
    if (areYouSure) {
        $.ajax({
            type: "POST",
            data: {id: id},
            url: "../delete.php",
            beforeSend: function () {
                $('#addUser').button('loading');
            },
            complete: function () {
                $('#addUser').button('reset');

            },
            success: function (e) {
                $("tr[data-id=" + id + "]").remove()
            }
        });
    }
});


function makeTdEditable(td) {
    editingTd = {
        elem: td,
        data: td.innerHTML
    };

    td.classList.add('edit-td'); // td в состоянии редактирования, CSS применятся к textarea внутри ячейки

    let input = document.createElement('input');
    input.style.width = td.clientWidth + 'px';
    input.style.height = td.clientHeight - 22 + 'px';
    input.className = 'edit-area';
    input.setAttribute('required', 'required');
    input.setAttribute('name', td.dataset.info);


    input.value = td.innerHTML;
    td.innerHTML = '';
    td.appendChild(input);
    input.focus();

    td.insertAdjacentHTML("beforeEnd",
        '<div class="edit-controls"><button class="edit-ok">OK</button><button class="edit-cancel">CANCEL</button></div>'
    );
}

function finishTdEdit(td, isOk) {
   let value  =  td.firstChild.value;
   let element  =  document.getElementsByClassName('edit-area');
   let attrName = element[0].getAttribute("name");
   let RegEmail = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
   let RegName = /^[a-zA-Zа-яА-Я'][a-zA-Zа-яА-Я-' ]+[a-zA-Zа-яА-Я']?$/u;
    // console.log(element[0].getAttribute("name"));

    if (isOk) {

        if (value === ''){
            element[0].style.border = '2px solid red';
            alert('Заполните Поле: ' + td.dataset.info);
            return false;
        }

        if (attrName === 'first_name' || attrName === 'second_name'  ){
            if (!value.match(RegName)){
                alert('Введите коректно Поле: ' + td.dataset.info);
                element[0].style.border = '2px solid red';
                return false
            }
        }

        if (attrName === 'email'){
            if (!value.match(RegEmail)){
                alert('Введите коректно Поле: ' + td.dataset.info);
                element[0].style.border = '2px solid red';
                return false
            }
        }

        $.ajax({
            type: "POST",
            data: {value: value, table: td.dataset.info, id: td.dataset.id},
            url: "../changeInfo.php",
            error: function () {
                alert('Error')
            },
            success: function (e) {
                console.log('Work Fine');
            }
        });
        td.innerHTML = td.firstChild.value;


    } else {
        td.innerHTML = editingTd.data;
    }
    td.classList.remove('edit-td');
    editingTd = null;
}

