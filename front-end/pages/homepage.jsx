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
        <option value="">Select Deployment Option</option>
        <option value="form1">Dockerhub Image</option>
        <option value="form3">Github</option>
        <option value="form2">Code Files</option>
        <option value="form4">Local Container</option>
      </select>

      <div style={{ marginTop: '20px' }}>
        {selectedOption === 'form1' && <Form1 />}
        {selectedOption === 'form2' && <Form2 />}
        {selectedOption === 'form3' && <Form3 />}
        {selectedOption === 'form4' && <Form4 />}
      </div>
    </div>
  );
};

const Form1 = () => {
  const [dockerhubImage, setDockerhubImage] = useState('');
  const [appName, setAppName] = useState('');
  const [noOfReps,setNoOfReps] = useState('');
  const [trigCmd, setTrigCmd] = useState('');
  function handleCreatePod(event) {
    event.preventDefault();
    axios
      .post('http://localhost:4001/dockerImageName', { 
        dockerHubImage : dockerhubImage,
        appName: appName,
        replicas: noOfReps,
        command: trigCmd
       })
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
        {/* From dockerhub images from the cloud */}
        <h4>Dockerhub details</h4>
      </div>
     
      <div>
        {/* container details */}
        <span class="input-group-text" id="container-name" style={{ width: '400px' ,  fontWeight: 'bold'}}>
          Dockerhub image
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

        {/* app-name */}
        <span class="input-group-text" id="app-name" style={{ width: '400px' ,  fontWeight: 'bold'}}>
          App name
        </span>
        <input
          type="text"
          class="form-control"
          name="appname"
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
          placeholder=""
          aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-default"
          style={{ width: '400px' }}
        ></input>

        {/* number of replicas */}
        <span class="input-group-text" id="replicas" style={{ width: '400px' ,  fontWeight: 'bold'}}>
          number of replicas
        </span>
        <input
          type="text"
          class="form-control"
          name="noOfReps"
          value={noOfReps}
          onChange={(e) => setNoOfReps(e.target.value)}
          placeholder=""
          aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-default"
          style={{ width: '400px' }}
        ></input>

        {/* trigCmd */}
        <span class="input-group-text" id="command" style={{ width: '400px' ,  fontWeight: 'bold'}}>
          trigger command
        </span>
        <input
          type="text"
          class="form-control"
          name="trigCmd"
          value={trigCmd}
          onChange={(e) => setTrigCmd(e.target.value)}
          placeholder="e.g, python app/mnist-main.py"
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

  

  const [baseImage, setBaseImage] = useState('');
  const [requirementsTxtPath, setRequirementsTxtPath] = useState('');
  const [applicationCodeFolderPath,setApplicationCodeFolderPath] = useState('');
  const [triggerCmd, setTriggerCmd] = useState('');
  function handleCreatePod(event) {
    event.preventDefault();
    axios
      .post('http://localhost:4001/codeFiles', { 
        baseImage : baseImage,
        requirementsTxtPath: requirementsTxtPath,
        applicationCodeFolderPath: applicationCodeFolderPath,
        triggerCmd: triggerCmd
       })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          alert('Next step is to automate pod creation for the given application code!!');
        }
      })
      .catch((err) => console.log(err));
  }
  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '20px', marginTop: '30px' }}>
      <div class="input-group mb-4 w-60" style={{ margin: '0 auto', textAlign: 'center', display: 'block' }}>
        <h4>Expected input</h4>
      </div>

        {/* Base Image Name */}
        <div>
          <span class="input-group-text" id="base-image" style={{ width: '400px' ,  fontWeight: 'bold'}}>
            Base Image
          </span>
          <input
            type="text"
            class="form-control"
            onChange={(e) => setBaseImage(e.target.value)}
            placeholder="e.g, Python, Node.js, Ubuntu"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
            style={{ width: '400px' }}
          ></input>
        </div>

        {/* requirements.txt path */}
        <div>
          {/* <div class="mb-3">
            <label for="formFile" class="form-label" style={{ width: '400px' ,  fontWeight: 'bold' }}>
              requirements.txt file
            </label>
            <input class="form-control" type="file" id="formFile" style={{ width: '400px' }}></input>
          </div> */}

          <span class="input-group-text" id="requirements-txt" style={{ width: '400px' ,  fontWeight: 'bold'}}>
            requirements.txt absolute path
          </span>
          <input
            type="text"
            class="form-control"
            placeholder=""
            onChange={(e) => setRequirementsTxtPath(e.target.value)}
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
            style={{ width: '400px' }}
          ></input>

        </div>

        {/* application code path */}
        <div>
          {/* <div class="mb-3">
            <label for="formFile" class="form-label" style={{ width: '400px' ,  fontWeight: 'bold' }}>
              soruce code(zipped format)
            </label>
            <input class="form-control" type="file" id="formFile" style={{ width: '400px' }}></input>
          </div> */}

          <span class="input-group-text" id="application-path" style={{ width: '400px' ,  fontWeight: 'bold'}}>
            Application code folder path
          </span>
          <input
            type="text"
            class="form-control"
            placeholder=""
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
            onChange={(e) => setApplicationCodeFolderPath(e.target.value)}
            style={{ width: '400px' }}
          ></input>
        </div>

        {/* TriggerCmd */}
        <div>
          <span class="input-group-text" id="container-name-3" style={{ width: '400px', color: 'black',  fontWeight: 'bold' }}>
            Trigger command
          </span>
          <input
            type="text"
            class="form-control"
            placeholder="e.g, python main.py"
            aria-label="Sizing example input"
            onChange={(e) => setTriggerCmd(e.target.value)}
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

