import type { ComponentType } from "react";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";

import css from "./Pagination.module.css";

type ModuleWithDefault<T> = {
  default: T;
};

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
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
