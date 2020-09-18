import React from "react";
import {Box, Button, Divider, makeStyles} from "@material-ui/core";
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";
import {
  FACheckCircleIcon,
  FATimesCircleIcon
} from "../../../../web/js/mui/MUIFontAwesome";
import {PremiumButton} from "./PremiumButton";
import {PlanCheckIcon} from "./PlanCheckIcon";
import {PlanPricing} from "./PlanPricing";
import {PlanIntervalButton} from "./PlanIntervalButton";
import {FindPlan} from "./FindPlan";

const useStyles = makeStyles({
  checkCircle: {
    maxHeight: "24px",
  },

  header: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "normal",
    // fontSize: "min(28px, 2.5vw)",
    fontSize: "28px",
    lineHeight: "33px",
    marginTop: "40px",
    // margin: "20px 0",
  },

  headerMobile: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "normal",
    // fontSize: "min(28px, 2.5vw)",
    fontSize: "38px",
    lineHeight: "33px",
    marginTop: "30px",
    // margin: "20px 0",
  },

  tableDesktop: {
    fontSize: '16px',
    margin: "0px auto 5% auto",
    mixBlendMode: "normal",
    width: "80%",
    textAlign: "center",
    borderCollapse: "collapse",
    paddingRight: "25px",
  },

  imgBox: {
    margin: "0 auto",
    display: "flex",
    justifyContent: "center",
  },

  buttonSignUp: {
    textTransform: "none",
    marginBottom: "8px",
    backgroundColor: "#6754D6",
    width: "9vw",
    height: "45px",
  },

  buttonSignUpMobile: {
    textTransform: "none",
    marginBottom: "8px",
    backgroundColor: "#6754D6",
    // width: "58%",
    padding: "0 20%",
    height: "45px",
    // minHeight: "45px",

    fontSize: "20px",
  },

  rowHead: {
    textAlign: "right",
    padding: "7px 0px 7px 20px",
  },

  divider: {
    marginLeft: "4%",
    width: "92%",
  },
  row: {
    height: "55px",
    width: "65%",
  },

  pricing: {
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "32px",
    lineHeight: "37px",

    letterSpacing: "0.15px",

    color: "#E0E0E0",
    margin: "20px 0",
  },

  rate: {
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "12px",
    lineHeight: "14px",
    letterSpacing: "0.15px",
    color: "#E0E0E0",
  },

  subtitle: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: ".9vw",
    lineHeight: "19px",
    textAlign: "center",
    letterSpacing: "0.15px",
    color: "#E0E0E0",
    paddingBottom: "10%",
  },

  subtitleMobile: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "16px",
    lineHeight: "19px",

    textAlign: "center",
    letterSpacing: "0.15px",
    marginTop: "5px",
    color: "#E0E0E0",
    paddingBottom: "8%",
  },

  rowHeadMobile: {
    textAlign: "left",
  },

  pricePlanTab: {
    mixBlendMode: "normal",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "33%",
    marginBottom: "8%",
    paddingBottom: "5%",
  },

  pricePlanMobile: {
    mixBlendMode: "normal",
    display: "flex",
    flexDirection: "column",
    // justifyContent: "center",
    alignItems: "center",
    width: "340px",
    // minWidth: "300px",
    // width: "70%",
    margin: "15px",
    // paddingBottom: "5%",
    height: "705px",
  },

  tableMobile: {
    mixBlendMode: "normal",
    width: "70%",
    borderCollapse: "collapse",
    paddingRight: "25px",
    textAlign: "center",
    fontSize: "16px",
  },
});

export const PremiumContent2 = () => {

  return (
    <DeviceRouter handheld={<Mobile/>} desktop={<Desktop/>}/>
  );

}

