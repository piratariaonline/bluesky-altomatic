/**
 * Configurações de design responsivo
 * md = desktop, xs = mobile
 */

const SX = {
	AuthCardBox: {
		mt: { md: 3, xs: 1 },
		p: 	{ md: 2, xs: 1 }
	},
	PostScreen: {
		ContainerGrid: {
			display: 'grid',
			gridTemplateColumns: { md: '2fr 1.5fr', xs: '1fr' }
		},
		EditorBox: {
			mt: { md: 3, xs: 1 },
			p: 	{ md: 2, xs: 1 }
		},
		PreviewBox: {
			mt: { md: 3, xs: 1 },
			p:  { md: 2, xs: 1 }
		}
	},
	ProfileHeader: {
		LogoutBtn: {
			minWidth: { md: '20px', xs: 'auto' },
			height:   { md: '20px', xs: 'auto' },
			p:		  { md: 2, xs: 1 },
		// mt: 		  { md: 2, xs: 0 },
		},
		LogoutBtnLabel: {
			display: { md: 'block', xs: 'none' }
		}
	}
}

const Spacing = {
	PostScreen: {
		ContainerGrid: { md: 3, xs: 0 }
	}
}

export default { SX, Spacing };