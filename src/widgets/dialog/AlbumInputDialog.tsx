import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { TextField } from '@mui/material';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export interface IAlbumInputDialog{
  open: boolean;
  onClose: () => void;
  onSave: (arg0: string) => void;
}
export default function AlbumInputDialog(props: IAlbumInputDialog) {

  const nameRef = React.useRef<HTMLInputElement>(null);
  

  return (
    <React.Fragment>
      <Dialog
        open={props.open}
        TransitionComponent={Transition}
        onClose={props.onClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const name = formJson.name;
            props.onSave(name);
          },
        }}
      >
        <DialogTitle>Album</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter Album Name.
          </DialogContentText>
          <TextField
            autoFocus
            required
            ref={nameRef}
            margin="dense"
            id="name"
            name="name"
            label="Album Name"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
