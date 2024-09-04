import React, {useState, useEffect} from 'react';
import './crab-insight.css';
import MenuBar from '../menuBar/menuBar';
import Dropdown from './dropDown/dropDown';
import NumberInput from './numberInput/numberInput';

const CrabInsight = () => {

    const apiUrl = process.env.REACT_APP_API_URL;

    const [selectedSpecies, setSelectedSpecies] = useState('');
    const [selectedSex, setSelectedSex] = useState('');
    const [selectedInjuries, setSelectedInjuries] = useState('');
    const [selectedQueryMode, setSelectedQueryMode] = useState('Regular');
    const [selectedBaitType, setSelectedBaitType] = useState('');
    const [selectedRequirement, setSelectedRequirement] = useState('');
    const [minSize, setMinSize] = useState('');
    const [minCaught, setMinCaught] = useState('');

    const [fetchedData, setFetchedData] = useState([]);

    const species = [
        { value: '', label: 'Unspecified'},
        { value: 'Dungeness', label: 'Dungeness' },
        { value: 'Red rock', label: 'Red Rock' },
        { value: 'Graceful', label: 'Graceful' },
        { value: 'Green', label: 'Green' },
        { value: 'Shore', label: 'Shore' },
    ];

    const sex = [
        { value: '', label: 'Unspecified'},
        { value: 'M', label: 'Male'},
        { value: 'F', label: 'Female'},
    ];

    const injuries = [
        { value: '', label: 'Unspecified'},
        { value: 'Y', label: 'Injuries'},
        { value: 'N', label: 'No Injuries'},
    ];

    const baitType = [
        { value: '', label: 'Unspecified'},
        { value: 'Chicken', label: 'Chicken'},
        { value: 'Beef', label: 'Beef'},
        { value: 'Pork', label: 'Pork'},
        { value: 'Duck', label: 'Duck'},
        { value: 'Turkey', label: 'Turkey'},
    ];

    const requirement = [
        { value: 'A', label: 'The biggest crab caught of each species'},
        { value: 'B', label: 'Number of crabs caught in each location'},
    ];

    const queryMode = [
        { value: 'Regular', label: 'Regular'},
        { value: 'Detailed', label: 'Detailed'},
        { value: 'Special', label: 'Special'},
    ];

    const handleSubmit = async () => {
        setFetchedData([]);
    
        const filterData = {
            selectedSpecies,
            selectedSex,
            selectedInjuries,
            selectedQueryMode,
            selectedBaitType,
            selectedRequirement,
            minSize,
            minCaught
        };
        console.log("Form Submitted with the following data:", filterData);
    
        const queryString = new URLSearchParams(filterData).toString();
    
        try {
            const response = await fetch(`${apiUrl}/crab/insight?${queryString}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
    
            const data = await response.json();
            setFetchedData(data.data);
    
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    

    useEffect(() => {
        console.log('Fetched data updated:', fetchedData);
    }, [fetchedData]);

    const renderData = (data) => {

        return Object.entries(data).map(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
                return (
                    <div key={key} style={{ marginLeft: '20px' }}>
                        <strong>{key}:</strong>
                        <div>{renderData(value)}</div>
                    </div>
                );

            } else {
                return (
                    <div key={key}>
                        <strong>{key}: </strong>{value}
                    </div>
                );
            }
        });
    };

  return (
    <div className="CrabInsight">
        <MenuBar />
        <div className='CrabContent'>
            <div className='Filter'>
                <Dropdown
                    options={species}
                    title="Species"
                    onChange={(e) => setSelectedSpecies(e.target.value)}
                />
                <Dropdown
                    options={sex}
                    title="Sex"
                    onChange={(e) => setSelectedSex(e.target.value)}
                />
            </div>
            <div className='Filter'>
                <Dropdown
                    options={injuries}
                    title="Injuries"
                    onChange={(e) => setSelectedInjuries(e.target.value)}
                />
                <NumberInput
                    title="Minimum Size"
                    value={minSize}
                    onChange={(e) => setMinSize(e.target.value)}
                />
            </div>
            <div className='Filter'>
                <Dropdown
                    options={queryMode}
                    title="Query Mode"
                    onChange={(e) => setSelectedQueryMode(e.target.value)}
                />

                {selectedQueryMode === "Detailed" && (
                <Dropdown
                    options={baitType}
                    title="Bait Type"
                    onChange={(e) => setSelectedBaitType(e.target.value)}
                />
                )}

                {selectedQueryMode === "Special" && (
                <Dropdown
                    options={requirement}
                    title="Special Requirement"
                    onChange={(e) => setSelectedRequirement(e.target.value)}
                />
                )}
                {selectedQueryMode === "Special" && selectedRequirement === "B" && (
                <NumberInput
                    title="Minimum Caught"
                    value={minCaught}
                    onChange={(e) => setMinCaught(e.target.value)}
                />
                )}


            </div>
            <div className='SubmitSection'>
                <button className="submit-button" onClick={handleSubmit}>
                    Submit
                </button>
            </div>

            {fetchedData && (
                <div className="data-display">
                    {fetchedData.map((item, index) => (
                        <div key={index} className="data-item">
                            <strong>{index}.</strong>
                            {renderData(item)}
                            <strong>----------------------------------------------------------------------</strong>
                        </div>
                    ))}
                </div>
            )}

            
        </div>
    </div>
  );
};

export default CrabInsight;
