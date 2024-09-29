/* eslint-disable no-fallthrough */
import $ from "jquery"
import { Howl, Howler } from "howler";
import { GunColor, KeyBind, movementKeys, RecvPacketTypes, TIMEOUT } from "./constants";
import { start, stop } from "./renderer";
import { initMap } from "./rendering/map";
import { addKeyPressed, addMousePressed, getToken, isKeyPressed, isMenuHidden, isMouseDisabled, removeKeyPressed, removeMousePressed, toggleBigMap, toggleHud, toggleMap, toggleMenu, toggleMinimap, toggleMouseDisabled } from "./states";
import { FullPlayer, Healing } from "./store/entities";
import { castObstacle, castMinObstacle, Bush, Tree, Barrel, Crate, Desk, Stone, Toilet, ToiletMore, Table, Box } from "./store/obstacles";
import { castTerrain } from "./store/terrains";
import { Vec2 } from "./types/math";
import { PingPacket, MovementPressPacket, MovementReleasePacket, MouseMovePacket, MousePressPacket, MouseReleasePacket, GamePacket, MapPacket, AckPacket, InteractPacket, SwitchWeaponPacket, ReloadWeaponPacket, UseHealingPacket, ResponsePacket, SoundPacket, ParticlesPacket, MovementResetPacket, MovementPacket, AnnouncementPacket, PlayerRotationDelta, ScopeUpdatePacket, ServerScopeUpdatePacket, ServerPacketResolvable, CancelActionsPacket } from "./types/packet";
import { World } from "./types/world";
import { receive, send } from "./utils";
import Building from "./types/building";
import { cookieExists, getCookieValue } from "cookies-utils";
import { Obstacle } from "./types/obstacle";
import { getMode } from "./homepage";
import { IslandrBitStream } from "./packets";
import { MinTerrain, MinVec2 } from "./types/minimized";
import { deserialiseDiscardables, deserialiseMinEntities, deserialiseMinObstacles, deserialiseMinParticles, deserialisePlayer, setUsrnameIdDeathImg } from "./deserialisers";
import { inflate } from "pako";
import { type } from "os";
//handle users that tried to go to old domain name, or direct ip
var urlargs = new URLSearchParams(window.location.search);
if(urlargs.get("from")){
	alert("We have moved from " + urlargs.get("from") + " to islandr.io!")
}

export let world: World;

let id: string | null;
let tps = 1; // Default should be 1, so even if no TPS detail from server, we will not be dividing by 0
let username: string | null;
let address: string | null;
let skin: string | null = localStorage.getItem("playerSkin");
if (!localStorage.getItem("playerDeathImg")) localStorage.setItem("playerDeathImg", "default")

let deathImg: string | null = localStorage.getItem("playerDeathImg");

const isMobile = /Android/.test(navigator.userAgent) || /iPhone/.test(navigator.userAgent) || /iPad/.test(navigator.userAgent) || /Tablet/.test(navigator.userAgent)
let player: FullPlayer | null;

/**
 * Getter of player ID
 * @returns Player ID
 */
export function getId(): string | null { return id; }
/**
 * Getter of the client player object
 * @returns Client Player object
 */
export function getPlayer(): FullPlayer | null { return player; }
/**
 * Getter of server TPS
 * @returns Server TPS
 */
export function getTPS(): number { return tps; }

let ws: WebSocket;
let connected = false;
export function getConnected() { return connected; }
function setConnected(v: boolean) { connected = v; return connected; }
enum modeMapColours {
	normal = 0x748838,
	suroi_collab = 0x49993e,
	classic = 0x80B251
}
const joystick = document.getElementsByClassName('joystick-container')[0];
const handle = document.getElementsByClassName('joystick-handle')[0];
const aimJoystick = document.getElementsByClassName('aimjoystick-container')[0];
const aimHandle = document.getElementsByClassName('aimjoystick-handle')[0];
let _selectedScope = 1;
let data: any;
declare type modeMapColourType = keyof typeof modeMapColours

