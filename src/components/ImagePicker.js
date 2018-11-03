import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Button, Image, View, TouchableOpacity } from 'react-native';
import { ImagePicker, Permissions } from 'expo';

class ImagePickerComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      image: null,
    };
    // this.pickFromGallery = this.pickFromGallery.bind(this)
  }

  componentWillMount(){
    this.props.getProfilePhoto();
  }

  async pickFromGallery(){
    console.log('pic from gal')
     const permissions = Permissions.CAMERA_ROLL;
     const { status } = await Permissions.askAsync(permissions);
     if(status === 'granted') {
       let image = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: 'Images',
       }).catch(error => console.log(permissions, { error }));
      if (!image.cancelled) {
        this.setState({ image: image.uri});
        this.props.savePhoto({ image: image.uri});
      }
     }
  }

  
  render() {
    const { image } = this.state;
    const {profilePhoto} = this.props;
    const photo = image ? image : profilePhoto;
    const button = !photo && <Button title="Pick an image from camera roll" onPress={this.pickFromGallery.bind(this)}/>;
    const picture = photo && 
      <TouchableOpacity onPress={this.pickFromGallery.bind(this)}>
        <Image source={{ uri: photo }} style={{ width: 200, height: 200, borderRadius: 100 }} />}
      </TouchableOpacity>;
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 0, marginBottom: 50 }}>
        {button}
        {picture}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export {ImagePickerComponent};
export default connect(mapStateToProps, {})(ImagePickerComponent);