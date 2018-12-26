<?php

    $name = "unknown";
    $email = "unknown";
    $message = "unknown";

    if(!empty($_POST)) {
        if(isset($_POST['name']) && isset($_POST['email']) && isset($_POST['message'])) {
            $name = $_POST['name'];
            $email = $_POST['email'];
            $message = $_POST['message'];
            $messageMail = "Вам пришло новое сообщение с сайта: \n" 
            . "Имя отправителя: $name \n"
            . "Email отправителя: $email \n"
            . "Сообщение:\n$message";
            $toMail = "companyMail@info.com";
            $FromMail = "From: $email";
            $resultSending = mail($toMail, 'Сообщение с сайта', $messageMail, $FromMail);

            if($resultSending) {
                echo "Форма отправлена успешно!";
            } else {
                echo "Ошибка! Что-то пошло не так.";
            }
        }
    } else {
        echo "Ошибка отправки данных!";
    }

?>