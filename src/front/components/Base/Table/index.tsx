import Img from "next/image";
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

  function copyToClipboard(text: string) {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
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
                  if (typeof cell === "function")
                    return (
                      <td
                        className="up-table__button"
                        key={index}
                        onClick={cell}
                      >
                        {headers[index] === "Delete" && (
                          <Img src={trashSvg} alt="Trash" />
                        )}
                        {headers[index] === "Update" && (
                          <Img src={penSvg} alt="Pen" />
                        )}
                      </td>
                    );

                  return (
                    <td
                      onClick={() => {
                        copyToClipboard(cell);
                      }}
                      key={index}
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
