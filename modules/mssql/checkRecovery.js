const checkRecovery = async (connection, dbList) => {
    let isPassCheck = true;
    try {
        const selectStmt = `select  name, recovery_model_desc  from sys.databases  where name in ('${dbList.join("','")}')`;
        const result = await connection.query(selectStmt);

        result.recordset.forEach(record => {
            if (record.recovery_model_desc.toLowerCase() === 'simple') {
                console.error(`${record.name} is in SIMPLE recovery model!`);
                console.dir(result.recordset);
                isPassCheck = false;
            }
        });
    } catch (error) {
        console.error(error);
    }

    return isPassCheck
}

export default checkRecovery;