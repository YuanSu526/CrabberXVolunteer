const express = require('express');
const appService = require('./appService');
const router = express.Router();

// api endpoints

// all backend calls
router.get('/', async (req, res) => {
    const isConnect = await appService.testOracleConnection();

    if (isConnect) {
        res.send('Connected!');

    } else {
        res.send('Unable to connect.');
    }
});

// get all tables from database
router.get('/tables', async (req, res) => {
    try {
        const tables = await appService.fetchAllTables();

        if (tables.length > 0) {
            res.json({ success: true, tables });
        } else {
            res.status(404).json({ success: false, message: 'No tables found.' });
        }
    } catch (err) {
        console.error('Error fetching tables:', err);
        res.status(500).json({ success: false, message: 'Server error while getting tables.' });
    }
});

// get all columns from specified table
router.get('/columns', async (req, res) => {
    try {
        const tableName = req.query.table;

        if (!tableName) {
            return res.status(400).json({ success: false, message: 'Table name is required.' });
        }

        const columns = await appService.fetchAllColumns(tableName);

        if (columns.length > 0) {
            res.json({ success: true, columns });
        } else {
            res.status(404).json({ success: false, message: 'No columns found.' });
        }
    } catch (err) {
        console.error('Error fetching tables:', err);
        res.status(500).json({ success: false, message: 'Server error while getting columns.' });
    }
});

// get all rows from specified table and column(s)
router.post('/data', async (req, res) => {
    try {
        const { table, columns } = req.body;

        if (!table || !columns || columns.length === 0) {
            return res.status(400).json({ success: false, message: 'Table name and columns are required.' });
        }

        const data = await appService.fetchAllTuplesOfColumns(table, columns);

        if (data.length > 0) {
            res.json({ success: true, rows: data });
        } else {
            res.status(404).json({ success: false, message: 'No data found.' });
        }
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ success: false, message: 'Server error while getting rows.' });
    }
});

// run beachkeepers.sql
router.get('/initialize-beachkeepers', async (req, res) => {
    try {

        await appService.initializeBeachkeepers();
        res.json({ success: true, message: 'SQL tables initialized successfully!' });

    } catch (err) {

        console.error('Error initializing tables:', err);
        res.status(500).json({ success: false, message: 'Server error while initializing.' });
    }
});

// get all tuples from specified table
router.get('/tables/fetch', async (req, res) => {
    const { tableName} = req.query;

    if (!tableName) {
        return res.status(400).json({ success: false, message: 'No tableName provided.' });
    }

    try {
        const tuples = await appService.fetchAllTuples(tableName);

        if (tuples && tuples.length > 0) {
            res.json({ success: true, rows: tuples });
        } else {
            res.status(404).json({ success: false, message: `No data found in table ${tableName}.` });
        }

    } catch (err) {
        res.status(500).json({ success: false, message: `Error fetching data from table ${tableName}.` });
    }
});

