import React from "react";

import * as loderdata from "../data/Component/loderdata/loderdata";
import { Card, Collapse } from "react-bootstrap";
import { ColorRing } from "react-loader-spinner";

const Loaderimg = () => {
  const [expanded, setExpanded] = React.useState(true);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <div id="global-loader">
      <div class="fullscreen">
        <Card className="card card-none">
          <Collapse in={expanded} timeout="auto">
            <div className="card-body ">
              <div className="dimmer active">
                <ColorRing
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="blocks-loading"
                  wrapperStyle={{}}
                  wrapperClass="blocks-wrapper"
                  // colors={['#6259ca', '#423c8c', '#ff002f','#ff002f','#6259ca']}
                  colors={[
                    "#6259ca",
                    "#6259ca",
                    "#6259ca",
                    "#6259ca",
                    "#6259ca",
                  ]}
                />
              </div>
            </div>
          </Collapse>
        </Card>
      </div>
    </div>
  );
};

export default Loaderimg;
