import Img from "next/image";
import Link from "next/link";
import penSvg from "../../../../../public/images/pen-solid.svg";
import trashSvg from "../../../../../public/images/trash-solid.svg";

interface ITableProps {
  title: string;
  headers: string[];
  data: [][];
  isLoading: boolean;
}

export const Table = ({ title, headers, data, isLoading }: ITableProps) => {
  function prepareHeader(header: string) {
    return header
      .replace(/^_/, "")
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  }

  return (
    <div className="up-table">
      <h2>{title}</h2>
      {!isLoading && (
        <table>
          <thead>
            <tr>
              {headers.map((header: string, index: number) => (
                <th key={index}>{prepareHeader(header)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row: any[], index: number) => (
              <tr key={index}>
                {row.map((cell, index) => {
                  if (index === row.length - 2)
                    return (
                      <td key={index} onClick={cell}>
                        <Img src={penSvg} alt="Pen" />
                      </td>
                    );

                  if (index === row.length - 1)
                    return (
                      <td key={index} onClick={cell}>
                        <Img src={trashSvg} alt="Trash" />
                      </td>
                    );

                  return <td key={index}>{cell}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