/**
 * Initializes connection with a given address from the <input> tag
 * @param address Websocket address from the <input> tag
 */
async function init(address: string) {
	// Initialize the websocket
	const protocol = "ws";
	// if ((<HTMLInputElement>document.getElementById("wss")).checked) protocol += "s";
	ws = new WebSocket(`${protocol}://${address}`);
	ws.binaryType = "arraybuffer";

	await new Promise((res, rej) => {
		const timer = setTimeout(() => {
			rej(new Error("Failed finding game"));
			ws.close();
		}, TIMEOUT);

		ws.onmessage = async (event) => {
			const stream = new IslandrBitStream(inflate(event.data).buffer)
			const dataA = <AckPacket>{
				type:stream.readPacketType(),
				id:stream.readId(),
				tps:stream.readInt8(),
				size:[stream.readInt16(),stream.readInt16()],
				terrain: <MinTerrain>{ id:stream.readId() }
			}
			id = dataA.id;
			tps = dataA.tps;
			world = new World(new Vec2(dataA.size[0], dataA.size[1]), castTerrain(dataA.terrain).setColour((modeMapColours[getMode() as modeMapColourType])));
			const gameObjects = [Bush, Tree, Barrel, Crate, Desk, Stone, Toilet, ToiletMore, Table, Box]
			gameObjects.forEach(OBJ => {OBJ.updateAssets() })
	
			// Call renderer start to setup
			await start();
			var currentCursor = localStorage.getItem("selectedCursor")
			if (!currentCursor){localStorage.setItem("selectedCursor", "default"); currentCursor = localStorage.getItem("selectedCursor")}
			if (currentCursor) { document.documentElement.style.cursor = currentCursor }
			const responsePacket = new ResponsePacket(id, username!, skin!, deathImg!, isMobile!, (cookieExists("gave_me_cookies") ? getCookieValue("access_token") : getToken()) as string)
			connected = true;
			send(ws, responsePacket);
			setConnected(true)
			showMobControls();
			clearTimeout(timer);
			const scopes = document.getElementById(`scopes`);
			const scopeList = [1, 2, 4, 8, 15];
			const x1scope = scopes?.children.item(0) as HTMLElement
			x1scope.style.background = "rgba(55, 55, 55, 1.5)"
			x1scope.addEventListener("click", () => {
				if (_selectedScope == 1) return;
				_selectedScope = 1;
				send(ws, new ServerScopeUpdatePacket(1));
				for (let ii = 0; ii < scopeList.length; ii++) {
					if (_selectedScope == scopeList[ii]) {
						(scopes?.children.item(ii) as HTMLElement).style.background = "rgba(55, 55, 55, 1.5)"
					}
					else {
						(scopes?.children.item(ii) as HTMLElement).style.background = "rgba(51, 51, 51, 0.5)"
					}
				}
			}

			)
			// Setup healing items click events
			for (const element of document.getElementsByClassName("healing-panel")) {
				const el = <HTMLElement> element;
				console.log("Adding events for", el.id);
				const ii = parseInt(<string>el.id.split("-").pop());
				el.onmouseenter = el.onmouseleave = () => toggleMouseDisabled();
				el.onclick = () => {
					if (!el.classList.contains("enabled")) return;
					send(ws, new UseHealingPacket(Healing.mapping[ii]));
				}
			}
			showMobileExclusiveBtns();
	
			// Ping server every second to ensure connection
			const interval = setInterval(() => {
				if (connected) send(ws, new PingPacket());
				else clearInterval(interval);
			}, 1000);
			ws.onmessage = (event) => {
				let bitstream = true;
				let stream;
				let packetType: number;
				if (receive(event.data) && (receive(event.data)!.type == RecvPacketTypes.GAME || receive(event.data)!.type == RecvPacketTypes.MAP)) { data = receive(event.data); bitstream = false; packetType = receive(event.data)!.type }
				else { stream = new IslandrBitStream(inflate(event.data).buffer); packetType = (stream as IslandrBitStream).readPacketType() } 
				switch (packetType) {
					case RecvPacketTypes.MAP: {
						const mapPkt = <MapPacket>data;
						world.terrains = mapPkt.terrains.map(ter => castTerrain(ter));
						world.obstacles = <Obstacle[]>mapPkt.obstacles.map(obs => castObstacle(castMinObstacle(obs))).filter(obs => !!obs);
						world.buildings = mapPkt.buildings.map(bui => new Building(bui));
						initMap();
						// Show player count once game starts
						(document.querySelector("#playercountcontainer") as HTMLInputElement).style.display = "block";
						break;
					}
					case RecvPacketTypes.GAME: {
						if (bitstream) {
							data = {
								type: packetType,
								entities: deserialiseMinEntities(stream as IslandrBitStream as IslandrBitStream),
								obstacles: deserialiseMinObstacles(stream as IslandrBitStream),
								alivecount: (stream as IslandrBitStream).readInt8(),
								discardEntities: deserialiseDiscardables(stream as IslandrBitStream),
								discardObstacles: deserialiseDiscardables(stream as IslandrBitStream),
							}
						}
						const gamePkt = <GamePacket>data;
						world.updateEntities(gamePkt.entities, gamePkt.discardEntities);
						world.updateObstacles(gamePkt.obstacles, gamePkt.discardObstacles);
						world.updateLiveCount(gamePkt.alivecount);
						break;
					}
					case RecvPacketTypes.PLAYERTICK: {
						const playerSrvr = deserialisePlayer(stream as IslandrBitStream)
						if (!player) player = new FullPlayer(playerSrvr);
						else player.copy(playerSrvr);
						const usableGunAmmoNames = ["9mm", "12 gauge", "7.62mm", "5.56mm", ".308 subsonic"];
						const usableGunAmmos = [
							player.inventory.ammos[GunColor.YELLOW],
							player.inventory.ammos[GunColor.RED],
							player.inventory.ammos[GunColor.BLUE],
							player.inventory.ammos[GunColor.GREEN],
							player.inventory.ammos[GunColor.OLIVE]];
						const ammosElements = document.getElementsByClassName("ammos");
						for (let ii = 0; ii < usableGunAmmoNames.length; ii++) {
							(<HTMLElement>ammosElements.item(ii)).textContent = `${usableGunAmmoNames[ii]}: ${usableGunAmmos[ii]}`
						}
						break;
					}
					case RecvPacketTypes.SOUND: {
						if (!player) break;
						const data = {
							type: packetType,
							path: (stream as IslandrBitStream).readASCIIString(50),
							position: Vec2.fromMinVec2(<MinVec2>{x: (stream as IslandrBitStream).readInt16(), y: (stream as IslandrBitStream).readInt16()})
						}
						const soundPkt = <SoundPacket>data;
						const howl = new Howl({
							src: `assets/${getMode()}/sounds/${soundPkt.path}`
						});
						const pos = Vec2.fromMinVec2(soundPkt.position);
						const relative = pos.addVec(player.position.inverse()).scaleAll(1/60);
						howl.pos(relative.x, relative.y);
						const id = howl.play();
						world.sounds.set(id, { howl, pos });
						howl.on("end", () => world.sounds.delete(id));
						break;
					}
					case RecvPacketTypes.PARTICLES: {
						const data = {
							type: packetType,
							particles: deserialiseMinParticles(stream as IslandrBitStream)
						}
						const partPkt = <ParticlesPacket>data;
						world.addParticles(partPkt.particles);
						break;
					}
					case RecvPacketTypes.ANNOUNCE: {
						const data = {
							type: packetType,
							weaponUsed: (stream as IslandrBitStream).readASCIIString(),
							killer: (stream as IslandrBitStream).readASCIIString(),
							killed: (stream as IslandrBitStream).readASCIIString()
						}
						const announcementPacket = <AnnouncementPacket>data;
						const killFeeds = document.getElementById("kill-feeds")
						const killFeedItem = document.createElement("div")
						if (killFeeds?.childNodes.length as number > 5) { killFeeds?.childNodes[killFeeds.childNodes.length - 1].remove(); }
						if (announcementPacket.killer == getPlayer()!.id) { killFeedItem.style.background = "rgba(0, 0, 139, 0.5)" }
						else { killFeedItem.style.background = "rgba(139, 0, 0, 0.5)" }
						const KILLFEED_STRING = `${announcementPacket.killer} killed ${announcementPacket.killed} with ${announcementPacket.weaponUsed}`;
						killFeedItem.prepend(`${KILLFEED_STRING}\n`)
						killFeeds?.prepend(killFeedItem);
						setTimeout(() => {
							killFeeds?.childNodes[killFeeds.childNodes.length-1].remove();
						}, 5000);
						break;
					}
					case RecvPacketTypes.SCOPEUPD: {
						const data = {
							type:packetType,
							scope: (stream as IslandrBitStream).readInt8()
						}
						const scopeChangePkt = <ScopeUpdatePacket>data;
						for (let ii = 0; ii < scopes!.children.length; ii++) {
							(<HTMLElement>scopes?.children.item(ii)).style.background = "rgba(55, 55, 55, 0.5)";
						}
						const scopeElement = (scopes?.children.item(scopeList.indexOf(Number(scopeChangePkt.scope))) as HTMLElement);
						console.log(scopeElement)
						scopeElement.style.display = "block";
						scopeElement.style.background = "rgba(55, 55, 55, 1.5)"
						
						scopeElement.addEventListener("click", () => {
							_selectedScope = scopeChangePkt.scope
							send(ws, new ServerScopeUpdatePacket(Number(scopeElement.textContent?.replace("x", "") as unknown)))
							for (let ii = 0; ii < scopeList.length; ii++) {
								if (_selectedScope == scopeList[ii]) {
									(scopes?.children.item(ii) as HTMLElement).style.background = "rgba(55, 55, 55, 1.5)"
								}
								else {
									(scopes?.children.item(ii) as HTMLElement).style.background = "rgba(51, 51, 51, 0.5)"
								}
							}
						})
					}
				}
			}
		}
	
		// Reset everything when connection closes
		ws.onclose = () => {
			connected = false;
			setConnected(false)
			stop();
			Howler.stop();
			id = null;
			tps = 1;
			username = null;
			player = null;
			setUsrnameIdDeathImg([null, null, null])
			res(undefined);
			Healing.setupHud()
			for (const ammoElement of document.getElementsByClassName("ammos")) {
				ammoElement.textContent = "";
			}
			//remove playercount
		}
	
		ws.onerror = (err) => {
			console.error(err);
			rej(new Error("Failed joining game"));
			ws.close()
		};
	});
}

