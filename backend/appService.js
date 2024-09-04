const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

const fs = require('fs').promises;
const path = require('path');

// database config
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

// terminate connection pool
async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// connect to oracle database
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

// test whether oracle is connected
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

// get all tables in beachkeepers.sql
async function fetchAllTables() {

    return await withOracleDB(async (connection) => {

        const query = `
            SELECT table_name 
            FROM user_tables
        `;

        const result = await connection.execute(query);

        return result.rows.map(row => row[0]);

    }).catch((error) => {
        console.error('Error fetching tables:', error);
        return [];
    });
}

// get all columns for given table
async function fetchAllColumns(table) {

    return await withOracleDB(async (connection) => {

        const query = `
            SELECT column_name 
            FROM user_tab_columns 
            WHERE table_name = :tableName
        `;

        const result = await connection.execute(query, [table]);

        return result.rows.map(row => row[0]);

    }).catch((error) => {
        console.error('Error fetching columns:', error);
        return [];
    });
}

// get all tuples in certain columns of specified table
async function fetchAllTuplesOfColumns(table, columns) {
    
    return await withOracleDB(async (connection) => {

        const query = `
            SELECT ${columns.map(col => `"${col}"`).join(', ')}
            FROM "${table}"
        `;

        const result = await connection.execute(query);

        return result.rows;

    }).catch((error) => {
        console.error('Error fetching data:', error);
        return [];
    });
}

// run beachkeepers.sql
async function initializeBeachkeepers() {
    try {
        const sql = await fs.readFile(path.join(__dirname, 'beachkeepers.sql'), 'utf8');
        const sqlStatements = sql.split(/;\s*$/m).filter(stmt => stmt.trim() !== '');

        await withOracleDB(async (connection) => {

            for (const statement of sqlStatements) {
                try {

                    console.log(`Executing: ${statement.trim().substring(0, 30)}...`);
                    await connection.execute(statement, [], { autoCommit: true });

                } catch (err) {

                    console.error(`Error executing statement: ${statement.trim().substring(0, 30)}...`, err);
                    throw err;
                }
            }
            await connection.commit();
            console.log('SQL file executed successfully');
        });
    } catch (err) {
        console.error('Error executing SQL file:', err);
        throw err;
    }
}

// get all tuples in specified table
async function fetchAllTuples(tableName) {
    return await withOracleDB(async (connection) => {

        const query = `SELECT * FROM ${tableName}`;
        console.log(`Executing query: ${query}`);

        try {
            const result = await connection.execute(query);

            const columns = result.metaData.map(col => col.name);

            const transformedRows = result.rows.map(row => {
                let obj = {};
                row.forEach((value, index) => {
                    obj[columns[index]] = value;
                });
                return obj;
            });

            return transformedRows;
        } catch (err) {
            console.error(`Error executing query: ${query}`, err);
            throw err;
        }
    }).catch((err) => {
        console.error('Error during DB operation', err);
        throw err;
    });
}


// run 'insert into crab values (...);' query
async function insertCrabData(crabid, species, sex, crab_size, injury, trapid) {
    return await withOracleDB(async (connection) => {

        const query = `INSERT INTO crab (crabid, species, sex, crab_size, injury, trapid)
                       VALUES (${crabid}, '${species}', '${sex}', ${crab_size}, '${injury}', ${trapid})`;
        console.log(query)

        try {
            const result = await connection.execute(query, [], { autoCommit: true });

            console.log(result);

            return result.rowsAffected === 1;
        } catch (err) {
            console.error('Error inserting crab data:', err);
            throw err;
        }
    });
}

// check if Crab already contains a row with PK crabid
async function checkCrabIdExists(crabid) {
    return await withOracleDB(async (connection) => {

        const query = `SELECT COUNT(*) 
                       FROM crab 
                       WHERE crabid = ${crabid}`;
        console.log(query);

        try {
            const result = await connection.execute(query);

            console.log(result);
            console.log(result.rows[0][0]);

            return result.rows[0][0] > 0;
        } catch (err) {
            console.error('Error checking crabid:', err);
            throw err;
        }
    });
}

