import React, { useState } from 'react';
import axios from 'axios';

const Homepage = () => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
  };
  //https://c1.wallpaperflare.com/preview/266/2/416/electrical-data-center-complete-sets-of-cabinet.jpg
  return (
    
    <div
      className='min-h-screen'
      style={{
        margin: '0 auto',
        textAlign: 'center',
        backgroundImage: 'url("https://t4.ftcdn.net/jpg/02/46/11/45/360_F_246114560_O7EKssDoFwNRsuJQJ8fXn760wH9ubhnq.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
    <div className='flex justify-between p-1' style={{ color: 'white' }}>
        <h1>Home Page</h1>
    </div>
    <div className='flex justify-between p-4' style={{ color: 'white' }}>
        <h2>Welcome Back, ML Guy</h2>
    </div>

      
      <select value={selectedOption} onChange={handleDropdownChange}
      style={{
        backgroundColor: 'white',
        color: 'black',
        fontSize: '20px',
        // Add more styles as needed
      }}
      >
        <option value="">Select Form</option>
        <option value="form1">Dockerhub Image</option>
        <option value="form2">Code Files</option>
      </select>

      <div style={{ marginTop: '20px' }}>
        {selectedOption === 'form1' && <Form1 />}
        {selectedOption === 'form2' && <Form2 />}
      </div>
    </div>
  );
};

const Form1 = () => {
  const [dockerhubImage, setDockerhubImage] = useState('');

  const submitImage = (event) => {
    setDockerhubImage(event.target.value);
  };

  function handleCreatePod(event) {
    event.preventDefault();
    axios
      .post('http://localhost:4001/dockerImageName', { DockerImage: dockerhubImage })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          alert('Next step is to automate pod creation for the given docker container!!');
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '20px', marginTop: '30px' }}>
      <div class="input-group mb-4 w-60" style={{ margin: '0 auto', textAlign: 'center', display: 'block' }}>
        <h4>Dockerhub details</h4>
      </div>
     
      <div>
        <span class="input-group-text" id="container-name" style={{ width: '400px' ,  fontWeight: 'bold'}}>
          Container details
        </span>
        <input
          type="text"
          class="form-control"
          name="dockerhubImage"
          value={dockerhubImage}
          onChange={(e) => setDockerhubImage(e.target.value)}
          placeholder="e.g, userName/containerName:tagname"
          aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-default"
          style={{ width: '400px' }}
        ></input>
      </div>
      <button type="button" class="btn btn-primary" onClick={handleCreatePod}>
        Create Pod
      </button>
    </div>
  );
};

const Form2 = () => {
  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '20px', marginTop: '30px' }}>
      <div class="input-group mb-4 w-60" style={{ margin: '0 auto', textAlign: 'center', display: 'block' }}>
        <h4>Expected input</h4>
      </div>

        <div>
          <span class="input-group-text" id="container-name-1" style={{ width: '400px' ,  fontWeight: 'bold'}}>
            Base Image
          </span>
          <input
            type="text"
            class="form-control"
            placeholder="e.g, Python, Node.js, Ubuntu"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
            style={{ width: '400px' }}
          ></input>
        </div>

        <div>
          <div class="mb-3">
            <label for="formFile" class="form-label" style={{ width: '400px' ,  fontWeight: 'bold' }}>
              requirements.txt file
            </label>
            <input class="form-control" type="file" id="formFile" style={{ width: '400px' }}></input>
          </div>
        </div>

        <div>
          <div class="mb-3">
            <label for="formFile" class="form-label" style={{ width: '400px' ,  fontWeight: 'bold' }}>
              soruce code(zipped format)
            </label>
            <input class="form-control" type="file" id="formFile" style={{ width: '400px' }}></input>
          </div>
        </div>

        <div>
          <span class="input-group-text" id="container-name-3" style={{ width: '400px', color: 'black',  fontWeight: 'bold' }}>
            Provide startup command
          </span>
          <input
            type="text"
            class="form-control"
            placeholder="e.g, python main.py"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
            style={{ width: '400px' }}
          ></input>
        </div>

      <button type="button" class="btn btn-primary" onClick="">
        Create Pod
      </button>
    </div>
  );
};

export default Homepage;
