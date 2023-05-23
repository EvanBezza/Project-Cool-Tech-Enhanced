import React, { useState, useEffect } from 'react'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [newRole, setNewRole] = useState('')
  const [selectedUserData, setSelectedUserData] = useState(null)
  const [divisions, setDivisions] = useState([])
  const [selectedDivisions, setSelectedDivisions] = useState([])
  const [ous, setOUs] = useState([])
  const [selectedOUs, setSelectedOUs] = useState([])

  useEffect(() => {
    fetchUsers()
    fetchDivisions()
    fetchOUs()
  }, [])

  useEffect(() => {
    if (selectedUserData) {
      setSelectedUserData(selectedUserData)
      setSelectedDivisions(selectedUserData.divisions || [])
      setSelectedOUs(selectedUserData.OUs || [])
    }
  }, [selectedUserData])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/getUsers', {
        headers: {
          Authorization: sessionStorage.getItem('token'),
        },
      })
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchDivisions = async () => {
    try {
      const response = await fetch('/getDivisions', {
        headers: {
          Authorization: sessionStorage.getItem('token'),
        },
      })
      const data = await response.json()
      setDivisions(data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchOUs = async () => {
    try {
      const response = await fetch('/getOUs', {
        headers: {
          Authorization: sessionStorage.getItem('token'),
        },
      })
      const data = await response.json()
      setOUs(data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleChangeRole = async () => {
    if (!selectedUserData || !newRole) {
      return
    }

    try {
      await fetch(`/changeUserRole/${selectedUserData._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({ role: newRole }),
      })

      // Update the user list with the new role
      const updatedUsers = users.map((user) => {
        if (user._id === selectedUserData._id) {
          return { ...user, role: newRole }
        }
        return user
      })
      setUsers(updatedUsers)

      // Update selected user data with the new role
      setSelectedUserData({ ...selectedUserData, role: newRole })
    } catch (error) {
      console.log(error)
    }
  }

  const handleUserClick = (user) => {
    setSelectedUserData(user)
    setSelectedDivisions(user.divisions || [])
    setSelectedOUs(user.OUs || [])
  }

  const handleAssignDivision = async (divisionId) => {
    if (!selectedUserData || !divisionId) {
      return
    }

    // Check if the division is already assigned to the user
    if (selectedDivisions.includes(divisionId)) {
      return
    }

    try {
      await fetch('/assignUserToDivision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({ userId: selectedUserData._id, divisionId }),
      })

      setSelectedDivisions([...selectedDivisions, divisionId])
    } catch (error) {
      console.log(error)
    }
  }

  const handleRemoveDivision = async (divisionId) => {
    if (!selectedUserData || !divisionId) {
      return
    }

    try {
      await fetch('/removeUserFromDivision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({ userId: selectedUserData._id, divisionId }),
      })

      setSelectedDivisions((prevDivisions) =>
        prevDivisions.filter((division) => division !== divisionId),
      )
    } catch (error) {
      console.log(error)
    }
  }

  const handleAssignOU = async (ouId) => {
    if (!selectedUserData || !ouId) {
      return
    }

    // Check if the OU is already assigned to the user
    if (selectedOUs.includes(ouId)) {
      return
    }

    try {
      await fetch('/assignUserToOU', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({ userId: selectedUserData._id, ouId }),
      })

      setSelectedOUs([...selectedOUs, ouId])
    } catch (error) {
      console.log(error)
    }
  }

  const handleRemoveOU = async (ouId) => {
    if (!selectedUserData || !ouId) {
      return
    }

    try {
      await fetch('/removeUserFromOU', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({ userId: selectedUserData._id, ouId }),
      })

      setSelectedOUs((prevOUs) => prevOUs.filter((ou) => ou !== ouId))
    } catch (error) {
      console.log(error)
    }
  }

  const closeCard = () => {
    setSelectedUserData(null)
    setSelectedDivisions([])
    setSelectedOUs([])
  }

  return (
    <div>
      <h1>User Management</h1>

      <h2>Change User Role</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Role/Target</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} onClick={() => handleUserClick(user)}>
              <td>{user.username}</td>
              <td>{user.role || user.target}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUserData && (
        <div className="card">
          <div className="card-header">
            <h3>User Details</h3>
          </div>
          <div className="card-body">
            <p>Username: {selectedUserData.username}</p>
            <p>Role: {selectedUserData.role || selectedUserData.target}</p>
            <h4>Update Role</h4>
            <select
              value={selectedUserData.role || selectedUserData.target}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option>Select a new role...</option>
              <option value="normal">Normal</option>
              <option value="management">Management</option>
              <option value="admin">Admin</option>
            </select>
            <button type="button" onClick={handleChangeRole}>
              Change Role
            </button>

            <h4>Assigned Divisions</h4>
            <ul>
              {selectedDivisions.map((division) => {
                const foundDivision = divisions.find(
                  (item) => item._id === division,
                )
                return (
                  <li key={division}>
                    {foundDivision ? foundDivision.name : ''}
                  </li>
                )
              })}
            </ul>

            <h4>Assign/Remove Divisions</h4>
            <select onChange={(e) => handleAssignDivision(e.target.value)}>
              <option>Select a division to assign...</option>
              {divisions.map((division) => (
                <option key={division._id} value={division._id}>
                  {division.name}
                </option>
              ))}
            </select>
            <select onChange={(e) => handleRemoveDivision(e.target.value)}>
              <option>Select a division to remove...</option>
              {selectedDivisions.map((division) => {
                const foundDivision = divisions.find(
                  (item) => item._id === division,
                )
                return (
                  <option key={division} value={division}>
                    {foundDivision ? foundDivision.name : ''}
                  </option>
                )
              })}
            </select>

            <h4>Assigned OUs</h4>
            <ul>
              {selectedOUs.map((ou) => {
                const foundOU = ous.find((item) => item._id === ou)
                return <li key={ou}>{foundOU ? foundOU.name : ''}</li>
              })}
            </ul>

            <h4>Assign/Remove OUs</h4>
            <select onChange={(e) => handleAssignOU(e.target.value)}>
              <option>Select an OU to assign...</option>
              {ous.map((ou) => (
                <option key={ou._id} value={ou._id}>
                  {ou.name}
                </option>
              ))}
            </select>
            <select onChange={(e) => handleRemoveOU(e.target.value)}>
              <option>Select an OU to remove...</option>
              {selectedOUs.map((ou) => {
                const foundOU = ous.find((item) => item._id === ou)
                return (
                  <option key={ou} value={ou}>
                    {foundOU ? foundOU.name : ''}
                  </option>
                )
              })}
            </select>
          </div>
          <div className="card-footer">
            <button onClick={closeCard}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement
