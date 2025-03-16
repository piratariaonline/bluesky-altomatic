import { CircularProgress } from "@mui/material";

interface Props {
	isLoading: boolean;
	label?: string;
	children: any;
}

const Loading: React.FC<Props> = (props) => {

	return (
		<div>
			{
				props.isLoading ?
					<CircularProgress size={20} thickness={4} color='primary' /> :
					props.children
			}
		</div>
	)
}

export default Loading;