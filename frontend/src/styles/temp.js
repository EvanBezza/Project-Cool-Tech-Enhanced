import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateCredential = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [target, setTarget] = useState("");
  const navigate = useNavigate();
  const { credentialId } = useParams(); //get credential id from url parameters

  useEffect(() => {
    fetchCredential();
  }, []);

  const fetchCredential = async () => {
    try {
      const response = await fetch(`/getCredentials/${credentialId}`, {
        headers: {
          Authorization: sessionStorage.getItem('token'),
        },
      });
      const data = await response.json();
      setUsername(data.username);
      setPassword(data.password);
      setTarget(data.target);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`/updateCredential/${credentialId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({ username, password, target }),
      });
      navigate('/credential-list');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Update Credential</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <label>
          Target:
          <input type="text" value={target} onChange={(e) => setTarget(e.target.value)} />
        </label>
        <br />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateCredential;
