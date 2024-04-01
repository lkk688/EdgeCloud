import React from 'react'

//configuration file that has the values stored for users
// import config from './config'



class GrafanaGPUMetrics extends React.Component {
  componentDidMount() {
    this.reloadIframes(); // Initial iframe reload

    // Set up an interval to reload the iframes every 2 seconds (2000 milliseconds)
    this.reloadInterval = setInterval(() => {
      this.reloadIframes();
    }, 2000);
  }

  componentWillUnmount() {
    // Clear the interval when the component unmounts to prevent memory leaks
    clearInterval(this.reloadInterval);
  }

  reloadIframes() {
    // Get all the iframes by their id and reload them
    const iframes = document.querySelectorAll('#iframes');
    iframes.forEach((iframe) => {
      if (iframe.contentDocument) {
        iframe.contentDocument.location.reload(true);
      }
    });
  }
    render() {
        //suppose user is received from props
        const { user } = this.props
        return (
          
            <>
            {/* <div>
            document.getElementById("iframes").contentDocument.location.reload(true);
            </div> */}
            {/* <div><button onClick={() => { this.resetIframe(); }}>Reset</button></div> */}
              {/* <div>
        <h2>GPU Metrics</h2>
            </div> */}
            
                {/** different dashboards for different organizations
                 * depending upon the parameters their panels value changes
                 */}
                {/* {(config.roles.user1_org1 === user.role.id) &&
                    <iframe
                        src={`https://${config.sampleDash.organization1.username}:${config.sampleDash.organization1.password}@authproxy.sampleDomain/z/aaaaaaaaa/organization_1?orgId=1&from=now-90d&to=now&var-org_user=${type}&var-state=${state}&var-top=5&kiosk=tv`} />
                }
                {(config.roles.user2_org3 === user.role.id) &&
                    <iframe
                        src={`https://${config.sampleDash.organization3.username}:${config.sampleDash.organization3.password}@authproxy.sampleDomain/z/ccccccccc/organization_3?orgId=3&from=now-90d&to=now&var-org_user=${user.username}&var-city=${city}&kiosk=tv`} />
                } */}
                {
                  <iframe src="http://localhost:3000/d-solo/Oxed_c6Wz/nvidia-dcgm-exporter-dashboard?orgId=1&panelId=12" width="450" height="200" frameborder="0" id = "iframes"></iframe>                
                  }
                {
                  <iframe src="http://localhost:3000/d-solo/Oxed_c6Wz/nvidia-dcgm-exporter-dashboard?orgId=1&panelId=14" width="450" height="200" frameborder="0" id = "iframes"></iframe>                
                  }
                {
                  <iframe src="http://localhost:3000/d-solo/Oxed_c6Wz/nvidia-dcgm-exporter-dashboard?orgId=1&panelId=10" width="450" height="200" frameborder="0" id = "iframes"></iframe>                
                  }
                {
                  <iframe src="http://localhost:3000/d-solo/Oxed_c6Wz/nvidia-dcgm-exporter-dashboard?orgId=1&panelId=16" width="450" height="200" frameborder="0" id = "iframes"></iframe>                
                  }
                {
                  <iframe src="http://localhost:3000/d-solo/Oxed_c6Wz/nvidia-dcgm-exporter-dashboard?orgId=1&panelId=2" width="450" height="200" frameborder="0" id = "iframes"></iframe>                
                  }
                {
                  <iframe src="http://localhost:3000/d-solo/Oxed_c6Wz/nvidia-dcgm-exporter-dashboard?orgId=1&panelId=6" width="450" height="200" frameborder="0" id = "iframes"></iframe>                
                  }
                {
                  <iframe src="http://localhost:3000/d-solo/oOSnZg7mz/node-dashboard?orgId=1&panelId=74" width="450" height="200" frameborder="0" id = "iframes"></iframe>
                }
                {
                  <iframe src="http://localhost:3000/d-solo/oOSnZg7mz/node-dashboard?orgId=1&panelId=32" width="450" height="200" frameborder="0" id = "iframes"></iframe>
                }
                {
                  <iframe src="http://localhost:3000/d-solo/oOSnZg7mz/node-dashboard?orgId=1&panelId=84" width="450" height="200" frameborder="0"></iframe>
                }
            </>
        )
    }
}

export default GrafanaGPUMetrics;
