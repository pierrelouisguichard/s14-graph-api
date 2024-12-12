import React from "react";
import styled from "styled-components";

const Table = styled.table`
  margin: 100px auto 200px; /* Centers the table horizontally and adds margin-top and margin-bottom */
  font-size: 16px;
  width: 70%;
  color: #074352;
  /* border-collapse: collapse; */
  /* Optionally, use flexbox for centering vertically */
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #e3cfb6;
  }
`;

const TableCell = styled.td`
  border: 2px solid #c9a271;
  padding: 8px;
  text-align: center;
  width: 30px;

  &:hover {
    background-color: #e6f7ff;
  }
`;

const TableHeader = styled.th`
  padding: 11px;
  text-align: center;
`;

const RotateHeader = styled(TableHeader)`
  height: 145px;
  white-space: nowrap;
  text-align: left;
`;

const RotateDiv = styled.div`
  transform: translate(25px, 51px) rotate(315deg);
  width: 30px;
  text-align: center;
`;

const HeaderSpan = styled.span`
  border-bottom: 2px solid #c9a271;
  padding: 9px 10px 5px 10px;
`;

// Helper to generate columns
const generateColumns = (cols, data) => {
  return Array.from({ length: cols - 1 }, (_, colIndex) => (
    <RotateHeader key={colIndex}>
      <RotateDiv>
        <HeaderSpan>{data[0][colIndex + 1]}</HeaderSpan>
      </RotateDiv>
    </RotateHeader>
  ));
};

// Helper to generate rows
const generateRows = (rows, cols, data) => {
  return Array.from({ length: rows - 1 }, (_, rowIndex) => (
    <TableRow key={rowIndex}>
      <TableHeader>{data[rowIndex + 1][0]}</TableHeader>
      {Array.from({ length: cols - 1 }, (_, colIndex) => (
        <TableCell key={colIndex}>{data[rowIndex + 1][colIndex + 1]}</TableCell>
      ))}
    </TableRow>
  ));
};

// React Component
const StyledTable = ({ data }) => {
  const rows = data.length;
  const cols = data[0].length;

  return (
    <Table>
      <thead>
        <TableRow>
          <TableHeader>{data[0][0]}</TableHeader>
          {generateColumns(cols, data)}
        </TableRow>
      </thead>
      <tbody>{generateRows(rows, cols, data)}</tbody>
    </Table>
  );
};

export default StyledTable;
