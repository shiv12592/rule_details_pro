import React, {useState, useEffect, useRef} from "react";

const RuleConditionRows = ({ onConditionDataChange,initialData }) => {
    const [conditions, setConditions] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectOperation, setSelectOperation] = useState("AND");
    const [isAddClicked, setIsAddClicked] = useState(false);

    const firstUpdate = useRef(true);  // Create a ref to track the first render

    useEffect(() => {
        if (initialData && initialData.conditions) {
            const formattedData = reFormat(initialData.conditions);
            setConditions(formattedData.conditions);
            setSelectOperation(initialData.selectOperation || "AND");
            setIsAddClicked(true);
        }
    }, [initialData]);

    const reFormat = (formattedObject) => {
        // Helper function to process each condition
        const processCondition = (condition) => {
            if (typeof condition === "object" && condition !== null && !Array.isArray(condition)) {
                const keys = Object.keys(condition);
                if (keys.includes("Source")) {
                    let obj = { source: condition["Source"] || null };
                    if (obj.source === "Request") {
                        obj.requestAttribute = condition["attribute"] || null;
                        obj.requestValue = condition["value"] || null;
                    } else if (obj.source === "Identity") {
                        obj.identityAttribute = condition["attribute"] || null;
                        obj.identityValue = condition["value"] || null;
                    }
                    return obj;
                } else {
                    const selectOperation = keys[0];
                    return {
                        rows: condition[selectOperation].map(processCondition),
                        selectOperation: selectOperation,
                    };
                }
            }
            return null; // Handle null or unexpected structures
        };

        const rootSelectOperation = Object.keys(formattedObject)[0];
        const conditions = formattedObject[rootSelectOperation].map(processCondition);
        return {
            conditions: conditions.filter((condition) => condition !== null), // Filter null entries
            selectOperation: rootSelectOperation || "AND", // Default to "AND" if none found
        };
    };

    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;  // Set to false after first render
            return;  // Skip the first call
        }
        onConditionDataChange(format(conditions, selectOperation));
    }, [conditions, selectOperation, onConditionDataChange]);

    const handleAddConditionRow = () => {
        setConditions([...conditions, {}]);
        setIsAddClicked(true);
    };

    const handleSelectRow = (index) => {
        if (selectedRows.includes(index)) {
            setSelectedRows(selectedRows.filter((i) => i !== index));
        } else {
            setSelectedRows([...selectedRows, index]);
        }
    };

    const handleGroupSelected = () => {
        if (selectedRows.length > 1) {
            let groupedConditions = [];
            let groupedRows = [];
            conditions.forEach((condition, index) => {
                if (selectedRows.includes(index)) {
                    groupedRows.push(condition);
                } else {
                    groupedConditions.push(condition);
                }
            });

            let hasGroup = groupedRows.some((row) => row.rows && row.selectOperation);

            if (hasGroup) {
                let newGroup = { rows: [], selectOperation };
                groupedRows.forEach((row) => {
                    if (row.rows && row.selectOperation) {
                        newGroup.rows.push(row);
                    } else {
                        if (row.selectOperation) {
                            delete row.selectOperation;
                        }
                        newGroup.rows.push({ ...row, selectOperation });
                    }
                });
                groupedConditions.push(newGroup);
            } else {
                groupedConditions.push({ rows: groupedRows, selectOperation });
            }

            setConditions(groupedConditions);
            setSelectedRows([]);
        } else if (selectedRows.length === 1) {
            let selectedRow = conditions[selectedRows[0]];

            if (selectedRow.rows && selectedRow.selectOperation) {
                let updatedConditions = conditions.map((condition, index) => {
                    if (index === selectedRows[0]) {
                        return { ...condition, selectOperation: undefined };
                    }
                    return condition;
                });
                setConditions(updatedConditions);
            } else {
                let newGroup = {
                    rows: [{ ...selectedRow, selectOperation: undefined }],
                    selectOperation,
                };
                setConditions([
                    ...conditions.slice(0, selectedRows[0]),
                    newGroup,
                    ...conditions.slice(selectedRows[0] + 1),
                ]);
            }

            setSelectedRows([]);
        }
    };

    const handleUngroupSelected = () => {
        let ungroupedConditions = [];
        conditions.forEach((condition, index) => {
            if (
                selectedRows.includes(index) &&
                condition.rows &&
                condition.selectOperation
            ) {
                ungroupedConditions.push(...condition.rows);
            } else {
                ungroupedConditions.push(condition);
            }
        });
        setConditions(ungroupedConditions);
        setSelectedRows([]);
    };

    const handleDeleteSelected = () => {
        let updatedConditions = conditions.filter(
            (condition, index) => !selectedRows.includes(index)
        );
        setConditions(updatedConditions);
        setSelectedRows([]);
    };

    const format = (conditions, selectOperation) => {
        let result = {};
        result[selectOperation] = conditions.map((condition) => {
            if (condition.rows && condition.selectOperation) {
                return format(condition.rows, condition.selectOperation);
            } else {
                let obj = {};
                obj["Source"] = condition.source || "";
                if (condition.source === "Request") {
                    obj["attribute"] = condition.requestAttribute || "";
                    obj["value"] = condition.requestValue || [];
                } else if (condition.source === "Identity") {
                    obj["attribute"] = condition.identityAttribute || "";
                    obj["value"] = condition.identityValue || "";
                }
                return obj;
            }
        });
        return result;
    };

    const updateNestedCondition = (condition, indices, field, value) => {
        if (indices.length === 0) {
            condition[field] = value;  // Set the field at the correct depth
            return condition;
        }

        const [currentIndex, ...restIndices] = indices;

        // Initialize 'rows' array if it doesn't exist yet
        if (!condition.rows) {
            condition.rows = [];  // Create rows array if missing
        }

        // Ensure the row exists at the current index, and initialize if missing1
        if (!condition.rows[currentIndex]) {
            condition.rows[currentIndex] = {};  // Initialize missing row as an empty object
        }

        // Recursively update the condition for the nested row
        condition.rows[currentIndex] = updateNestedCondition(condition.rows[currentIndex], restIndices, field, value);

        return condition;
    };

    const handleChange = (index, field, value) => {
        let updatedConditions = [...conditions];
        updatedConditions[index][field] = value;

        // If requestAttribute is being changed, reset the requestValue
        if (field === 'requestAttribute') {
            updatedConditions[index]['requestValue'] = '';  // Reset value
        }

        // If identityAttribute is being changed, reset the identityValue
        if (field === 'identityAttribute') {
            updatedConditions[index]['identityValue'] = '';  // Reset value or array depending on the use case
        }

        setConditions(updatedConditions);
    };

    const handleChangeInner = (outerIndex, innerIndex, field, value) => {
        let updatedConditions = [...conditions];

        // Ensure that the row exists
        if (updatedConditions[outerIndex].rows && updatedConditions[outerIndex].rows[innerIndex]) {
            updatedConditions[outerIndex].rows[innerIndex][field] = value;

            // If requestAttribute is being changed, reset the requestValue
            if (field === 'requestAttribute') {
                updatedConditions[outerIndex].rows[innerIndex]['requestValue'] = '';  // Reset value
            }

            // If identityAttribute is being changed, reset the identityValue
            if (field === 'identityAttribute') {
                updatedConditions[outerIndex].rows[innerIndex]['identityValue'] = '';  // Reset value or array depending on the use case
            }
        }

        setConditions(updatedConditions);
    };


    const renderConditionRow = (condition, outerIndex, innerIndex, isGrouped = false, level = 0) => {
        const isDisabled = (level) => {
            return level >= 2;  // Only disable level 3 and above
        };

        return condition.rows && condition.selectOperation ? (
            <table style={{ border: "1px solid red", margin: "10px", width: "100%" }}>
                <tbody>
                <tr style={{ border: "1px solid black" }}>
                    {!isGrouped && (
                        <td>
                            <input
                                type="checkbox"
                                checked={isGrouped ? condition.checked : selectedRows.includes(outerIndex)}
                                onChange={() =>
                                    isGrouped
                                        ? handleChangeInner(outerIndex, innerIndex, "checked", !condition.checked, level)
                                        : handleSelectRow(outerIndex)
                                }
                            />
                        </td>
                    )}
                    <td style={{ width: '10%' }}>
                        <select
                            value={condition.selectOperation}
                            onChange={(e) =>
                                isGrouped
                                    ? handleChangeInner(outerIndex, innerIndex, "selectOperation", e.target.value, level)
                                    : handleChange(outerIndex, "selectOperation", e.target.value)
                            }
                            disabled={isDisabled(level+1)} // Editable for level 0, 1, 2
                        >
                            <option value="AND">AND</option>
                            <option value="OR">OR</option>
                        </select>
                    </td>
                    <td style={{ width: '90%' }}>
                        {condition.rows.map((row, i) => (
                            <div key={i}>
                                {renderConditionRow(row, outerIndex, i, true, level + 1)} {/* Increment level */}
                            </div>
                        ))}
                    </td>
                </tr>
                </tbody>
            </table>
        ) : (
            <div style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
                {!isGrouped && (
                    <input
                        type="checkbox"
                        checked={isGrouped ? condition.checked : selectedRows.includes(outerIndex)}
                        onChange={() =>
                            isGrouped
                                ? handleChangeInner(outerIndex, innerIndex, "checked", !condition.checked, level)
                                : handleSelectRow(outerIndex)
                        }
                    />
                )}
                <select
                    value={condition.source}
                    onChange={(e) =>
                        isGrouped
                            ? handleChangeInner(outerIndex, innerIndex, "source", e.target.value, level)
                            : handleChange(outerIndex, "source", e.target.value)
                    }
                    disabled={isDisabled(level)} // Editable for level 0, 1, 2
                >
                    <option value="">Select Source</option>
                    <option value="Request">Request</option>
                    <option value="Identity">Identity</option>
                </select>
                {condition.source === "Request" && (
                    <div>
                        <select
                            value={condition.requestAttribute}
                            onChange={(e) =>
                                isGrouped
                                    ? handleChangeInner(outerIndex, innerIndex, "requestAttribute", e.target.value, level)
                                    : handleChange(outerIndex, "requestAttribute", e.target.value)
                            }
                            disabled={isDisabled(level)} // Editable for level 0, 1, 2
                        >
                            <option value="">Select Request Attribute</option>
                            <option value="accountOperation">accountOperation</option>
                            <option value="band">band</option>
                        </select>
                        {condition.requestAttribute === "accountOperation" ? (
                            <div>
                                <select
                                    value={condition.requestValue}
                                    onChange={(e) =>
                                        isGrouped
                                            ? handleChangeInner(outerIndex, innerIndex, "requestValue", e.target.value, level)
                                            : handleChange(outerIndex, "requestValue", e.target.value)
                                    }
                                    disabled={isDisabled(level)} // Editable for level 0, 1, 2
                                >
                                    <option value="">Select</option>
                                    <option value="add">add</option>
                                    <option value="remove">remove</option>
                                    <option value="reject">reject</option>
                                    <option value="cancel">cancel</option>
                                    <option value="update">update</option>
                                </select>
                            </div>
                        ) : (
                            <input
                                type="text"
                                value={condition.requestValue}
                                onChange={(e) =>
                                    isGrouped
                                        ? handleChangeInner(outerIndex, innerIndex, "requestValue", e.target.value, level)
                                        : handleChange(outerIndex, "requestValue", e.target.value)
                                }
                                disabled={isDisabled(level)} // Editable for level 0, 1, 2
                            />
                        )}

                    </div>
                )}

                {condition.source === "Identity" && (
                    <div>
                        <select
                            value={condition.identityAttribute}
                            onChange={(e) =>
                                isGrouped
                                    ? handleChangeInner(outerIndex, innerIndex, "identityAttribute", e.target.value, level)
                                    : handleChange(outerIndex, "identityAttribute", e.target.value)
                            }
                            disabled={isDisabled(level)} // Editable for level 0, 1, 2
                        >
                            <option value="">Select Identity Attribute</option>
                            <option value="nationality">nationality</option>
                            <option value="department">department</option>
                        </select>
                        { (
                            <input
                                type="text"
                                value={condition.identityValue}
                                onChange={(e) =>
                                    isGrouped
                                        ? handleChangeInner(outerIndex, innerIndex, "identityValue", e.target.value, level)
                                        : handleChange(outerIndex, "identityValue", e.target.value)
                                }
                                disabled={isDisabled(level)} // Editable for level 0, 1, 2
                            />
                        )}

                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="col-md-12 pad-1 card-rounded" style={{ width: '100%' }}>
            <button className="btn btn-primary mb-2" onClick={handleAddConditionRow}>
                Add Condition Row
            </button>
            {isAddClicked && conditions.length > 0 ? (
                <table style={{ width: '100%' }}>
                    <tbody>
                    <tr>
                        <td style={{ width: '10%' }}>
                            <select
                                className="form-control"
                                value={selectOperation}
                                onChange={(e) => setSelectOperation(e.target.value)}
                            >
                                <option value="AND">AND</option>
                                <option value="OR">OR</option>
                            </select>
                        </td>
                        <td style={{ width: '90%' }}>
                            {conditions.map((condition, index) => (
                                <div key={index}>{renderConditionRow(condition, index)}</div>
                            ))}
                        </td>
                    </tr>
                    </tbody>
                </table>
            ) : null}
            {conditions.length > 0 &&
                <div className="mt-3">
                <button className="btn btn-info m-1" onClick={handleGroupSelected}>
                    Group Selected
                </button>
                <button className="btn btn-info m-1" onClick={handleUngroupSelected}>
                    Un-group Selected
                </button>
                <button className="btn btn-danger m-1" onClick={handleDeleteSelected}>
                    Delete Selected
                </button>
            </div>
            }
            <pre>{JSON.stringify({Data:format(conditions, selectOperation)}, null,2)}</pre>
        </div>
    );

};

export default RuleConditionRows;
