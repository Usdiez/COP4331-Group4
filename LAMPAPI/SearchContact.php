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

	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$email = $inData["email"];
	$phoneNumber = $inData["phoneNumber"];
	$userId = $inData["userId"];

	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "apiUser", "COP4331Gfour", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("select ID, FirstName, LastName, Email, PhoneNumber from Contacts where FirstName like ? and LastName like ? and Email like ? and PhoneNumber like ? and UserID=?");
		$firstName = "%" . $firstName . "%";
		$lastName = "%" . $lastName . "%";
		$email = "%" . $email . "%";
		$phoneNumber = "%" . $phoneNumber . "%";
		$stmt->bind_param("ssssi", $firstName, $lastName, $email, $phoneNumber, $userId);
		$stmt->execute();

		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$rowID = $row["ID"];
			$rowFirstName = $row["FirstName"];
            $rowLastName = $row["LastName"];
            $rowEmail = $row["Email"];
            $rowPhoneNumber = $row["PhoneNumber"];
			$searchResults .= '{' . '"ID":' . '"' . $rowID . '",' . '"firstName":' . '"' . $rowFirstName . '",'  . '"lastName":' . '"' . $rowLastName . '",' . '"email":' . '"' . $rowEmail . '",' . '"phoneNumber":' . '"' . $rowPhoneNumber . '"' . '}';
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
		}
		
		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>