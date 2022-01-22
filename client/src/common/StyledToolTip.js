import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip arrow classes={{ popper: className }} {...props} />
))(({ theme }) => `
  .${tooltipClasses.arrow} {
    color: ${theme.palette.common.black};
  };

  .${tooltipClasses.tooltip} {
    background-color: ${theme.palette.common.black};
    padding: ${theme.spacing(1)};
  }
`);

export default StyledTooltip;
export * from '@mui/material/Tooltip';
