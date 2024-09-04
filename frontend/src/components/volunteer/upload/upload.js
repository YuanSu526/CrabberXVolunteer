import React, { useState, useEffect } from 'react';
import './upload.css';
import MenuBar from '../menuBar/menuBar'

const VolunteerDataUpload = () => {

    const apiUrl = process.env.REACT_APP_API_URL;

    const [crabID, setCrabID] = useState(null);
    const [species, setSpecies] = useState('');
    const [sex, setSex] = useState('');
    const [injury, setInjury] = useState('');
    const [size, setSize] = useState(null);
    const [referenceTrapID, setReferenceTrapID] = useState(null);
    const [crabExists, setCrabExists] = useState(null);

    const handleCrabIDChange = (e) => {
        setCrabID(e.target.value);
    };
    const handleSpeciesChange = (e) => {
        setSpecies(e.target.value);
    };
    const handleSexChange = (e) => {
        setSex(e.target.value);
    };
    const handleInjuryChange = (e) => {
        setInjury(e.target.value);
    };
    const handleSizeChange = (e) => {
        setSize(e.target.value);
    };
    const handleReferenceTrapIDChange = (e) => {
        setReferenceTrapID(e.target.value);
    };

    useEffect(() => {
        if (crabID) {
            const checkCrabExists = async () => {
                try {
                    const response = await fetch(`${apiUrl}/crab/exists?crabid=${crabID}`);
                    const data = await response.json();

                    if (response.ok) {
                        console.log('CrabID exists:', data.message);
                        setCrabExists(true);
                    } else {
                        console.log('CrabID does not exist:', data.message);
                        setCrabExists(false);
                    }
                } catch (err) {
                    console.error('Error while checking CrabID:', err);
                    setCrabExists(null);
                }
            };
            checkCrabExists();
        }
    }, [crabID, apiUrl]);

    useEffect(() => {
        console.log('Crab exists updated:', crabExists);
    }, [crabExists]);


    const [baitType, setBaitType] = useState(''); // changed null to '' to be a dropdown menu
    const [trapType, setTrapType] = useState('');
    const [location, setLocation] = useState('');
    const [ageGroup, setAgeGroup] = useState('');
    const [trapID, setTrapID] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [phone, setPhone] = useState(null);
    const [licenseNumber, setLicenseNumber] = useState(null);

    const handleBaitTypeChange = (e) => {
        setBaitType(e.target.value);
    };
    const handleTrapTypeChange = (e) => {
        setTrapType(e.target.value);
    };
    const handleLocationChange = (e) => {
        setLocation(e.target.value);
    };
    const handleAgeGroupChange = (e) => {
        setAgeGroup(e.target.value);
    };
    const handleTrapIDChange = (e) => {
        setTrapID(e.target.value);
    };
    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
    };
    const handlePhoneChange = (e) => {
        setPhone(e.target.value);
    };
    const handleLicenseNumberChange = (e) => {
        setLicenseNumber(e.target.value);
    };

    const [parkVisitorFirstName, setParkVisitorFirstName] = useState(null);
    const [parkVisitorPhone, setParkVisitorPhone] = useState(null);
    const [topic, setTopic] = useState(null);
    const [parkVisitorAgeGroup, setParkVisitorAgeGroup] = useState('');

    const handleParkVisitorFirstNameChange = (e) => {
        setParkVisitorFirstName(e.target.value);
    };
    const handleParkVisitorPhoneChange = (e) => {
        setParkVisitorPhone(e.target.value);
    };
    const handleTopicChange = (e) => {
        setTopic(e.target.value);
    };
    const handleParkVisitorAgeGroupChange = (e) => {
        setParkVisitorAgeGroup(e.target.value);
    };

    const [showNotification, setShowNotification] = useState(false);

    const handleCrabSubmit = async () => {
        if (!crabID || !referenceTrapID) {
            alert('Crab ID and Trap ID are required');
            return;
        }

        const crabData = {
            crabid: crabID,
            species: species || null,
            sex: sex || null,
            crab_size: size !== undefined && size !== null ? size : null,
            injury: injury || null,
            trapid: referenceTrapID,
        };

        console.log(crabData);

        try {
            const response = await fetch(`${apiUrl}/crab`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(crabData),
            });

            const data = await response.json();

            if (response.ok) {
                setCrabExists(true);
                setShowNotification(true);
                setTimeout(() => {
                    setShowNotification(false);
                }, 2000);
            } else {
                alert(`Failed to insert crab data: ${data.message}`);
            }
        } catch (err) {
            console.error('Error during crab data insertion:', err);
            alert('Server error during crab data insertion');
        }
    };

    const handleCrabUpdate = async () => {
        if (!crabID || !referenceTrapID) {
            alert('Crab ID and Trap ID are required');
            return;
        }
    
        const crabData = {
            crabid: crabID,
            species: species || null,
            sex: sex || null,
            crab_size: size !== undefined && size !== null ? size : null,
            injury: injury || null,
            trapid: referenceTrapID,
        };
    
        console.log(crabData);
    
        try {
            const response = await fetch(`${apiUrl}/crab/${crabID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(crabData),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setCrabExists(true);
                setShowNotification(true);
                setTimeout(() => {
                    setShowNotification(false);
                }, 2000);
            } else {
                alert(`Failed to update crab data: ${data.message}`);
            }
        } catch (err) {
            console.error('Error during crab data update:', err);
            alert('Server error during crab data update');
        }
    };

    const handleTrapSubmit = async () => {
        if (!trapID || !phone) {
            alert('Trap ID and Phone are required');
            return;
        }
        
        const trapData = {
            baittype: baitType || null,
            traptype: trapType || null,
            location: location || null,
            age: ageGroup || null,
            trapid: trapID,
            firstname: firstName || null,
            phone: phone,
            licensenum: licenseNumber,
        };

        console.log(trapData);

        try {
            const response = await fetch(`${apiUrl}/trap`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trapData),
            });

            const data = await response.json();

            if (response.ok) {
                setShowNotification(true);
                setTimeout(() => {
                    setShowNotification(false);
                }, 2000);
            } else {
                alert(`Failed to insert trap data: ${data.message}`);
            }
        } catch (err) {
            console.error('Error during trap data insertion:', err);
            alert('Server error during trap data insertion');
        }
    };

    const handleInteractionSubmit = async () => {
        if (!parkVisitorPhone) {
            alert('Phone is required');
            return;
        }

        const interactionData = {
            firstname: parkVisitorFirstName || null,
            phone: parkVisitorPhone,
            topic: topic || null,
            age: parkVisitorAgeGroup || null,
        };

        console.log(interactionData);

        try {
            const response = await fetch(`${apiUrl}/interaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(interactionData),
            });

            const data = await response.json();

            if (response.ok) {
                setShowNotification(true);
                setTimeout(() => {
                    setShowNotification(false);
                }, 2000);
            } else {
                alert(`Failed to upload interaction: ${data.message}`);
            }
        } catch (err) {
            console.error('Error during interaction upload:', err);
            alert('Server error during interaction upload');
        }
    };
    
  
    return (
        <div className="upload-container">
            <MenuBar></MenuBar>
            <div className="information">
                <div className="upload-content">
                    <div className="info-card-upload">
                        <h3>Crab</h3>
                        <p>
                            <span className="attribute-name">Crab ID:</span> 
                            <input 
                            type="text" 
                            className="text-input" 
                            onChange={handleCrabIDChange}
                            />
                        </p>
                        {crabID && crabExists ? 
                            <p style={{ marginLeft: '20px', color: 'red', fontSize: '14px'}}>
                                Crab Exists In System!
                            </p> 
                            :
                            <p style={{ marginLeft: '20px', fontSize: '14px'}}>
                                Uploading New Crab
                            </p>
                        }
                        <p>
                            <span className="attribute-name">Species:</span> 
                            <select className="dropdown" onChange={handleSpeciesChange} value={species}>
                                <option value='' disabled>Select</option>
                                <option value='Dungeness'>Dungeness</option>
                                <option value='Red rock'>Red Rock</option>
                                <option value='Graceful'>Graceful</option>
                                <option value='Green'>Green</option>
                                <option value='Shore'>Shore</option>
                            </select>
                        </p>
                        <p>
                            <span className="attribute-name">Sex:</span> 
                            <select className="dropdown" onChange={handleSexChange} value={sex}>
                                <option value='' disabled>Select</option>
                                <option value='M'>Male</option>
                                <option value='F'>Female</option>
                            </select>
                        </p>
                        <p>
                            <span className="attribute-name">Injury:</span> 
                            <select className="dropdown" onChange={handleInjuryChange} value={injury}>
                                <option value='' disabled>Select</option>
                                <option value="Y">Yes</option>
                                <option value="N">No</option>
                            </select>
                        </p>
                        <p>
                            <span className="attribute-name">Size:</span> 
                            <input 
                            type="text" 
                            className="text-input" 
                            onChange={handleSizeChange}
                            />
                        </p>
                        <p>
                            <span className="attribute-name">TrapID:</span> 
                            <input 
                            type="text" 
                            className="text-input" 
                            onChange={handleReferenceTrapIDChange}
                            />
                        </p>
                        {crabID && crabExists ? 
                            <div className='button-container'> 
                                <button className="submit-button" onClick={handleCrabUpdate}>Update</button>
                            </div>
                            :
                            <div className='button-container'> 
                                <button className="submit-button" onClick={handleCrabSubmit}>Submit</button>
                            </div>
                        }
                    </div>
                    <div className="info-card-upload"> 
                        <h3>Trap</h3>
                        <p>
                            <span className="attribute-name">Bait Type:</span> 
                            <select className="dropdown" onChange={handleBaitTypeChange} value={baitType}>
                                <option value='' disabled>Select</option>
                                <option value='Chicken'>Chicken</option>
                                <option value='Turkey'>Turkey</option>
                                <option value='Duck'>Duck</option>
                                <option value='Pork'>Pork</option>
                                <option value='Beef'>Beef</option>
                                <option value='Other'>Other</option>
                            </select>
                        </p>
                        <p>
                            <span className="attribute-name">Trap Type:</span> 
                            <select className="dropdown" onChange={handleTrapTypeChange} value={trapType}>
                                <option value='' disabled>Select</option>
                                <option value='Clamshell'>Clamshell</option>
                                <option value='Circle'>Circle</option>
                                <option value='Box'>Box</option>
                                <option value='Triangle'>Triangle</option>
                            </select>
                        </p>
                        <p>
                            <span className="attribute-name">Location:</span> 
                            <select className="dropdown" onChange={handleLocationChange} value={location}>
                                <option value='' disabled>Select</option>
                                <option value='Main'>Main</option>
                                <option value='North'>North</option>
                                <option value='East'>East</option>
                                <option value='South'>South</option>
                            </select>
                        </p>
                        <p>
                            <span className="attribute-name">Age Group:</span> 
                            <select className="dropdown" onChange={handleAgeGroupChange} value={ageGroup}>
                                <option value='' disabled>Select</option>
                                <option value='Youth'>Youth</option>
                                <option value='Adult'>Adult</option>
                            </select>
                        </p>
                        <p>
                            <span className="attribute-name">Trap ID:</span> 
                            <input 
                            type="text" 
                            className="text-input" 
                            onChange={handleTrapIDChange}
                            />
                        </p>
                        <p>
                            <span className="attribute-name">First Name:</span> 
                            <input 
                            type="text" 
                            className="text-input" 
                            onChange={handleFirstNameChange}
                            />
                        </p>
                        <p>
                            <span className="attribute-name">Phone:</span> 
                            <input 
                            type="text" 
                            className="text-input" 
                            onChange={handlePhoneChange}
                            />
                        </p>
                        <p>
                            <span className="attribute-name">License Number:</span> 
                            <input 
                            type="text" 
                            className="text-input" 
                            onChange={handleLicenseNumberChange}
                            />
                        </p>
                        <div className='button-container'> 
                            <button className="submit-button" onClick={handleTrapSubmit}>Submit</button>
                        </div>
                    </div>
                    <div className="info-card-upload">
                        <h3>Interaction</h3>
                        <p>
                            <span className="attribute-name">First Name:</span> 
                            <input 
                            type="text" 
                            className="text-input" 
                            onChange={handleParkVisitorFirstNameChange}
                            />
                        </p>
                        <p>
                            <span className="attribute-name">Phone:</span> 
                            <input 
                            type="text" 
                            className="text-input" 
                            onChange={handleParkVisitorPhoneChange}
                            />
                        </p>
                        <p>
                            <span className="attribute-name">Topic:</span> 
                            <input 
                            type="text" 
                            className="text-input" 
                            onChange={handleTopicChange}
                            />
                        </p>
                        <p>
                            <span className="attribute-name">Age Group:</span> 
                            <select className="dropdown" onChange={handleParkVisitorAgeGroupChange} value={parkVisitorAgeGroup}>
                                <option value='' disabled>Select</option>
                                <option value='Youth'>Youth</option>
                                <option value='Adult'>Adult</option>
                            </select>
                        </p>
                        <div className='button-container'> 
                            <button className="submit-button" onClick={handleInteractionSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
            {showNotification && (
                <div className="notification">
                    Successfully submitted!
                </div>
            )}
        </div>
    );
};

export default VolunteerDataUpload;