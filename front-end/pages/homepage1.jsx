import React, { useState } from 'react';

const Homepage = () => {
  const [baseImage, setBaseImage] = useState('');
  const [startCommand, setStartCommand] = useState('');

  const handleCreatePod = () => {
    const data = {
      baseImage,
      startCommand,
    };

    fetch('/api/update-dockerfile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Dockerfile data updated:', data);
      })
      .catch(error => {
        console.error('Error updating Dockerfile data:', error);
      });
  };

  return (
    <div>
        <div className='bg-gray-100 min-h-screen' style={{ margin: '0 auto', textAlign: 'center' }}>
      <div className='flex justify-between p-4'>
        <h2>Home Page development ----in progress</h2>
        <h2>Welcome Back, ML Guy</h2>
        
      </div>

      <div class="input-group mb-3 w-25" style={{ margin: '0 auto', textAlign: 'center', display: 'block' }}>
      <h4>If you have already cerated container in dockerhub</h4>
        <div>
          <span class="input-group-text" id="container-name">container details</span>
          <input type="text" class="form-control" placeholder="e.g, userName/containerName:tagname" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"></input>
        </div>
        <button type="button" class="btn btn-primary" onClick="">create pod</button>
      </div>

      <div>
        <div class="input-group mb-3 w-25" style={{ margin: '0 auto', textAlign: 'center', display: 'block' }}>
          <h4>If you just have you executable command and files, please provide the following inputs </h4>
        </div>

        <div class="input-group mb-3 w-25" style={{ margin: '0 auto', textAlign: 'center', display: 'block' }}>
          <div>
            <span class="input-group-text" id="container-name-1">Base Image</span>
            <input type="text" class="form-control" placeholder="e.g, Python,Node.js,Ubuntu" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"></input>          
          </div>
        </div>

        <div class="input-group mb-3 w-25" style={{ margin: '0 auto', textAlign: 'center', display: 'block' }}>

          <div>
           {/* <span class="input-group-text" id="container-name-2">Requirements file in txt format</span> */}
           <div class="mb-3">
              <label for="formFile" class="form-label">input requirements.txt file</label>
              <input class="form-control" type="file" id="formFile"></input>
            </div>
            {/* <input type="text" class="form-control" placeholder="add all the requirements along with version with line breaks" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"></input> */}
          </div>
        </div>

        <div class="input-group mb-3 w-25" style={{ margin: '0 auto', textAlign: 'center', display: 'block' }}>
          <div>
          <span class="input-group-text" id="container-name-3">Provide startup command</span>
          <input type="text" class="form-control" placeholder="e.g, python main.py" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"></input>
        
          </div>
          
        </div>
        <button type="button" class="btn btn-primary" onClick="">create pod</button>
        </div>
      </div>
    </div>

    
  );
};

export default Homepage;
