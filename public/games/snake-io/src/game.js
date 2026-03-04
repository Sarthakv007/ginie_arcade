/**
 * Game state for Snake.io
 */
Game = function(game) {}

Game.prototype = {
    preload: function() {
        // Load assets
        this.game.load.image('circle','asset/circle.png');
        this.game.load.image('shadow', 'asset/white-shadow.png');
        this.game.load.image('background', 'asset/tile.png');
        this.game.load.image('eye-white', 'asset/eye-white.png');
        this.game.load.image('eye-black', 'asset/eye-black.png');
        this.game.load.image('food', 'asset/hex.png');
    },
    
    create: function() {
        var width = this.game.width;
        var height = this.game.height;
        
        // Create larger world (4x4 screens)
        this.game.world.setBounds(-width * 2, -height * 2, width * 4, height * 4);
        this.game.stage.backgroundColor = '#2C3E50';
        
        // Add tilesprite background
        var background = this.game.add.tileSprite(
            -width * 2, -height * 2,
            this.game.world.width, this.game.world.height,
            'background'
        );
        background.alpha = 0.3;
        
        // Initialize physics and groups
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);
        
        this.foodGroup = this.game.add.group();
        this.snakeHeadCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.foodCollisionGroup = this.game.physics.p2.createCollisionGroup();
        
        // Add more food (300 pieces)
        for (var i = 0 ; i < 300 ; i++) {
            this.initFood(
                Util.randomInt(-width * 2, width * 2),
                Util.randomInt(-height * 2, height * 2)
            );
        }
        
        this.game.snakes = [];
        
        // Create player snake with custom name from global variable
        var playerName = window.playerName || 'Player';
        var snake = new PlayerSnake(this.game, 'circle', 0, 0, playerName);
        this.game.camera.follow(snake.head);
        
        // Create 15 bot snakes
        var botNames = [
            'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon',
            'Zeta', 'Theta', 'Lambda', 'Sigma', 'Omega',
            'Phoenix', 'Dragon', 'Tiger', 'Eagle', 'Viper'
        ];
        
        for (var i = 0; i < 15; i++) {
            var angle = (i / 15) * Math.PI * 2;
            var distance = 400 + Math.random() * 400;
            var x = Math.cos(angle) * distance;
            var y = Math.sin(angle) * distance;
            new BotSnake(this.game, 'circle', x, y, botNames[i]);
        }
        
        // Initialize snake groups and collision
        for (var i = 0 ; i < this.game.snakes.length ; i++) {
            var snake = this.game.snakes[i];
            snake.head.body.setCollisionGroup(this.snakeHeadCollisionGroup);
            snake.head.body.collides([this.foodCollisionGroup]);
            snake.addDestroyedCallback(this.snakeDestroyed, this);
        }
        
        // Setup minimap
        this.minimapCanvas = document.getElementById('minimap');
        this.minimapCtx = this.minimapCanvas.getContext('2d');
    },
    
    update: function() {
        // Update all snakes
        for (var i = this.game.snakes.length - 1 ; i >= 0 ; i--) {
            this.game.snakes[i].update();
        }
        
        // Update all food
        for (var i = this.foodGroup.children.length - 1 ; i >= 0 ; i--) {
            var f = this.foodGroup.children[i];
            f.food.update();
        }
        
        // Update leaderboard
        this.updateLeaderboard(this.game.snakes);
        
        // Update minimap
        this.updateMinimap(this.game, this.minimapCtx);
        
        // Update score display
        if (this.game.snakes[0]) {
            document.getElementById('score-value').textContent = 
                Math.floor(this.game.snakes[0].snakeLength);
        }
    },
    
    initFood: function(x, y) {
        var f = new Food(this.game, x, y);
        f.sprite.body.setCollisionGroup(this.foodCollisionGroup);
        this.foodGroup.add(f.sprite);
        f.sprite.body.collides([this.snakeHeadCollisionGroup]);
        return f;
    },
    
    snakeDestroyed: function(snake) {
        // Place food where snake was destroyed
        for (var i = 0 ; i < snake.headPath.length ;
        i += Math.round(snake.headPath.length / snake.snakeLength) * 2) {
            this.initFood(
                snake.headPath[i].x + Util.randomInt(-10,10),
                snake.headPath[i].y + Util.randomInt(-10,10)
            );
        }
        
        // Respawn bot after 3 seconds
        if (snake.isBot) {
            var game = this.game;
            setTimeout(function() {
                var angle = Math.random() * Math.PI * 2;
                var distance = 400 + Math.random() * 400;
                var x = Math.cos(angle) * distance;
                var y = Math.sin(angle) * distance;
                new BotSnake(game, 'circle', x, y, snake.name);
            }, 3000);
        }
    },
    
    updateLeaderboard: function(snakes) {
        if (!snakes || snakes.length === 0) return;
        
        // Sort by length
        var sortedSnakes = snakes.slice().sort(function(a, b) {
            return b.snakeLength - a.snakeLength;
        });
        
        var leaderboardList = document.getElementById('leaderboard-list');
        var html = '';
        
        for (var i = 0; i < Math.min(10, sortedSnakes.length); i++) {
            var snake = sortedSnakes[i];
            var isPlayer = !snake.isBot;
            var className = isPlayer ? 'leader-entry player' : 'leader-entry';
            html += '<div class="' + className + '">' +
                    (i + 1) + '. ' + snake.name + ' - ' +
                    Math.floor(snake.snakeLength) +
                    '</div>';
        }
        
        leaderboardList.innerHTML = html;
    },
    
    updateMinimap: function(game, ctx) {
        if (!game.snakes || game.snakes.length === 0) return;
        
        var canvas = ctx.canvas;
        var worldWidth = game.world.width;
        var worldHeight = game.world.height;
        var worldLeft = game.world.bounds.x;
        var worldTop = game.world.bounds.y;
        
        // Clear minimap
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background
        ctx.fillStyle = '#34495e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw world border
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        
        // Draw all snakes
        for (var i = 0; i < game.snakes.length; i++) {
            var snake = game.snakes[i];
            if (!snake.head || !snake.head.body) continue;
            
            var x = ((snake.head.body.x - worldLeft) / worldWidth) * canvas.width;
            var y = ((snake.head.body.y - worldTop) / worldHeight) * canvas.height;
            
            // Highlight player
            if (!snake.isBot) {
                ctx.fillStyle = '#ffd700';
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillStyle = snake.color || '#ffffff';
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
};
