import * as ReactPaginateModule from "react-paginate";
import type { ComponentType } from "react";
import css from "./Pagination.module.css";

interface ReactPaginateProps {
  pageCount: number;
  forcePage: number;
  onPageChange: (data: { selected: number }) => void;
  containerClassName: string;
  activeClassName: string;
  previousLabel: string;
  nextLabel: string;
  breakLabel: string;
  pageRangeDisplayed: number;
  marginPagesDisplayed: number;
}

const ReactPaginate = (
  ReactPaginateModule.default as unknown as {
    default: ComponentType<ReactPaginateProps>;
  }
).default;

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

function Pagination({ pageCount, currentPage, onPageChange }: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={pageCount}
      forcePage={currentPage - 1}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      containerClassName={css.pagination}
      activeClassName={css.active}
      previousLabel="←"
      nextLabel="→"
      breakLabel="..."
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
    />
  );
}

export default Pagination;
