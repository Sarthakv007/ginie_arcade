export interface Game {
  id: string
  uuid: string
  title: string
  description: string
  icon: string
  color: "cyan" | "purple" | "pink"
  players: number
  highScore: number
  category: string
  gamePath: string
}

export const games: Game[] = [
  {
    id: "flappy",
    uuid: "d3f1a920-4b8c-4e2a-9c15-7a6b3d8e1f04",
    title: "Flappy Bird",
    description: "Navigate through pipes in this classic arcade game. Simple to learn, impossible to master.",
    icon: "Bird",
    color: "pink",
    players: 5621,
    highScore: 420,
    category: "Arcade",
    gamePath: "/games/flappy/index.html",
  },
  {
    id: "snake-io",
    uuid: "c8d4e5f6-9a1b-4c2d-8e3f-0a7b8c9d1e2f",
    title: "Snake.io",
    description: "Grow your snake by eating food, trap other snakes, and dominate the arena! Enhanced multiplayer with 15+ bots and blockchain XP rewards.",
    icon: "Worm",
    color: "cyan",
    players: 0,
    highScore: 0,
    category: "Arcade",
    gamePath: "/games/snake-io/index.html",
  },
  {
    id: "the-house",
    uuid: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    title: "The House",
    description: "A mysterious point-and-click adventure. Explore dark rooms, collect items, solve puzzles, and uncover the secrets within. Multiple endings await.",
    icon: "Home",
    color: "purple",
    players: 0,
    highScore: 0,
    category: "Adventure",
    gamePath: "/games/the-house-game/index.html",
  },
  {
    id: "shooter",
    uuid: "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
    title: "Shooter",
    description: "Fast-paced top-down space shooter. Dodge hexagonal obstacles, blast asteroids, and rack up high scores in this neon-lit arcade action game.",
    icon: "Rocket",
    color: "cyan",
    players: 0,
    highScore: 0,
    category: "Arcade",
    gamePath: "/games/shooter/index.html",
  },
  {
    id: "match-three",
    uuid: "c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f",
    title: "Match-Three Puzzle",
    description: "Classic match-3 puzzle game with combos, special candies, and power-ups. Score as high as you can before time runs out! Your total XP is your final score.",
    icon: "Puzzle",
    color: "purple",
    players: 0,
    highScore: 0,
    category: "Puzzle",
    gamePath: "/games/match-three/index.html",
  },
  {
    id: "match-three",
    uuid: "f3a4b5c6-d7e8-4f9a-0b1c-2d3e4f5a6b7c",
    title: "Match Three Mania",
    description: "Classic match-3 puzzle gameplay. Swap colorful gems to create matches of 3 or more. Chain combos for higher scores!",
    icon: "Gamepad2",
    color: "pink",
    players: 0,
    highScore: 0,
    category: "Puzzle",
    gamePath: "/games/match-three/index.html",
  },
  {
    id: "zombie-apocalypse",
    uuid: "e4f5a6b7-c8d9-4e0a-1b2c-3d4e5f6a7b8c",
    title: "Zombie Apocalypse",
    description: "Survive the zombie invasion! Shoot zombies on a post-apocalyptic road. Click or press space to fire. Each kill earns 10 XP!",
    icon: "Skull",
    color: "purple",
    players: 0,
    highScore: 0,
    category: "Shooter",
    gamePath: "/games/zombie-apocalypse/index.html",
  },
]

export function getGameById(id: string): Game | undefined {
  return games.find((game) => game.id === id)
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}
