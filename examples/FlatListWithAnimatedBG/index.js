import React, { Component } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions } from 'react-native';
import _ from 'lodash';

const { width, height } = Dimensions.get("screen");
let lastOffset = 0;
let lastRatio  = 0;


class FlatListWithAnimatedBG extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: DATA
		}
		this.onScroll = this.onScroll.bind(this);
		this.imgBGRef = [React.createRef(null)];
	}
	componentDidMount() {
		setTimeout(() => {
			this.setState({ data: [...DATA, ...DATA2] })
		}, 3000);
	}

	renderItem = ({ item }) => (
		<View style={[styles.listItemContainer, styles.centerContent]}>
			<Text style={styles.boldText}>{item.text}</Text>
		</View>
	);

	onScroll(event) {
		debugger
		const offset = _.get(event, 'nativeEvent.contentOffset.y', 0);                    // get Offset 
		const scrollingDownwards = offset > lastOffset ? true : false;                    // find direction
		const ratio = offset / height;                          												  // calculate offset between 0 to device_height
		const diff = Math.abs(ratio - lastRatio);
		const page = Math.abs(parseInt(ratio)); 																					// get integer 2.32355 -> 2
		const offsetOpacity = diff % 1;  																									// get only decimal protion i.e, 2.32355 -> .32355
		const pageRef = this.imgBGRef[page];

		console.log("**********", ratio, lastRatio);
		console.log("//////////", Math.abs(ratio - lastRatio));

		const findCalculation =
			scrollingDownwards ?
				(pageRef.getOpacity() - offsetOpacity)
				: (pageRef.getOpacity() + offsetOpacity);

		// console.log("------", findCalculation, offsetOpacity);
		pageRef.changeOpacity(findCalculation);

		// setting values for next iteration
		lastOffset = offset;
		lastRatio = ratio;
	}

	render() {
		return (
			<View style={styles.container}>

				{
					this.state.data.map((d, i) =>
						<ImageBackGround
							ref={ref => this.imgBGRef[i] = ref}
							key={'img_' + i}
							source={d.img}
							index={i}
						/>
					)
				}


				<FlatList
					style={styles.container}
					data={this.state.data}
					pagingEnabled
					renderItem={this.renderItem}
					keyExtractor={(_item, index) => `key_${index}`}
					onScroll={this.onScroll}
					getItemLayout={(_data, index) => (
						{ length: height, offset: height * index, index }
					)}
				/>
			</View>
		)
	}
}

export default FlatListWithAnimatedBG;


class ImageBackGround extends Component {
	constructor(props) {
		super(props);
		this.state = {
			opacity: 1
		}
	}

	changeOpacity(opacity) {
		this.setState({ opacity })
	}

	getOpacity = () => this.state.opacity;

	render() {
		const { source, index } = this.props;
		return (
			<Image
				source={source}
				style={[styles.imgBG, { zIndex: index * -10, opacity: this.state.opacity }]} />
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	centerContent: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	boldText: {
		fontSize: 40,
		fontWeight: '700',
		color: 'white',
	},

	imgBG: {
		position: 'absolute',
		height,
		width,
		top: 0,
		left: 0
	},
	listItemContainer: {
		height,
		width,
		// backgroundColor: 'rgba(0, 0, 0, 0.3)',
		borderColor: 'white',
		borderBottomWidth: 1,
	}
})

const DATA = [
	{
		text: "Heyyy 😀",
		img: require("../../assets/1.jpeg")
	},
	{
		text: "Hola! 😍",
		img: require("../../assets/2.jpeg")
	},
	{
		text: "Bonjour 🥰",
		img: require("../../assets/3.jpeg")
	},
]

const DATA2 = [
	{
		text: "Konbanwa 🥶",
		img: require("../../assets/4.png")
	},
	{
		text: "Namaste 😎",
		img: require("../../assets/5.jpeg")
	},
	{
		text: "Kem cho 🤪",
		img: require("../../assets/6.jpeg")
	},
]