// run 'update crab set (...) where crabid = crabid;' query
async function updateCrabData(crabid, species, sex, crab_size, injury, trapid) {
    return await withOracleDB(async (connection) => {

        const query = `
            UPDATE crab
            SET 
                species = ${species},
                sex = ${sex},
                crab_size = ${crab_size},
                injury = ${injury},
                trapid = ${trapid}
            WHERE crabid = ${crabid}
        `;

        try {
            const result = await connection.execute(query, [], { autoCommit: true });
            return result.rowsAffected === 1;
        } catch (err) {
            console.error('Error updating crab data:', err);
            throw err;
        }
    });
}

// crab regular query
async function crabRegularQuery(species, sex, injuries, minSize) {
    console.log(`Regular query executed with ${species}, ${sex}, ${injuries}, ${minSize}`);

    return await withOracleDB(async (connection) => {

        let query = "SELECT * FROM crab WHERE crab_size >= 0";

        if (species) {
            query += ` AND species = '${species}'`;
        }
        if (sex) {
            query += ` AND sex = '${sex}'`;
        }
        if (injuries) {
            query += ` AND injury = '${injuries}'`;
        }
        if (minSize !== undefined && minSize !== null) {

            let st = "";
            if((st+minSize).length > 0) {
                query += ` AND crab_size >= ${minSize}`;
            }
        }

        console.log(query);

        try {
            const result = await connection.execute(query);
            const rows = result.rows;

            const columns = ['CrabID', 'Species', 'Sex', 'CrabSize', 'Injury', 'TrapID'];

            const transformedRows = rows.map(row => {
                let obj = {};
                row.forEach((value, index) => {
                    obj[columns[index]] = value;
                });
                return obj;
            });

            return transformedRows;
        } catch (err) {
            console.error('Error executing crabRegularQuery:', err);
            throw err;
        }
    });
}

// crab detailed query
async function crabDetailedQuery(species, sex, injuries, minSize, baitType) {
    console.log(`Detailed query executed with ${species}, ${sex}, ${injuries}, ${minSize}, ${baitType}`);

    return await withOracleDB(async (connection) => {

        let query = `
            SELECT 
                c.crabid, c.species, c.sex, c.crab_size, c.injury, c.trapid,
                t.baittype, t.traptype, t.trap_location
            FROM crab c, trap t 
            WHERE c.trapid = t.trapid
        `;

        if (species) {
            query += ` AND c.species = '${species}'`;
        }
        if (sex) {
            query += ` AND c.sex = '${sex}'`;
        }
        if (injuries) {
            query += ` AND c.injury = '${injuries}'`;
        }
        if (minSize !== undefined && minSize !== null) {
            if((""+minSize).length > 0) {
                query += ` AND c.crab_size >= ${minSize}`;
            }
        }
        if (baitType) {
            query += ` AND t.baittype = '${baitType}'`;
        }

        console.log(query);

        try {
            const result = await connection.execute(query);
            const rows = result.rows;

            const columns = [
                'CrabID', 'Species', 'Sex', 'CrabSize', 'Injury', 'TrapID', 
                'BaitType', 'TrapType', 'TrapLocation'
            ];

            const transformedRows = rows.map(row => {
                let obj = {};
                row.forEach((value, index) => {
                    obj[columns[index]] = value;
                });
                return obj;
            });

            return transformedRows;
        } catch (err) {
            console.error('Error executing crabDetailedQuery:', err);
            throw err;
        }
    });
}

// crab special query (biggest catch)
async function crabSpecialQueryBiggestCatch(species, sex, injuries) {
    console.log(`Special query (Biggest Catch) executed with ${species}, ${sex}, ${injuries}`);

    return await withOracleDB(async (connection) => {
        let query = `
            SELECT species, MAX(crab_size) AS BiggestCatch 
            FROM crab 
            WHERE crab_size >= 0
        `;

        if (species) {
            query += ` AND species = '${species}'`;
        }
        if (sex) {
            query += ` AND sex = '${sex}'`;
        }
        if (injuries) {
            query += ` AND injury = '${injuries}'`;
        }
        query += ` GROUP BY species`;

        console.log(query);

        try {
            const result = await connection.execute(query);
            const rows = result.rows;

            const columns = ['Species', 'BiggestCatch'];

            const transformedRows = rows.map(row => {
                let obj = {};
                row.forEach((value, index) => {
                    obj[columns[index]] = value;
                });
                return obj;
            });

            return transformedRows;
        } catch (err) {
            console.error('Error executing crabSpecialQueryBiggestCatch:', err);
            throw err;
        }
    });
}

