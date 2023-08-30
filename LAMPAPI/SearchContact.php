<?php

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
		$stmt = $conn->prepare("select FirstName, LastName, Email, PhoneNumber from Contacts where FirstName like ? and LastName like ? and Email like ? and PhoneNumber like ? and UserID=?");
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
			$rowFirstName = $row["FirstName"];
            $rowLastName = $row["LastName"];
            $rowEmail = $row["Email"];
            $rowPhoneNumber = $row["PhoneNumber"];
			$searchResults .= '{' . '"firstName":' . '"' . $rowFirstName . '",' . '"lastName":' . '"' . $rowLastName . '",' . '"email":' . '"' . $rowEmail . '",' . '"phoneNumber":' . '"' . $rowPhoneNumber . '"' . '}';
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