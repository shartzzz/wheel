import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import './Home.css';
import {Howl} from 'howler';

/* audio code */
var clack = new Howl({
  src: [
    'https://2gd4.me/salty/audio/sfx/menu_move.ogg',
    'https://2gd4.me/salty/audio/sfx/menu_move.wav',
  ]
});
var click = new Howl({
  src: [
    'https://2gd4.me/salty/audio/sfx/question_show.ogg',
    'https://2gd4.me/salty/audio/sfx/question_show.wav',
  ]
});
var stopSound = new Howl({
  src: [
    'https://2gd4.me/salty/audio/sfx/option_highlight.ogg',
    'https://2gd4.me/salty/audio/sfx/option_highlight.wav'
  ]
});

/* spinner code */
var currentCategory = 2;
var spinnerRotation = 15;
var spinnerSpeed = 0;
var friction = 0.02;
var frameCount = 0;
function updateCategory(){
  const prizes = [
    0,
    1,
    2,
    3,
    4,
    5,
  ][currentCategory];

  var color = [
    "#ff2b48"
  , "#ffa72b"
  , "#fff421"
  , "#44f21d"
  , "#2d91fc"
  , "#c93ef7"
  ][currentCategory];
  document.getElementById("wrapper").style.backgroundColor = color;
  document.getElementById("spin_button").style.color = color;
  var text = [
    "Подарок №1"
  , "Подарок №2"
  , "Подарок №3"
  , "Подарок №4"
  , "Подарок №5"
  , "Подарок №6"
  ][currentCategory];

  if (prizes == 0 || prizes == 3 || prizes == 5) {
    document.getElementById("category").innerText = text + "хуй";
  }

  else if (prizes == 1 || prizes == 2 || prizes == 4) {
    document.getElementById("category").innerText = text + "поздравляем";
  }

  
  console.log(text);
  console.log(prizes);
  
  var pointer =  document.getElementById("pointer_content");
  if (spinnerSpeed > 0) {
   pointer.classList.add("nudged_right");
  } else {
   pointer.classList.add("nudged_left");
  }
  
  pointer.classList = "";
  clack.stop();
  clack.play();
}
function stopWheel(){
 document.getElementById("spin_button").disabled = false; document.getElementById("roulette_wheel").classList.add("highlight");
  stopSound.play();
  spinnerSpeed = 0;
  requestAnimationFrame(function(){
document.getElementById("roulette_wheel").classList.remove("highlight");
  })
}
function spinWheel(){
  var lastCategory = currentCategory;
  spinnerRotation += spinnerSpeed;
  if (spinnerRotation >= 360 || spinnerRotation < 0) {
    spinnerRotation = (360 + spinnerRotation) % 360;
  }
  document.getElementById("roulette_image").style.transform = "rotate(" + (135 - spinnerRotation) + "deg)";

  if (lastCategory != Math.floor(spinnerRotation / 60) % 6) {
    currentCategory = Math.floor(spinnerRotation / 60);
    updateCategory(currentCategory);
  }
  if (frameCount) {
    spinnerSpeed *= 1 - friction;
    frameCount--;
  } else {
    spinnerSpeed *= 1 - (friction * (0.75 + 0.25 * Math.random()));
    frameCount = 30;
  }
  if (spinnerSpeed > 0.5 || spinnerSpeed < -0.5) {
    requestAnimationFrame(spinWheel);
  } else {
    requestAnimationFrame(stopWheel);
  }
}

function startWheel(){
  click.play();
  document.getElementById("spin_button").disabled = true;
  document.getElementById("category").classList.remove("active");


  var randVal = Math.random() * 2 - 1;
  spinnerSpeed = randVal * 40 + (randVal < 0 ? -40 : 40);
  console.log("start speed: " + spinnerSpeed);
  
  setTimeout(spinWheel, 600);
}

const Home = ({ id, go, fetchedUser }) => (
	
	<Panel id={id}>
		<PanelHeader>Колесо фортуны</PanelHeader>
		{fetchedUser &&
		<Group title="User Data Fetched with VK Connect">
			<Cell
				before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}
				description={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}
			>
				{`${fetchedUser.first_name} ${fetchedUser.last_name}`}
			</Cell>
		</Group>}

		<Group title="Navigation Example">
		<div id="wrapper">
  <div id="roulette">
    <div id="roulette_wheel">
      <div id="roulette_image"></div>
      <span id="pointer">
      <svg id="pointer_content" width="16" height="16" version="1.1" viewBox="0 0 16 16">
<path d="m8 4c-1.5803.00017-3.0125.93093-3.6543 2.375l-4.2227 9.502 9.502-4.2227c1.4441-.64181 2.3748-2.074 2.375-3.6543.000233-2.2091-1.7909-4.0002-4-4z" fill="#fff"/>
<path d="m8 6a2 2 0 00-2 2 2 2 0 002 2 2 2 0 002-2 2 2 0 00-2-2z" fill="#000"/>
</svg>
      </span>
    </div>
  </div>
  <div id="controls">
    <button id="spin_button" type="button" onClick={startWheel}>крутить</button>
    <div id="category" className="active">Подарок №3</div>
  </div>
</div>
		</Group>
	</Panel>
);

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		city: PropTypes.shape({
			title: PropTypes.string,
		}),
	}),
};

export default Home;
