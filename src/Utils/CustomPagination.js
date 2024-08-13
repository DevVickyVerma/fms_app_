import React from "react";
import Card from 'react-bootstrap/Card';
import Pagination from 'react-bootstrap/Pagination';

const CustomPagination = ({
    currentPage,
    lastPage,
    handlePageChange,
}) => {
    const maxPagesToShow = 3;
    const pages = [];

    // Calculate the range of pages to display
    let startPage = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 1);
    let endPage = Math.min(startPage + maxPagesToShow - 1, lastPage);

    // Handle cases where the range is near the beginning or end
    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(endPage - maxPagesToShow + 1, 1);
    }

    // Generate the page numbers
    for (let i = startPage; i <= endPage; i++) {
        pages.push(
            <Pagination.Item
                key={i}
                active={i === currentPage}
                onClick={() => handlePageChange(i)}
            >
                {i}
            </Pagination.Item>
        );
    }

    return (
        <Card.Footer className=" d-flex align-items-end justify-content-end">
            <div style={{ float: "right" }}>
                <Pagination>
                    <Pagination.First
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                    />
                    <Pagination.Prev
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    />
                    {startPage > 1 && <Pagination.Ellipsis />}
                    {pages}
                    {endPage < lastPage && <Pagination.Ellipsis />}
                    <Pagination.Next
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === lastPage}
                    />
                    <Pagination.Last
                        onClick={() => handlePageChange(lastPage)}
                        disabled={currentPage === lastPage}
                    />
                </Pagination>
            </div>
        </Card.Footer>
    );
};

export default CustomPagination;
