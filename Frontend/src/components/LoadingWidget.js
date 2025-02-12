// import React from "react";
// import { CircularProgress } from "@material-ui/core";
// // import LoaderGif from "./../../assets/gifs/Loader.gif";
// import { makeStyles } from "@material-ui/core/styles";

// const useStyles = makeStyles(() => ({
//   loaderColor: {
//     color: "white",
//   },
//   loaderWrapper: {
//     position: "fixed",
//     background: "rgb(28 32 46 / 30%)",
//     left: 0,
//     top: 0,
//     width: "100%",
//     height: "100%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 99999999,
//     "& img": {
//       width: 100,
//       height: "auto",
//     },
//   },
// }));

// const LoadingWidget = props => {
//   const classes = useStyles();
//   if (props.pageLoader) {
//     return (
//       <div className={classes.loaderWrapper}>
//         <img src={LoaderGif} alt="ialign-loader" />
//       </div>
//     );
//   }
//   return (
//     <CircularProgress
//       className={classes.loaderColor}
//       style={{ color: props.color }}
//       size={20}
//     />
//   );
// };

// export default LoadingWidget;

import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const LoadingWidget = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingWidget;
