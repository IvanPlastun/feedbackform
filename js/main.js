//Получение формы
let form = document.formSend,
    button = form.formSubmit,
    requestAddress = "http://feedbackform/postdata.php";

let notifyMessage = {
    emptyName: 'Поле имени не может быть пустым',
    emptyEmail: 'Поле email не может быть пустым',
    emptyMessage: 'Поле сообщение не может быть пустым',
    incorrectFormatEmail: 'Неверный формат email'   
}

let nameBlock = document.getElementById('name-block'),
    emailBlock = document.getElementById('email-block'),
    messageBlock = document.getElementById('message-block');

//Функция создания нотификации
function createNotificationError(notifyMessage, classes) {
    let alertBox = document.createElement('div');
    alertBox.textContent = notifyMessage;
    alertBox.className = classes;
    return alertBox;
}

//Функция добавления нотификации
function addNotificationError(inputBlock, alertBox) {
    inputBlock.appendChild(alertBox);
}

//Функция удаления нотификации
function removeNotificationError(inputBlock) {
    var node = inputBlock.firstChild;
    // обращаемся к следующему узлу, пока он определен
    while((node=node.nextSibling) !== null){
        if(node.nodeType == 1) {
            if(node.nodeName == "DIV") {
                var classElem = node.getAttribute('class');
                if(classElem.indexOf('alert') != -1) { 
                    var parentnode = node.parentNode;
                    parentnode.removeChild(node);
                }
            }
                
        }
    }
}
//Функция открывающая модальное окно
function openModalWindow() {
    var modalWindow = document.getElementById('modal');
    modalWindow.classList.remove('hide--modal');   
}
//Функция закрывающая модальное окно
function closeModalWindow(modalButtonID) {
    var closeButton = document.getElementById(modalButtonID),
        modalWindow = document.getElementById('modal');
    closeButton.addEventListener('click', function() {
        modalWindow.className += " hide--modal";
    });
}


//AJAX-запрос
function post(url, requestBody) {
    return new Promise(function(succeed, fail) {
        var request = new XMLHttpRequest();
        request.open('POST', url, true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.addEventListener('load', function() {
            if(request.status < 400) 
                succeed(request.responseText);
            else
                fail(new Error(`Request failed: ${request.statusText}`));
        });
        request.addEventListener('error', function() {
            fail(new Error('Network eror'));
        });
        request.send(requestBody);
    });
}

//Обработка формы перед её отправкой на сервер
button.addEventListener('click', function(event) {
    event.preventDefault();

    //Шаблон для проверки корректности формата Email
    let pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z{2,4}\.])?[a-z]{2,4}$/i;

    //переменные хранящие значение получение из полей формы
    let name = document.getElementById('nameField').value.trim(),
        email = document.getElementById('emailField').value.trim(),
        message = document.getElementById('messagefield').value.trim();

    //Строка с данными формы для отправки на сервер
    var requestData = `name=${name}&email=${email}&message=${message}`;

    //Валидация формы
    if(name.length != 0) {
        removeNotificationError(nameBlock);
        if(email.length != 0) {
            removeNotificationError(emailBlock);
            if(pattern.test(email)) {
                if(message.length != 0) {
                    removeNotificationError(messageBlock);
                    post(requestAddress, requestData).then(function(text) {
                        removeNotificationError(messageBlock);
                        let modalElem = document.getElementById('modal-message'),
                            modalText = modalElem.innerHTML = text;
                            openModalWindow();
                            closeModalWindow('modal-close');
                            form.reset();
                    }, function(error) {
                        let notificationSending = createNotificationError(error, 'alert alert--danger');
                        removeNotificationError(messageBlock);
                        addNotificationError(messageBlock, notificationSending);
                    });
                } else {
                    let notifyEmptyMessage = createNotificationError(notifyMessage.emptyMessage, 'alert alert--danger');
                    removeNotificationError(messageBlock);
                    addNotificationError(messageBlock, notifyEmptyMessage); 
                }
            } else {
                let notifyIncorrectFormatEmail = createNotificationError(notifyMessage.incorrectFormatEmail, 'alert alert--danger');
                removeNotificationError(emailBlock);
                addNotificationError(emailBlock, notifyIncorrectFormatEmail);
            }
        } else {
            let notifyEmptyEmail = createNotificationError(notifyMessage.emptyEmail, 'alert alert--danger');
            removeNotificationError(emailBlock);
            addNotificationError(emailBlock, notifyEmptyEmail);
        }
    }   else {
        let notifyEmptyPassword = createNotificationError(notifyMessage.emptyName, 'alert alert--danger');
        removeNotificationError(nameBlock);
        addNotificationError(nameBlock, notifyEmptyPassword);
    }
    
});


