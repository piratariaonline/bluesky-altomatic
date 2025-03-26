/**
 * Configurações de design responsivo
 * md = desktop, xs = mobile
 */

const SX = {
	AuthCardBox: {
		mt: { md: 3, xs: 1 },
		p: 	{ md: 3, xs: 2 }
	},
	PostScreen: {
		ContainerGrid: {
			display: 'grid',
			gridTemplateColumns: { md: '2fr 1.5fr', xs: '1fr' }
		},
		EditorBox: {
			mt: { md: 3, xs: 1 },
			p: 	{ md: 3, xs: 2 }
		},
		PreviewBox: {
			mt: { md: 3, xs: 1 },
			p:  { md: 3, xs: 2 }
		}
	}
}

const Spacing = {
	PostScreen: {
		ContainerGrid: { md: 3, xs: 0 }
	}
}

export default { SX, Spacing };