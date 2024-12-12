import { loginRequest } from "./../authConfig";
import { callMsGraph } from "./../graph";
import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import styled from "styled-components";

/**
 * Renders information about the signed-in user or a button to retrieve data about the user
 */
const MainTable = () => {
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState(null);

  function RequestProfileData() {
    // Silently acquires an access token which is then attached to a request for MS Graph data
    instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      })
      .then((response) => {
        callMsGraph(response.accessToken).then((response) =>
          setGraphData(response)
        );
      });
  }

  useEffect(() => {
    RequestProfileData();
  }, []);

  return (
    <>
      <CardTitle>Welcome {accounts[0].name}</CardTitle>
      {graphData ? (
        <Table>
          <thead>
            <tr>
              {graphData[0].map((header, index) => (
                <TableHeader key={index}>{header}</TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {graphData.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>{cell}</TableCell>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <LoadingText>Loading...</LoadingText>
      )}
    </>
  );
};

export default MainTable;

const CardTitle = styled.h5`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  background-color: #f2f2f2;
  padding: 10px;
  text-align: left;
  font-weight: bold;
  border: 1px solid #ddd;
`;

const TableCell = styled.td`
  max-width: 50px;
  max-height: 50px;
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
`;

const LoadingText = styled.p`
  font-size: 1rem;
  color: #999;
  text-align: center;
`;
