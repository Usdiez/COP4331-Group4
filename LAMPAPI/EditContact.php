<?php
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