const Form3 = () => {

  const [gitCloneURL, setgitCloneURL] = useState('');
  const [execCMD, setexecCMD] = useState('');
  const setGithub = ''

  function handleCreatePod(event) {
    event.preventDefault();
    axios
      .post('http://localhost:4001/githubPodDetails', { 
        githubUrl : gitCloneURL,
        executionCommand: execCMD
       })
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
        <h4>Github inputs</h4>
      </div>

        <div>
          <span class="input-group-text" id="container-name-1" style={{ width: '400px' ,  fontWeight: 'bold'}}>
            Github repository URL
          </span>
          <input
            type="text"
            class="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
            style={{ width: '400px' }}
            value={setGithub}
            onChange={(e) => 
              {
                setgitCloneURL(e.target.value);
                setexecCMD(e.target.value)
              }
            }
          ></input>
        </div>


        <div>
          <span class="input-group-text" id="container-name-3" style={{ width: '400px', color: 'black',  fontWeight: 'bold' }}>
            execution command
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

      <button type="button" class="btn btn-primary" onClick={handleCreatePod}>
        Create Pod
      </button>
    </div>
  );
};

const Form4 = () => {
  const [containerLocation, setContainerLocation ] = useState('');
  const [appName, setAppName] = useState('');
  const [noOfReps,setNoOfReps] = useState('');
  const [trigCmd, setTrigCmd] = useState('');
  function handleCreatePod(event) {
    event.preventDefault();
    axios
      .post('http://localhost:4001/localcontainer', { 
        containerLocation : containerLocation,
        appName: appName,
        replicas: noOfReps,
        command: trigCmd
       })
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
        {/* local docker */}
        <h4>Local docker</h4>
      </div>
     
      <div>
        
        {/* local container files location THIS MIGHT CHANGE LATER */}
        <span class="input-group-text" id="app-name" style={{ width: '400px' ,  fontWeight: 'bold'}}>
          local container image details
        </span>
        <input
          type="text"
          class="form-control"
          name="appname"
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
          placeholder=""
          aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-default"
          style={{ width: '400px' }}
        ></input>


        {/* app-name */}
        <span class="input-group-text" id="app-name" style={{ width: '400px' ,  fontWeight: 'bold'}}>
          App name
        </span>
        <input
          type="text"
          class="form-control"
          name="appname"
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
          placeholder=""
          aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-default"
          style={{ width: '400px' }}
        ></input>

        {/* number of replicas */}
        <span class="input-group-text" id="replicas" style={{ width: '400px' ,  fontWeight: 'bold'}}>
          number of replicas
        </span>
        <input
          type="text"
          class="form-control"
          name="noOfReps"
          value={noOfReps}
          onChange={(e) => setNoOfReps(e.target.value)}
          placeholder=""
          aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-default"
          style={{ width: '400px' }}
        ></input>

        {/* trigCmd */}
        <span class="input-group-text" id="command" style={{ width: '400px' ,  fontWeight: 'bold'}}>
          trigger command
        </span>
        <input
          type="text"
          class="form-control"
          name="trigCmd"
          value={trigCmd}
          onChange={(e) => setTrigCmd(e.target.value)}
          placeholder="e.g, python app/mnist-main.py"
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

export default Homepage;