document.getElementById("connect")?.addEventListener("click", async () => {
	const errorText = <HTMLDivElement>document.getElementById("error-div");
	username = (<HTMLInputElement>document.getElementById("username")).value;
	address = (<HTMLInputElement>document.getElementById("address")).value;
	try {
		// check if username and address are valid before initializing
		check(username, address);
		await init(address);
		errorText.style.display = "none";
	} catch (error: any) {
		errorText.innerHTML = error.message;
		errorText.style.display = "block";
		return;
	}
});
function showMobileExclusiveBtns() {
	if (getConnected() && isMobile) {
		function __sendPkt() { const rlpk = new ReloadWeaponPacket(); send(ws, rlpk); }
		const ReloadButtonElement = <HTMLElement>document.getElementById("reload-btn");
		ReloadButtonElement.style.display = 'block';
		ReloadButtonElement.addEventListener('click', (event) => { event.stopPropagation(); __sendPkt() })
		const MenuBtnElement = <HTMLElement>document.getElementById("menu-btn");
		MenuBtnElement.style.display = 'block';
		MenuBtnElement.addEventListener('click', (event) => {
			event.stopPropagation();
			if (isMenuHidden()) { document.getElementById("settings")?.classList.remove("hidden"); toggleMenu() }
			else { document.getElementById("settings")?.classList.add("hidden"); toggleMenu() }
		})
		for (let ii = 0; ii < 4; ii++) {
			(document.getElementsByClassName("weapon-panel")[ii] as HTMLElement).style.height = "8.5vh";
			(document.getElementsByClassName("weapon-index")[ii] as HTMLElement).style.height = "4vh";
}
		document.getElementById("weapon-container")!.style.top = "-4%";
	}
}
function showMobControls() {
	if (isMobile && getConnected()) {
		joystick.classList.remove("hidden");
		handle.classList.remove("hidden");
		aimJoystick.classList.remove("hidden");
		aimHandle.classList.remove("hidden");
	var joystickActive = false;
	var joystickDirection = '';
		var aimJoystickActive = false;
		let resettedMovement = false;

	// Get the joystick and handle elements
	const HandlerObjects = [joystick, handle, aimJoystick, aimHandle];
	HandlerObjects.forEach(handler => {
		(<HTMLElement>handler).style.display = 'block';
	});
	// Add event listeners for touch events
	(<HTMLElement>handle).addEventListener('touchstart', handleTouchStart);
	(<HTMLElement>handle).addEventListener('touchmove', handleTouchMove);
	(<HTMLElement>handle).addEventListener('touchcancel', handleTouchEnd);
	(<HTMLElement>handle).addEventListener('touchend', handleTouchEnd);
	(<HTMLElement>joystick).addEventListener('touchcancel', handleTouchEnd);
	(<HTMLElement>joystick).addEventListener('touchend', handleTouchEnd);

	//Add event listeners for the aim joystick
	(<HTMLElement>aimJoystick).addEventListener('touchcancel', handleAimJoystickTouchEnd);
	(<HTMLElement>aimJoystick).addEventListener('touchend', handleAimJoystickTouchEnd);
	(<HTMLElement>aimHandle).addEventListener('touchstart', handleAimJoystickTouchStart);
	(<HTMLElement>aimHandle).addEventListener('touchmove', handleTouchMoveAimJoystick);
	(<HTMLElement>aimHandle).addEventListener('touchcancel', handleAimJoystickTouchEnd);
	(<HTMLElement>aimHandle).addEventListener('touchend', handleAimJoystickTouchEnd);
		var centerX = (<HTMLElement>aimJoystick).offsetWidth / 2;
		var centerY = (<HTMLElement>aimJoystick).offsetHeight / 2;
	// Function to handle touchstart event
	function handleTouchStart(event: Event) {
		event.preventDefault();
		joystickActive = true;
		resettedMovement = false;
		return 0;
	}
	function handleAimJoystickTouchStart(event: Event) { event.preventDefault(); aimJoystickActive = true; return 0; }

	// Function to handle touchmove event
	function handleTouchMove(event: any) {
		event.preventDefault();
		resettedMovement = false;
		if (joystickActive) {
			var touch = event.targetTouches[0];
			var posX = touch.pageX - (<HTMLElement>joystick).offsetLeft;
			var posY = touch.pageY - (<HTMLElement>joystick).offsetTop;
			var touchX = event.touches[0].clientX - (<HTMLElement>joystick).offsetLeft - (<HTMLElement>joystick).offsetWidth / 2;
			var touchY = event.touches[0].clientY - (<HTMLElement>joystick).offsetTop - (<HTMLElement>joystick).offsetWidth / 2;
			// Calculate the distance from the center of the joystick
			
			var distance = Math.sqrt(Math.pow(posX - (<HTMLElement>joystick).offsetWidth / 2, 2) + Math.pow(posY - (<HTMLElement>joystick).offsetHeight / 2, 2));
			var maxDistance = 100;
			var angle;
			// If the distance exceeds the maximum, limit it
			angle = Math.atan2(posY - (<HTMLElement>joystick).offsetHeight / 2, posX - (<HTMLElement>joystick).offsetWidth / 2);
			if (distance > maxDistance) {
				var deltaX = Math.cos(angle) * maxDistance;
				var deltaY = Math.sin(angle) * maxDistance;
				posX = (<HTMLElement>joystick).offsetWidth / 2 + deltaX;
				posY = (<HTMLElement>joystick).offsetHeight / 2 + deltaY;
			}
			var joystickAngle = Math.atan2(touchY, touchX);
			const joystickX = ((<HTMLElement>joystick).offsetWidth / 2 - (<HTMLElement>handle).offsetWidth / 2) * Math.cos(joystickAngle);
			const joystickY = ((<HTMLElement>joystick).offsetWidth / 2 - (<HTMLElement>handle).offsetWidth / 2) * Math.sin(joystickAngle);
			(<HTMLElement>handle).style.transform = 'translate(' + joystickX + 'px, ' + joystickY + 'px)';
			// Calculate the joystick direction based on the handle position
			joystickDirection = '';
			send(ws, new MovementPacket(angle as number))
		}
	}
	//function for joystick aim part
	function handleTouchMoveAimJoystick(event: any) {
		event.preventDefault()
		if (!aimJoystickActive) return;
		var touch = event.targetTouches[0];
		var posX = touch.pageX - (<HTMLElement>aimJoystick).offsetLeft;
		var posY = touch.pageY - (<HTMLElement>aimJoystick).offsetTop;
		var touchX = event.touches[0].clientX - (<HTMLElement>aimJoystick).offsetLeft - (<HTMLElement>aimJoystick).offsetWidth / 2;
		var touchY = event.touches[0].clientY - (<HTMLElement>aimJoystick).offsetTop - (<HTMLElement>aimJoystick).offsetWidth / 2;
		// Calculate the distance from the center of the joystick

		var distance = Math.sqrt(Math.pow(posX - (<HTMLElement>aimJoystick).offsetWidth / 2, 2) + Math.pow(posY - (<HTMLElement>aimJoystick).offsetHeight / 2, 2));
		var maxDistance = 100;
		var angle;
		// If the distance exceeds the maximum, limit it
		angle = Math.atan2(posY - (<HTMLElement>aimJoystick).offsetHeight / 2, posX - (<HTMLElement>aimJoystick).offsetWidth / 2);
		if (distance > maxDistance) {
			var deltaX = Math.cos(angle) * maxDistance;
			var deltaY = Math.sin(angle) * maxDistance;
			posX = (<HTMLElement>aimJoystick).offsetWidth / 2 + deltaX;
			posY = (<HTMLElement>aimJoystick).offsetHeight / 2 + deltaY;
		}
		var joystickAngle = Math.atan2(touchY, touchX);
		const joystickX = ((<HTMLElement>aimJoystick).offsetWidth / 2 - (<HTMLElement>aimHandle).offsetWidth / 2) * Math.cos(joystickAngle);
		const joystickY = ((<HTMLElement>aimJoystick).offsetWidth / 2 - (<HTMLElement>aimHandle).offsetWidth / 2) * Math.sin(joystickAngle);
		(<HTMLElement>aimHandle).style.transform = 'translate(' + joystickX + 'px, ' + joystickY + 'px)';
		send(ws, new PlayerRotationDelta(angle as number));
		if (distance > maxDistance) {
			addMousePressed(0)
			send(ws, new MousePressPacket(0))
		}
	}
	// Function to handle touchend event
	function handleAimJoystickTouchEnd(event: Event) {
		event.preventDefault();
		aimJoystickActive = false;
		(<HTMLElement>aimHandle).style.transform = "translate(0px, 0px)";
		removeMousePressed(1)
		send(ws, new MouseReleasePacket(0));
	}
	function handleTouchEnd(event: Event) {
		event.preventDefault();
		joystickActive = false;
		(<HTMLElement>handle).style.transform = "translate(0px, 0px)";

		joystickDirection = '';
		if (resettedMovement == false) send(ws, new MovementResetPacket())
		resettedMovement = true;
	}
	setInterval(function () {
		if ((joystickDirection == '' || !joystickActive) && getConnected() && resettedMovement == false ) {
			send(ws, new MovementResetPacket())
			resettedMovement = true;
		}
	}, 100);
}}