const Mobile = () => {

  const classes = useStyles();
  return (
    <Box
      style={{
        display: "flex",
        // flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        marginBottom: "40px",
      }}
    >
      <Box className={classes.pricePlanMobile}>
        <Box className={classes.headerMobile}>Launch</Box>
        <Box className={classes.pricing}> Free </Box>
        <Box className={classes.subtitleMobile}>Free forever</Box>

        <table className={classes.tableMobile}>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Updates
            </td>
            <td>
              <Box style={{ width: "50%" }} className={classes.imgBox}>
                <PlanCheckIcon/>
              </Box>
            </td>
          </tr>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Web + Desktop
            </td>
            <td>
              <Box style={{ width: "50%" }} className={classes.imgBox}>
                <PlanCheckIcon/>
              </Box>
            </td>
          </tr>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Storage
            </td>
            <td>1 GB</td>
          </tr>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Maximum Captured <br /> Web Documents
            </td>
            <td>250</td>
          </tr>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Devices
            </td>
            <td>2</td>
          </tr>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Priority Support
            </td>
            <td>
              <Box style={{ width: "50%" }} className={classes.imgBox}>
                <FATimesCircleIcon className={classes.checkCircle} />
              </Box>
            </td>
          </tr>
          {/* <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Maximum Daily <br /> Flashcard Reviews
            </td>
            <td>20</td>
          </tr> */}
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Related Tags
            </td>
            <td>
              <Box style={{ width: "50%" }} className={classes.imgBox}>
                <FATimesCircleIcon className={classes.checkCircle} />
              </Box>
            </td>
          </tr>
        </table>
      </Box>
      <Box className={classes.pricePlanMobile}>
        <Box className={classes.headerMobile}>Plus</Box>
        <Box className={classes.pricing}>
          $6.99
          <span className={classes.rate}>/mo</span>
        </Box>

        <PremiumButton newPlan="plus" />

        <Box className={classes.subtitleMobile}>
          1 year commitment <br />
          gets one month free
        </Box>
        <table className={classes.tableMobile}>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Updates
            </td>
            <td>
              <Box style={{ width: "50%" }} className={classes.imgBox}>
                <PlanCheckIcon/>
              </Box>
            </td>
          </tr>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Web + Desktop
            </td>
            <td>
              <Box style={{ width: "50%" }} className={classes.imgBox}>
                <PlanCheckIcon/>
              </Box>
            </td>
          </tr>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Storage
            </td>
            <td>50 GB</td>
          </tr>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Maximum Captured <br /> Web Documents
            </td>
            <td>unlimited</td>
          </tr>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Devices
            </td>
            <td>3</td>
          </tr>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Priority Support
            </td>
            <td>
              <Box style={{ width: "50%" }} className={classes.imgBox}>
                <PlanCheckIcon/>
              </Box>
            </td>
          </tr>
          {/* <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Maximum Daily <br /> Flashcard Reviews
            </td>
            <td>unlimited</td>
          </tr> */}
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Related Tags
            </td>
            <td>
              <Box style={{ width: "50%" }} className={classes.imgBox}>
                <PlanCheckIcon/>
              </Box>
            </td>
          </tr>
        </table>
      </Box>
      <Box className={classes.pricePlanMobile}>
        <Box className={classes.headerMobile}>Pro</Box>
        <Box className={classes.pricing}>
          $14.99
          <span className={classes.rate}>/mo</span>
        </Box>

        <PremiumButton newPlan="pro" />

        <Box className={classes.subtitleMobile}>
          1 year commitment <br />
          gets one month free
        </Box>
        <table className={classes.tableMobile}>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Updates
            </td>
            <td>
              <Box style={{ width: "50%" }} className={classes.imgBox}>
                <PlanCheckIcon/>
              </Box>
            </td>
          </tr>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Web + Desktop
            </td>
            <td>
              <Box style={{ width: "50%" }} className={classes.imgBox}>
                <PlanCheckIcon/>
              </Box>
            </td>
          </tr>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Storage
            </td>
            <td>500 GB</td>
          </tr>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Maximum Captured <br /> Web Documents
            </td>
            <td>unlimited</td>
          </tr>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Devices
            </td>
            <td>unlimited</td>
          </tr>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Priority Support
            </td>
            <td>
              <Box style={{ width: "50%" }} className={classes.imgBox}>
                <PlanCheckIcon/>
              </Box>
            </td>
          </tr>
          {/* <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Maximum Daily <br /> Flashcard Reviews
            </td>
            <td>unlimited</td>
          </tr> */}
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Related Tags
            </td>
            <td>
              <Box style={{ width: "50%" }} className={classes.imgBox}>
                <PlanCheckIcon/>
              </Box>
            </td>
          </tr>
        </table>
      </Box>
    </Box>
  );
}

