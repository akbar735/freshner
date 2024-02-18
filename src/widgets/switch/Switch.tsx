import  React, {type ChangeEvent} from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { styled } from "@mui/material/styles";

 const FormLabel = styled(FormControlLabel)(({ theme }) => ({
    ".MuiFormControlLabel-label": {
        fontSize: "13px",
    },
 }));
interface ISwitchLabels{
    checked: boolean;
    handleOnSwitchChange: (event: ChangeEvent) => void;
    label: string;
}
export default function SwitchLabels(props: ISwitchLabels) {
  return (
      <FormLabel 
        style={{fontSize: 12}}
        control={<Switch size='small' checked = {props.checked} onChange={props.handleOnSwitchChange} />} 
        label={props.label}
      />
  );
}
