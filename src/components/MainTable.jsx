import { loginRequest } from "./../authConfig";
import {
  callMsGraph,
  callMsGraphForGrpSftp,
  callMsGraphForGrpSvc,
} from "./../graph";
import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import styled, { createGlobalStyle } from "styled-components"; // Add createGlobalStyle import
import StyledTable from "./Table";

const GlobalStyle = createGlobalStyle`
  @media print {
    .no-print {
      display: none !important;
    }
  }
`;

const MainTable = () => {
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState(null);
  const [groupSvcData, setGroupSvcData] = useState(null);
  const [groupSftpData, setGroupSftpData] = useState(null);
  const [data2, setData2] = useState([[]]);
  const [data3, setData3] = useState([[]]);
  const [selectedTab, setSelectedTab] = useState(1);

  const processData = (dataResponse, countStart) => {
    const updatedData = [[]];
    updatedData[0].push("Folder / Security Group");

    dataResponse[0].forEach((item, index) => {
      if (index > 0) updatedData[0].push(item);
    });

    let count = countStart;

    dataResponse[0].forEach((item, i) => {
      if (i > 0) {
        updatedData[i] = [item.slice(4), ...Array(count - 1).fill(""), "X"];
        count++;
      }
    });

    return updatedData;
  };

  const RequestProfileData = () => {
    instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      })
      .then((response) => {
        Promise.all([
          callMsGraph(response.accessToken),
          callMsGraphForGrpSvc(response.accessToken),
          callMsGraphForGrpSftp(response.accessToken),
        ])
          .then(
            ([
              graphDataResponse,
              groupSvcDataResponse,
              groupSftpDataResponse,
            ]) => {
              setGraphData(graphDataResponse);
              setGroupSvcData(groupSvcDataResponse);
              setGroupSftpData(groupSftpDataResponse);

              setData2(processData(graphDataResponse, 1));
              setData3(processData(groupSftpDataResponse, 1));
            }
          )
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      })
      .catch((error) => {
        console.error("Error acquiring token:", error);
      });
  };

  useEffect(() => {
    RequestProfileData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <GlobalStyle /> {/* Add GlobalStyle component here */}
      <Main>
        <TabContainer className="no-print">
          <Tab onClick={() => setSelectedTab(1)} active={selectedTab === 1}>
            S14 Permission Structure
          </Tab>
          <Tab onClick={() => setSelectedTab(2)} active={selectedTab === 2}>
            SFTP Permission Structure
          </Tab>
          <PrintButton onClick={handlePrint}>Print</PrintButton>
        </TabContainer>

        {selectedTab === 1 ? (
          <>
            {data2?.length > 0 ? (
              <TableSection>
                <Title>1. Folder authorisations by security groups</Title>
                <StyledTable data={data2} />
              </TableSection>
            ) : (
              <LoadingText>Loading...</LoadingText>
            )}

            {graphData ? (
              <TableSection>
                <Title>2. User names for group services</Title>
                <StyledTable data={graphData} />
              </TableSection>
            ) : (
              <LoadingText>Loading...</LoadingText>
            )}

            {groupSvcData ? (
              <TableSection>
                <Title>3. Group services for security groups</Title>
                <StyledTable data={groupSvcData} />
              </TableSection>
            ) : (
              <LoadingText>Loading Group Service Data...</LoadingText>
            )}
          </>
        ) : (
          <>
            {data3?.length > 0 ? (
              <TableSection>
                <Title>1. Folder authorisations by security groups</Title>
                <StyledTable data={data3} />
              </TableSection>
            ) : (
              <LoadingText>Loading...</LoadingText>
            )}

            {groupSftpData ? (
              <TableSection>
                <Title>2. Group services for security groups</Title>
                <StyledTable data={groupSftpData} />
              </TableSection>
            ) : (
              <LoadingText>Loading Group SFTP Data...</LoadingText>
            )}
          </>
        )}
      </Main>
    </>
  );
};

export default MainTable;

const Main = styled.div``;

const Title = styled.h2`
  margin-bottom: 30px;
  color: #333;
  text-align: left; /* Aligns the title to the left */
`;

const LoadingText = styled.p`
  font-size: 1rem;
  color: #999;
  text-align: left; /* Aligns the loading text to the left */
`;

const TabContainer = styled.div`
  padding: 20px;
  display: flex;
  justify-content: flex-start; /* Aligns tabs and button to the left */
  margin-bottom: 20px;
  gap: 20px; /* Adds space between the tabs and print button */
`;

const Tab = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  font-weight: bold;

  border-radius: 5px;
  background-color: ${(props) => (props.active ? "#ddd" : "white")};
  transition: background-color 0.3s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const TableSection = styled.div`
  margin-bottom: 50px; /* Increased margin to add more space between tables */
`;

const PrintButton = styled.button`
  padding: 10px 20px;
  background-color: #b3b3b3;
  color: black;
  font-size: 16px;
  border: 2px solid #ccc;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #dedede;
  }
`;
