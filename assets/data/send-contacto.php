<?php 
   // print_r($_POST);
    
    error_reporting( E_ALL );
    ini_set('display_errors', 1);
    
    setlocale(LC_ALL,"es_ES");

// RECUPERO CAMPOS DEL FORM

    $post_requestdate = date("Y-m-d H:i:s");
    $form_area = isset($_REQUEST['area'])? $_REQUEST['area'] : '';
    $form_name = isset($_REQUEST['nombre'])? $_REQUEST['nombre'] : '';
    $form_lastname = isset($_REQUEST['apellido'])? $_REQUEST['apellido'] : '';
    $form_business = isset($_REQUEST['empresa'])? $_REQUEST['empresa'] : '';
    $form_email = isset($_REQUEST['email'])? $_REQUEST['email'] : '';
    $form_message = isset($_REQUEST['mensaje'])? $_REQUEST['mensaje'] : '';

    $message = '<html><body>';
    $message .= '<h1>Formulario de Contacto de alliance.com</h1>';
    $message .= '<table rules="all" style="border-color: #E8E8E8; width:100%" cellpadding="10" width="100%">';
    $message .= "<tr><td><strong>Enviado:</strong> </td><td>" . $post_requestdate . "</td></tr>";
    $message .= "<tr><td><strong>Área:</strong> </td><td>" . strip_tags($form_area) . "</td></tr>";
    $message .= "<tr><td><strong>Nombre:</strong> </td><td>" . strip_tags($form_name) . "</td></tr>";
    $message .= "<tr><td><strong>Apellido:</strong> </td><td>" . strip_tags($form_lastname) . "</td></tr>";
    $message .= "<tr><td><strong>Empresa:</strong> </td><td>" . strip_tags($form_business) . "</td></tr>";
    $message .= "<tr><td><strong>Email:</strong> </td><td>" . strip_tags($form_email) . "</td></tr>";
    $message .= "<tr><td><strong>Mensaje:</strong> </td><td>" . strip_tags($form_message) . "</td></tr>";
    $message .= "</table>";
    $message .= "</body></html>";

//CON PHPMAILER

define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', '465');
define('SMTP_SECURE', 'ssl');
define('IS_HTML', true);
define('SMTPAUTH', true);// true o false, dejar false en caso de que no se necesite login
define('SMTP_USERNAME', 'mailer@e-gate.com.ar');
define('SMTP_PASSWORD', 'egate2fast');
define('SMTP_FROM', 'mailer@e-gate.com.ar');
define('SMTP_FROMNAME', 'alliance Web');

$to= "pablo@agenciacapitan.com";
//$to = "web@allianceprotects.com";
$subject = 'alliance.com - Contacto de ' . $form_name.' '.$form_lastname;
$texto = $message;
        
        include'class/class.smtp.php';
        include'class/class.phpmailer.php';
            $mail = new phpmailer();

            $mail->CharSet = 'UTF-8';
            $mail->PluginDir = "class/";
            $mail->Mailer = "smtp";
            $mail->Host = SMTP_HOST;
            $mail->Port = SMTP_PORT;
            $mail->SMTPAuth = SMTPAUTH;
            $mail->SMTPSecure = SMTP_SECURE;
            $mail->Username = SMTP_USERNAME;
            $mail->Password = SMTP_PASSWORD;
            $mail->IsHTML(IS_HTML);
            //$mail->SMTPDebug = 2;
            //Indicamos cual es nuestra dirección de correo y el nombre que 
            //queremos que vea el usuario que lee nuestro correo
            $mail->From = SMTP_FROM;
            $mail->FromName = SMTP_FROMNAME;

            //Indicamos cual es la dirección de destino del correo
            $mail->AddAddress($to);

            //Asignamos asunto y cuerpo del mensaje
            $mail->Subject = $subject;
            $mail->Body = $texto;

            $sendResult = $mail->Send();

            if ($sendResult) {
                echo "OK";
            } else {
                echo "FAIL";
            }









?>
