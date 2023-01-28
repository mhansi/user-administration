import { useEffect, useState } from "react";
import { Pagination } from "react-bootstrap";

interface Props {
  totalNumberOfPages: number;
  currentPage: number;
  currectPageHandle: (i: number) => void;
}

const PaginationBar = ({
  totalNumberOfPages,
  currentPage,
  currectPageHandle,
}: Props) => {
  const [paginationItems, setPaginationItems] = useState<number[]>([]);
  
  useEffect(() => {
    const savedCurrentPage = localStorage.getItem("currentPage");
    if (savedCurrentPage) currectPageHandle(Number(savedCurrentPage));
  }, [currectPageHandle]);

  useEffect(() => {
    const items: number[] = [];
    for (let i = 1; i <= totalNumberOfPages; i++) items.push(i);

    setPaginationItems(items);
  }, [currectPageHandle, currentPage, totalNumberOfPages]);

  return (
    <Pagination>
      {paginationItems.map((item: number) => (
        <Pagination.Item
          key={item}
          active={item === currentPage}
          onClick={() => currectPageHandle(item)}
        >
          {item}
        </Pagination.Item>
      ))}
    </Pagination>
  );
};

export default PaginationBar;