// crab special query (number of crabs caught in each location)
async function crabSpecialQueryCrabCount(species, sex, injuries, minSize, minCaught) {
    console.log(`Special query (Crab Count) executed with ${species}, ${sex}, ${injuries}, ${minSize}, ${minCaught}`);

    return await withOracleDB(async (connection) => {

        let query = `
            SELECT t.trap_location, COUNT(c.crabid) AS CrabCount 
            FROM crab c, trap t 
            WHERE c.trapid = t.trapid
        `;

        if (species) {
            query += ` AND c.species = '${species}'`;
        }
        if (sex) {
            query += ` AND c.sex = '${sex}'`;
        }
        if (injuries) {
            query += ` AND c.injury = '${injuries}'`;
        }
        if (minSize !== undefined && minSize !== null) {
            let st = "";
            if((st+minSize).length > 0) {
                query += ` AND c.crab_size >= ${minSize}`;
            }
        }

        query += ` GROUP BY t.trap_location`;

        if (minCaught !== undefined && minCaught !== null) {
            if((""+minCaught).length > 0) {
                query += ` HAVING COUNT(c.crabid) >= ${minCaught}`;
            }
        }

        console.log(query);

        try {
            const result = await connection.execute(query);
            const rows = result.rows;

            const columns = ['Location', 'CrabCount'];

            const transformedRows = rows.map(row => {
                let obj = {};
                row.forEach((value, index) => {
                    obj[columns[index]] = value;
                });
                return obj;
            });

            return transformedRows;

        } catch (err) {

            console.error('Error executing crabSpecialQueryCrabCount:', err);
            throw err;
        }
    });
}

// find all positions offered on a certain day (given shift date)
async function fetchPositions(shiftDate) {

    return await withOracleDB(async (connection) => {

        const formattedDate = `TO_DATE('${shiftDate}', 'YYYY-MM-DD')`;

        const query = `
            SELECT * 
            FROM position 
            WHERE shift_date = ${formattedDate}
        `;

        try {
            const result = await connection.execute(query);

            const columns = ['position_name', 'shift_date', 'difficulty', 'pos_location'];

            const transformedRows = result.rows.map(row => {
                let obj = {};
                row.forEach((value, index) => {
                    obj[columns[index]] = value;
                });
                return obj;
            });

            return transformedRows;
        } catch (err) {
            console.error(`Error executing query: ${query}`, err);
            throw err;
        }
    }).catch((err) => {
        console.error('Error during DB operation', err);
        throw err;
    });
}

// run 'insert into trap values (...);' query
async function insertTrapData(baittype, traptype, location, age, trapid, phone) {
    return await withOracleDB(async (connection) => {

        const query = `INSERT INTO trap (trapid, baittype, traptype, trap_location, phone)
                       VALUES (${trapid}, '${baittype}', '${traptype}', '${location}', '${phone}')`;
        console.log(query)

        try {
            const result = await connection.execute(query, [], { autoCommit: true });

            console.log(result);

            return result.rowsAffected === 1;
        } catch (err) {
            console.error('Error inserting trap data:', err);

            if (err.message.includes('ORA-00001')) {
                throw new Error('TrapID already exists! Please select a different TrapID.');
            }

            throw err;
        }
    });
}

// delete the shift of given shift date
async function deleteShift(shiftDate) {
    return await withOracleDB(async (connection) => {
        const formattedDate = `TO_DATE('${shiftDate}', 'YYYY-MM-DD')`;

        console.log(formattedDate);

        const deleteShiftQuery = `
            DELETE FROM shift 
            WHERE shift_date = ${formattedDate}
        `;

        try {
            const deleteShiftResult = await connection.execute(deleteShiftQuery, [], { autoCommit: true });

            if (deleteShiftResult.rowsAffected > 0) {
                return { success: true, message: `Deletion successful` };
            } else {
                return { success: false, status: 404, message: `No shift found` };
            }
        } catch (err) {
            console.error(`Error executing deletion query`, err);
            throw err;
        }
    });
}

