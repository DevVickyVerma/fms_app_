import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import {BsDroplet} from "react-icons/bs";
import { AiOutlineBarChart, AiOutlineEuroCircle, AiOutlinePauseCircle } from "react-icons/ai";
import {HiOutlineCircleStack} from "react-icons/hi2";
import { Padding } from "@mui/icons-material";
import { useLocation } from "react-router-dom";


const DashTopSubHeading = (props) => {
  // const location = useLocation();
  // console.log(location , "my location");
  // const {passData} = location.state;
  // if (passData.length) {
  //   console.log("my data us passed or not ", passData); 
  // }
  return (
    <div style={{marginBottom:"20px"}}>
    <Box
      width={"100%"}
      height={"60px"}
      bgcolor={"#ffffff"}
      color={"black"}
      mb={"20px"}
      display={"flex"}
      alignItems={"center"}
      justifyContent="center"
      gap={4}
      p={0}
      boxShadow="0px 10px 10px -5px rgba(0,0,0,0.5)"
    >
      <Box
        flex={1}
        borderRight="1px solid #2a282863"
        height={"100%"}
        alignItems={"center"}
        display={"flex"}
        px={"20px"}
      >
      <BsDroplet size={"22px"} color="red" />
        {/* <WaterDropIcon /> */}
        <Box flexGrow={1} ml={2}>
        <Typography variant="body3" sx={{ opacity: 0.5 }} >Your Text</Typography>
          <Typography variant="body1">2000 ppl</Typography>
        </Box>
        <Typography variant="body1">75%</Typography>
      </Box>
      <Box
        flex={1}
        borderRight="1px solid  #2a282863"
        alignItems={"center"}
        display={"flex"}
        height={"100%"}
        pr={"20px"}

      >
        <AiOutlinePauseCircle size={"22px"} color="red"/>
        <Box flexGrow={1} ml={2}>
          <Typography variant="body3" sx={{ opacity: 0.5 }} >Your Text</Typography>
          <Typography variant="body1">2000 ppl</Typography>
        </Box>
        <Typography variant="body1">75%</Typography>
      </Box>
      <Box
        flex={1}
        borderRight="1px solid  #2a282863"
        alignItems={"center"}
        display={"flex"}
        height={"100%"}
        pr={"20px"}

      >
        <AiOutlineBarChart size={"22px"} color="red" />

        <Box flexGrow={1} ml={2}>
          <Typography variant="body3" sx={{ opacity: 0.5 }} >Your Text</Typography>
          <Typography variant="body1">2000 ppl</Typography>
        </Box>
        <Typography variant="body1">75%</Typography>
      </Box>
      <Box flex={1} alignItems={"center"} display={"flex"} height={"100%"} 
      pr={"20px"} 
      >
      <AiOutlineEuroCircle size={"22px"} color="red" />
        
        <Box flexGrow={1} ml={2}>
        <Typography variant="body3" sx={{ opacity: 0.5 }} >Your Text</Typography>
          <Typography variant="body1">2000 ppl</Typography>
        </Box>
        <Typography variant="body1">75%</Typography>
      </Box>
    </Box>
    </div>
  );
};

export default DashTopSubHeading;
