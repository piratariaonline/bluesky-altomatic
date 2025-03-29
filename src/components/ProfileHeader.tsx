import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import Loading from "./Loading";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { Logout } from "@mui/icons-material";

interface Props {
	profile: ProfileViewDetailed | undefined;
	onLogout: () => void;
}

const ProfileHeader: React.FC<Props> = (props) => {

	const { profile, onLogout } = props;

	return (
		<Loading isLoading={!profile}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
				<Box sx={{ display: 'flex'}}>
					{
						profile && profile.avatar && (
							<Avatar
								alt={profile.displayName}
								src={profile.avatar}
								sx={{ width: 40, height: 40, mb: 2, border: 'solid 1px grey' }}
							/>
						)
					}
					<Box sx={{ display: 'block', marginLeft: '10px' }}>
						<Typography variant="body1" sx={{ fontSize: '14px' }}>
							<strong>{profile ? profile.displayName : '---'}</strong>
						</Typography>
						<Typography variant="body1" sx={{ fontSize: '12px' }}>
							@{profile ? profile.handle : '---'}
						</Typography>
					</Box>
				</Box>
				<Box>
					<Button
						variant="contained"
						color="error"
						sx={{
							borderRadius: '10px',
							minWidth: { xs: 'auto', md: '20px' },
							height: { xs: 'auto', md: '20px' },
							p: { xs: 1, md: 2 },
							// mt: { xs: 0, md: 2 },
						}}
						onClick={onLogout}
					>
						<Logout />
						<Box sx={{ display: { xs: 'none', md: 'block' }, ml: 1 }}>
							Sair
						</Box>
					</Button>
				</Box>
			</Box>
		</Loading>
	)
}

export default ProfileHeader;