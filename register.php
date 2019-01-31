<?php
session_start();
$name=$_POST['name'];
$email=$_POST['email'];
$username=$_POST['username'];
$password=$_POST['password'];
$conn = mysqli_connect("localhost","root","","medicine");
if(!$conn){  
  die('Could not connect: '.mysqli_connect_error());  
}


$sql = "INSERT INTO customer(`name`, `email`,  `username`, `password`) VALUES ('$name', '$email', '$username', '$password')";
if(mysqli_query($conn, $sql))
{  
echo "<script language = javascript>
                swal({  title: 'Registration Successful',
                type: 'success', 
                 timer: 1000,   showConfirmButton: false,   
                showCancelButton: false,   
                showLoaderOnConfirm: true, }, 
                function(){   
                    setTimeout(function(){     
                        header('location : reg.html');  
                    });
                     });
            </script>";





}
else
{  
  echo "Could not insert record: ". mysqli_error($conn);  
}

mysqli_close($conn); 

?>

