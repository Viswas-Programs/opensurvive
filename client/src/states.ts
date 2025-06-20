// This file records the state of things

import { KeyBind, KeyBindDef } from "./constants";

const keyPressed = new Map<string, boolean>();
export function isKeyPressed(key: string) { return !!keyPressed.get(key); }
export function addKeyPressed(key: string) { keyPressed.set(key, true); }
export function removeKeyPressed(key: string) { keyPressed.delete(key); }
const mousePressed = new Map<number, boolean>();
export function isMousePressed(button: number) { return !!mousePressed.get(button); }
export function addMousePressed(button: number) { mousePressed.set(button, true); }
export function removeMousePressed(button: number) { mousePressed.delete(button); }
export function cleanUpMouseAndKeyPressed() { keyPressed.clear(); mousePressed.clear() }

let menuHidden = true;
export function isMenuHidden() { return menuHidden; }
export function toggleMenu() { menuHidden = !menuHidden; }

let leaderBoardHidden = true;
export function leaderBoardViewStatus() {return leaderBoardHidden;}
export function toggleLeaderboard(){ leaderBoardHidden = !leaderBoardHidden;}

let hudHidden = false;
export function isHudHidden() { return hudHidden; }
export function toggleHud() {
	hudHidden = !hudHidden;
	if (hudHidden) document.getElementById("hud")!.classList.add("hidden");
	else document.getElementById("hud")!.classList.remove("hidden");
}

let mapOpened = false;
export function isMapOpened() { return mapOpened; }
export function toggleMap() { mapOpened = !mapOpened; }

let mapHidden = false;
export function isMapHidden() { return mapHidden; }
export function toggleMinimap() { mapHidden = !mapHidden; }

let bigMap = false;
export function isBigMap() { return bigMap; }
export function toggleBigMap() { bigMap = !bigMap; }


let mouseDisabled = false;
export function isMouseDisabled() { return mouseDisabled; }
export function toggleMouseDisabled() { mouseDisabled = !mouseDisabled; }

// Used when cookies are not accepted
let username: string;
export function getUsername() { return username; }
export function setUsername(u: string) { return username = u; }

let token: string | undefined;
export function getToken() { return token; }
export function setToken(t?: string) { return token = t; }