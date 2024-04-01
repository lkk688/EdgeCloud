import React, { useState } from 'react';
import axios from 'axios';

const Triggerpod = () => {
    const [selectedOption, setSelectedOption] = useState('');

    const handleDropdownChange = (event) => {
        setSelectedOption(event.target.value);
    };
    return(
    
            <div
              className='min-h-screen'
              style={{
                margin: '0 auto',
                textAlign: 'center',
                backgroundImage: 'url("https://newrelic.com/sites/default/files/styles/og_image/public/2021-04/infinity-symbol-min_0.jpg?h=77039d24&itok=haBHyAr5")',
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
                <h1>Trigger Pod</h1>
            </div>
            <div className='flex justify-between p-4' style={{ color: 'white' }}>
                <h2>Select the pod from the below dropdown</h2>
            </div>
        
              
              <select value={selectedOption} onChange={handleDropdownChange}
              style={{
                backgroundColor: 'white',
                color: 'black',
                fontSize: '20px',
                // Add more styles as needed
              }}
              >
                <option value="">Select Created Pod to trigger</option>
                <option value="mnist">Mnist-App</option>
                <option value="imgcap">Image-Captioning-App</option>
                <option value="nlp">NLP-App</option>
                <option value="mnist2">Mnist-App-2</option>
              </select>
        
              <div style={{ marginTop: '20px' }}>
                {selectedOption === 'mnist' && <Mnist />}
                {selectedOption === 'imgcap' && <Imgcap /> }
                {selectedOption === 'nlp' && <Nlp />}
                {selectedOption === 'Mnist2' && <Mnist2/>}
              </div>
            </div>
          );
    };

    const Mnist = () => {
        return(
            <div>
                <button type="button" class="btn btn-success" >
                Trigger Pod
            </button>
            </div>
        );
    }

    const Imgcap = () => {
        return(
            <div>
                <button type="button" class="btn btn-success" >
                Trigger Pod
            </button>
            </div>
        );
    }

    const Nlp = () => {
        return(
            <div>
                <button type="button" class="btn btn-success" >
                Trigger Pod
            </button>
            </div>
        );
    }

    const Mnist2 = () => {
        return(
            <div>
                <button type="button" class="btn btn-success" >
                Trigger Pod
            </button>
            </div>
        );
    }
export default Triggerpod;