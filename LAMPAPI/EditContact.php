<?php

// DISABLE CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
    header('Access-Control-Allow-Headers: token, Content-Type');
    header('Access-Control-Max-Age: 1728000');
    header('Content-Length: 0');
    header('Content-Type: text/plain');
    die();
}

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT');

$inData = getRequestInfo();

$userId = $inData["userId"];
$id = $inData["id"];
$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$email = $inData["email"];
$phoneNumber = $inData["phoneNumber"];

$conn = new mysqli("localhost", "apiUser", "COP4331Gfour", "COP4331"); 
if ($conn->connect_error) 
{
    returnWithError( $conn->connect_error );
} 
else
{
    // First, check if the contact with the provided ID belongs to the given user.
    $checkQuery = $conn->prepare("SELECT * FROM Contacts WHERE ID = ? AND UserID = ?");
    $checkQuery->bind_param("ii", $id, $userId);
    $checkQuery->execute();
    $result = $checkQuery->get_result();

    if ($result->num_rows === 0) {
        returnWithError("Contact not found or does not belong to the user.");
    } else {
        // If the contact belongs to the user, update its details.
        $updateQuery = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Email=?, PhoneNumber=? WHERE ID = ?");
        $updateQuery->bind_param("ssssi", $firstName, $lastName, $email, $phoneNumber, $id);
        $updateQuery->execute();
        $updateQuery->close();
        returnWithError("");
    }

    $checkQuery->close();
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}
?>