/**
 * Validates username and address
 * @param username <input> username
 * @param address <input> address
 */
function check(username: string, address: string): Error | void {
	if (!username)
		throw new Error("Please provide a username.");
	else if (username.length > 50)
		throw new Error("Username too long! Try another username.");

	if (!address)
		throw new Error("Please provide an address.");
}

document.getElementById("disconnect")?.addEventListener("click", () => {
	// when disconnect is clicked, close the socket and return to home screen
	ws.close();
	document.getElementById("settings")?.classList.add("hidden");
	(<HTMLElement>joystick).style.display = 'none';
	(<HTMLElement>handle).style.display = 'none';
	(<HTMLElement>aimJoystick).style.display = 'none';
	(<HTMLElement>aimHandle).style.display = 'none';
	toggleMenu();
});
document.getElementById("resume")?.addEventListener('click', () => {
	document.getElementById("settings")?.classList.add('hidden');
	toggleMenu();
})
window.onkeydown = (event) => {
	if (!connected || isKeyPressed(event.key)) return;
	event.stopPropagation();
	addKeyPressed(event.key);
	const settingsElem = document.getElementById("settings");
	if (event.key == KeyBind.MENU) {
		if (isMenuHidden()) settingsElem?.classList.remove("hidden");
		else settingsElem?.classList.add("hidden");
		toggleMenu();
	} else if (event.key == KeyBind.HIDE_HUD) toggleHud();
	else if (event.key == KeyBind.WORLD_MAP) toggleMap();
	else if (event.key == KeyBind.HIDE_MAP) toggleMinimap();
	else if (event.key == KeyBind.BIG_MAP) toggleBigMap();
	if (isMenuHidden()) {
		const index = movementKeys.indexOf(event.key);
		if (index >= 0)
			send(ws, new MovementPressPacket(index));
		else if (event.key == KeyBind.INTERACT)
			send(ws, new InteractPacket());
		else if (event.key == KeyBind.RELOAD)
			send(ws, new ReloadWeaponPacket());
		else if (event.key == KeyBind.CANCEL)
			send(ws, new CancelActionsPacket())
		else if (!isNaN(parseInt(event.key)))
			send(ws, new SwitchWeaponPacket(parseInt(event.key) - 1, true));
	}
}

