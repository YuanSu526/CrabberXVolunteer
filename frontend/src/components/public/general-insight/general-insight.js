import React, { useState, useEffect } from 'react';
import './general-insight.css';
import TableComponent from './TableComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import MenuBar from '../menuBar/menuBar'

const apiUrl = process.env.REACT_APP_API_URL;
console.log('URL: ', apiUrl);

const GeneralInsight = () => {

    const [tables, setTables] = useState([]);
    const [columns, setColumns] = useState([]);
    const [selectedTable, setSelectedTable] = useState('');
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [displayedColumns, setDisplayedColumns] = useState([]);
    const [fetchedData, setFetchedData] = useState([]);
    const [avgStudiedCrabs, setAvgStudiedCrabs] = useState(null);
    const [trapIDs, setTrapIDs] = useState([]);
  
    useEffect(() => {

        const fetchTables = async () => {

            const tableNames = await Service.fetchTables();

            if (tableNames) {

                setTables(tableNames); 

            } else {

                console.error('Table is not found');
    
            }
        };

        fetchTables();

    }, []);

    const handleTableChange = async (e) => {

        const tableName = e.target.value;

        setSelectedTable(tableName);

        const columnNames = await Service.fetchColumns(tableName);

        if (columnNames) {

            setColumns(columnNames);

        } else {

            console.error('No columns found for table: ', tableName);

        }

        setSelectedColumns([]);
        setFetchedData([]);
        setAvgStudiedCrabs(null);
        setTrapIDs([]);

    };

    const handleColumnChange = (e) => {

        const { value, checked } = e.target;

        if (checked) {

            setSelectedColumns([...selectedColumns, value]);

        } else {

            setSelectedColumns(selectedColumns.filter((columnName) => columnName !== value));

        }
    };

    const handleSelectAllColumn = (e) => {

        if (e.target.checked) {

            setSelectedColumns(columns);

        } else {

            setSelectedColumns([]);

        }
    };

    const handleFetchData = async () => {

        if (!selectedTable) {

            alert('Please select a table');

        } else if (selectedColumns.length === 0) {

            alert('Please select at least one column');

        } else {

            if (selectedTable === 'VOLUNTEER') {

                const data = await Service.fetchAvgVolunteerStudiedCrabs();

                if (data.success) {

                    setAvgStudiedCrabs(data.avgStudiedCrabs);

                } else {

                    alert('Uable to fetch average number of crabs studied by all volunteers');

                }
            }

            if (selectedTable === 'TRAP') {

                console.log("Fetching special traps that caught all five crabs")

                const data = await Service.fetchSpecialTrapIDs();

                if (data) {

                    console.log("Data returned");
                    console.log(data);

                    if (data.success) {

                        const formattedIDs = data.trapIDs.map(trapID => ({ 'Trap ID': trapID }));
                        setTrapIDs(formattedIDs);
    
                    } else {
    
                        alert('Uable to fetch special traps that caught all five crabs');
    
                    }
                } else {
    
                    alert('Uable to fetch special traps that caught all five crabs');

                }
                
                
            }

            const data = await Service.fetchData(selectedTable, selectedColumns);

            if (data) {

                setDisplayedColumns(selectedColumns);

                const dataWithColNames = data.map(row => {

                    return selectedColumns.reduce((obj, col, index) => {

                        obj[col] = row[index];
                        return obj;

                    }, {});
                });

                setFetchedData(dataWithColNames);

            } else {

                console.error('No data found for the selected table and columns.');

            }
        }
    };


  
    return (
        <div className="general-insight-container">
            <MenuBar />
            <div className='content'>
                <div className="dropdown-container">
                    <label htmlFor="tables">Select Table: </label>
                    <select id="tables" onChange={handleTableChange} value={selectedTable}>
                        <option value="" disabled>Select a table</option>
                        {tables.map((table, index) => (
                            <option key={index} value={table}>{table}</option>
                        ))}
                    </select>
                </div>
                {selectedTable && columns.length > 0 && (
                    <div className="columns-container">
                        <label>Select Columns:</label>
                        <div className="columns-scrollable">
                            <div>
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAllColumn}
                                    checked={selectedColumns.length === columns.length}
                                />
                                <label>Select All</label>
                            </div>
                            {columns.map((column, index) => (
                                <div key={index}>
                                    <input
                                        type="checkbox"
                                        value={column}
                                        onChange={handleColumnChange}
                                        checked={selectedColumns.includes(column)}
                                    />
                                    <label>{column}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <button className='action-button' onClick={handleFetchData}>Fetch Data</button>
                {fetchedData.length > 0 && (
                    <div className="data-table-container">
                        <TableComponent columns={displayedColumns} data={fetchedData} />
                    </div>
                )}
                {avgStudiedCrabs &&
                    (<p className="avg-crabs-studied">
                        <span className="attribute-name">Average number of crabs studied by all volunteers:</span> 
                        <strong className="value">{avgStudiedCrabs}</strong>
                    </p>)
                }
                {trapIDs.length > 0 &&
                    (<div className="special-traps">
                    <span className="attribute-name">IDs of traps that have caught all 5 types of crabs:</span>
                        <div className="data-table-container">
                            <TableComponent columns={['Trap ID']} data={trapIDs} />
                        </div>
                    </div>
                    )
                }
            </div>
        </div>
    );
};

var Service = {};

Service.fetchTables = async function() {

    try {
        const response = await fetch(`${apiUrl}/tables`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        console.log('tables:', data);

        return data.tables;

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

Service.fetchColumns = async function(tableName) {

    try {
        const response = await fetch(`${apiUrl}/columns?table=${tableName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        console.log('columns:', data);

        return data.columns;

    } catch (error) {
        console.error('Error fetching columns:', error);
    }
};

Service.fetchData = async function(tableName, columns) {
    try {
        const response = await fetch(`${apiUrl}/data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ table: tableName, columns })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        console.log('Fetched data:', data);

        return data.rows;

    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

Service.fetchAvgVolunteerStudiedCrabs = async function() {

    try {
        const response = await fetch(`${apiUrl}/volunteer/avgStudiedCrabs`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        return data;

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

Service.fetchSpecialTrapIDs = async function() {

    try {
        const response = await fetch(`${apiUrl}/trap/caughtAll3Crabs`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        return data;

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export default GeneralInsight
