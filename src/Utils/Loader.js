import React from 'react';

import * as loderdata from "../data/Component/loderdata/loderdata"
import { Card, Collapse } from 'react-bootstrap';
import { ColorRing } from 'react-loader-spinner';

const Loaderimg = () => {

    const [expanded, setExpanded] = React.useState(true);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <div id="global-loader">
      <div class="fullscreen">
      <Card className="card">
        <Collapse in={expanded} timeout="auto">
          <div className="card-body">
          <div className="dimmer active">
            {/* <div className="dimmer active">
              <div className="spinner1-lg">
                <div className="double-bounce1"></div>
                <div className="double-bounce2"></div>
              </div>
            </div> */}
            <ColorRing
  visible={true}
  height="80"
  width="80"
  ariaLabel="blocks-loading"
  wrapperStyle={{}}
  wrapperClass="blocks-wrapper"
  colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
/>
</div>
          </div>
        </Collapse>
      </Card>
    </div>
    </div>
  );
};

export default Loaderimg