window.onkeyup = (event) => {
	if (!connected) return;
	event.stopPropagation();
	removeKeyPressed(event.key);
	const index = movementKeys.indexOf(event.key);
	if (index >= 0)
		send(ws, new MovementReleasePacket(index));
}

window.onmousemove = (event) => {
	if (!connected || isMobile) return;
	event.stopPropagation();
	send(ws, new MouseMovePacket(event.x - window.innerWidth / 2, event.y - window.innerHeight / 2));
}

window.onmousedown = (event) => {
	if (!connected || isMouseDisabled() || isMobile) return;
	event.stopPropagation();
	addMousePressed(event.button);
	send(ws, new MousePressPacket(event.button));
}

window.onmouseup = (event) => {
	if (!connected || isMobile) return;
	event.stopPropagation();
	removeMousePressed(event.button);
	send(ws, new MouseReleasePacket(event.button));
}

window.onwheel = (event) => {
	if (!connected || !player) return;
	event.stopPropagation();
	const delta = event.deltaY < 0 ? -1 : 1;
	send(ws, new SwitchWeaponPacket(delta));
}

window.oncontextmenu = (event) => {
	if (connected) event.preventDefault();
}

window.ondblclick = (event) => {
	if (connected) event.preventDefault();
}

// Because 4 is grenade and it's not done yet
for (let ii = 0; ii < 3; ii++) {
	const panel = <HTMLElement> document.getElementById("weapon-panel-" + ii);
	panel.onmouseenter = panel.onmouseleave = () => toggleMouseDisabled();
	panel.onclick = () => {
		if (!connected || !player) return;
		send(ws, new SwitchWeaponPacket(ii, true));
	}
}