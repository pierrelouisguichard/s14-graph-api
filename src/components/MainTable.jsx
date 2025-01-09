import { loginRequest } from "./../authConfig";
import {
  callMsGraph,
  callMsGraphForGrpSftp,
  callMsGraphForGrpSvc,
} from "./../graph";
import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import styled from "styled-components";
import StyledTable from "./Table";
import PrintCoverPage from "./PrintCoverPage";

const MainTable = () => {
  const [showPrintableArea, setShowPrintableArea] = useState(false);

  const handlePrint = () => {
    setShowPrintableArea(true); // Make the printable area visible for printing

    const printableArea = document.getElementById("printable-area");
    if (printableArea) {
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = printableArea.innerHTML;
      window.print();
      document.body.innerHTML = originalContent;
    }

    setShowPrintableArea(false); // Hide the printable area again after printing
  };

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
        const updatedItem = item.split("_").slice(2).join("_");
        updatedData[i] = [updatedItem, ...Array(count - 1).fill(""), "X"];
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

  return (
    <>
      <TabContainer>
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

      {/* This div will only be visible for printing */}
      <Print id="printable-area" show={showPrintableArea}>
        <PrintCoverPage />
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
        {data3?.length > 0 ? (
          <TableSection>
            <Title>4. Folder authorisations by security groups</Title>
            <StyledTable data={data3} />
          </TableSection>
        ) : (
          <LoadingText>Loading...</LoadingText>
        )}

        {groupSftpData ? (
          <TableSection>
            <Title>5. Group services for security groups</Title>
            <StyledTable data={groupSftpData} />
          </TableSection>
        ) : (
          <LoadingText>Loading Group SFTP Data...</LoadingText>
        )}
      </Print>
    </>
  );
};

export default MainTable;

const Print = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  @media print {
    display: block;
  }
`;

const Title = styled.h2`
  margin-bottom: 40px;
  color: #333;
  text-align: left;

  @media print {
    page-break-before: always;
    margin-top: 40px;
    font-size: 20px;
  }
`;

const LoadingText = styled.p`
  font-size: 1rem;
  color: #999;
  text-align: left;

  @media print {
    page-break-before: always;
    margin: 20px 40px;
  }
`;

const TabContainer = styled.div`
  padding: 10px;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 30px;

  @media print {
    page-break-before: always;
    margin: 40px;
  }
`;

const Tab = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  border-radius: 8px 8px 0 0;
  background-color: ${(props) => (props.active ? "#074352" : "#f1f3f4")};
  color: ${(props) => (props.active ? "white" : "#202124")};
  border: ${(props) =>
    props.active ? "2px solid #074352" : "1px solid #e0e0e0"};
  box-shadow: ${(props) =>
    props.active ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none"};
  transition: background-color 0.3s, color 0.3s, border 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: ${(props) => (props.active ? "#12697f" : "#e8f0fe")};
  }

  &:focus {
    outline: none;
    border: 2px solid #074352;
  }

  @media print {
    page-break-inside: avoid;
  }
`;

const TableSection = styled.div`
  margin-bottom: 60px;

  @media print {
    page-break-before: always;
    page-break-inside: avoid;
  }
`;

const PrintButton = styled.button`
  margin-left: 100px;
  padding: 10px 20px;
  background-color: #b3b3b3;
  color: black;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #dedede;
  }

  @media print {
    display: none;
  }
`;
