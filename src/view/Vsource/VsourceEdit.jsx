import PropTypes from 'prop-types';
import React from 'react';

import NameFromURL from '../../utility/NameFromURL';

import Valert from '../Valert';
import VsourceLayers from './VsourceLayers';
import VsourceAdd from './VsourceAdd';

import Msource from '../../model/Msource';

export default class Vsource extends React.Component {
	static propTypes = {
		handle: PropTypes.object,
		match: PropTypes.object,
		style: PropTypes.object
	}

	constructor(props) {
		super(props);

		const {style, handle, match} = this.props;

		const path = decodeURIComponent(match.params.path);
		const source = Msource.get(path);

		Msource.setJSON(path,source);
	}

	render (){
		const {style, handle, match} = this.props;

		const path = decodeURIComponent(match.params.path);
		const source = Msource.get(path);

		console.log('path:',path,'source:',source,style);

		const styleLayers = style.get('layers');

		// change map mode to show_hidden source layers

		if (source === null){
			return <div/>;
		}
		return <div>
			<h2 className="px-2 py-1 m-0 text-nav bg-light">
				{NameFromURL.get(path)}
			</h2>
			<div className="p-0">
				<VsourceLayers source={source} sourceKey={path} styleLayers={styleLayers} sourceLayers={Msource.getLayers(path)}/>
			</div>
		</div>;
	}
};