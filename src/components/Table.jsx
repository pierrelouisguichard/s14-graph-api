import React from "react";
import styled from "styled-components";

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
    <>
      <table>
        <thead>
          <TableRow>
            <TableHeader>{data[0][0]}</TableHeader>
            {generateColumns(cols, data)}
          </TableRow>
        </thead>
        <tbody>{generateRows(rows, cols, data)}</tbody>
      </table>
    </>
  );
};

export default StyledTable;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #e3cfb6;
  }
`;

const TableCell = styled.td`
  border: 1px solid #c9a271;
  text-align: center;

  &:hover {
    background-color: #e6f7ff;
  }
`;

const TableHeader = styled.th`
  padding: 3px 9px;
  text-align: left;
`;

const RotateHeader = styled(TableHeader)`
  height: 145px;
  white-space: nowrap;
  text-align: left;
`;

const RotateDiv = styled.div`
  transform: translate(9px, 55px) rotate(315deg);
  width: 15px;
  text-align: center;
`;

const HeaderSpan = styled.span`
  border-bottom: 1px solid #c9a271;
  padding: 20px 10px 0px 2px;
  display: inline-block;
  max-width: 200px; /* Maximum width for the header */
  white-space: nowrap; /* Prevents text from wrapping */
  overflow: hidden; /* Hides overflowing text */
  text-overflow: ellipsis; /* Adds '...' for overflowing text */
`;
