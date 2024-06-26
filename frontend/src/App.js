import React, { Component } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      boxes: [],
      cameraActive: false,
    };
    this.webcamRef = React.createRef();
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    };
  }

  displayFaceBox = (box) => {
    this.setState({ boxes: [box] });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/imageurl`, { input: this.state.input })
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response.data)))
      .catch(err => console.log(err));
  }

  capture = () => {
    const imageSrc = this.webcamRef.current.getScreenshot();
    this.setState({ imageUrl: imageSrc });
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/imageurl`, { input: imageSrc })
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response.data)))
      .catch(err => console.log(err));
  }

  toggleCamera = () => {
    this.setState((prevState) => ({ cameraActive: !prevState.cameraActive }));
  }

  render() {
    const { imageUrl, boxes, cameraActive } = this.state;
    return (
      <div className="App">
        <p>{'This Magic Brain will detect faces in your pictures. Give it a try.'}</p>
        <div>
          <input type="text" onChange={this.onInputChange} />
          <button onClick={this.onButtonSubmit}>Detect</button>
        </div>
        <div>
          <button onClick={this.toggleCamera}>
            {cameraActive ? 'Stop Camera' : 'Start Camera'}
          </button>
          {cameraActive && (
            <div>
              <Webcam
                audio={false}
                ref={this.webcamRef}
                screenshotFormat="image/jpeg"
                width={500}
              />
              <button onClick={this.capture}>Capture</button>
            </div>
          )}
        </div>
        <div className="image-container">
          <img id="inputImage" alt="" src={imageUrl} width="500px" heigh="auto" />
          {boxes.map((box, i) => {
            return (
              <div
                key={i}
                className="bounding-box"
                style={{
                  top: box.topRow,
                  right: box.rightCol,
                  bottom: box.bottomRow,
                  left: box.leftCol,
                }}
              ></div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default App;
