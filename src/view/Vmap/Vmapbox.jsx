import React from 'react';
import PropTypes from 'prop-types';

import MapboxGl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import Mconfig from '../../model/Mconfig';
import Mstyle from '../../model/Mstyle';
import Mlayer from '../../model/Mlayer';

import LayerIcon from '../../utility/LayerIcon';

import 'mapbox-gl-inspect/dist/mapbox-gl-inspect.css';
var MapboxInspect = require('mapbox-gl-inspect');

export default class Vmap extends React.Component {

	static propTypes = {
		styleJS: PropTypes.object.isRequired,
		handle: PropTypes.object,
		match: PropTypes.object
	}

	constructor (props){
		super(props);
		this.state = {
			map:undefined,
			styleJS:undefined
		};
	}

	render (){
		return <div id="map" className="" ref={el => this.container = el}></div>
	}
	componentWillReceiveProps (nextProps){


		if(!this.state.map) return;

		const {styleJS, handle, match} = nextProps;

		//console.log('map match:',match);

		//console.log('compare:',this.state.styleJS,styleJS);

		if (this.state.styleJS.equals(styleJS)) return;
		this.setState({styleJS:styleJS});

		//console.log('styleJs:',JSON.stringify(styleJS.toJS()));

		/*
		const metadata = nextProps.mapStyle.metadata || {}
		MapboxGl.accessToken = metadata['maputnik:mapbox_access_token'] || tokens.mapbox
		*/

		// clear prev errors
		Mstyle.errorsSet();

		try {
			this.state.map.setStyle(styleJS.toJS(),{diff: true});
		} catch(e){
			//console.error('map style error:',e);
			Mstyle.errorAdd(e);
			//handle.error(e);
		}
	}

	renderPopup (features){

		//console.log('render popup:',this);

		const {handle} = this.props;

		// ReactDOM.render(element, document.getElementById('root'));

		window.layerClick = (path)=>{
			handle.route(path);
		};

		//console.log('features:',features);
		let html = '<div class="map-inspect">'+
			'<ul class="mb-0 mt-1 map-inspect-list">';
		let layers = {};
		features.forEach((feature)=>{
			layers[feature.layer.id] = layers[feature.layer.id] || {count:0};
			layers[feature.layer.id].count++;
		});
		for (let i in layers){
			const layer = Mlayer.get(i);
			const path = 'layer/'+layer.get('id');
			html += '<li><a href="javascript://" onclick="layerClick(\''+path+'\')">'+
				'<div class="list-left mr-2 inline-block position-relative">'+
				'<i class="material-icons md-18 md-shadow" style="color:'+
				LayerIcon.getColor(layer)+'">'+LayerIcon.getIcon(layer)+
				'</i></div>'+
				i+' <span class="badge">'+layers[i].count+'</span></a></li>';
		}
		html += '</ul></div>'
		return html;
	}

	componentDidMount (){
		const {styleJS} = this.props;

		this.setState({styleJS:styleJS});

		//console.log('map style:',styleJS,MapboxGl);

		const config = Mconfig.get();
		const token = config.get('mapboxToken');

		//console.log('token:',token,config);

		MapboxGl.accessToken = token;

		const map = new MapboxGl.Map({
			container: this.container,
			style: styleJS.toJS(),
			hash: true
		});

		map.addControl(new MapboxInspect({
			popup: new MapboxGl.Popup({
				closeButton: true,
   			closeOnClick: false
			}),
			showInspectButton: false,
			showMapPopup: true,
			showMapPopupOnHover: false,
			showInspectMapPopupOnHover: false,
			renderPopup: this.renderPopup.bind(this)
		}));


		//console.log('map:',MapboxGl);

		/*
		const zoom = new ZoomControl;
		map.addControl(zoom, 'top-right');
		*/

		const nav = new MapboxGl.NavigationControl();
		map.addControl(nav, 'top-right');

		map.on('error',(e)=>{
			//console.log('map error:',e.error.message);
			console.log('map error:',e);
			if (e.source) return Mstyle.errorAdd({message:'error loading source: '+e.source.url});
			Mstyle.errorAdd(e.error);
		});

		this.setState({map:map});



		//this.setState({map:map});



		/*
		const map = new MapboxGl.Map({
		container: this.container,
		style: this.props.mapStyle,
		hash: true,
		})

		*/

		/*

		const inspect = new MapboxInspect({
		popup: new MapboxGl.Popup({
		  closeOnClick: false
		}),
		showMapPopup: true,
		showMapPopupOnHover: false,
		showInspectMapPopupOnHover: true,
		showInspectButton: false,
		assignLayerColor: (layerId, alpha) => {
		  return Color(colors.brightColor(layerId, alpha)).desaturate(0.5).string()
		},
		buildInspectStyle: (originalMapStyle, coloredLayers) => buildInspectStyle(originalMapStyle, coloredLayers, this.props.highlightedLayer),
		renderPopup: features => {
		  if(this.props.inspectModeEnabled) {
		    return renderPropertyPopup(features)
		  } else {
		    var mountNode = document.createElement('div');
		    ReactDOM.render(<FeatureLayerPopup features={features} onLayerSelect={this.props.onLayerSelect} />, mountNode)
		    return mountNode
		  }
		}
		})
		map.addControl(inspect)

		map.on("style.load", () => {
		this.setState({ map, inspect });
		})

		map.on("data", e => {
		if(e.dataType !== 'tile') return
		this.props.onDataChange({
		  map: this.state.map
		})
		})
		*/
  }
};