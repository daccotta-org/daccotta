import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getUserData } from '@/services/userService';
import { useState, useEffect } from 'react';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';

const options = ['Profile', 'Settings', 'Sign Out'];

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
  avatar: string;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function SimpleDialog(props: SimpleDialogProps) {
  const navigate = useNavigate();

  const { signOut } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to home page or other post-logout actions
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    if (value === 'Profile') {
      navigate('/profile');
    } else if (value === 'Settings') {
      navigate('/settings');
    } else if (value === 'Sign Out') {
      handleSignOut();
    }
    onClose(value);
  };

  return (
    <Dialog 
      onClose={handleClose} 
      TransitionComponent={Transition} 
      open={open} 
      PaperProps={{
        className: 'absolute top-0 right-0 w-[200px] ', // Use Tailwind CSS for positioning
      }}
     
    >
      <List sx={{ pt: 0 }} className='flex flex-col items-center bg-main text-white'>
        {options.map((option) => (
          <ListItem disableGutters key={option} className='border-b-2 border-b-gray-500'>
            <ListItemButton onClick={() => handleListItemClick(option)}>
              <ListItemText primary={option} className='text-center ' />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

export default function SimpleDialogDemo() {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(options[1]);
  const [avatar, setAvatar] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        try {
          const userData = await getUserData(user.uid);
          setAvatar(userData.profile_image);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div className='flex justify-end items-start p-4 '> {/* Adjust padding as needed */}
      <Avatar
        src={avatar}
        alt="User Avatar"
        onClick={handleClickOpen}
        sx={{
          width: 42,
          height: 42,
          cursor: 'pointer',
          bgcolor: avatar ? 'transparent' : 'red' // Fallback to red background if no avatar
        }}
        className=' hover:shadow-2xl hover:scale-110 transition duration-300'
      >
        {!avatar && <PersonIcon />} {/* Show PersonIcon if no avatar */}
      </Avatar>
      <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        avatar={avatar}
      />
    </div>
  );
}