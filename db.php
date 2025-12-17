<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();

$host = "localhost";
$user = "HayaS";
$pass = "H@y@2003";
$db_name = "flower_market";

$con = mysqli_connect($host, $user, $pass, $db_name);

if (mysqli_connect_errno()) {
    die("Connection failed: " . mysqli_connect_error());
}

if (isset($_POST['login_btn'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $enc_password = md5($password);

    $sql = "SELECT * FROM users WHERE username = '$username' AND password = '$enc_password'";
    $result = mysqli_query($con, $sql);

    if (mysqli_num_rows($result) == 1) {
        echo "<script>
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', '$username');
            alert('Login Successful!');
            window.location.href = 'home.html';
        </script>";
    } else {
        echo "<script>
            alert('Wrong username or password');
            window.location.href = 'login.html';
        </script>";
    }
}

if (isset($_POST['signup_btn'])) {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $confirm = $_POST['confirm_password'];

    if ($password != $confirm) {
        echo "<script>alert('Passwords do not match'); window.location.href='signup.html';</script>";
        exit();
    }

    $enc_password = md5($password);
    
    $sql = "INSERT INTO users (username, email, password) VALUES ('$username', '$email', '$enc_password')";
    
    if (mysqli_query($con, $sql)) {
        echo "<script>alert('Account created! Please login.'); window.location.href='login.html';</script>";
    } else {
        echo "Error: " . mysqli_error($con);
    }
}

if (isset($_GET['logout'])) {
    session_destroy();
    echo "<script>
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        alert('You have been logged out.');
        window.location.href = 'login.html';
    </script>";
}

if (isset($_POST['reset_btn'])) {
    $email = $_POST['email'];
    $new_password = $_POST['new_password'];
    $confirm_password = $_POST['confirm_new_password'];

    if ($new_password !== $confirm_password) {
        echo "<script>alert('Passwords do not match'); window.location.href='forgot-password.html';</script>";
        exit();
    }

    $check_email = "SELECT * FROM users WHERE email = '$email'";
    $result = mysqli_query($con, $check_email);

    if (mysqli_num_rows($result) > 0) {
        $enc_password = md5($new_password);
        $update_sql = "UPDATE users SET password = '$enc_password' WHERE email = '$email'";
        
        if (mysqli_query($con, $update_sql)) {
            echo "<script>alert('Password reset successful! Please login.'); window.location.href='login.html';</script>";
        } else {
            echo "Error updating record: " . mysqli_error($con);
        }
    } else {
        echo "<script>alert('Email not found!'); window.location.href='forgot-password.html';</script>";
    }
}
?>