
interface soundEffectsConfigIF {
  [key: string]: string
}

const soundEffectsConfig: soundEffectsConfigIF = {
  one: './assets/sound/mixkit-arcade-mechanical-bling-210.wav',
  levelUp: './assets/sound/mixkit-game-bonus-reached-2065.wav',
  tetriminoMove: './assets/sound/mixkit-player-jumping-in-a-video-game-2043.wav',
  four: './assets/sound/mixkit-quick-positive-video-game-notification-interface-265.wav',
  five: './assets/sound/mixkit-sci-fi-positive-notification-266.wav',
  tetriminoLand: './assets/sound/mixkit-small-hit-in-a-game-2072.wav',
  lineClear: './assets/sound/mixkit-video-game-health-recharge-2837.wav',
  eight: './assets/sound/mixkit-winning-a-coin-video-game-2069.wav',
}

export { soundEffectsConfig, soundEffectsConfigIF }