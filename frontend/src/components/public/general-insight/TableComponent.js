import React from 'react';
import PropTypes from 'prop-types';
import './TableComponent.css';

const TableComponent = ({ columns = [], data = [] }) => {
    if (data.length === 0 || columns.length === 0) return null;

    return (
        <div className="table-responsive">
            <table className="custom-table">
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((col, colIndex) => (
                                <td key={colIndex}>{row[col]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

TableComponent.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string),
    data: PropTypes.arrayOf(PropTypes.object)
};

export default TableComponent;