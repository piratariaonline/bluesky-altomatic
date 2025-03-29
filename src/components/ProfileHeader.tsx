import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import Loading from "./Loading";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { Logout } from "@mui/icons-material";
import ViewportManager from '../services/ViewportManager';
import './ProfileHeader.css';

interface Props {
	profile: ProfileViewDetailed | undefined;
	onLogout: () => void;
}

const ProfileHeader: React.FC<Props> = (props) => {

	const { profile, onLogout } = props;
	const { SX } = ViewportManager;
	

	return (
		<Loading isLoading={!profile}>
			<Box className='profile-header-container'>
				<Box className='profile-data-container'>
					{
						profile && profile.avatar && (
							<Avatar className='avatar' alt={profile.displayName} src={profile.avatar}/>
						)
					}
					<Box className='user-info'>
						<Typography variant="body1" className='display-name'>
							<a href={profile ? `https://bsky.app/profile/${profile.handle}` : '#'} target='_blank'>
								<strong>{profile ? profile.displayName : '---'}</strong>
							</a>
						</Typography>
						<Typography variant="body1" className='handler'>
							@{profile ? profile.handle : '---'}
						</Typography>
					</Box>
				</Box>
				<Box>
					<Button className='logout-btn' variant="contained" color="error" sx={SX.ProfileHeader.LogoutBtn} onClick={onLogout}>
						<Logout />
						<Box className='label' sx={SX.ProfileHeader.LogoutBtnLabel}>Sair</Box>
					</Button>
				</Box>
			</Box>
		</Loading>
	)
}

export default ProfileHeader;