// insert into crab
router.post('/crab', async (req, res) => {
    let { crabid, species, sex, crab_size, injury, trapid } = req.body;

    if (crabid === undefined || trapid === undefined) {
        return res.status(400).json({ success: false, message: 'Crab ID and Trap ID are required.' });
    }

    species = species ? species : 'NULL';
    sex = sex ? sex : 'NULL';
    crab_size = crab_size !== undefined && crab_size !== null ? crab_size : 'NULL';
    injury = injury ? injury : 'NULL';

    try {
        const success = await appService.insertCrabData(crabid, species, sex, crab_size, injury, trapid);

        if (success) {
            res.status(201).json({ success: true, message: 'Crab data inserted successfully!' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to insert crab data.' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error during crab data insertion.' });
    }
});

// check if crabID already exists in Crab table
router.get('/crab/exists', async (req, res) => {
    const { crabid } = req.query;

    console.log(req.query);

    if (!crabid) {
        return res.status(400).json({ success: false, message: 'Crab ID is required.' });
    }

    try {

        const exists = await appService.checkCrabIdExists(crabid);


        if (exists) {
            res.json({ success: true, message: `Crab ID already exists!` });
        } else {
            res.status(404).json({ success: false, message: `CrabID does not yet exist.` });
        }

    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error while checking if Crab ID exists.' });
    }
});

// update crab where crabid = crabid
router.put('/crab/:crabid', async (req, res) => {
    const { crabid } = req.params;
    let { species, sex, crab_size, injury, trapid } = req.body;

    if (!crabid || !trapid) {
        return res.status(400).json({ success: false, message: 'Crab ID and Trap ID is required.' });
    }

    species = species ? `'${species}'` : 'NULL';
    sex = sex ? `'${sex}'` : 'NULL';
    crab_size = crab_size !== undefined && crab_size !== null ? crab_size : 'NULL';
    injury = injury ? `'${injury}'` : 'NULL';

    try {
        const success = await appService.updateCrabData(crabid, species, sex, crab_size, injury, trapid);

        if (success) {
            res.json({ success: true, message: 'Crab data updated successfully!' });
        } else {
            res.status(404).json({ success: false, message: `No crab found with crabid ${crabid}.` });
        }

    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error during crab data update.' });
    }
});

// perform regular, detailed, or specific query depending on selectedQueryMode
router.get('/crab/insight', async (req, res) => {
    const {
        selectedSpecies,
        selectedSex,
        selectedInjuries,
        selectedQueryMode,
        selectedBaitType,
        minCaught,
        minSize,
        selectedRequirement
    } = req.query;

    try {
        let result;

        if (selectedQueryMode === 'Regular') {
            console.log('CRAB: Initializing regular query...')
            result = await appService.crabRegularQuery(selectedSpecies, selectedSex, selectedInjuries, minSize);

        } else if (selectedQueryMode === 'Detailed') {
            console.log('CRAB: Initializing detailed query...')
            result = await appService.crabDetailedQuery(selectedSpecies, selectedSex, selectedInjuries, minSize, selectedBaitType);

        } else if (selectedQueryMode === 'Special') {
            console.log('CRAB: Initializing special query...')

            if (selectedRequirement === 'B') {
                console.log('Finding the numbers of crab caught in each locations...');
                result = await appService.crabSpecialQueryCrabCount(selectedSpecies, selectedSex, selectedInjuries, minSize, minCaught);

            } else {
                console.log('Finding the biggest crab of each species...')
                result = await appService.crabSpecialQueryBiggestCatch(selectedSpecies, selectedSex, selectedInjuries);

            }

        } else {
            return res.status(400).json({ success: false, message: 'Invalid query mode.' });
        }

        res.json({ success: true, data: result });
    } catch (err) {
        console.error('Error processing crab query:', err);
        res.status(500).json({ success: false, message: 'Server error during crab query.' });
    }
});

// get all tuples in Shift
router.get('/shifts', async (req, res) => {
    try {
        const shifts = await appService.fetchAllTuples('shift');

        if (shifts && shifts.length > 0) {
            res.json({ success: true, shifts });
        } else {
            res.status(404).json({ success: false, message: 'No shifts found.' });
        }

    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching shifts.' });
    }
});

// get all positions where FK shiftdate = shiftdate
router.get('/shifts/positions', async (req, res) => {
    const { shiftDate } = req.query;

    if (!shiftDate) {
        return res.status(400).json({ success: false, message: 'Shift date is required.' });
    }

    try {
        const positions = await appService.fetchPositions(shiftDate);

        if (positions && positions.length > 0) {
            res.json({ success: true, positions });
        } else {
            res.status(404).json({ success: false, message: `No positions found.` });
        }

    } catch (err) {
        res.status(500).json({ success: false, message: `Error fetching positions for that shift.` });
    }
});

// insert into trap
router.post('/trap', async (req, res) => {
    let { baittype, traptype, location, age, trapid, firstname, phone, licensenum } = req.body;

    if (trapid === undefined || phone === undefined) {
        return res.status(400).json({ success: false, message: 'TrapID and Phone are required.' });
    }

    baittype = baittype ? baittype : 'NULL';
    traptype = traptype ? traptype : 'NULL';
    location = location ? location : 'NULL';
    age = age ? age : 'NULL';
    firstname = firstname ? firstname : 'NULL';
    licensenum = licensenum ? licensenum : 'NULL';

    try {
        const PVexists = await appService.checkParkVisitorExists(phone);

        if (!PVexists) {
            await appService.insertPV(age, firstname, phone);
        }

        const crabberExists = await appService.checkCrabberExists(phone);

        if (!crabberExists) {
            await appService.insertCrabber(phone, licensenum);
        }

        const success = await appService.insertTrapData(baittype, traptype, location, age, trapid, phone);

        if (success) {
            res.status(201).json({ success: true, message: 'Trap data inserted successfully!' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to insert trap data.' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// delete specified shift (should cascade for associated positions and volunteers)
router.delete('/shifts/:shiftDate', async (req, res) => {
    const shiftDate = req.params.shiftDate;

    console.log(shiftDate);

    try {
        const result = await appService.deleteShift(shiftDate);

        if (result.success) {
            res.status(200).json({ success: true, message: result.message });
        } else {
            res.status(result.status || 500).json({ success: false, message: result.message });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: `Error deleting shift and related positions: ${err.message}.` });
    }
});

// volunteer sign-up for login page
router.post('/volunteer/signup', async (req, res) => {
    let { firstname, lastname, employeeid, password } = req.body;

    if (!firstname || !lastname || !employeeid || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        await appService.insertVolunteer(firstname, lastname, employeeid, password);

        res.status(201).json({ success: true, message: 'Volunteer signed up successfully!' });

    } catch (err) {
        console.error('Error during volunteer signup:', err);
        res.status(500).json({ success: false, message: 'Error signing up volunteer.' });
    }
});

// supervisor sign-up for login page
router.post('/supervisor/signup', async (req, res) => {
    let { firstname, lastname, password, phone } = req.body;

    if (!firstname || !lastname || !password || !phone) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        await appService.insertSupervisor(firstname, lastname, password, phone);

        res.status(201).json({ success: true, message: 'Supervisor signed up successfully!' });

    } catch (err) {
        console.error('Error during supervisor signup:', err);
        res.status(500).json({ success: false, message: 'Error signing up supervisor.' });
    }
});

// upload email for supervisor
router.post('/supervisor/email', async (req, res) => {
    let { firstname, lastname, email, employeeid } = req.body;

    if (!firstname || !lastname || !email || !employeeid) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        await appService.insertEmail(firstname, lastname, email, employeeid);

        res.status(201).json({ success: true, message: 'Email signed up successfully.' });

    } catch (err) {
        console.error('Error during binding email with supervisor:', err);
        res.status(500).json({ success: false, message: 'Error binding email with supervisor.' });
    }
});

// volunteer log-in to view volunteer-only pages
router.post('/volunteer/login', async (req, res) => {
    const { firstname, lastname, password } = req.body;

    if (!firstname || !lastname || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        const passwordMatch = await appService.logIn(true, firstname, lastname, password);

        if (passwordMatch) {

            res.status(200).json({ success: true, message: 'Login successful.' });

        } else {

            res.status(401).json({ success: false, message: 'Invalid firstname, lastname, or password.' });

        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error during volunteer login.' });
    }
}); 

// supervisor log-in to view supervisor-only pages
router.post('/supervisor/login', async (req, res) => {
    const { firstname, lastname, password } = req.body;

    if (!firstname || !lastname || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        const passwordMatch = await appService.logIn(false, firstname, lastname, password);

        if (passwordMatch) {

            res.status(200).json({ success: true, message: 'Login successful.' });

        } else {

            res.status(401).json({ success: false, message: 'Invalid firstname, lastname, or password.' });
            
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error during login.' });
    }
}); 

// search for volunteer given volunteerid
router.post('/volunteer/volunteerid', async (req, res) => {
    const { firstname, lastname } = req.body;

    if (!firstname || !lastname) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        const volunteerid = await appService.getVolunteerIdByName(firstname, lastname);

        if (!volunteerid) {

            return res.status(404).json({ success: false, message: 'Volunteer not found.' });

        }

        res.status(200).json({ success: true, volunteerid });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error during fetching volunteer ID.' });
    }
}); 

// search for supervisor given employeeid
router.post('/supervisor/employeeid', async (req, res) => {
    const { firstname, lastname } = req.body;

    if (!firstname || !lastname) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        const employeeid = await appService.getSupervisorIdByName(firstname, lastname);

        if (!employeeid) {

            return res.status(404).json({ success: false, message: 'Supervisor not found.' });

        }

        res.status(200).json({ success: true, employeeid });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error during fetching volunteer ID.' });
    }
});


router.get('/volunteer/avgStudiedCrabs', async (req, res) => {
    try {

        const avgStudiedCrabs = await appService.getAvgVolunteerStudiedCrabs();

        if (avgStudiedCrabs) {
            res.json({ success: true, avgStudiedCrabs });
        } else {
            res.status(404).json({ success: false, message: `Unable to calculate avg crabs studied by volunteers` });
        }

    } catch (err) {
        res.status(500).json({ success: false, message: `Error calculating avg crabs studied by volunteers` });
    }
});


router.get('/trap/caughtAll3Crabs', async (req, res) => {
    try {

        console.log("Fetching traps that caught all three crabs");

        const trapIDs = await appService.fetchSpecialTrapIDs();

        if (trapIDs.length > 0) {
            res.json({ success: true, trapIDs });
        } else {
            console.log(`No traps have caught all 3 kinds of crabs before`);
            res.status(404).json({ success: false, message: `No traps have caught all 3 kinds of crabs before` });
        }

    } catch (err) {
        res.status(500).json({ success: false, message: `Error calculating avg crabs studied by volunteers` });
    }
});

router.post('/interaction', async (req, res) => {
    let { firstname, phone, topic, age } = req.body;

    if (phone === undefined) {
        return res.status(400).json({ success: false, message: 'Phone is required.' });
    }
    
    firstname = firstname ? firstname : 'NULL';
    topic = topic ? topic : 'NULL';
    age = age ? age : 'NULL';

    try {
        const PVexists = await appService.checkParkVisitorExists(phone);

        if (!PVexists) {
            await appService.insertPV(age, firstname, phone);
        }

        const success = await appService.insertInteraction(phone, topic);

        if (success) {
            res.status(201).json({ success: true, message: 'Interaction uploaded successfully!' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to upload interaction.' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;