// run 'insert into supervisor values (...);' query
async function insertSupervisor(firstname, lastname, password, phone) {
    return await withOracleDB(async (connection) => {
        const query = `
            INSERT INTO supervisor (employeeid, firstname, lastname, phone, password)
            VALUES (supervisor_id.nextval, :firstname, :lastname, :phone, :password)
        `;

        try {
            await connection.execute(query, {
                firstname: firstname,
                lastname: lastname,
                phone: phone,
                password: password
            }, { autoCommit: true });

            console.log('Supervisor inserted successfully');
        } catch (err) {
            console.error('Error inserting supervisor:', err);
            throw err;
        }
    }).catch((err) => {
        console.error('Database error:', err);
        throw err;
    });
}

// run 'insert into email values (...);' query
async function insertEmail(firstname, lastname, email, employeeid) {
    return await withOracleDB(async (connection) => {
        const query = `
            INSERT INTO email (firstname, lastname, email, employeeid)
            VALUES (:firstname, :lastname, :email, :employeeid)
        `;

        try {
            await connection.execute(query, {
                firstname: firstname,
                lastname: lastname,
                email: email,
                employeeid: employeeid
            }, { autoCommit: true });

            console.log('Email inserted successfully');
        } catch (err) {
            console.error('Error inserting email:', err);
            throw err;
        }
    }).catch((err) => {
        console.error('Database error:', err);
        throw err;
    });
}

// run 'insert into volunteer values (...);' query
async function insertVolunteer(firstname, lastname, employeeid, password, experience = 0) {
    return await withOracleDB(async (connection) => {
        const query = `
            INSERT INTO volunteer (volunteerid, firstname, lastname, employeeid, password, experience)
            VALUES (volunteer_id.nextval, :firstname, :lastname, :employeeid, :password, :experience)
        `;

        try {
            await connection.execute(query, {
                firstname: firstname,
                lastname: lastname,
                employeeid: employeeid,
                password: password,
                experience: experience
            }, { autoCommit: true });

            console.log('Volunteer inserted successfully');
        } catch (err) {
            console.error('Error inserting volunteer:', err);
            throw err;
        }
    }).catch((err) => {
        console.error('Database error:', err);
        throw err;
    });
}

// check password and role type for login
async function logIn(isVolunteer, firstname, lastname, password) {
    return await withOracleDB(async (connection) => {

        const role = isVolunteer ? 'volunteer' : 'supervisor';

        const query = `
        SELECT password FROM ${role}
        WHERE firstname = :firstname AND lastname = :lastname
        `;

        try {
            const result = await connection.execute(query, {firstname, lastname});

            if (result.rows.length === 0) {
                return false;
            }

            const dataBasePassword = result.rows[0][0];

            return password === dataBasePassword;
        } catch (err) {
            console.error('Error checking crabid:', err);
            throw err;
        }
    });
}

// find employee ids of supervisors given first and last name
async function getSupervisorIdByName(firstname, lastname) {
    return await withOracleDB(async (connection) => {

        const query = `
            SELECT employeeid 
            FROM supervisor 
            WHERE firstname = :firstname AND lastname = :lastname
        `;

        try {
            const result = await connection.execute(query, { firstname, lastname });

            if (result.rows.length === 0) {
                return null;
            }

            return result.rows[0][0];
        } catch (err) {
            console.error('Error fetching supervisor ID:', err);
            throw err;
        }
    });
}

// find volunteer ids of volunteers given first and last name
async function getVolunteerIdByName(firstname, lastname) {
    return await withOracleDB(async (connection) => {

        const query = `
            SELECT volunteerid 
            FROM volunteer 
            WHERE firstname = :firstname AND lastname = :lastname
        `;

        try {
            const result = await connection.execute(query, { firstname, lastname });

            if (result.rows.length === 0) {
                return null;
            }

            return result.rows[0][0];
        } catch (err) {
            console.error('Error fetching supervisor ID:', err);
            throw err;
        }
    });
}

// check if ParkVisitor already contains a row with PK phone
async function checkParkVisitorExists(phone) {
    return await withOracleDB(async (connection) => {
        const query = `SELECT COUNT(*) 
                       FROM parkvisitor 
                       WHERE phone = :phone`;
        console.log(query);

        try {
            const result = await connection.execute(query, { phone });
            return result.rows[0][0] > 0;
        } catch (err) {
            console.error('Error checking phone:', err);
            throw err;
        }
    });
}

