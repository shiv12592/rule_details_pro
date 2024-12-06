import './App.css';
import { useState, useEffect, useCallback } from "react";
import RuleConditionRows from "./Component/RuleConditionRows";
import SecondaryNavBar from './Component/SecondaryNavBar';

export default function App() {
  const [jsonData, setJsonData] = useState(null);
  const [conditionData, setConditionData] = useState([]);
  const [errorRequestMessages, setErrorMessages] = useState([]);
  const [ruleDetails, setRuleDetails] = useState([]);  // Fetched rules state
  const [showForm, setShowForm] = useState(false); // Control for form visibility
  const [newRule, setNewRule] = useState({ ruleName: '', ruleNo: '', category: '', carId: '', owner: '' }); // Form state
  const [editMode, setEditMode] = useState(false);  // To handle edit mode
  const [editRuleId, setEditRuleId] = useState(null); // Store rule ID to edit

  // Fetch ruleDetails from the backend
  const fetchRules = async () => {
    try {
      const response = await fetch('http://localhost:5000/ruleDetails');
      const data = await response.json();
      setRuleDetails(data);
    } catch (error) {
      console.error('Error fetching rule details:', error);
    }
  };

  useEffect(() => {
    fetchRules(); // Call the fetch function on component mount
  }, []);

  const handleConditionData = useCallback((data) => {
    if (JSON.stringify(data) !== JSON.stringify(conditionData)) {
      setConditionData(data);
    }
  }, [conditionData]);

  const validateData = (data) => {
    if (!data) return [];
    let errors = [];
    const traverse = (obj, path = [], index = 0) => {
      for (const key in obj) {
        if (Array.isArray(obj[key]) && obj[key].length === 0) {
          errors.push(`Array for <${key}> under ${obj.Source ? `${obj.Source} Condition Row Number ${index + 1}` : "condition"} should not be empty.`);
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          traverse(obj[key], [...path, key], index);
        } else if (obj[key] === "") {
          errors.push(`Value for <${key}> under ${obj.Source ? `${obj.Source} Condition Row Number ${index + 1}` : "condition"} should not be empty.`);
        }
      }
    };

    if (data.AND) {
      data.AND.forEach((condition, index) => traverse(condition, ["AND"], index));
    }
    if (data.OR) {
      data.OR.forEach((condition, index) => traverse(condition, ["OR"], index));
    }
    return errors;
  };

  // Handle form input for new rule
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRule({ ...newRule, [name]: value });
  };

  const handleCreateNewRule = () => {
    setShowForm(true);
    setEditMode(false); // Ensure we're not in edit mode
    setNewRule({ ruleName: '', ruleNo: '', category: '', carId: '', owner: '' }); // Reset form fields
    setConditionData([]);
  };

  const handleFormSubmit = async () => {
    const rulePayload = {
      ...newRule,
      conditionData,  // Include conditionData in the payload
    };

    if (editMode) {
      // If we are in edit mode, update the existing rule
      try {
        const errorMessages = validateData(conditionData);
        if (errorMessages.length === 0) {
          const jsonString = JSON.stringify(conditionData, null, 2);
          setJsonData(jsonString);
          setErrorMessages([]);
        } else {
          setErrorMessages(errorMessages);
          return; // Stop if there are validation errors
        }

        const response = await fetch(`http://localhost:5000/ruleDetails/${editRuleId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(rulePayload), // Send the updated rule data with conditionData
        });

        if (response.ok) {
          const updatedRule = await response.json();
          console.log("Rule updated:", updatedRule);

          // Update the ruleDetails state with the updated rule
          setRuleDetails(ruleDetails.map(rule => rule._id === editRuleId ? updatedRule : rule));
        } else {
          console.error('Failed to update rule:', response.statusText);
        }
      } catch (error) {
        console.error('Error during form submission:', error);
      }
    } else {
      // If we are not in edit mode, create a new rule
      try {
        const errorMessages = validateData(conditionData);
        if (errorMessages.length === 0) {
          const jsonString = JSON.stringify(conditionData, null, 2);
          setJsonData(jsonString);
          setErrorMessages([]);
        } else {
          setErrorMessages(errorMessages);
          return; // Stop if there are validation errors
        }

        const response = await fetch('http://localhost:5000/ruleDetails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(rulePayload), // Send the new rule data with conditionData
        });

        if (response.ok) {
          const savedRule = await response.json();
          console.log("New rule saved:", savedRule);

          // Add the newly saved rule to ruleDetails state to show it in the table
          setRuleDetails([...ruleDetails, savedRule]);
        } else {
          console.error('Failed to submit new rule:', response.statusText);
        }
      } catch (error) {
        console.error('Error during form submission:', error);
      }
    }

    setShowForm(false); // Close the form
  };

  const handleModify = (rule) => {
    setShowForm(true);  // Open the form
    setEditMode(true);   // Set edit mode to true
    setEditRuleId(rule._id); // Store the rule ID for updating
    setNewRule({ ruleName: rule.ruleName, ruleNo: rule.ruleNo, category: rule.category, carId: rule.carId, owner: rule.owner }); // Populate form with rule data
    setConditionData(rule.conditionData || []);
  };

  return (
      <div className="container-fluid my-4" style={{ padding: '20px' }}>
        <SecondaryNavBar/>
        <h3 className="text-center mb-4">Existing Rules</h3>
        <table className="table table-bordered text-center" style={{ width: '100%', border: '1px solid black' }}>
          <thead className="thead-light">
          <tr>
            <th style={{ border: '1px solid black' }}>Rule Name</th>
            <th style={{ border: '1px solid black' }}>Rule No</th>
            <th style={{ border: '1px solid black' }}>Category</th>
            <th style={{ border: '1px solid black' }}>Car ID</th>
            <th style={{ border: '1px solid black' }}>Condition</th>
            <th style={{ border: '1px solid black' }}>Owner</th>
            <th style={{ border: '1px solid black' }}>Actions</th>
          </tr>
          </thead>
          <tbody>
          {ruleDetails.map((rule, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid black' }}>{rule.ruleName}</td>
                <td style={{ border: '1px solid black' }}>{rule.ruleNo}</td>
                <td style={{ border: '1px solid black' }}>{rule.category}</td>
                <td style={{ border: '1px solid black' }}>{rule.carId}</td>
                <td style={{ border: '1px solid black' }}>{JSON.stringify(rule.conditionData)}</td> {/* Display condition data */}
                <td style={{ border: '1px solid black' }}>{rule.owner}</td>
                <td style={{ border: '1px solid black' }}>
                  <button className="btn btn-primary" onClick={() => handleModify(rule)}>
                    Modify
                  </button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>

        <div className="text-center mb-4">
          <button className="btn btn-primary" onClick={handleCreateNewRule}>
            Create New Rule
          </button>
        </div>

        {showForm && (
            <div
                className="new-rule-form"
                style={{
                  border: '1px solid black',
                  padding: '20px',
                  width: '98%', // Full width
                  margin: '0 auto',
                }}
            >
              <h4 className="text-center">{editMode ? 'Modify Rule' : 'Create New Rule'}</h4>

              <div className="form-group" style={{ display: 'flex', marginBottom: '15px' }}>
                <label style={{ flex: '30%', textAlign: 'right', paddingRight: '10px' }}>Rule Name:</label>
                <input
                    type="text"
                    className="form-control"
                    name="ruleName"
                    value={newRule.ruleName}
                    onChange={handleInputChange}
                    style={{flex: '70%'}}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', marginBottom: '15px' }}>
                <label style={{ flex: '30%', textAlign: 'right', paddingRight: '10px' }}>Rule No:</label>
                <input
                    type="text"
                    className="form-control"
                    name="ruleNo"
                    value={newRule.ruleNo}
                    onChange={handleInputChange}
                    style={{flex: '70%'}}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', marginBottom: '15px' }}>
                <label style={{ flex: '30%', textAlign: 'right', paddingRight: '10px' }}>Category:</label>
                <input
                    type="text"
                    className="form-control"
                    name="category"
                    value={newRule.category}
                    onChange={handleInputChange}
                    style={{flex: '70%'}}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', marginBottom: '15px' }}>
                <label style={{ flex: '30%', textAlign: 'right', paddingRight: '10px' }}>Car ID:</label>
                <input
                    type="text"
                    className="form-control"
                    name="carId"
                    value={newRule.carId}
                    onChange={handleInputChange}
                    style={{flex: '70%'}}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', marginBottom: '15px' }}>
                <label style={{ flex: '30%', textAlign: 'right', paddingRight: '10px' }}>Owner:</label>
                <input
                    type="text"
                    className="form-control"
                    name="owner"
                    value={newRule.owner}
                    onChange={handleInputChange}
                    style={{flex: '70%'}}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', marginBottom: '15px' }}>
                <label style={{ flex: '30%', textAlign: 'right', paddingRight: '10px' }}>Condition Data:</label>
                <div style={{ flex: '70%' }}>
                  <RuleConditionRows onConditionDataChange={handleConditionData} initialData={conditionData}/>
                </div>
              </div>

              {errorRequestMessages.length > 0 && (
                  <div className="alert alert-danger" style={{border: '1px solid red', padding: '20px'}}>
                    <h5>Error:</h5>
                    {errorRequestMessages.map((error, index) => (
                        <p style={{color:'red'}} key={index}>{`Error ${index + 1}: ${error}`}</p>
                    ))}
                  </div>
              )}

              <div className="text-center">
                <button className="btn btn-primary" onClick={handleFormSubmit}>
                  {editMode ? 'Update Rule' : 'Submit Rule'}
                </button>
              </div>
            </div>
        )}
      </div>
  );
}
