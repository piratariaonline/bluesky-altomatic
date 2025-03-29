import { Typography } from "@mui/joy";

interface Props {
	count: number;
}

const CharCounter: React.FC<Props> = (props) => {

	const { count } = props;

	return (
		<Typography level="body-xs" sx={{ ml: 'auto' }}>
			{count} caracter{count > 1 && 'es'}
		</Typography>
	)
}

export default CharCounter;