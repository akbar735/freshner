import  React, {type ChangeEvent} from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { styled, withTheme } from "@mui/material/styles";

const MediaSwitch = styled(Switch)(({ theme }) => ({
    ".MuiSwitch-track": {
        backgroundColor: "white",
    },
    ".MuiSwitch-thumb": {
        backgroundColor: "white",
        opacity: 1
    },
    ".css-5ryogn-MuiButtonBase-root-MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track":{
        backgroundColor: "white",
        opacity: 1
    }
 }));

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
        control={<MediaSwitch size='small' checked = {props.checked} onChange={props.handleOnSwitchChange} />} 
        label={props.label}
      />
  );
}
