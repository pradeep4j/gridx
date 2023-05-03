
import React from 'react';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import './style.css';

const columns = [
  { header: 'First Name', key: 'firstName' },
  { header: 'Last Name', key: 'lastName' },
  { header: 'Purchase Price', key: 'purchasePrice' },
  { header: 'Payments Made', key: 'paymentsMade' }
];

const data = [
  {
    firstName: 'Kylie',
    lastName: 'James',
    purchasePrice: 1000,
    paymentsMade: 900
  },
  {
    firstName: 'Harry',
    lastName: 'Peake',
    purchasePrice: 1000,
    paymentsMade: 1000
  }
];

const workSheetName = 'Worksheet-1';
const workBookName = 'MyWorkBook';
const myInputId = 'myInput';

export default function App() {
  const workbook = new Excel.Workbook();

  const saveExcel = async () => {
    try {
      const myInput = document.getElementById(myInputId);
      const fileName = myInput.value || workBookName;

      // creating one worksheet in workbook
      const worksheet = workbook.addWorksheet(workSheetName);

      // add worksheet columns
      // each columns contains header and its mapping key from data
      worksheet.columns = columns;

      // updated the font for first row.
      worksheet.getRow(1).font = { bold: true };

      // loop through all of the columns and set the alignment with width.
      worksheet.columns.forEach(column => {
        column.width = column.header.length + 5;
        column.alignment = { horizontal: 'center' };
      });

      // loop through data and add each one to worksheet
      data.forEach(singleData => {
        worksheet.addRow(singleData);
      });

      // loop through all of the rows and set the outline style.
      worksheet.eachRow({ includeEmpty: false }, row => {
        // store each cell to currentCell
        const currentCell = row._cells;

        // loop through currentCell to apply border only for the non-empty cell of excel
        currentCell.forEach(singleCell => {
          // store the cell address i.e. A1, A2, A3, B1, B2, B3, ...
          const cellAddress = singleCell._address;

          // apply border
          worksheet.getCell(cellAddress).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      });

      // write the content using writeBuffer
      const buf = await workbook.xlsx.writeBuffer();

      // download the processed file
      saveAs(new Blob([buf]), `${fileName}.xlsx`);
    } catch (error) {
      console.error('<<<ERRROR>>>', error);
      console.error('Something Went Wrong', error.message);
    } finally {
      // removing worksheet's instance to create new one
      workbook.removeWorksheet(workSheetName);
    }
  };

  return (
    <>
      <style>
        {`
          table, th, td {
            border: 1px solid black;
            border-collapse: collapse;
            textAlign: center;
          }
           th, td { 
             padding: 4px;
           }
        `}
      </style>
      <div style={{ textAlign: 'center' }}>
        <div>
          Export to excel from table
          <br />
          <br />
          Export to : <input id={myInputId} defaultValue={workBookName} /> .xlsx
        </div>

        <br />
        <div>
          <button onClick={saveExcel}>Export</button>
        </div>

        <br />

        <div>
          <table style={{ margin: '0 auto' }}>
            <tr>
              {columns.map(({ header }) => {
                return <th>{header}</th>;
              })}
            </tr>

            {data.map(uniqueData => {
              return (
                <tr>
                  {Object.entries(uniqueData).map(eachData => {
                    const value = eachData[1];
                    return <td>{value}</td>;
                  })}
                </tr>
              );
            })}
          </table>
        </div>
      </div>
    </>
  );
}
