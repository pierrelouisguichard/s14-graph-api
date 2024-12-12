import { loginRequest } from "./../authConfig";
import { callMsGraph, callMsGraphForGrpSvc } from "./../graph";
import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import styled from "styled-components";
import StyledTable from "./Table";

/**
 * Renders information about the signed-in user or a button to retrieve data about the user
 */
const MainTable = () => {
  const data = [
    [
      "Folder / Security Group",
      "grp_00_S14-Public",
      "grp_01_Management",
      "grp_02_Corporate",
      "grp_03_Broker",
      "grp_04_Compliance",
      "grp_05_Finance",
      "grp_06_Funds",
      "grp_07_HR",
      "grp_08_Marketing",
      "grp_09_BusinessDev",
      "grp_10_IT-Dev",
      "grp_11_Research",
      "grp_12_Staff-Training",
      "grp_13_IT-General",
      "grp_14_IT-Management",
    ],
    ["00_S14-Public", "X", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["01_Management", "", "X", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["02_Corporate", "", "", "X", "", "", "", "", "", "", "", "", "", "", ""],
    ["03_Brokers", "", "", "", "X", "", "", "", "", "", "", "", "", "", ""],
    ["04_Compliance", "", "", "", "", "X", "", "", "", "", "", "", "", "", ""],
    ["05_Finance", "", "", "", "", "", "X", "", "", "", "", "", "", "", ""],
    ["06_Funds", "", "", "", "", "", "", "X", "", "", "", "", "", "", ""],
    ["07_HR", "", "", "", "", "", "", "", "X", "", "", "", "", "", ""],
    ["08_Marketing", "", "", "", "", "", "", "", "", "X", "", "", "", "", ""],
    [
      "09_Business-Dev",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "X",
      "",
      "",
      "",
      "",
    ],
    ["10_IT-Dev", "", "", "", "", "", "", "", "", "", "", "X", "", "", ""],
    ["11_Research", "", "", "", "", "", "", "", "", "", "", "", "X", "", ""],
    [
      "12_Staff-Training",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "X",
      "",
    ],
    [
      "13_IT-General",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "X",
      "",
    ],
    [
      "14_IT-Management",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "X",
    ],
  ];
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState(null);
  const [groupSvcData, setGroupSvcData] = useState(null); // State for second table

  function RequestProfileData() {
    // Silently acquires an access token which is then attached to a request for MS Graph data
    instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      })
      .then((response) => {
        // Request data for both tables
        callMsGraph(response.accessToken).then((response) =>
          setGraphData(response)
        );
        callMsGraphForGrpSvc(response.accessToken).then((response) =>
          setGroupSvcData(response)
        );
      });
  }

  useEffect(() => {
    RequestProfileData();
  }, []);

  return (
    <>
      <CardTitle>Welcome {accounts[0].name}</CardTitle>
      <h2>1. Folder authorisations by security groups</h2>
      <StyledTable data={data} />
      {graphData ? (
        <div>
          <h2>2. User names for groups services</h2>
          <StyledTable data={graphData} />
        </div>
      ) : (
        <LoadingText>Loading...</LoadingText>
      )}

      {groupSvcData ? (
        <div>
          <h2>3. Group services for security groups</h2>
          <StyledTable data={groupSvcData} />
        </div>
      ) : (
        <LoadingText>Loading Group Service Data...</LoadingText>
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

const LoadingText = styled.p`
  font-size: 1rem;
  color: #999;
  text-align: center;
`;
