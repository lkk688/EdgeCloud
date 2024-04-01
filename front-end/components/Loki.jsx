import React from 'react'

//configuration file that has the values stored for users
// import config from './config'

class Loki extends React.Component {
    render() {
        //suppose user is received from props
        const { user } = this.props
        return (
            <>
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
                    <iframe src="http://localhost:3000/d-solo/c1a37387-a47e-4671-b31b-e255ccc0bc3d/loki-dashboard?orgId=1&refresh=30s&panelId=7" width="1400" height="200" frameborder="0"></iframe>
                }
                {
                  <iframe src="http://localhost:3000/d-solo/c1a37387-a47e-4671-b31b-e255ccc0bc3d/loki-dashboard?orgId=1&refresh=30s&panelId=5" width="1400" height="200" frameborder="0"></iframe>
                }
                {/* {
                    <iframe src="http://localhost:3000/d-solo/c1a37387-a47e-4671-b31b-e255ccc0bc3d/loki-dashboard?orgId=1&refresh=30s&from=1698281520697&to=1698283320697&panelId=4" width="450" height="200" frameborder="0"></iframe>
                } */}
                
            </>
        )
    }
}

export default Loki;
