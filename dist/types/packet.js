"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmmoUpdatePacket = exports.ScopeUpdatePacket = exports.AnnouncementPacket = exports.ParticlesPacket = exports.SoundPacket = exports.MapPacket = exports.GamePacket = exports.AckPacket = exports.ServerScopeUpdatePacket = exports.UseHealingPacket = exports.CancelActionsPacket = exports.ReloadWeaponPacket = exports.SwitchWeaponPacket = exports.InteractPacket = exports.MouseMovePacket = exports.MouseReleasePacket = exports.MousePressPacket = exports.PlayerRotationDelta = exports.MovementPacket = exports.MovementReleasePacket = exports.MovementResetPacket = exports.MovementPressPacket = exports.PingPacket = exports.ResponsePacket = void 0;
// Packet to respond the server Ack
class ResponsePacket {
    constructor(id, username, skin, deathImg, isMobile, accessToken) {
        this.type = "response";
        this.id = id;
        this.username = username;
        this.skin = skin;
        this.deathImg = deathImg;
        this.accessToken = accessToken;
        this.isMobile = isMobile;
    }
}
exports.ResponsePacket = ResponsePacket;
// Packet to ping the server
class PingPacket {
    constructor() {
        this.type = "ping";
    }
}
exports.PingPacket = PingPacket;
// Packet to notify movement key press
class MovementPressPacket {
    constructor(direction) {
        this.type = "movementpress";
        this.direction = direction;
    }
}
exports.MovementPressPacket = MovementPressPacket;
class MovementResetPacket {
    constructor() {
        this.type = "movementReset";
    }
}
exports.MovementResetPacket = MovementResetPacket;
// Packet to notify movement key release
class MovementReleasePacket {
    constructor(direction) {
        this.type = "movementrelease";
        this.direction = direction;
    }
}
exports.MovementReleasePacket = MovementReleasePacket;
class MovementPacket {
    constructor(direction) {
        this.type = "mobilemovement";
        this.direction = direction;
    }
}
exports.MovementPacket = MovementPacket;
class PlayerRotationDelta {
    constructor(angle) {
        this.type = "playerRotation";
        this.angle = angle;
    }
}
exports.PlayerRotationDelta = PlayerRotationDelta;
// Packet to notify mouse button press
class MousePressPacket {
    constructor(button) {
        this.type = "mousepress";
        this.button = button;
    }
}
exports.MousePressPacket = MousePressPacket;
// Packet to notify mouse button release
class MouseReleasePacket {
    constructor(button) {
        this.type = "mouserelease";
        this.button = button;
    }
}
exports.MouseReleasePacket = MouseReleasePacket;
// Packet to notify mouse movement
class MouseMovePacket {
    constructor(x, y) {
        this.type = "mousemove";
        this.x = x;
        this.y = y;
    }
}
exports.MouseMovePacket = MouseMovePacket;
// Packet to notify interaction (e.g. pickup)
class InteractPacket {
    constructor() {
        this.type = "interact";
    }
}
exports.InteractPacket = InteractPacket;
// Packet to notify weapon switching
class SwitchWeaponPacket {
    constructor(delta, setMode = false) {
        this.type = "switchweapon";
        this.delta = delta;
        this.setMode = setMode;
    }
}
exports.SwitchWeaponPacket = SwitchWeaponPacket;
// Packet to notify weapon reloading
class ReloadWeaponPacket {
    constructor() {
        this.type = "reloadweapon";
    }
}
exports.ReloadWeaponPacket = ReloadWeaponPacket;
//notify to cancel any actions going on 
class CancelActionsPacket {
    constructor() {
        this.type = "cancelActionsPacket";
    }
}
exports.CancelActionsPacket = CancelActionsPacket;
// Packet to notify healing item usage
class UseHealingPacket {
    constructor(item) {
        this.type = "usehealing";
        this.item = item;
    }
}
exports.UseHealingPacket = UseHealingPacket;
class ServerScopeUpdatePacket {
    constructor(scope) {
        this.type = "serverSideScopeUpdate";
        this.scope = scope;
    }
}
exports.ServerScopeUpdatePacket = ServerScopeUpdatePacket;
/// Packet from server acknowledgement
class AckPacket {
    constructor() {
        this.type = "ack";
    }
}
exports.AckPacket = AckPacket;
/// Packet from server containing game data
class GamePacket {
    constructor() {
        this.type = "game";
    }
}
exports.GamePacket = GamePacket;
/// Packet from server containing map data
class MapPacket {
    constructor() {
        this.type = "map";
    }
}
exports.MapPacket = MapPacket;
/// Packet from server about sound and its location
class SoundPacket {
    constructor() {
        this.type = "sound";
    }
}
exports.SoundPacket = SoundPacket;
class ParticlesPacket {
    constructor() {
        this.type = "particles";
    }
}
exports.ParticlesPacket = ParticlesPacket;
class AnnouncementPacket {
    constructor() {
        this.type = "announce";
    }
}
exports.AnnouncementPacket = AnnouncementPacket;
class ScopeUpdatePacket {
    constructor() {
        this.type = "scopeUpdate";
    }
}
exports.ScopeUpdatePacket = ScopeUpdatePacket;
class AmmoUpdatePacket {
    constructor() {
        this.type = "ammoUpdatePacket";
    }
}
exports.AmmoUpdatePacket = AmmoUpdatePacket;
