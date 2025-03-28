import React from "react";
import { Box, Typography } from "@mui/material";

const NoDataFound = ({ NoDataMessage }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      height="200px"
      justifyContent="center"
    >
      <Typography variant="body2" className="f-gray" gutterBottom>
        {NoDataMessage}
      </Typography>
    </Box>
  );
};

export default NoDataFound;