const Desktop = () => {

  const classes = useStyles();

  return (
    <table className={classes.tableDesktop}>
      <tbody>
      <tr style={{ height: "100px", verticalAlign: "top" }}>
        <th style={{ width: "12%" }}>
          <div className="mt-2 mb-2">
            <FindPlan/>
            <PlanIntervalButton/>
          </div>
        </th>
        <th style={{ width: "22%" }}>
          <Box className={classes.header}>Free</Box>
          <Box className={classes.pricing}>
            <PlanPricing plan='free'/>
          </Box>
          {/*<Button className={classes.buttonSignUp}>Get Started</Button>*/}
          <Box className={classes.subtitle}>Free forever</Box>
        </th>
        <th style={{ width: "22%" }}>
          <Box className={classes.header}>Plus</Box>
          <Box className={classes.pricing}>
            <PlanPricing plan='plus'/>
          </Box>

          <PremiumButton newPlan="plus" />

          {/*<Box className={classes.subtitle}>*/}
          {/*  1 year commitment <br /> gets one month free*/}
          {/*</Box>*/}
        </th>
        <th style={{ width: "22%" }}>
          <Box className={classes.header}>Pro</Box>
          <Box className={classes.pricing}>
            <PlanPricing plan='pro'/>
          </Box>

          <PremiumButton newPlan="pro" />

          {/*<Box className={classes.subtitle}>*/}
          {/*  1 year commitment <br /> gets one month free*/}
          {/*</Box>*/}
        </th>
      </tr>

      <td colSpan={5}>
        <Divider className={classes.divider} />
      </td>
      <tr className={classes.row}>
        <td className={classes.rowHead}>Storage</td>
        <td>1 GB</td>
        <td>50 GB</td>
        <td>500 GB</td>
      </tr>
      <td colSpan={5}>
        <Divider className={classes.divider} />
      </td>
      <tr className={classes.row}>
        <td className={classes.rowHead}>
          Maximum Captured <br /> Web Documents
        </td>
        <td>250</td>
        <td>unlimited</td>
        <td>unlimited</td>
      </tr>
      <td colSpan={5}>
        <Divider className={classes.divider} />
      </td>
      <tr className={classes.row}>
        <td className={classes.rowHead}>Devices</td>
        <td>2</td>
        <td>3</td>
        <td>unlimited</td>
      </tr>
      <td colSpan={5}>
        <Divider className={classes.divider} />
      </td>
      <tr className={classes.row}>
        <td className={classes.rowHead}>Priority Support</td>
        <td>
          <Box className={classes.imgBox}>
            <FATimesCircleIcon className={classes.checkCircle} />
          </Box>
        </td>
        <td>
          <Box className={classes.imgBox}>
            <PlanCheckIcon/>
          </Box>
        </td>
        <td>
          <Box className={classes.imgBox}>
            <PlanCheckIcon/>
          </Box>
        </td>
      </tr>
      <td colSpan={5}>
        <Divider className={classes.divider} />
      </td>
      {/* <tr className={classes.row}>
        <td className={classes.rowHead}>
          Maximum Daily <br /> Flashcard Reviews
        </td>
        <td>20</td>
        <td>unlimited</td>
        <td>unlimited</td>
        <td>unlimited</td>
      </tr>*/}
      {/* <td colSpan={5}>
        <Divider className={classes.divider} />
      </td> */}
      <tr className={classes.row}>
        <td className={classes.rowHead}>Related Tags</td>
        <td>
          <Box className={classes.imgBox}>
            <FATimesCircleIcon className={classes.checkCircle} />
          </Box>
        </td>
        <td>
          <Box className={classes.imgBox}>
            <PlanCheckIcon/>
          </Box>
        </td>
        <td>
          <Box className={classes.imgBox}>
            <PlanCheckIcon/>
          </Box>
        </td>
      </tr>
      <tr style={{ height: "50px" }}></tr>
      </tbody>
    </table>
  );
}
