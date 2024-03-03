import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import FastForwardRounded from '@mui/icons-material/FastForwardRounded';
import FastRewindRounded from '@mui/icons-material/FastRewindRounded';
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
import VolumeDownRounded from '@mui/icons-material/VolumeDownRounded';
import RepeatOneIcon from '@mui/icons-material/RepeatOne';
import RepeatOneOnIcon from '@mui/icons-material/RepeatOneOn';
import { IMetaData } from '../../pages/media_play_list/MediaPlayList';
import './AudioPlayer.css';

const WallPaper = styled('div')({
  position: 'relative',
  width: '100%',
  height: '100vh',
  top: 0,
  left: 0,
  overflow: 'hidden',
  background: 'linear-gradient(rgb(255, 38, 142) 0%, rgb(255, 105, 79) 100%)',
  transition: 'all 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275) 0s',
  '&::before': {
    content: '""',
    width: '140%',
    height: '140%',
    position: 'absolute',
    top: '-40%',
    right: '-50%',
    background:
      'radial-gradient(at center center, rgb(62, 79, 249) 0%, rgba(62, 79, 249, 0) 64%)',
  },
  '&::after': {
    content: '""',
    width: '140%',
    height: '140%',
    position: 'absolute',
    bottom: '-50%',
    left: '-30%',
    background:
      'radial-gradient(at center center, rgb(247, 237, 225) 0%, rgba(247, 237, 225, 0) 70%)',
    transform: 'rotate(30deg)',
  },
});

const Widget = styled('div')(({ theme }) => ({
  padding: 16,
  borderRadius: 16,
  width: 343,
  maxWidth: '100%',
  margin: 'auto',
  position: 'relative',
  zIndex: 1,
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.4)',
  backdropFilter: 'blur(40px)',
}));

const CoverImage = styled('div')({
  width: 100,
  height: 100,
  objectFit: 'cover',
  overflow: 'hidden',
  flexShrink: 0,
  borderRadius: 8,
  backgroundColor: 'rgba(0,0,0,0.08)',
  '& > img': {
    width: '100%',
  },
});

const TinyText = styled(Typography)({
  fontSize: '0.75rem',
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});

function getOptimizedEndpoint(rormattedTime: string){
    let [hr, min, sec] = rormattedTime.split(':').map(str => str.trim())
    hr = (hr === '00') ? '': hr+':'
    min = (min === '00') ? '': min+':'
    return hr+min+sec
}

export interface IAudioPlayer{
    totalDuration: number|null;
    currentTime: number|null;
    updateCurrentTime: (value: number) => void;
    paused: boolean;
    startPlaying: (arg0: number) => void;
    pausePlaying:  (arg0: number) => void;
    rewindPlaying: (arg0: number) => void;
    forwardPlaying: (arg0: number) => void;
    playPrevious: (arg0: number) => void;
    enableLoop: () => void;
    desableLoop: () => void;
    playNext: (arg0: number) => void;
    index: number;
    loop: boolean,
    allFileDetail: {
        name: string;
        src: string;
        metadata?: IMetaData;
  }
}


