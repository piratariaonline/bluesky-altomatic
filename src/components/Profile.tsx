import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import Loading from "../components/Loading";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { Logout } from "@mui/icons-material";

interface Props {
	profile: ProfileViewDetailed | undefined;
	onLogout: () => void;
}

const Profile: React.FC<Props> = (props) => {

	const { profile, onLogout } = props;

	return (
		<Loading isLoading={!profile}>
			<Box
				sx={{
				display: 'flex',
				flexDirection: { xs: 'row', md: 'column' }, // Row for mobile, column for desktop
				alignItems: { xs: 'center', md: 'flex-start' }, // Center align for mobile, left align for desktop
				gap: { xs: 2, md: 0 }, // Add gap between items for mobile
				}}
			>
			{
				profile && profile.avatar && (
					<Avatar
						alt={profile.displayName}
						src={profile.avatar}
						sx={{
						width: { xs: 50, md: 100 }, // Smaller avatar for mobile
						height: { xs: 50, md: 100 },
						mb: { xs: 0, md: 2 }, // No margin bottom for mobile
						}}
					/>
				)
			}

			<Box sx={{ flexGrow: 1 }}>
				<Typography variant="h5" sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
					{profile ? profile.displayName : '---'}
				</Typography>
				<Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
					<strong>@{profile ? profile.handle : '---'}</strong>
				</Typography>
			</Box>

			<Button
				variant="contained"
				color="error"
				sx={{
					minWidth: { xs: 'auto', md: '100%' }, // Auto width for mobile, full width for desktop
					p: { xs: 1, md: 2 }, // Smaller padding for mobile
					mt: { xs: 0, md: 2 }, // No margin top for mobile
				}}
				onClick={onLogout}
			>
				<Logout />
				<Box sx={{ display: { xs: 'none', md: 'block' }, ml: 1 }}>
					Sair
				</Box>
			</Button>
		</Box>
	</Loading>
	)
}

export default Profile;