// check if Crabber already contains a row with PK phone
async function checkCrabberExists(phone) {
    return await withOracleDB(async (connection) => {

        const query = `SELECT COUNT(*) 
                       FROM crabber 
                       WHERE phone = :phone`;
        console.log(query);

        try {
            const result = await connection.execute(query, { phone });
            return result.rows[0][0] > 0;
        } catch (err) {
            console.error('Error checking phone:', err);
            throw err;
        }
    });
}

// run 'insert into parkvisitor values (...);' query
async function insertPV(age, firstname, phone) {
    return await withOracleDB(async (connection) => {

        const query = `INSERT INTO parkvisitor (phone, firstname, age)
                       VALUES ('${phone}', '${firstname}', '${age}')`;
        console.log(query)

        try {
            const result = await connection.execute(query, [], { autoCommit: true });

            console.log(result);

            return result.rowsAffected === 1;
        } catch (err) {
            console.error('Error logging park visitor:', err);

            if (err.message.includes('ORA-00001')) {
                throw new Error('Park visitor with given phone number already exists! Try again.');
            }

            throw err;
        }
    });
}

// run 'insert into crabber values (...);' query
async function insertCrabber(phone, licenseNumber) {
    return await withOracleDB(async (connection) => {

        const query = `INSERT INTO crabber (phone, licensenum, volunteerid)
                       VALUES ('${phone}', '${licenseNumber}', 112)`;
        console.log(query)

        try {
            const result = await connection.execute(query, [], { autoCommit: true });

            console.log(result);

            return result.rowsAffected === 1;
        } catch (err) {
            console.error('Error logging crabber:', err);

            if (err.message.includes('ORA-00001')) {
                throw new Error('Crabber with given phone number already exists! Try again.');
            }

            throw err;
        }
    });
}

// run 'insert into interacts values (...);' query
async function insertInteraction(phone, topic) {
    return await withOracleDB(async (connection) => {

        const query = `INSERT INTO interacts (volunteerid, phone, topic)
                       VALUES (112, '${phone}', '${topic}')`;
        console.log(query)

        try {
            const result = await connection.execute(query, [], { autoCommit: true });

            console.log(result);

            return result.rowsAffected === 1;
        } catch (err) {
            console.error('Error uploading interaction:', err);

            if (err.message.includes('ORA-00001')) {
                throw new Error('Duplicate interaction already uploaded.');
            }

            throw err;
        }
    });
}


async function getAvgVolunteerStudiedCrabs() {
    return await withOracleDB(async (connection) => {

        const query = `
            SELECT AVG(crab_count) AS avg_crabs_studied_per_volunteer
            FROM (
                SELECT COUNT(crabid) AS crab_count
                FROM studies
                GROUP BY volunteerid
            )
        `;

        try {

            const result = await connection.execute(query);

            if (result.rows.length === 0) {

                return null;

            }

            return result.rows[0][0];

        } catch (err) {
            console.error('Error fetching avg volunteer studied crabs:', err);
            throw err;
        }
    });
}


async function fetchSpecialTrapIDs() {
    return await withOracleDB(async (connection) => {

        const query = `
            SELECT T.trapid
            FROM Trap T
            WHERE NOT EXISTS (
                SELECT S.species
                FROM Species S
                WHERE NOT EXISTS (
                    SELECT C.species
                    FROM Crab C
                    WHERE C.trapid = T.trapid
                    AND C.species = S.species
                )
            )
        `;

        console.log(query);

        const result = await connection.execute(query);

        console.log(result);

        return result.rows.map(row => row[0]);

    }).catch((error) => {
        console.error('Error fetching special trap ids:', error);
        return [];
    });
}


module.exports = {
    testOracleConnection,
    fetchAllTables,
    fetchAllColumns,
    fetchAllTuplesOfColumns,
    initializeBeachkeepers,
    fetchAllTuples,
    insertCrabData,
    checkCrabIdExists,
    updateCrabData,
    
    crabRegularQuery,
    crabDetailedQuery,
    crabSpecialQueryBiggestCatch,
    crabSpecialQueryCrabCount,

    fetchPositions,

    insertTrapData,
    deleteShift,
    checkParkVisitorExists,
    checkCrabberExists,
    insertPV,
    insertCrabber,
    insertInteraction,

    insertSupervisor,
    insertEmail,
    insertVolunteer,
    logIn,

    getSupervisorIdByName,
    getVolunteerIdByName,
    getAvgVolunteerStudiedCrabs,
    fetchSpecialTrapIDs
};