export default function AudioPlayer(props: IAudioPlayer) {
  const theme = useTheme();

  const mainIconColor = theme.palette.mode === 'dark' ? '#fff' : '#000';
  const lightIconColor =
    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';

    const getFirsEndPoint = React.useMemo(() => {
       
        let timeInSec = props.currentTime ? Math.round(props.currentTime) : 0
        if(props.totalDuration === props.currentTime){
            timeInSec = 0
        }
        const hr = Math.floor(timeInSec / (60 * 60))
        timeInSec = timeInSec % (60 * 60)
        const min = Math.floor(timeInSec / 60)
        timeInSec = timeInSec % 60;
        const formattedTime =
            `${(hr.toString()).length > 1 ? hr: `0${hr}`}:
             ${(min.toString()).length > 1 ? min: `0${min}`}:
             ${(timeInSec.toString()).length > 1 ? timeInSec: `0${timeInSec}`}`   
        
        const endpoint = getOptimizedEndpoint(formattedTime)
        return endpoint
        
    }, [props.currentTime, props.totalDuration]);

    const getLastEndPoint = React.useMemo(() => {
        let timeLetInSec = Math.round((props.totalDuration ?? 0) - (props.currentTime ?? 0));
        if(props.totalDuration === props.currentTime){
            timeLetInSec = Math.round(props.totalDuration ?? 0);
        }
        
        const hr = Math.floor(timeLetInSec / (60 * 60))
        timeLetInSec = timeLetInSec % (60 * 60)
        const min = Math.floor(timeLetInSec / 60)
        timeLetInSec = timeLetInSec % 60;
        
        const formattedTime = `${(hr.toString()).length > 1 ? hr: `0${hr}`}:
             ${(min.toString()).length > 1 ? min: `0${min}`}:
             ${(timeLetInSec.toString()).length > 1 ? timeLetInSec: `0${timeLetInSec}`}` 
        
        const endpoint = getOptimizedEndpoint(formattedTime)
        return endpoint
    }, [props.totalDuration, props.currentTime])
    
  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Widget>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CoverImage>
            <img
              alt="can't win - Chilling Sunday"
              src={props?.allFileDetail?.metadata?.picture?.base64Image}
            />
          </CoverImage>
          <Box sx={{ ml: 1.5, minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              {props?.allFileDetail?.metadata?.album ?? 'Unkown'}
            </Typography>
            <Typography noWrap>
              <b>{props.allFileDetail.metadata?.artist ?? 'Unkown'}</b>
            </Typography>
            <div>
            <Typography noWrap letterSpacing={-0.25}>
               {props.allFileDetail.metadata?.title ?? props.allFileDetail.name}
            </Typography>
            </div>
           
          </Box>
          <IconButton sx={{position: 'absolute', top: '5px', right: '5px'}} aria-label="next song" onClick={() => {
              props.loop ? props.desableLoop() : props.enableLoop()
          }}>
            {!props.loop && <RepeatOneIcon htmlColor={mainIconColor} />}
            {props.loop && <RepeatOneOnIcon htmlColor={mainIconColor} />}
          </IconButton>
        </Box>
        <Slider
          aria-label="time-indicator"
          size="small"
          value={props.currentTime || 0}
          min={0}
          step={1}
          max={props.totalDuration || 0}
          onChange={(_, value) => props.updateCurrentTime(value as number)}
          sx={{
            color: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
            height: 4,
            '& .MuiSlider-thumb': {
              width: 8,
              height: 8,
              transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
              '&::before': {
                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
              },
              '&:hover, &.Mui-focusVisible': {
                boxShadow: `0px 0px 0px 8px ${
                  theme.palette.mode === 'dark'
                    ? 'rgb(255 255 255 / 16%)'
                    : 'rgb(0 0 0 / 16%)'
                }`,
              },
              '&.Mui-active': {
                width: 20,
                height: 20,
              },
            },
            '& .MuiSlider-rail': {
              opacity: 0.28,
            },
          }}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: -2,
          }}
        >
          <TinyText>{getFirsEndPoint}</TinyText>
          <TinyText>-{getLastEndPoint}</TinyText>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: -1,
          }}
        >
          <IconButton aria-label="previous song" onClick={() => props.playPrevious(props.index)}>
            <FastRewindRounded fontSize="large" htmlColor={mainIconColor} />
          </IconButton>
          <IconButton
            aria-label={props.paused ? 'play' : 'pause'}
            onClick={() => {
                props.paused ? props.startPlaying(props.index): props.pausePlaying(props.index)
            }}
          >
            {props.paused ? (
              <PlayArrowRounded
                sx={{ fontSize: '3rem' }}
                htmlColor={mainIconColor}
              />
            ) : (
              <PauseRounded sx={{ fontSize: '3rem' }} htmlColor={mainIconColor} />
            )}
          </IconButton>
          <IconButton aria-label="next song" onClick={() => props.playNext(props.index)}>
            <FastForwardRounded fontSize="large" htmlColor={mainIconColor} />
          </IconButton>
        </Box>
        <Stack spacing={2} direction="row" sx={{ mb: 1, px: 1 }} alignItems="center">
          <VolumeDownRounded htmlColor={lightIconColor} />
          <Slider
            aria-label="Volume"
            defaultValue={30}
            sx={{
              color: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
              '& .MuiSlider-track': {
                border: 'none',
              },
              '& .MuiSlider-thumb': {
                width: 24,
                height: 24,
                backgroundColor: '#fff',
                '&::before': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                },
                '&:hover, &.Mui-focusVisible, &.Mui-active': {
                  boxShadow: 'none',
                },
              },
            }}
          />
          <VolumeUpRounded htmlColor={lightIconColor} />
        </Stack>
      </Widget>
    </Box>
  );
}
