import React, { useState, useEffect } from "react";
import { Button, Row, Col, Container, Card, Badge } from "react-bootstrap";
import Sound from "react-sound";

// Audio files for each button press
const soundUrls = [
  "https://cdn.freecodecamp.org/curriculum/take-home-projects/simonSound1.mp3",
  "https://cdn.freecodecamp.org/curriculum/take-home-projects/simonSound2.mp3",
  "https://cdn.freecodecamp.org/curriculum/take-home-projects/simonSound3.mp3",
  "https://cdn.freecodecamp.org/curriculum/take-home-projects/simonSound4.mp3",
];

const App = () => {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [strictMode, setStrictMode] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [winningCount, setWinningCount] = useState(20);
  const [audioUrl, setAudioUrl] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (playing) {
      setSequence([]);
      setUserSequence([]);
      setStepCount(0);
      setGameOver(false);
      setTimeout(playSequence, 1000);
    }
  }, [playing]);

  useEffect(() => {
    if (userSequence.length > 0) {
      checkSequence();
    }
  }, [userSequence]);

  const playSound = (url) => {
    setAudioUrl(url);
  };

  const addToSequence = () => {
    const random = Math.floor(Math.random() * 4);
    setSequence((prevSequence) => [...prevSequence, random]);
    setStepCount((prevCount) => prevCount + 1);
  };

  const playSequence = () => {
    let i = 0;
    const interval = setInterval(() => {
      playSound(soundUrls[sequence[i]]);
      i++;
      if (i >= sequence.length) {
        clearInterval(interval);
      }
    }, 1000);
  };

  const handleButtonClick = (buttonIndex) => {
    if (playing && !gameOver) {
      setUserSequence((prevSequence) => [...prevSequence, buttonIndex]);
      playSound(soundUrls[buttonIndex]);
    }
  };

  const checkSequence = () => {
    for (let i = 0; i < userSequence.length; i++) {
      if (userSequence[i] !== sequence[i]) {
        setStatusMessage("Wrong!");
        if (strictMode) {
          setGameOver(true);
          setPlaying(false);
          return;
        }
        setTimeout(() => {
          setUserSequence([]);
          setStatusMessage("");
          playSequence();
        }, 1500);
        return;
      }
    }

    if (userSequence.length === sequence.length) {
      setStatusMessage("Correct!");
      if (sequence.length === winningCount) {
        setGameOver(true);
        setStatusMessage("You win!");
        return;
      }
      setUserSequence([]);
      setTimeout(addToSequence, 1500);
    }
  };

  const handleStartClick = () => {
    setPlaying(true);
    setStatusMessage("");
  };

  const handleStrictModeToggle = () => {
    setStrictMode((prevMode) => !prevMode);
  };

  const handleRestartClick = () => {
    setSequence([]);
    setUserSequence([]);
    setPlaying(true);
    setStatusMessage("");
    setGameOver(false);
    setStepCount(1);
  };

  return (
    <Container className="mt-5">
      <Card className="text-center">
        <Card.Header as="h5">Simon Game</Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col>
              <Button onClick={handleStartClick} disabled={playing}>
                Start
              </Button>
              <Button className="ml-2" onClick={handleRestartClick}>
                Restart
              </Button>
              <Button className="ml-2" onClick={handleStrictModeToggle}>
                Strict {strictMode ? "On" : "Off"}
              </Button>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <h6>Steps: {stepCount}</h6>
              <h6>{statusMessage}</h6>
            </Col>
          </Row>
          <Row>
            {[0, 1, 2, 3].map((index) => (
              <Col key={index} className="mb-3">
                <Button
                  variant="primary"
                  onClick={() => handleButtonClick(index)}
                  disabled={!playing || gameOver}
                  block
                >
                  {index + 1}
                  <Sound
                    url={audioUrl}
                    playStatus={Sound.status.PLAYING}
                    onFinishedPlaying={() => setAudioUrl("")}
                  />
                </Button>
              </Col>
            ))}
          </Row>
        </Card.Body>
        <Card.Footer className="text-muted">
          <Badge variant="secondary">freeCodeCamp Project</Badge>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default App;
